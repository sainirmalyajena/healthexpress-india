'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Lock, ArrowRight, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function PatientLoginPage() {
    const router = useRouter();
    const [step, setStep] = useState<'phone' | 'otp'>('phone');
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSendOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/patient/otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Failed to send OTP');
            }

            setStep('otp');
            setSuccess('OTP sent successfully to your mobile.');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const result = await signIn('patient-login', {
                phone,
                otp,
                redirect: false,
            });

            if (result?.error) {
                throw new Error('Invalid OTP. Please try again.');
            }

            router.push('/patient/dashboard');
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="flex justify-center mb-6">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">H</div>
                        <span className="text-2xl font-bold text-slate-900">HealthExpress</span>
                    </Link>
                </div>
                <h2 className="text-center text-3xl font-extrabold text-slate-900 tracking-tight">
                    Patient Command Center
                </h2>
                <p className="mt-2 text-center text-sm text-slate-600">
                    Track your inquiry, surgery status, and medical reports.
                </p>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-3xl sm:px-10 border border-slate-100">
                    <AnimatePresence mode="wait">
                        {step === 'phone' ? (
                            <motion.div
                                key="phone-step"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                            >
                                <form className="space-y-6" onSubmit={handleSendOTP}>
                                    <div>
                                        <label htmlFor="phone" className="block text-sm font-semibold text-slate-700">
                                            Registered Mobile Number
                                        </label>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Phone className="h-5 w-5 text-slate-400" />
                                            </div>
                                            <input
                                                id="phone"
                                                name="phone"
                                                type="tel"
                                                required
                                                placeholder="Enter 10 digit mobile"
                                                value={phone}
                                                onChange={(e) => setPhone(e.target.value)}
                                                className="block w-full pl-10 pr-3 py-3 border-slate-200 rounded-xl focus:ring-teal-500 focus:border-teal-500 text-slate-900 placeholder:text-slate-400"
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                            <p>{error}</p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading || phone.length < 10}
                                        className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:opacity-50 transition-all"
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Login OTP'}
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </form>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="otp-step"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <form className="space-y-6" onSubmit={handleVerifyOTP}>
                                    <div>
                                        <div className="flex justify-between items-center mb-1">
                                            <label htmlFor="otp" className="block text-sm font-semibold text-slate-700">
                                                Verification Code
                                            </label>
                                            <button
                                                type="button"
                                                onClick={() => setStep('phone')}
                                                className="text-xs text-teal-600 hover:underline font-medium"
                                            >
                                                Change Number
                                            </button>
                                        </div>
                                        <div className="mt-1 relative rounded-md shadow-sm">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Lock className="h-5 w-5 text-slate-400" />
                                            </div>
                                            <input
                                                id="otp"
                                                name="otp"
                                                type="text"
                                                required
                                                maxLength={6}
                                                placeholder="Enter 6-digit OTP"
                                                value={otp}
                                                onChange={(e) => setOtp(e.target.value)}
                                                className="block w-full pl-10 pr-3 py-3 border-slate-200 rounded-xl focus:ring-teal-500 focus:border-teal-500 text-slate-900 placeholder:text-slate-400 tracking-[0.5em] font-mono text-center text-lg"
                                            />
                                        </div>
                                        <p className="mt-2 text-xs text-slate-500">
                                            Sent to +91 {phone.slice(0, 2)}******{phone.slice(-2)}
                                        </p>
                                    </div>

                                    {success && (
                                        <div className="flex items-center gap-2 p-3 bg-teal-50 text-teal-700 text-sm rounded-lg border border-teal-100">
                                            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                                            <p>{success}</p>
                                        </div>
                                    )}

                                    {error && (
                                        <div className="flex items-center gap-2 p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-100">
                                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                                            <p>{error}</p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={loading || otp.length < 6}
                                        className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 transition-all"
                                    >
                                        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm & Login'}
                                    </button>
                                </form>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                <p className="mt-8 text-center text-sm text-slate-500">
                    By logging in, you agree to our{' '}
                    <Link href="/terms" className="font-medium text-slate-700 hover:text-teal-600 underline">
                        Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="font-medium text-slate-700 hover:text-teal-600 underline">
                        Privacy Policy
                    </Link>
                </p>
            </div>
        </div>
    );
}
