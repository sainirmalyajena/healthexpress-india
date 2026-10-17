import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import fs from 'fs';
import path from 'path';

export interface EmployeeRecord {
    id: string;
    employeeId: string;
    name: string;
    designation: string;
    department: string;
    annualCtc: number;
    monthlyGross: number;
    monthlyBasic: number;
    monthlyHra: number;
    monthlyMedical: number;
    monthlySpecial: number;
    pfDeduction: number;
    netTakeHome: number;
    dateOfJoining: string; // YYYY-MM-DD
    relievingDate?: string; // YYYY-MM-DD
    workMode: 'Remote / Work From Home' | 'On-Site' | 'Hybrid';
    status: 'ACTIVE' | 'RELIEVED';
    createdAt: string;
}

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

const BACKUP_FILE = path.join(process.cwd(), 'data', 'hr_employees.json');

async function getEmployeesFromStorage(): Promise<EmployeeRecord[]> {
    try {
        const setting = await prisma.systemSetting.findUnique({
            where: { key: 'hr_employees' }
        });
        if (setting && setting.value) {
            const parsed = JSON.parse(setting.value);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
    } catch (e) {
        console.warn('Could not read employees from DB, falling back to local file:', e);
    }

    try {
        if (fs.existsSync(BACKUP_FILE)) {
            const raw = fs.readFileSync(BACKUP_FILE, 'utf8');
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
    } catch (e) {
        console.warn('Could not read backup file:', e);
    }

    // Save default list if neither exists
    await saveEmployeesToStorage(DEFAULT_EMPLOYEES);
    return DEFAULT_EMPLOYEES;
}

async function saveEmployeesToStorage(employees: EmployeeRecord[]): Promise<void> {
    const jsonStr = JSON.stringify(employees, null, 2);
    try {
        await prisma.systemSetting.upsert({
            where: { key: 'hr_employees' },
            create: { key: 'hr_employees', value: jsonStr },
            update: { value: jsonStr }
        });
    } catch (e) {
        console.warn('Could not save employees to DB:', e);
    }

    try {
        const dir = path.dirname(BACKUP_FILE);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(BACKUP_FILE, jsonStr, 'utf8');
    } catch (e) {
        console.warn('Could not save employees to backup file:', e);
    }
}

export async function GET() {
    try {
        const employees = await getEmployeesFromStorage();
        return NextResponse.json({ success: true, employees });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const employees = await getEmployeesFromStorage();

        if (body.action === 'delete') {
            const filtered = employees.filter(e => e.id !== body.id);
            await saveEmployeesToStorage(filtered);
            return NextResponse.json({ success: true, employees: filtered });
        }

        // Calculate auto-breakdown if annualCtc provided
        const ctc = Number(body.annualCtc) || 600000;
        const gross = Math.round(ctc / 12);
        const basic = body.monthlyBasic ? Number(body.monthlyBasic) : Math.round(gross * 0.45);
        const hra = body.monthlyHra ? Number(body.monthlyHra) : Math.round(basic * 0.5);
        const medical = body.monthlyMedical ? Number(body.monthlyMedical) : 3500;
        const pf = body.pfDeduction !== undefined ? Number(body.pfDeduction) : 1800;
        const special = Math.max(0, gross - (basic + hra + medical));
        const net = gross - pf;

        const newEmp: EmployeeRecord = {
            id: body.id || `emp_${Date.now()}`,
            employeeId: body.employeeId || `HEI-EMP-${Math.floor(1000 + Math.random() * 9000)}`,
            name: body.name || 'New Employee',
            designation: body.designation || 'Case Manager',
            department: body.department || 'Patient Operations',
            annualCtc: ctc,
            monthlyGross: gross,
            monthlyBasic: basic,
            monthlyHra: hra,
            monthlyMedical: medical,
            monthlySpecial: special,
            pfDeduction: pf,
            netTakeHome: net,
            dateOfJoining: body.dateOfJoining || new Date().toISOString().split('T')[0],
            relievingDate: body.relievingDate || undefined,
            workMode: body.workMode || 'Remote / Work From Home',
            status: body.relievingDate ? 'RELIEVED' : 'ACTIVE',
            createdAt: body.createdAt || new Date().toISOString()
        };

        const existingIndex = employees.findIndex(e => e.id === newEmp.id);
        let updated: EmployeeRecord[];
        if (existingIndex >= 0) {
            updated = [...employees];
            updated[existingIndex] = newEmp;
        } else {
            updated = [newEmp, ...employees];
        }

        await saveEmployeesToStorage(updated);
        return NextResponse.json({ success: true, employees: updated, employee: newEmp });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
