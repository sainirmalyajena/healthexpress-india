import { getAdminSession } from '@/lib/admin-auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import SeoDashboardClient from '@/components/dashboard/seo/SeoDashboardClient';

export default async function SeoDashboardPage({ params }: { params: { lang: string } }) {
    const session = await getAdminSession();
    if (!session || session.role !== 'admin') {
        redirect('/' + params.lang + '/login');
    }

    const rawData = await prisma.seoQueryData.findMany({
        orderBy: { impressions: 'desc' }
    });

    const opportunities = await prisma.seoOpportunity.findMany({
        orderBy: { score: 'desc' }
    });

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">SEO Opportunity Engine</h1>
                    <p className="text-slate-600 mt-1">AI-driven search console analysis and content recommendations.</p>
                </div>
            </div>
            <SeoDashboardClient rawData={rawData} opportunities={opportunities} />
        </div>
    );
}
