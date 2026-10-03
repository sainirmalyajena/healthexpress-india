import { NextRequest, NextResponse } from 'next/server';
import { getAdminSession } from '@/lib/admin-auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function POST(req: NextRequest) {
    const session = await getAdminSession();
    if (!session?.adminId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    
    // Also create a dummy doctor entry if doctor name provided
    const newHospital = await prisma.hospital.create({
        data: {
            name: body.name,
            city: body.city,
            email: body.email,
            status: 'ACTIVE',
            specialties: ['General'],
            doctors: body.doctorName ? {
                create: {
                    name: body.doctorName,
                    qualification: 'MBBS, MD',
                    experience: 5,
                    about: 'Partner Surgeon'
                }
            } : undefined
        }
    });

    revalidatePath('/[lang]/dashboard/hospitals');
    return NextResponse.json(newHospital);
}
