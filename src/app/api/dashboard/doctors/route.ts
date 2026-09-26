import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
    try {
        const session = await getAdminSession();
        if (!session?.adminId) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const doctors = await prisma.doctor.findMany({
            orderBy: { name: 'asc' },
            include: {
                hospital: {
                    select: { id: true, name: true, city: true }
                },
                surgeries: {
                    select: { id: true, name: true }
                }
            }
        });

        return NextResponse.json({ success: true, doctors });
    } catch (err: any) {
        console.error('Error fetching doctors:', err);
        return NextResponse.json({ error: err.message || 'Failed to fetch doctors' }, { status: 500 });
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
            qualification,
            experience,
            about,
            email,
            hospitalId,
            surgeryIds,
            status = 'ACTIVE',
            image
        } = body;

        if (!name || !qualification || !hospitalId) {
            return NextResponse.json({ error: 'Doctor name, qualification, and affiliated hospital are required.' }, { status: 400 });
        }

        // Generate clean doctor email if not provided or ensure uniqueness
        const doctorEmail = email?.trim() || `${name.toLowerCase().replace(/[^a-z0-9]/g, '') || 'doctor'}.${Date.now()}@healthexpressindia.com`;

        const existing = await prisma.doctor.findUnique({
            where: { email: doctorEmail }
        });

        if (existing) {
            return NextResponse.json({ error: 'A doctor with this email address already exists.' }, { status: 400 });
        }

        const doctor = await prisma.doctor.create({
            data: {
                name: name.trim(),
                qualification: qualification.trim(),
                experience: Number(experience) || 5,
                about: about?.trim() || `Specialist doctor affiliated with partner hospitals for advanced surgical care.`,
                image: image?.trim() || '/doctors/default-doctor.png',
                email: doctorEmail,
                status: status || 'ACTIVE',
                isVerified: true,
                hospitalId,
                surgeries: Array.isArray(surgeryIds) && surgeryIds.length > 0 ? {
                    connect: surgeryIds.map((id: string) => ({ id }))
                } : undefined
            },
            include: {
                hospital: { select: { id: true, name: true, city: true } },
                surgeries: { select: { id: true, name: true } }
            }
        });

        return NextResponse.json({ success: true, doctor, message: `${doctor.name} added successfully!` });
    } catch (err: any) {
        console.error('Error creating doctor:', err);
        return NextResponse.json({ error: err.message || 'Failed to add doctor' }, { status: 500 });
    }
}
