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

export async function GET(req: NextRequest) {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const pincode = req.nextUrl.searchParams.get('pincode')?.trim();
    if (!pincode || !/^\d{6}$/.test(pincode)) {
        return NextResponse.json({ error: 'Please enter a valid 6-digit pincode' }, { status: 400 });
    }

    // Resolve pincode → lat/lng using free India postal API
    let userLat: number, userLon: number;
    try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pincode}`, {
            headers: { 'Accept': 'application/json' },
            next: { revalidate: 86400 }, // cache 24h
        });
        const data = await res.json();
        if (!data?.[0] || data[0].Status !== 'Success' || !data[0].PostOffice?.length) {
            return NextResponse.json({ error: `Pincode ${pincode} not found. Please check and try again.` }, { status: 404 });
        }
        const po = data[0].PostOffice[0];
        if (!po.Latitude || !po.Longitude || po.Latitude === 'NA' || po.Longitude === 'NA') {
            return NextResponse.json({ error: `Coordinates not available for pincode ${pincode}` }, { status: 404 });
        }
        userLat = parseFloat(po.Latitude);
        userLon = parseFloat(po.Longitude);
    } catch {
        return NextResponse.json({ error: 'Could not reach pincode lookup service. Check your connection.' }, { status: 503 });
    }

    // Fetch all hospitals that have coordinates
    const hospitals = await prisma.hospital.findMany({
        where: { status: 'ACTIVE' },
        select: { id: true, latitude: true, longitude: true },
    });

    // Build distance map { hospitalId → distanceKm }
    const distances: Record<string, number | null> = {};
    for (const h of hospitals) {
        if (h.latitude != null && h.longitude != null) {
            distances[h.id] = Math.round(haversineKm(userLat, userLon, h.latitude, h.longitude) * 10) / 10;
        } else {
            distances[h.id] = null;
        }
    }

    return NextResponse.json({ distances, userLat, userLon });
}
