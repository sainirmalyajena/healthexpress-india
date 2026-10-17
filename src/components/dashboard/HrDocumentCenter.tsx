'use client';

import React, { useState } from 'react';
import { EmployeeRecord } from '@/app/api/dashboard/hr/employees/route';
import { 
    FileText, 
    UserPlus, 
    DollarSign, 
    Award, 
    Printer, 
    X, 
    Calendar, 
    Briefcase, 
    Building2, 
    Search,
    Trash2,
    Edit3,
    CheckCircle2,
    ShieldCheck
} from 'lucide-react';

interface HrDocumentCenterProps {
    initialEmployees: EmployeeRecord[];
    logoBase64?: string;
}

export default function HrDocumentCenter({ initialEmployees, logoBase64 = '/logo.png' }: HrDocumentCenterProps) {
    const [employees, setEmployees] = useState<EmployeeRecord[]>(initialEmployees);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedEmp, setSelectedEmp] = useState<EmployeeRecord | null>(null);
    const [modalType, setModalType] = useState<'OFFER' | 'PAYSLIP' | 'RELIEVING' | 'FORM' | null>(null);
    
    // For Payslip Generation
    const [selectedMonth, setSelectedMonth] = useState('August 2026');
    const [customRelievingDate, setCustomRelievingDate] = useState('2026-08-31');

    // For Employee Form
    const [formData, setFormData] = useState<Partial<EmployeeRecord>>({
        name: '',
        employeeId: '',
        designation: 'Business Development Manager (BDM)',
        department: 'Business Development & Partnerships',
        annualCtc: 620000,
        pfDeduction: 1800,
        dateOfJoining: '2026-01-27',
        relievingDate: '',
        workMode: 'Remote / Work From Home'
    });
    const [saving, setSaving] = useState(false);

    const filteredEmployees = employees.filter(e => 
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.designation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.employeeId.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleOpenForm = (emp?: EmployeeRecord) => {
        if (emp) {
            setFormData(emp);
        } else {
            setFormData({
                name: '',
                employeeId: `HEI-EMP-${Math.floor(1000 + Math.random() * 9000)}`,
                designation: 'Business Development Manager (BDM)',
                department: 'Business Development & Partnerships',
                annualCtc: 620000,
                pfDeduction: 1800,
                dateOfJoining: new Date().toISOString().split('T')[0],
                relievingDate: '',
                workMode: 'Remote / Work From Home'
            });
        }
        setModalType('FORM');
    };

    const handleSaveEmployee = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await fetch('/api/dashboard/hr/employees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                setEmployees(data.employees);
                setModalType(null);
            } else {
                alert('Error saving employee: ' + data.error);
            }
        } catch (err: any) {
            alert('Failed to save employee: ' + err.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteEmployee = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to remove ${name}?`)) return;
        try {
            const res = await fetch('/api/dashboard/hr/employees', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete', id })
            });
            const data = await res.json();
            if (data.success) {
                setEmployees(data.employees);
            }
        } catch (err: any) {
            alert('Delete failed: ' + err.message);
        }
    };

    const handlePrint = () => {
        window.print();
    };

    const getDaysInMonth = (monthName: string) => {
        if (['April', 'June', 'September', 'November'].some(m => monthName.includes(m))) return 30;
        if (monthName.includes('February')) return 28;
        return 31;
    };

    return (
        <div className="space-y-6">
            {/* Top Header Card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-2 text-teal-600 font-bold text-xs uppercase tracking-wider mb-1">
                        <ShieldCheck className="w-4 h-4" />
                        HealthExpress India HR & Compliance
                    </div>
                    <h1 className="text-2xl font-black text-slate-900 tracking-tight">HR Document & Payroll Center</h1>
                    <p className="text-sm text-slate-500 mt-1">
                        Generate official Offer Letters, Monthly Salary Slips, and Relieving Letters with verified Udyam credentials and brand seal.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => handleOpenForm()}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-sm font-bold shadow-sm transition-all"
                    >
                        <UserPlus className="w-4 h-4" />
                        Add New Employee
                    </button>
                </div>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
                    <div className="p-3 bg-teal-50 text-teal-700 rounded-lg">
                        <Briefcase className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-slate-900">{employees.length}</div>
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Team Members</div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-700 rounded-lg">
                        <Award className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-slate-900">MSME Micro</div>
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">UDYAM-OD-17-0050610</div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 text-emerald-700 rounded-lg">
                        <Building2 className="w-6 h-6" />
                    </div>
                    <div>
                        <div className="text-2xl font-black text-slate-900">Hospital Activities</div>
                        <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">NIC Code: 86100</div>
                    </div>
                </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search employees by name, role, or ID (e.g., Yamini, Business Development Manager, HEI-EMP-0128)..."
                    className="w-full text-sm bg-transparent focus:outline-none text-slate-900 placeholder:text-slate-400"
                />
            </div>

            {/* Employees Grid / Directory */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEmployees.map((emp) => (
                    <div key={emp.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between">
                        <div>
                            <div className="flex items-start justify-between gap-2 mb-3">
                                <div>
                                    <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-full border border-teal-200">
                                        {emp.employeeId}
                                    </span>
                                    <h3 className="text-lg font-black text-slate-900 mt-1">{emp.name}</h3>
                                    <p className="text-xs font-semibold text-slate-600">{emp.designation}</p>
                                    <p className="text-[11px] text-slate-400">{emp.department}</p>
                                </div>
                                <div className="flex items-center gap-1">
                                    <button 
                                        onClick={() => handleOpenForm(emp)}
                                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                                        title="Edit"
                                    >
                                        <Edit3 className="w-4 h-4" />
                                    </button>
                                    <button 
                                        onClick={() => handleDeleteEmployee(emp.id, emp.name)}
                                        className="p-1.5 text-red-400 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Salary & Details Chips */}
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-xs space-y-1.5 mb-4">
                                <div className="flex justify-between">
                                    <span className="text-slate-500 font-medium">Annual CTC:</span>
                                    <span className="font-bold text-slate-900">₹{emp.annualCtc.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 font-medium">Monthly Gross:</span>
                                    <span className="font-bold text-slate-900">₹{emp.monthlyGross.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-slate-500 font-medium">Monthly PF:</span>
                                    <span className="font-bold text-red-600">&minus; ₹{emp.pfDeduction.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between border-t border-slate-200 pt-1">
                                    <span className="text-slate-700 font-bold">Net Take-Home:</span>
                                    <span className="font-extrabold text-teal-700">₹{emp.netTakeHome.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="flex justify-between text-[11px] text-slate-400 pt-1">
                                    <span>DOJ: {emp.dateOfJoining}</span>
                                    <span>{emp.relievingDate ? `Relieved: ${emp.relievingDate}` : 'Active'}</span>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons for Document Generation */}
                        <div className="space-y-2 pt-2 border-t border-slate-100">
                            <button
                                onClick={() => { setSelectedEmp(emp); setModalType('OFFER'); }}
                                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                            >
                                <FileText className="w-3.5 h-3.5" />
                                Generate Offer Letter (3 Pages)
                            </button>

                            <button
                                onClick={() => { setSelectedEmp(emp); setModalType('PAYSLIP'); }}
                                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                            >
                                <DollarSign className="w-3.5 h-3.5" />
                                Generate Salary Slip (1 Page)
                            </button>

                            <button
                                onClick={() => { 
                                    setSelectedEmp(emp); 
                                    setCustomRelievingDate(emp.relievingDate || '2026-08-31');
                                    setModalType('RELIEVING'); 
                                }}
                                className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-all"
                            >
                                <Award className="w-3.5 h-3.5" />
                                Generate Relieving Letter (1 Page)
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* ========================================================
                MODAL 1: ADD / EDIT EMPLOYEE FORM
               ======================================================== */}
            {modalType === 'FORM' && (
                <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative my-8">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
                            <h2 className="text-lg font-black text-slate-900">
                                {formData.id ? 'Edit Employee Details' : 'Add New Team Member'}
                            </h2>
                            <button onClick={() => setModalType(null)} className="p-1 text-slate-400 hover:text-slate-700">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSaveEmployee} className="space-y-4 text-xs">
                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name || ''}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="e.g. Ms. Yamini"
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Employee ID</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.employeeId || ''}
                                        onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                                        placeholder="e.g. HEI-EMP-0128"
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Designation</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.designation || ''}
                                        onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                                        placeholder="e.g. Business Development Manager (BDM)"
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Department</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.department || ''}
                                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                        placeholder="e.g. Business Development & Partnerships"
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Annual CTC (INR)</label>
                                    <input
                                        type="number"
                                        required
                                        value={formData.annualCtc || 620000}
                                        onChange={(e) => setFormData({ ...formData, annualCtc: Number(e.target.value) })}
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                    />
                                    <span className="text-[10px] text-slate-400">Monthly Gross: ₹{Math.round((formData.annualCtc || 0) / 12).toLocaleString('en-IN')}</span>
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Monthly PF Deduction</label>
                                    <select
                                        value={formData.pfDeduction}
                                        onChange={(e) => setFormData({ ...formData, pfDeduction: Number(e.target.value) })}
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                    >
                                        <option value={1800}>₹1,800 / Month (Standard Statutory EPF)</option>
                                        <option value={0}>₹0.00 (Exempt under MSME &lt; 20 Headcount)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Date of Joining (DOJ)</label>
                                    <input
                                        type="date"
                                        required
                                        value={formData.dateOfJoining || ''}
                                        onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })}
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block font-bold text-slate-700 mb-1">Relieving Date (Optional)</label>
                                    <input
                                        type="date"
                                        value={formData.relievingDate || ''}
                                        onChange={(e) => setFormData({ ...formData, relievingDate: e.target.value })}
                                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block font-bold text-slate-700 mb-1">Work Modality</label>
                                <select
                                    value={formData.workMode || 'Remote / Work From Home'}
                                    onChange={(e) => setFormData({ ...formData, workMode: e.target.value as any })}
                                    className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-teal-500 focus:outline-none"
                                >
                                    <option value="Remote / Work From Home">Remote / Work From Home</option>
                                    <option value="On-Site">On-Site</option>
                                    <option value="Hybrid">Hybrid</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                                <button
                                    type="button"
                                    onClick={() => setModalType(null)}
                                    className="px-4 py-2 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold shadow-sm"
                                >
                                    {saving ? 'Saving...' : 'Save Employee'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* ========================================================
                MODAL 2: DOCUMENT PREVIEW & PRINT MODAL
               ======================================================== */}
            {selectedEmp && (modalType === 'OFFER' || modalType === 'PAYSLIP' || modalType === 'RELIEVING') && (
                <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-start p-4 overflow-y-auto">
                    {/* Control Bar */}
                    <div className="w-full max-w-4xl bg-slate-900 text-white rounded-2xl p-4 mb-4 flex items-center justify-between shadow-2xl sticky top-4 z-50">
                        <div className="flex items-center gap-3">
                            <span className="bg-teal-600 text-white text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider">
                                {modalType === 'OFFER' ? '3-Page Offer Letter' : modalType === 'PAYSLIP' ? '1-Page Salary Slip' : '1-Page Relieving Letter'}
                            </span>
                            <span className="font-bold text-sm hidden sm:inline">{selectedEmp.name} &bull; {selectedEmp.designation}</span>
                        </div>

                        {/* Month Selector if Payslip */}
                        {modalType === 'PAYSLIP' && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400 font-medium">Month:</span>
                                <select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(e.target.value)}
                                    className="bg-slate-800 text-white border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none"
                                >
                                    <option value="January 2026">January 2026</option>
                                    <option value="February 2026">February 2026</option>
                                    <option value="March 2026">March 2026</option>
                                    <option value="April 2026">April 2026</option>
                                    <option value="May 2026">May 2026</option>
                                    <option value="June 2026">June 2026</option>
                                    <option value="July 2026">July 2026</option>
                                    <option value="August 2026">August 2026</option>
                                    <option value="September 2026">September 2026</option>
                                    <option value="October 2026">October 2026</option>
                                    <option value="November 2026">November 2026</option>
                                    <option value="December 2026">December 2026</option>
                                </select>
                            </div>
                        )}

                        {/* Relieving Date Selector if Relieving */}
                        {modalType === 'RELIEVING' && (
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400 font-medium">Relieving Date:</span>
                                <input
                                    type="date"
                                    value={customRelievingDate}
                                    onChange={(e) => setCustomRelievingDate(e.target.value)}
                                    className="bg-slate-800 text-white border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-semibold focus:outline-none"
                                />
                            </div>
                        )}

                        <div className="flex items-center gap-2">
                            <button
                                onClick={handlePrint}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-teal-500 hover:bg-teal-600 text-white rounded-xl text-xs font-bold transition-all shadow-sm"
                            >
                                <Printer className="w-4 h-4" />
                                🖨️ Download / Save PDF
                            </button>
                            <button
                                onClick={() => setModalType(null)}
                                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Printable Paper Canvas */}
                    <div className="w-full max-w-4xl bg-white shadow-2xl rounded-lg p-8 print:p-0 print:shadow-none print:m-0 text-slate-900">
                        {modalType === 'PAYSLIP' && (
                            <PrintablePayslip 
                                emp={selectedEmp} 
                                monthName={selectedMonth} 
                                days={getDaysInMonth(selectedMonth)} 
                                logoBase64={logoBase64} 
                            />
                        )}

                        {modalType === 'OFFER' && (
                            <PrintableOfferLetter 
                                emp={selectedEmp} 
                                logoBase64={logoBase64} 
                            />
                        )}

                        {modalType === 'RELIEVING' && (
                            <PrintableRelievingLetter 
                                emp={selectedEmp} 
                                relievingDate={customRelievingDate} 
                                logoBase64={logoBase64} 
                            />
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

// =========================================================================
// SUB-COMPONENT: PRINTABLE SALARY SLIP (1 PAGE)
// =========================================================================
function PrintablePayslip({ emp, monthName, days, logoBase64 }: { emp: EmployeeRecord; monthName: string; days: number; logoBase64: string }) {
    return (
        <div className="text-[12px] leading-relaxed font-sans">
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-teal-600 pb-3 mb-3">
                <div className="flex items-center gap-3">
                    <img src={logoBase64} alt="HealthExpress Logo" className="w-12 h-12 rounded-xl object-contain shadow-xs" />
                    <div>
                        <div className="text-2xl font-black text-teal-800 leading-none">HealthExpress</div>
                        <div className="text-[10px] font-extrabold text-teal-600 tracking-[3px] uppercase">India</div>
                    </div>
                </div>
                <div className="text-right text-[10px] text-slate-500 leading-tight">
                    <span className="inline-block bg-teal-50 text-teal-800 border border-teal-200 px-1.5 py-0.5 rounded font-bold text-[9px] mb-0.5">Govt. of India Registered MSME</span>
                    <div className="font-bold text-slate-800 text-[11px]">HEALTHEXPRESS INDIA</div>
                    <div><strong>Udyam Reg. No:</strong> UDYAM-OD-17-0050610</div>
                    <div>Plot No. 1034, Kalpataru Kutira Building, Kajala, Kendrapara, Odisha &ndash; 754211</div>
                    <div><strong>Web:</strong> www.healthexpressindia.com &bull; <strong>Support:</strong> +91 91143 24795</div>
                </div>
            </div>

            <div className="text-center bg-slate-100 border border-slate-200 py-1.5 rounded mb-3">
                <div className="font-black text-sm text-slate-900 uppercase tracking-wide">PAYSLIP / SALARY SLIP &ndash; {monthName.toUpperCase()}</div>
                <div className="text-[10px] font-bold text-teal-700">Confidential &bull; Employee Pay Record &bull; Fixed Remuneration with PF</div>
            </div>

            {/* Info Table */}
            <table className="w-full border-collapse border border-slate-200 text-[11px] mb-3">
                <tbody>
                    <tr>
                        <td className="p-1.5 bg-slate-50 font-semibold text-slate-600 border border-slate-200 w-1/4">Employee Name</td>
                        <td className="p-1.5 font-bold text-slate-900 border border-slate-200 w-1/4">{emp.name}</td>
                        <td className="p-1.5 bg-slate-50 font-semibold text-slate-600 border border-slate-200 w-1/4">Designation</td>
                        <td className="p-1.5 font-bold text-slate-900 border border-slate-200 w-1/4">{emp.designation}</td>
                    </tr>
                    <tr>
                        <td className="p-1.5 bg-slate-50 font-semibold text-slate-600 border border-slate-200">Employee ID</td>
                        <td className="p-1.5 font-bold text-slate-900 border border-slate-200">{emp.employeeId}</td>
                        <td className="p-1.5 bg-slate-50 font-semibold text-slate-600 border border-slate-200">Department</td>
                        <td className="p-1.5 font-bold text-slate-900 border border-slate-200">{emp.department}</td>
                    </tr>
                    <tr>
                        <td className="p-1.5 bg-slate-50 font-semibold text-slate-600 border border-slate-200">Date of Joining</td>
                        <td className="p-1.5 font-bold text-slate-900 border border-slate-200">{emp.dateOfJoining}</td>
                        <td className="p-1.5 bg-slate-50 font-semibold text-slate-600 border border-slate-200">Work Mode</td>
                        <td className="p-1.5 font-bold text-slate-900 border border-slate-200">{emp.workMode}</td>
                    </tr>
                    <tr>
                        <td className="p-1.5 bg-slate-50 font-semibold text-slate-600 border border-slate-200">Pay Period</td>
                        <td className="p-1.5 font-bold text-slate-900 border border-slate-200">{monthName}</td>
                        <td className="p-1.5 bg-slate-50 font-semibold text-slate-600 border border-slate-200">Total Paid Days</td>
                        <td className="p-1.5 font-bold text-slate-900 border border-slate-200">{days} Days (Full Attendance)</td>
                    </tr>
                </tbody>
            </table>

            {/* Salary Breakdown Table */}
            <table className="w-full border-collapse border border-slate-200 text-[11px] mb-3">
                <thead>
                    <tr className="bg-slate-900 text-white font-bold text-[10px] uppercase">
                        <th className="p-1.5 text-left border border-slate-300">Earnings Component</th>
                        <th className="p-1.5 text-right border border-slate-300">Amount (INR)</th>
                        <th className="p-1.5 text-left border border-slate-300">Deductions Component</th>
                        <th className="p-1.5 text-right border border-slate-300">Amount (INR)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="p-1.5 border border-slate-200">Basic Salary</td>
                        <td className="p-1.5 text-right border border-slate-200 font-mono">₹{emp.monthlyBasic.toLocaleString('en-IN')}.00</td>
                        <td className="p-1.5 border border-slate-200">Provident Fund (Employee EPF)</td>
                        <td className="p-1.5 text-right border border-slate-200 font-mono text-red-600">₹{emp.pfDeduction.toLocaleString('en-IN')}.00</td>
                    </tr>
                    <tr className="bg-slate-50">
                        <td className="p-1.5 border border-slate-200">House Rent Allowance (HRA)</td>
                        <td className="p-1.5 text-right border border-slate-200 font-mono">₹{emp.monthlyHra.toLocaleString('en-IN')}.00</td>
                        <td className="p-1.5 border border-slate-200">Employee State Insurance (ESIC)</td>
                        <td className="p-1.5 text-right border border-slate-200 font-mono">₹0.00</td>
                    </tr>
                    <tr>
                        <td className="p-1.5 border border-slate-200">Medical & Telecommunication</td>
                        <td className="p-1.5 text-right border border-slate-200 font-mono">₹{emp.monthlyMedical.toLocaleString('en-IN')}.00</td>
                        <td className="p-1.5 border border-slate-200">Professional Tax (PT)</td>
                        <td className="p-1.5 text-right border border-slate-200 font-mono">₹0.00</td>
                    </tr>
                    <tr className="bg-slate-50">
                        <td className="p-1.5 border border-slate-200">Special / Remote Allowance</td>
                        <td className="p-1.5 text-right border border-slate-200 font-mono">₹{emp.monthlySpecial.toLocaleString('en-IN')}.00</td>
                        <td className="p-1.5 border border-slate-200">Tax Deducted at Source (TDS)</td>
                        <td className="p-1.5 text-right border border-slate-200 font-mono">₹0.00</td>
                    </tr>
                    <tr className="bg-teal-50 font-extrabold text-teal-900 border-t-2 border-b-2 border-teal-600">
                        <td className="p-1.5 border border-slate-200">TOTAL GROSS EARNINGS (A)</td>
                        <td className="p-1.5 text-right border border-slate-200 font-mono">₹{emp.monthlyGross.toLocaleString('en-IN')}.00</td>
                        <td className="p-1.5 border border-slate-200">TOTAL DEDUCTIONS (B)</td>
                        <td className="p-1.5 text-right border border-slate-200 font-mono text-red-600">₹{emp.pfDeduction.toLocaleString('en-IN')}.00</td>
                    </tr>
                </tbody>
            </table>

            {/* Net Pay Card */}
            <div className="bg-teal-50 border-1.5 border-teal-600 rounded-lg p-3 flex items-center justify-between mb-3">
                <div>
                    <div className="text-[10px] font-bold text-teal-800 uppercase">Net Payable Salary (In-Hand Take Home: A &minus; B)</div>
                    <div className="text-xs font-semibold text-slate-700 italic">Annual CTC: ₹{emp.annualCtc.toLocaleString('en-IN')} &bull; Disbursed via Bank Transfer</div>
                </div>
                <div className="text-xl font-black text-teal-800 font-mono">
                    ₹{emp.netTakeHome.toLocaleString('en-IN')}.00
                </div>
            </div>

            <div className="text-[9.5px] text-slate-500 bg-slate-50 border-l-2 border-teal-600 p-2 mb-4">
                <strong>* Statutory Compliance:</strong> HealthExpress India is registered under Ministry of MSME, Govt. of India (Udyam Reg: UDYAM-OD-17-0050610). Monthly EPF contribution of ₹{emp.pfDeduction.toLocaleString('en-IN')} is deposited towards candidate's UAN. Net take-home pay is remitted directly to bank account.
            </div>

            {/* Signatures */}
            <div className="flex justify-between items-end pt-4 border-t border-dashed border-slate-300">
                <div className="text-center text-[10px] text-slate-600">
                    <div className="w-36 border-b border-slate-800 mb-1"></div>
                    <strong>{emp.name}</strong>
                    <div>Employee Signature</div>
                </div>

                {/* Round Corporate Seal */}
                <div className="w-18 h-18 rounded-full border-2 border-teal-600 p-1 flex items-center justify-center bg-teal-50/50">
                    <div className="w-full h-full rounded-full border border-dashed border-teal-600 flex flex-col items-center justify-center text-center p-1 leading-tight text-[7px] font-black text-teal-800">
                        <span>HEALTHEXPRESS</span>
                        <span className="text-[6px] text-teal-600">★ INDIA ★</span>
                        <span className="text-[5.5px]">UDYAM-OD-17-0050610</span>
                        <span className="text-[5.5px]">ODISHA</span>
                    </div>
                </div>

                <div className="text-center text-[10px] text-slate-600">
                    <div className="w-36 border-b border-slate-800 mb-1"></div>
                    <strong>For HEALTHEXPRESS INDIA</strong>
                    <div>Authorized Signatory (HR & Operations)</div>
                </div>
            </div>
        </div>
    );
}

// =========================================================================
// SUB-COMPONENT: PRINTABLE OFFER LETTER (3 PAGES)
// =========================================================================
function PrintableOfferLetter({ emp, logoBase64 }: { emp: EmployeeRecord; logoBase64: string }) {
    return (
        <div className="text-[12px] leading-relaxed font-sans space-y-8">
            {/* Page 1 */}
            <div className="min-h-[900px] flex flex-col justify-between border-b pb-8 border-slate-300">
                <div>
                    <div className="flex items-center justify-between border-b-2 border-teal-600 pb-3 mb-3">
                        <div className="flex items-center gap-3">
                            <img src={logoBase64} alt="HealthExpress Logo" className="w-12 h-12 rounded-xl object-contain shadow-xs" />
                            <div>
                                <div className="text-2xl font-black text-teal-800 leading-none">HealthExpress</div>
                                <div className="text-[10px] font-extrabold text-teal-600 tracking-[3px] uppercase">India</div>
                            </div>
                        </div>
                        <div className="text-right text-[10px] text-slate-500 leading-tight">
                            <span className="inline-block bg-teal-50 text-teal-800 border border-teal-200 px-1.5 py-0.5 rounded font-bold text-[9px] mb-0.5">Govt. of India Registered MSME</span>
                            <div className="font-bold text-slate-800 text-[11px]">HEALTHEXPRESS INDIA</div>
                            <div><strong>Udyam:</strong> UDYAM-OD-17-0050610</div>
                            <div>Plot No. 1034, Kalpataru Kutira Building, Kajala, Kendrapara, Odisha &ndash; 754211</div>
                            <div><strong>Web:</strong> www.healthexpressindia.com &bull; <strong>Support:</strong> +91 91143 24795</div>
                        </div>
                    </div>

                    <div className="flex justify-between text-[11px] bg-slate-50 border-l-3 border-teal-600 px-3 py-1.5 mb-3">
                        <div><strong>Ref. No:</strong> HEI/HR/2026/OFF-0128</div>
                        <div><strong>Date of Issue:</strong> {emp.dateOfJoining}</div>
                    </div>

                    <div className="text-center my-3">
                        <h1 className="text-lg font-serif font-bold text-slate-900 uppercase">Letter of Employment & Appointment</h1>
                        <p className="text-xs font-bold text-teal-700 uppercase tracking-wider">Executive Appointment &bull; {emp.designation}</p>
                    </div>

                    <table className="w-full border-collapse border border-slate-200 text-[11px] mb-4">
                        <tbody>
                            <tr>
                                <td className="p-1.5 bg-slate-50 font-semibold text-slate-600 border border-slate-200 w-1/4">Candidate Name</td>
                                <td className="p-1.5 font-bold text-slate-900 border border-slate-200 w-1/4">{emp.name}</td>
                                <td className="p-1.5 bg-slate-50 font-semibold text-slate-600 border border-slate-200 w-1/4">Designation</td>
                                <td className="p-1.5 font-bold text-slate-900 border border-slate-200 w-1/4">{emp.designation}</td>
                            </tr>
                            <tr>
                                <td className="p-1.5 bg-slate-50 font-semibold text-slate-600 border border-slate-200">Department</td>
                                <td className="p-1.5 font-bold text-slate-900 border border-slate-200">{emp.department}</td>
                                <td className="p-1.5 bg-slate-50 font-semibold text-slate-600 border border-slate-200">Date of Joining</td>
                                <td className="p-1.5 font-bold text-slate-900 border border-slate-200">{emp.dateOfJoining}</td>
                            </tr>
                            <tr>
                                <td className="p-1.5 bg-slate-50 font-semibold text-slate-600 border border-slate-200">Annual CTC</td>
                                <td className="p-1.5 font-bold text-slate-900 border border-slate-200">INR {emp.annualCtc.toLocaleString('en-IN')}/-</td>
                                <td className="p-1.5 bg-slate-50 font-semibold text-slate-600 border border-slate-200">Net Take-Home</td>
                                <td className="p-1.5 font-bold text-teal-700 border border-slate-200">INR {emp.netTakeHome.toLocaleString('en-IN')}/- / Mo</td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="space-y-2 text-[11.5px] text-slate-700 text-justify">
                        <p><strong>Dear {emp.name},</strong></p>
                        <p>On behalf of <strong>HEALTHEXPRESS INDIA</strong>, we are pleased to confirm your appointment as <strong>{emp.designation}</strong>. We are confident that your experience and drive will significantly contribute to scaling our surgical network across India.</p>
                        <div className="font-bold text-slate-900 mt-2">1. Position & Work Mode</div>
                        <p>You shall discharge your responsibilities in a <strong>{emp.workMode}</strong> capacity, reporting to the Directorate of Operations, with targeted field meetings as necessary.</p>
                        <div className="font-bold text-slate-900 mt-2">2. Key Mandate & Responsibilities</div>
                        <ul className="list-disc ml-5 space-y-1">
                            <li>Hospital & Clinic Empanelment across targeted surgical specialties.</li>
                            <li>Surgeon Network expansion and managing surgical package commercial tie-ups.</li>
                            <li>B2B referral channels, corporate wellness partnerships, and inorganic patient lead pipelines.</li>
                            <li>CRM pipeline tracking, conversion rate optimization, and weekly management reviews.</li>
                        </ul>
                    </div>
                </div>
                <div className="text-center text-[10px] text-slate-400 border-t pt-2">HEALTHEXPRESS INDIA &bull; UDYAM-OD-17-0050610 &bull; Page 1 of 3</div>
            </div>

            {/* Page 2 */}
            <div className="min-h-[900px] flex flex-col justify-between border-b pb-8 border-slate-300">
                <div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 border-b pb-1 mb-4">
                        <span>HEALTHEXPRESS INDIA &bull; Appointment Letter</span>
                        <span>Candidate: {emp.name} &bull; {emp.employeeId}</span>
                    </div>

                    <div className="space-y-3 text-[11.5px] text-slate-700 text-justify">
                        <div className="font-bold text-slate-900">3. Compensation & Statutory EPF</div>
                        <p>Your annual CTC is INR {emp.annualCtc.toLocaleString('en-IN')}/-. In accordance with statutory EPF regulations, monthly PF deduction of INR {emp.pfDeduction.toLocaleString('en-IN')}/- is remitted to your UAN, yielding a net in-hand salary of INR {emp.netTakeHome.toLocaleString('en-IN')}/- per month.</p>

                        <div className="font-bold text-slate-900">4. Probation & Confirmation</div>
                        <p>You will undergo a 3-month probation period. Upon satisfactory review of performance against BDM conversion benchmarks, your employment will be confirmed in writing.</p>

                        <div className="font-bold text-slate-900">5. Exclusivity & Non-Moonlighting</div>
                        <p>This is a full-time, exclusive employment. You shall not engage in any other business or employment, whether advisory or operational, during your association with HealthExpress India.</p>

                        <div className="font-bold text-slate-900">6. Confidentiality & Medical Data Privacy</div>
                        <p>You agree to safeguard all patient records, doctor pricing schedules, and hospital commercial terms with strictest confidentiality under applicable healthcare privacy guidelines.</p>

                        <div className="font-bold text-slate-900">7. Separation & Notice Period</div>
                        <p>During probation, either party may terminate employment by giving 15 days' notice. Post-confirmation, the notice period shall be 30 days.</p>
                    </div>
                </div>
                <div className="text-center text-[10px] text-slate-400 border-t pt-2">HEALTHEXPRESS INDIA &bull; UDYAM-OD-17-0050610 &bull; Page 2 of 3</div>
            </div>

            {/* Page 3 */}
            <div className="min-h-[900px] flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 border-b pb-1 mb-4">
                        <span>HEALTHEXPRESS INDIA &bull; Annexure A & Signatures</span>
                        <span>Candidate: {emp.name}</span>
                    </div>

                    <div className="text-center mb-3">
                        <h2 className="text-sm font-bold text-slate-900 uppercase">Annexure A: Compensation Breakdown</h2>
                    </div>

                    <table className="w-full border-collapse border border-slate-200 text-[11px] mb-4">
                        <thead>
                            <tr className="bg-slate-900 text-white font-bold text-[10px] uppercase">
                                <th className="p-1.5 text-left border border-slate-300">Component</th>
                                <th className="p-1.5 text-right border border-slate-300">Monthly (INR)</th>
                                <th className="p-1.5 text-right border border-slate-300">Annual (INR)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className="p-1.5 border border-slate-200">Basic Salary</td>
                                <td className="p-1.5 text-right border border-slate-200 font-mono">₹{emp.monthlyBasic.toLocaleString('en-IN')}.00</td>
                                <td className="p-1.5 text-right border border-slate-200 font-mono">₹{(emp.monthlyBasic * 12).toLocaleString('en-IN')}.00</td>
                            </tr>
                            <tr className="bg-slate-50">
                                <td className="p-1.5 border border-slate-200">House Rent Allowance (HRA)</td>
                                <td className="p-1.5 text-right border border-slate-200 font-mono">₹{emp.monthlyHra.toLocaleString('en-IN')}.00</td>
                                <td className="p-1.5 text-right border border-slate-200 font-mono">₹{(emp.monthlyHra * 12).toLocaleString('en-IN')}.00</td>
                            </tr>
                            <tr>
                                <td className="p-1.5 border border-slate-200">Medical & Telecommunication Allowance</td>
                                <td className="p-1.5 text-right border border-slate-200 font-mono">₹{emp.monthlyMedical.toLocaleString('en-IN')}.00</td>
                                <td className="p-1.5 text-right border border-slate-200 font-mono">₹{(emp.monthlyMedical * 12).toLocaleString('en-IN')}.00</td>
                            </tr>
                            <tr className="bg-slate-50">
                                <td className="p-1.5 border border-slate-200">Special BDM / Remote Allowance</td>
                                <td className="p-1.5 text-right border border-slate-200 font-mono">₹{emp.monthlySpecial.toLocaleString('en-IN')}.00</td>
                                <td className="p-1.5 text-right border border-slate-200 font-mono">₹{(emp.monthlySpecial * 12).toLocaleString('en-IN')}.00</td>
                            </tr>
                            <tr className="bg-teal-50 font-extrabold text-teal-900 border-t-2 border-b-2 border-teal-600">
                                <td className="p-1.5 border border-slate-200">TOTAL GROSS SALARY / CTC</td>
                                <td className="p-1.5 text-right border border-slate-200 font-mono">₹{emp.monthlyGross.toLocaleString('en-IN')}.00</td>
                                <td className="p-1.5 text-right border border-slate-200 font-mono">₹{emp.annualCtc.toLocaleString('en-IN')}.00</td>
                            </tr>
                            <tr>
                                <td className="p-1.5 border border-slate-200 text-red-600">Employee Provident Fund (EPF Deduction)</td>
                                <td className="p-1.5 text-right border border-slate-200 font-mono text-red-600">&minus; ₹{emp.pfDeduction.toLocaleString('en-IN')}.00</td>
                                <td className="p-1.5 text-right border border-slate-200 font-mono text-red-600">&minus; ₹{(emp.pfDeduction * 12).toLocaleString('en-IN')}.00</td>
                            </tr>
                            <tr className="bg-teal-100 font-black text-teal-950 text-xs">
                                <td className="p-2 border border-slate-200">NET IN-HAND TAKE-HOME SALARY</td>
                                <td className="p-2 text-right border border-slate-200 font-mono">₹{emp.netTakeHome.toLocaleString('en-IN')}.00</td>
                                <td className="p-2 text-right border border-slate-200 font-mono">₹{(emp.netTakeHome * 12).toLocaleString('en-IN')}.00</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* Signatures */}
                    <div className="flex justify-between items-end pt-6 border-t border-dashed border-slate-300">
                        <div className="text-center text-[10px] text-slate-600">
                            <div className="w-40 border-b border-slate-800 mb-1"></div>
                            <strong>For HEALTHEXPRESS INDIA</strong>
                            <div>Authorized Signatory</div>
                        </div>

                        <div className="w-18 h-18 rounded-full border-2 border-teal-600 p-1 flex items-center justify-center bg-teal-50/50">
                            <div className="w-full h-full rounded-full border border-dashed border-teal-600 flex flex-col items-center justify-center text-center p-1 leading-tight text-[7px] font-black text-teal-800">
                                <span>HEALTHEXPRESS</span>
                                <span className="text-[6px] text-teal-600">★ INDIA ★</span>
                                <span className="text-[5.5px]">UDYAM-OD-17-0050610</span>
                                <span className="text-[5.5px]">ODISHA</span>
                            </div>
                        </div>

                        <div className="text-center text-[10px] text-slate-600">
                            <div className="w-40 border-b border-slate-800 mb-1"></div>
                            <strong>{emp.name}</strong>
                            <div>Candidate Acceptance</div>
                        </div>
                    </div>
                </div>
                <div className="text-center text-[10px] text-slate-400 border-t pt-2">HEALTHEXPRESS INDIA &bull; UDYAM-OD-17-0050610 &bull; Page 3 of 3</div>
            </div>
        </div>
    );
}

// =========================================================================
// SUB-COMPONENT: PRINTABLE RELIEVING LETTER (1 PAGE)
// =========================================================================
function PrintableRelievingLetter({ emp, relievingDate, logoBase64 }: { emp: EmployeeRecord; relievingDate: string; logoBase64: string }) {
    return (
        <div className="text-[12px] leading-relaxed font-sans">
            <div className="flex items-center justify-between border-b-2 border-teal-600 pb-3 mb-3">
                <div className="flex items-center gap-3">
                    <img src={logoBase64} alt="HealthExpress Logo" className="w-12 h-12 rounded-xl object-contain shadow-xs" />
                    <div>
                        <div className="text-2xl font-black text-teal-800 leading-none">HealthExpress</div>
                        <div className="text-[10px] font-extrabold text-teal-600 tracking-[3px] uppercase">India</div>
                    </div>
                </div>
                <div className="text-right text-[10px] text-slate-500 leading-tight">
                    <span className="inline-block bg-teal-50 text-teal-800 border border-teal-200 px-1.5 py-0.5 rounded font-bold text-[9px] mb-0.5">Govt. of India Registered MSME</span>
                    <div className="font-bold text-slate-800 text-[11px]">HEALTHEXPRESS INDIA</div>
                    <div><strong>Udyam:</strong> UDYAM-OD-17-0050610</div>
                    <div>Plot No. 1034, Kalpataru Kutira Building, Kajala, Kendrapara, Odisha &ndash; 754211</div>
                    <div><strong>Web:</strong> www.healthexpressindia.com &bull; <strong>Support:</strong> +91 91143 24795</div>
                </div>
            </div>

            <div className="flex justify-between text-[11px] bg-slate-50 border-l-3 border-teal-600 px-3 py-1.5 mb-3">
                <div><strong>Ref. No:</strong> HEI/HR/2026/REL-0128</div>
                <div><strong>Date of Issuance:</strong> {relievingDate}</div>
            </div>

            <div className="text-center my-3">
                <h1 className="text-base font-serif font-bold text-slate-900 uppercase">Relieving Letter & Service Certificate</h1>
                <p className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">Official Experience & Separation Certificate</p>
            </div>

            <table className="w-full border-collapse border border-slate-200 text-[11px] mb-4">
                <tbody>
                    <tr>
                        <td className="p-1.5 bg-slate-50 font-semibold text-slate-600 border border-slate-200 w-1/4">Employee Name</td>
                        <td className="p-1.5 font-bold text-slate-900 border border-slate-200 w-1/4">{emp.name}</td>
                        <td className="p-1.5 bg-slate-50 font-semibold text-slate-600 border border-slate-200 w-1/4">Designation</td>
                        <td className="p-1.5 font-bold text-slate-900 border border-slate-200 w-1/4">{emp.designation}</td>
                    </tr>
                    <tr>
                        <td className="p-1.5 bg-slate-50 font-semibold text-slate-600 border border-slate-200">Date of Joining</td>
                        <td className="p-1.5 font-bold text-slate-900 border border-slate-200">{emp.dateOfJoining}</td>
                        <td className="p-1.5 bg-slate-50 font-semibold text-slate-600 border border-slate-200">Relieving Date</td>
                        <td className="p-1.5 font-bold text-slate-900 border border-slate-200">{relievingDate}</td>
                    </tr>
                </tbody>
            </table>

            <div className="space-y-3 text-[11.5px] text-slate-700 text-justify mb-6">
                <p><strong>Dear {emp.name},</strong></p>
                <p>This has reference to your formal resignation from <strong>HEALTHEXPRESS INDIA</strong>. We hereby confirm that your resignation has been accepted and you are officially relieved from your duties as <strong>{emp.designation}</strong> effective at the close of business hours on <strong>{relievingDate}</strong>.</p>
                
                <div className="bg-teal-50 border border-teal-200 p-2.5 rounded text-teal-900 text-[11px]">
                    <strong>Clearance & No Dues:</strong> We confirm that you have completed all handover protocols, transferred hospital records and partner accounts, and your Full & Final Settlement has been cleared with <strong>Zero Outstanding Dues</strong>.
                </div>

                <p>During your tenure from {emp.dateOfJoining} to {relievingDate}, your dedication, professionalism, and contribution to hospital partnerships were exemplary. We thank you for your service and wish you all the best in your career ahead.</p>
            </div>

            <div className="flex justify-between items-end pt-6 border-t border-dashed border-slate-300">
                <div className="text-center text-[10px] text-slate-600">
                    <div className="w-36 border-b border-slate-800 mb-1"></div>
                    <strong>{emp.name}</strong>
                    <div>Employee Acknowledgment</div>
                </div>

                <div className="w-18 h-18 rounded-full border-2 border-teal-600 p-1 flex items-center justify-center bg-teal-50/50">
                    <div className="w-full h-full rounded-full border border-dashed border-teal-600 flex flex-col items-center justify-center text-center p-1 leading-tight text-[7px] font-black text-teal-800">
                        <span>HEALTHEXPRESS</span>
                        <span className="text-[6px] text-teal-600">★ INDIA ★</span>
                        <span className="text-[5.5px]">UDYAM-OD-17-0050610</span>
                        <span className="text-[5.5px]">ODISHA</span>
                    </div>
                </div>

                <div className="text-center text-[10px] text-slate-600">
                    <div className="w-36 border-b border-slate-800 mb-1"></div>
                    <strong>For HEALTHEXPRESS INDIA</strong>
                    <div>Authorized Signatory (HR & Operations)</div>
                </div>
            </div>
        </div>
    );
}
