import { redirect } from 'next/navigation';
import { getAdminSession } from '@/lib/admin-auth';
import DashboardShell from '@/components/dashboard/DashboardShell';
import HrDocumentCenter from '@/components/dashboard/HrDocumentCenter';
import fs from 'fs';
import path from 'path';
import { EmployeeRecord } from '@/app/api/dashboard/hr/employees/route';
import { prisma } from '@/lib/prisma';

const DEFAULT_EMPLOYEES: EmployeeRecord[] = [
    {
        id: 'emp_yamini_01',
        employeeId: 'HEI-EMP-0128',
        name: 'Ms. Yamini',
        designation: 'Business Development Manager (BDM)',
        department: 'Business Development & Partnerships',
        annualCtc: 620000,
        monthlyGross: 51667,
        monthlyBasic: 23250,
        monthlyHra: 12917,
        monthlyMedical: 3500,
        monthlySpecial: 12000,
        pfDeduction: 1800,
        netTakeHome: 49867,
        dateOfJoining: '2026-01-27',
        relievingDate: '2026-08-31',
        workMode: 'Remote / Work From Home',
        status: 'RELIEVED',
        createdAt: new Date().toISOString()
    }
];

async function getEmployees(): Promise<EmployeeRecord[]> {
    try {
        const setting = await prisma.systemSetting.findUnique({
            where: { key: 'hr_employees' }
        });
        if (setting && setting.value) {
            const parsed = JSON.parse(setting.value);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (e) {
        console.warn('Error reading employees in page:', e);
    }

    try {
        const backupPath = path.join(process.cwd(), 'data', 'hr_employees.json');
        if (fs.existsSync(backupPath)) {
            const raw = fs.readFileSync(backupPath, 'utf8');
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (e) {}

    return DEFAULT_EMPLOYEES;
}

export default async function HrDocumentsPage() {
    const session = await getAdminSession();
    if (!session) redirect('/dashboard/login');

    const employees = await getEmployees();

    let logoBase64 = '/logo.png';
    try {
        const logoPath = path.join(process.cwd(), 'public', 'logo.png');
        if (fs.existsSync(logoPath)) {
            const buf = fs.readFileSync(logoPath);
            logoBase64 = `data:image/jpeg;base64,${buf.toString('base64')}`;
        }
    } catch (e) {}

    return (
        <DashboardShell userName={session.name || 'Admin'} userRole={session.role}>
            <div className="p-4 sm:p-8 max-w-7xl mx-auto">
                <HrDocumentCenter initialEmployees={employees} logoBase64={logoBase64} />
            </div>
        </DashboardShell>
    );
}
