'use client';

import { useState } from 'react';
import Link from 'next/link';
import { trackFormSubmission } from '@/components/Analytics';

const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
    'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
    'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
    'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Puducherry'
];

const SPECIALTIES = [
    'General Surgery', 'Orthopedics', 'Cardiology', 'Neurology', 'Gynecology',
    'Pediatrics', 'Oncology', 'ENT', 'Ophthalmology', 'Dental', 'Urology',
    'Gastroenterology', 'Nephrology', 'Dermatology', 'Psychiatry'
];

export default function PartnersPage() {
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>([]);

    const handleSpecialtyChange = (specialty: string) => {
        setSelectedSpecialties(prev =>
            prev.includes(specialty)
                ? prev.filter(s => s !== specialty)
                : [...prev, specialty]
        );
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            hospitalName: formData.get('hospitalName'),
            registrationNumber: formData.get('registrationNumber'),
            city: formData.get('city'),
            state: formData.get('state'),
            pincode: formData.get('pincode'),
            contactPerson: formData.get('contactPerson'),
            designation: formData.get('designation'),
            email: formData.get('email'),
            phone: formData.get('phone'),
            website: formData.get('website'),
            hospitalType: Array.from(formData.getAll('hospitalType')),
            specialties: selectedSpecialties,
            bedCapacity: formData.get('bedCapacity'),
            icuBeds: formData.get('icuBeds'),
            hasOT: formData.get('hasOT') === 'on',
            yearsInOperation: formData.get('yearsInOperation'),
            isNABH: formData.get('isNABH') === 'on',
            isJCI: formData.get('isJCI') === 'on',
            isISO: formData.get('isISO') === 'on',
            has24x7Emergency: formData.get('has24x7Emergency') === 'on',
            hasAmbulance: formData.get('hasAmbulance') === 'on',
            hasPharmacy: formData.get('hasPharmacy') === 'on',
            hasDiagnosticLab: formData.get('hasDiagnosticLab') === 'on',
            hasBloodBank: formData.get('hasBloodBank') === 'on',
            partnershipReason: formData.get('partnershipReason'),
            monthlyPatients: formData.get('monthlyPatients'),
            insuranceTieups: formData.get('insuranceTieups'),
        };

        try {
            const response = await fetch('/api/partners', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            const result = await response.json();

            if (response.ok && result.success) {
                setSubmitted(true);
                trackFormSubmission('partner_registration', data.hospitalName as string);
            } else {
                alert(result.error || 'Failed to submit. Please try again.');
            }
        } catch (error) {
            console.error('Submission error:', error);
            alert('Failed to submit. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Hero Section */}
            <div className="bg-gradient-to-br from-teal-600 to-teal-800 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                    <div className="max-w-3xl">
                        <h1 className="text-4xl md:text-5xl font-bold mb-6">
                            Partner with India&apos;s Leading Healthcare Platform
                        </h1>
                        <p className="text-xl text-teal-100 mb-8">
                            Join 500+ hospital partners and grow your patient base with guaranteed referrals,
                            transparent pricing, and dedicated support.
                        </p>
                        <a href="#register" className="inline-block bg-white text-teal-700 font-semibold px-8 py-4 rounded-lg hover:bg-teal-50 transition-colors">
                            Become a Partner Hospital →
                        </a>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-teal-600 mb-2">500+</div>
                            <div className="text-slate-600">Partner Hospitals</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-teal-600 mb-2">10,000+</div>
                            <div className="text-slate-600">Happy Patients</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-teal-600 mb-2">₹50Cr+</div>
                            <div className="text-slate-600">Revenue Processed</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-teal-600 mb-2">95%</div>
                            <div className="text-slate-600">Hospital Satisfaction</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Benefits Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 mb-4">Why Partner with HealthExpress?</h2>
                    <p className="text-lg text-slate-600">Grow your hospital with India&apos;s most trusted healthcare platform</p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">Increased Patient Flow</h3>
                        <p className="text-slate-600">Get qualified patient referrals actively searching for procedures. Average 50+ patients per month.</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">Guaranteed Revenue</h3>
                        <p className="text-slate-600">Transparent pricing with no payment delays. Fixed commission model with guaranteed payouts within 7 days.</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">Analytics Dashboard</h3>
                        <p className="text-slate-600">Track referrals, conversion rates, and revenue in real-time. Data-driven insights to optimize performance.</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">Enhanced Credibility</h3>
                        <p className="text-slate-600">Featured listing on our platform with verified badge. Patient reviews and ratings to build trust.</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">Dedicated Support</h3>
                        <p className="text-slate-600">Personal account manager assigned to your hospital. 24/7 support for urgent issues and queries.</p>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 bg-teal-100 text-teal-600 rounded-lg flex items-center justify-center mb-4">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 mb-2">Marketing Support</h3>
                        <p className="text-slate-600">Featured in our digital campaigns and social media. Co-marketing opportunities to reach more patients.</p>
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div className="bg-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-slate-900 mb-4">How Partnership Works</h2>
                        <p className="text-lg text-slate-600">Simple 4-step process to get started</p>
                    </div>

                    <div className="grid md:grid-cols-4 gap-8">
                        {[
                            { step: '1', title: 'Submit Application', desc: 'Fill the registration form with your hospital details' },
                            { step: '2', title: 'Verification', desc: 'Our team reviews and verifies your credentials' },
                            { step: '3', title: 'Agreement', desc: 'Sign partnership agreement and complete onboarding' },
                            { step: '4', title: 'Go Live', desc: 'Start receiving patient referrals immediately' }
                        ].map((item, i) => (
                            <div key={i} className="text-center">
                                <div className="w-16 h-16 bg-teal-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                                    {item.step}
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
                                <p className="text-slate-600 text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Registration Form */}
            <div id="register" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-white rounded-xl shadow-lg p-8">
                    {submitted ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-2">Application Submitted!</h3>
                            <p className="text-slate-600 mb-4">
                                Thank you for your interest in partnering with HealthExpress India.
                            </p>
                            <div className="bg-teal-50 border border-teal-100 rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
                                <h4 className="font-semibold text-teal-900 mb-2">What happens next?</h4>
                                <ul className="text-sm text-teal-700 space-y-1">
                                    <li>✓ Our team will review your application within 48 hours</li>
                                    <li>✓ We&apos;ll verify your credentials and hospital details</li>
                                    <li>✓ You&apos;ll receive an email with next steps</li>
                                    <li>✓ Schedule a call to discuss partnership terms</li>
                                </ul>
                            </div>
                            <Link href="/" className="text-teal-600 hover:text-teal-700 font-medium">
                                ← Back to Home
                            </Link>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">Register Your Hospital</h2>
                            <p className="text-slate-600 mb-8">Fill in the details below to start your partnership journey</p>

                            <form onSubmit={handleSubmit} className="space-y-8">
                                {/* Basic Information */}
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                                        Basic Information
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Hospital Name *</label>
                                            <input type="text" name="hospitalName" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Registration Number *</label>
                                            <input type="text" name="registrationNumber" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">City *</label>
                                            <input type="text" name="city" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">State *</label>
                                            <select name="state" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500">
                                                <option value="">Select State</option>
                                                {INDIAN_STATES.map(state => (
                                                    <option key={state} value={state}>{state}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Pincode *</label>
                                            <input type="text" name="pincode" required pattern="[0-9]{6}" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500" />
                                        </div>
                                    </div>
                                </div>

                                {/* Contact Details */}
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                                        Contact Details
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Contact Person Name *</label>
                                            <input type="text" name="contactPerson" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Designation *</label>
                                            <input type="text" name="designation" required placeholder="e.g., CEO, Director, Administrator" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
                                            <input type="email" name="email" required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Phone Number *</label>
                                            <input type="tel" name="phone" required placeholder="+91 98765 43210" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Website (Optional)</label>
                                            <input type="url" name="website" placeholder="https://" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500" />
                                        </div>
                                    </div>
                                </div>

                                {/* Hospital Details */}
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                                        Hospital Details
                                    </h3>

                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Hospital Type *</label>
                                        <div className="flex gap-4">
                                            <label className="flex items-center">
                                                <input type="checkbox" name="hospitalType" value="Private" className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500" />
                                                <span className="ml-2 text-sm text-slate-700">Private</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input type="checkbox" name="hospitalType" value="Government" className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500" />
                                                <span className="ml-2 text-sm text-slate-700">Government</span>
                                            </label>
                                            <label className="flex items-center">
                                                <input type="checkbox" name="hospitalType" value="Trust" className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500" />
                                                <span className="ml-2 text-sm text-slate-700">Trust/NGO</span>
                                            </label>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Specialties Offered * (Select all that apply)</label>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto border border-slate-200 rounded-lg p-4">
                                            {SPECIALTIES.map(specialty => (
                                                <label key={specialty} className="flex items-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedSpecialties.includes(specialty)}
                                                        onChange={() => handleSpecialtyChange(specialty)}
                                                        className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500"
                                                    />
                                                    <span className="ml-2 text-sm text-slate-700">{specialty}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Total Bed Capacity *</label>
                                            <input type="number" name="bedCapacity" required min="1" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">ICU Beds</label>
                                            <input type="number" name="icuBeds" min="0" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Years in Operation *</label>
                                            <input type="number" name="yearsInOperation" required min="0" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500" />
                                        </div>
                                    </div>

                                    <div className="mt-6">
                                        <label className="flex items-center">
                                            <input type="checkbox" name="hasOT" className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500" />
                                            <span className="ml-2 text-sm text-slate-700">We have Operation Theatre (OT) facilities</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Accreditation */}
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                                        Accreditation & Certifications
                                    </h3>
                                    <div className="space-y-3">
                                        <label className="flex items-center">
                                            <input type="checkbox" name="isNABH" className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500" />
                                            <span className="ml-2 text-sm text-slate-700">NABH Accredited</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="checkbox" name="isJCI" className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500" />
                                            <span className="ml-2 text-sm text-slate-700">JCI Certified</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="checkbox" name="isISO" className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500" />
                                            <span className="ml-2 text-sm text-slate-700">ISO Certified</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Facilities */}
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                                        Facilities & Infrastructure
                                    </h3>
                                    <div className="grid md:grid-cols-2 gap-3">
                                        <label className="flex items-center">
                                            <input type="checkbox" name="has24x7Emergency" className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500" />
                                            <span className="ml-2 text-sm text-slate-700">24/7 Emergency Services</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="checkbox" name="hasAmbulance" className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500" />
                                            <span className="ml-2 text-sm text-slate-700">Ambulance Service</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="checkbox" name="hasPharmacy" className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500" />
                                            <span className="ml-2 text-sm text-slate-700">In-house Pharmacy</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="checkbox" name="hasDiagnosticLab" className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500" />
                                            <span className="ml-2 text-sm text-slate-700">Diagnostic Laboratory</span>
                                        </label>
                                        <label className="flex items-center">
                                            <input type="checkbox" name="hasBloodBank" className="w-4 h-4 text-teal-600 rounded focus:ring-teal-500" />
                                            <span className="ml-2 text-sm text-slate-700">Blood Bank</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Additional Information */}
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 mb-4 pb-2 border-b border-slate-200">
                                        Additional Information
                                    </h3>
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-2">Why do you want to partner with us? *</label>
                                            <textarea name="partnershipReason" required rows={4} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"></textarea>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Current Patient Volume per Month</label>
                                                <input type="number" name="monthlyPatients" min="0" placeholder="Approximate number" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500" />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-2">Insurance Tie-ups (comma-separated)</label>
                                                <input type="text" name="insuranceTieups" placeholder="e.g., HDFC Ergo, Star Health" className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-teal-500 focus:border-teal-500" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit */}
                                <div className="pt-6 border-t border-slate-200">
                                    <button
                                        type="submit"
                                        disabled={loading || selectedSpecialties.length === 0}
                                        className="w-full bg-teal-600 text-white font-semibold py-4 rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? 'Submitting Application...' : 'Submit Partnership Application'}
                                    </button>
                                    <p className="text-xs text-slate-500 text-center mt-4">
                                        By submitting, you agree to our <Link href="/terms" className="text-teal-600 underline">Terms</Link> and <Link href="/privacy" className="text-teal-600 underline">Privacy Policy</Link>.
                                    </p>
                                    <div className="flex items-center gap-2 justify-center mt-4 text-sm text-slate-500">
                                        <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                        Your information is secure and confidential
                                    </div>
                                </div>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
