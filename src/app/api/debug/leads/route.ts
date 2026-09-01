import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    const diagnostics: Record<string, any> = {
        timestamp: new Date().toISOString(),
        nodeEnv: process.env.NODE_ENV,
        hasDbUrl: !!process.env.DATABASE_URL,
        dbUrlPrefix: process.env.DATABASE_URL?.substring(0, 50) + '...',
    };

    // Test 1: Basic Prisma connectivity
    try {
        const count = await prisma.lead.count();
        diagnostics.leadCount = count;
        diagnostics.dbConnection = 'OK';
    } catch (e: any) {
        diagnostics.dbConnection = 'FAILED';
        diagnostics.dbError = e.message;
        diagnostics.dbCode = e.code;
    }

    // Test 2: The exact query from getLeads
    try {
        const leads = await prisma.lead.findMany({
            where: {},
            include: { surgery: true, hospital: true },
            orderBy: { createdAt: 'desc' },
            skip: 0,
            take: 5
        });
        diagnostics.leadQuery = 'OK';
        diagnostics.leadsReturned = leads.length;
    } catch (e: any) {
        diagnostics.leadQuery = 'FAILED';
        diagnostics.leadQueryError = e.message;
    }

    // Test 3: Surgery query
    try {
        const surgeries = await prisma.surgery.findMany({ select: { id: true, name: true } });
        diagnostics.surgeryQuery = 'OK';
        diagnostics.surgeryCount = surgeries.length;
    } catch (e: any) {
        diagnostics.surgeryQuery = 'FAILED';
        diagnostics.surgeryError = e.message;
    }

    // Test 4: Hospital query
    try {
        const hospitals = await prisma.hospital.findMany({ select: { id: true, name: true } });
        diagnostics.hospitalQuery = 'OK';
        diagnostics.hospitalCount = hospitals.length;
    } catch (e: any) {
        diagnostics.hospitalQuery = 'FAILED';
        diagnostics.hospitalError = e.message;
    }

    // Test 5: User query (the one outside try/catch on leads page!)
    try {
        const users = await prisma.user.findMany({ select: { id: true, name: true } });
        diagnostics.userQuery = 'OK';
        diagnostics.userCount = users.length;
    } catch (e: any) {
        diagnostics.userQuery = 'FAILED';
        diagnostics.userError = e.message;
    }

    // Test 6: Distinct cities query
    try {
        const cities = await prisma.lead.findMany({
            select: { city: true },
            distinct: ['city'],
            where: { city: { not: '' } }
        });
        diagnostics.citiesQuery = 'OK';
        diagnostics.citiesCount = cities.length;
    } catch (e: any) {
        diagnostics.citiesQuery = 'FAILED';
        diagnostics.citiesError = e.message;
    }

    // Test 7: Auth check
    try {
        const { getAdminSession } = await import('@/lib/admin-auth');
        const session = await getAdminSession();
        diagnostics.auth = session ? 'AUTHENTICATED' : 'NOT_AUTHENTICATED';
        if (session) {
            diagnostics.authUser = session.name;
            diagnostics.authRole = session.role;
        }
    } catch (e: any) {
        diagnostics.auth = 'ERROR';
        diagnostics.authError = e.message;
    }

    return NextResponse.json(diagnostics, { status: 200 });
}
