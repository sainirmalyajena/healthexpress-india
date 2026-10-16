import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

// Haversine formula — returns distance in km between two lat/lng points
function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

interface GeocodeResult {
    lat: number;
    lon: number;
    place?: string;
}

async function resolvePincode(pincode: string): Promise<GeocodeResult | null> {
    // Strategy 1: Zippopotam API for India (fast, specifically returns lat/long for Indian pincodes)
    try {
        const res = await fetch(`https://api.zippopotam.us/in/${pincode}`, {
            headers: { 'Accept': 'application/json' },
            next: { revalidate: 86400 } // cache 24h
        });
        if (res.ok) {
            const data = await res.json();
            const firstPlace = data?.places?.[0];
            if (firstPlace?.latitude && firstPlace?.longitude) {
                const lat = parseFloat(firstPlace.latitude);
                const lon = parseFloat(firstPlace.longitude);
                const place = [firstPlace['place name'], firstPlace.state].filter(Boolean).join(', ');
                if (!isNaN(lat) && !isNaN(lon)) {
                    return { lat, lon, place };
                }
            }
        }
    } catch (e) {
        console.warn('Zippopotam lookup failed:', e);
    }

    // Strategy 2: OpenStreetMap Nominatim (geocoding by postalcode in India)
    try {
        const osmRes = await fetch(
            `https://nominatim.openstreetmap.org/search?postalcode=${pincode}&country=India&format=json&limit=1`,
            {
                headers: {
                    'User-Agent': 'HealthExpressIndia/1.0 (admin@healthexpressindia.com)',
                    'Accept': 'application/json'
                },
                next: { revalidate: 86400 }
            }
        );
        if (osmRes.ok) {
            const osmData = await osmRes.json();
            if (osmData?.[0]?.lat && osmData?.[0]?.lon) {
                const lat = parseFloat(osmData[0].lat);
                const lon = parseFloat(osmData[0].lon);
                const place = osmData[0].display_name;
                if (!isNaN(lat) && !isNaN(lon)) {
                    return { lat, lon, place };
                }
            }
        }
    } catch (e) {
        console.warn('Nominatim postalcode lookup failed:', e);
    }

    // Strategy 3: PostalPincode API -> District/State -> Nominatim geocoding
    try {
        const pinRes = await fetch(`https://api.postalpincode.in/pincode/${pincode}`, {
            headers: { 'Accept': 'application/json' },
            next: { revalidate: 86400 }
        });
        if (pinRes.ok) {
            const pinData = await pinRes.json();
            if (pinData?.[0]?.Status === 'Success' && pinData[0]?.PostOffice?.[0]) {
                const po = pinData[0].PostOffice[0];
                const district = po.District || po.Region || '';
                const state = po.State || '';
                const query = [district, state, 'India'].filter(Boolean).join(', ');

                const geoRes = await fetch(
                    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
                    {
                        headers: {
                            'User-Agent': 'HealthExpressIndia/1.0 (admin@healthexpressindia.com)',
                            'Accept': 'application/json'
                        },
                        next: { revalidate: 86400 }
                    }
                );
                if (geoRes.ok) {
                    const geoData = await geoRes.json();
                    if (geoData?.[0]?.lat && geoData?.[0]?.lon) {
                        return {
                            lat: parseFloat(geoData[0].lat),
                            lon: parseFloat(geoData[0].lon),
                            place: `${district}, ${state}`
                        };
                    }
                }
            }
        }
    } catch (e) {
        console.warn('PostalPincode + Nominatim fallback failed:', e);
    }

    // Strategy 4: Local Database exact match
    const localMatch = await prisma.hospital.findFirst({
        where: { pincode, latitude: { not: null }, longitude: { not: null } },
        select: { latitude: true, longitude: true, city: true }
    });
    if (localMatch && localMatch.latitude && localMatch.longitude) {
        return {
            lat: localMatch.latitude,
            lon: localMatch.longitude,
            place: localMatch.city
        };
    }

    return null;
}

export async function GET(req: NextRequest) {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const pincode = req.nextUrl.searchParams.get('pincode')?.trim();
    if (!pincode || !/^\d{6}$/.test(pincode)) {
        return NextResponse.json({ error: 'Please enter a valid 6-digit pincode' }, { status: 400 });
    }

    const geo = await resolvePincode(pincode);
    if (!geo) {
        return NextResponse.json(
            { error: `Could not locate pincode ${pincode}. Please verify the 6 digits or enter the city name in search.` },
            { status: 404 }
        );
    }

    // Fetch all hospitals with coordinates
    const hospitals = await prisma.hospital.findMany({
        where: { status: 'ACTIVE' },
        select: { id: true, latitude: true, longitude: true },
    });

    // Build distance map { hospitalId → distanceKm }
    const distances: Record<string, number | null> = {};
    for (const h of hospitals) {
        if (h.latitude != null && h.longitude != null) {
            distances[h.id] = Math.round(haversineKm(geo.lat, geo.lon, h.latitude, h.longitude) * 10) / 10;
        } else {
            distances[h.id] = null;
        }
    }

    return NextResponse.json({
        distances,
        userLat: geo.lat,
        userLon: geo.lon,
        place: geo.place || null
    });
}
