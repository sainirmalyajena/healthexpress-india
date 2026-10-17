#!/usr/bin/env node

/**
 * HealthExpress India - HR Document Generator CLI
 * 
 * Usage:
 *   node scripts/hr_generator.js list
 *   node scripts/hr_generator.js add --name "John Doe" --role "Case Manager" --ctc 480000 --doj "2026-02-01" --pf 1800
 *   node scripts/hr_generator.js offer --name "Yamini"
 *   node scripts/hr_generator.js payslip --name "Yamini" --month "September 2026"
 *   node scripts/hr_generator.js relieving --name "Yamini" --date "2026-08-31"
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const DATA_FILE = path.join(__dirname, '..', 'data', 'hr_employees.json');
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const LOGO_PATH = path.join(__dirname, '..', 'public', 'logo.png');

let logoBase64 = '';
if (fs.existsSync(LOGO_PATH)) {
    const buf = fs.readFileSync(LOGO_PATH);
    logoBase64 = `data:image/jpeg;base64,${buf.toString('base64')}`;
}

function loadEmployees() {
    if (!fs.existsSync(DATA_FILE)) return [];
    try {
        return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
    } catch (e) {
        return [];
    }
}

function saveEmployees(list) {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), 'utf8');
}

const args = process.argv.slice(2);
const command = args[0] ? args[0].toLowerCase() : 'help';

function parseFlags() {
    const flags = {};
    for (let i = 1; i < args.length; i++) {
        if (args[i].startsWith('--')) {
            const key = args[i].replace(/^--/, '');
            const val = args[i + 1] && !args[i + 1].startsWith('--') ? args[++i] : true;
            flags[key] = val;
        }
    }
    return flags;
}

const flags = parseFlags();

if (command === 'list') {
    const emps = loadEmployees();
    console.log('\n================ HEALTHEXPRESS INDIA - EMPLOYEE DIRECTORY ================');
    if (emps.length === 0) {
        console.log('No employees found.');
    } else {
        emps.forEach(e => {
            console.log(`[${e.employeeId}] ${e.name} | ${e.designation} | CTC: ₹${e.annualCtc.toLocaleString('en-IN')} | DOJ: ${e.dateOfJoining} | Status: ${e.status}`);
        });
    }
    console.log('==========================================================================\n');
    process.exit(0);
}

if (command === 'add') {
    const name = flags.name || 'New Employee';
    const designation = flags.role || flags.designation || 'Case Manager';
    const department = flags.dept || flags.department || 'Patient Operations';
    const ctc = Number(flags.ctc) || 600000;
    const pf = flags.pf !== undefined ? Number(flags.pf) : 1800;
    const doj = flags.doj || new Date().toISOString().split('T')[0];
    const workMode = flags.mode || 'Remote / Work From Home';

    const gross = Math.round(ctc / 12);
    const basic = Math.round(gross * 0.45);
    const hra = Math.round(basic * 0.5);
    const medical = 3500;
    const special = Math.max(0, gross - (basic + hra + medical));
    const net = gross - pf;

    const emps = loadEmployees();
    const newEmp = {
        id: `emp_${Date.now()}`,
        employeeId: flags.id || `HEI-EMP-${Math.floor(1000 + Math.random() * 9000)}`,
        name,
        designation,
        department,
        annualCtc: ctc,
        monthlyGross: gross,
        monthlyBasic: basic,
        monthlyHra: hra,
        monthlyMedical: medical,
        monthlySpecial: special,
        pfDeduction: pf,
        netTakeHome: net,
        dateOfJoining: doj,
        workMode,
        status: 'ACTIVE',
        createdAt: new Date().toISOString()
    };

    emps.unshift(newEmp);
    saveEmployees(emps);
    console.log(`\nSuccessfully added employee: [${newEmp.employeeId}] ${newEmp.name} (${newEmp.designation})\n`);
    process.exit(0);
}

// Handler for generating documents
function findEmployee(nameQuery) {
    const emps = loadEmployees();
    if (!nameQuery) return emps[0];
    const q = nameQuery.toLowerCase();
    return emps.find(e => e.name.toLowerCase().includes(q) || e.employeeId.toLowerCase().includes(q));
}

const targetEmp = findEmployee(flags.name);
if (!targetEmp) {
    console.error(`\nError: Could not find employee matching "${flags.name}". Run "node scripts/hr_generator.js list" to view available employees.\n`);
    process.exit(1);
}

const safeName = targetEmp.name.replace(/[^a-zA-Z0-9]/g, '_');

if (command === 'offer') {
    console.log(`Generating Offer Letter for ${targetEmp.name}...`);
    // re-use generator logic
    const script = path.join(__dirname, '..', 'scratch', 'compile_pf_adjusted_docs.js');
    if (fs.existsSync(script)) {
        execSync(`node "${script}"`);
        console.log(`\nOffer Letter generated and saved to Desktop & Downloads!`);
    }
    process.exit(0);
}

if (command === 'payslip') {
    const month = flags.month || 'August 2026';
    console.log(`Generating Payslip for ${targetEmp.name} (${month})...`);
    const script = path.join(__dirname, '..', 'scratch', 'generate_three_month_payslips.js');
    if (fs.existsSync(script)) {
        execSync(`node "${script}"`);
        console.log(`\nPayslip generated and saved to Desktop & Downloads!`);
    }
    process.exit(0);
}

if (command === 'relieving') {
    const date = flags.date || '2026-08-31';
    console.log(`Generating Relieving Letter for ${targetEmp.name} (Date: ${date})...`);
    const script = path.join(__dirname, '..', 'scratch', 'generate_relieving_letter.js');
    if (fs.existsSync(script)) {
        execSync(`node "${script}"`);
        console.log(`\nRelieving Letter generated and saved to Desktop & Downloads!`);
    }
    process.exit(0);
}

console.log(`
HealthExpress India HR Document CLI
-----------------------------------
Commands:
  node scripts/hr_generator.js list
  node scripts/hr_generator.js add --name "John Doe" --role "Case Manager" --ctc 480000 --doj "2026-02-01"
  node scripts/hr_generator.js offer --name "Yamini"
  node scripts/hr_generator.js payslip --name "Yamini" --month "September 2026"
  node scripts/hr_generator.js relieving --name "Yamini" --date "2026-08-31"
`);
