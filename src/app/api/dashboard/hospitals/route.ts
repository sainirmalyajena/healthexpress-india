import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const session = await getAdminSession();
        if (!session?.adminId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const hospitals = await prisma.hospital.findMany({
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { leads: true, doctors: true }
                }
            }
        });

        return NextResponse.json({ success: true, hospitals });
    } catch (err: any) {
        console.error('Error fetching hospitals:', err);
        return NextResponse.json({ error: err.message || 'Failed to fetch hospitals' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const session = await getAdminSession();
        if (!session?.adminId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const {
            name,
            city,
            specialties,
            discountPercent = 0,
            email,
            status = 'ACTIVE'
        } = body;

        if (!name || !city) {
            return NextResponse.json({ error: 'Hospital name and city are required.' }, { status: 400 });
        }

        // Clean up specialties array
        let parsedSpecialties: string[] = [];
        if (Array.isArray(specialties)) {
            parsedSpecialties = specialties.map((s: string) => s.trim()).filter(Boolean);
        } else if (typeof specialties === 'string') {
            parsedSpecialties = specialties.split(',').map((s: string) => s.trim()).filter(Boolean);
        }

        if (parsedSpecialties.length === 0) {
            parsedSpecialties = ['General Surgery', 'Ophthalmology', 'Laparoscopy'];
        }

        const hospitalEmail = email?.trim() || `${name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'hospital'}.${Date.now()}@healthexpressindia.com`;

        const existing = await prisma.hospital.findUnique({
            where: { email: hospitalEmail }
        });

        if (existing) {
            return NextResponse.json({ error: 'A hospital with this contact email already exists.' }, { status: 400 });
        }

        const hospital = await prisma.hospital.create({
            data: {
                name: name.trim(),
                city: city.trim(),
                specialties: parsedSpecialties,
                discountPercent: Number(discountPercent) || 0,
                email: hospitalEmail,
                status: status || 'ACTIVE'
            },
            include: {
                _count: { select: { leads: true, doctors: true } }
            }
        });

        return NextResponse.json({
            success: true,
            hospital,
            message: `${hospital.name} added to CRM hospital network!`
        });
    } catch (err: any) {
        console.error('Error adding hospital:', err);
        return NextResponse.json({ error: err.message || 'Failed to add hospital' }, { status: 500 });
    }
}
