'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { leadFormSchema, LeadFormData } from '@/lib/validations';
import { Button, Input, Select, Textarea, Checkbox } from '@/components/ui';
import { Lock, ShieldCheck, Clock, CheckCircle2, UserCheck, Stethoscope } from 'lucide-react';

interface LeadFormProps {
    surgeryId: string;
    surgeryName: string;
}

export function LeadForm({ surgeryId, surgeryName }: LeadFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitResult, setSubmitResult] = useState<{ success: boolean; referenceId?: string; message?: string } | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<LeadFormData>({
        resolver: zodResolver(leadFormSchema),
        mode: 'onChange',
        defaultValues: {
            surgeryId,
            surgeryName,
            insurance: undefined,
            consent: false,
        },
    });

    const onSubmit = async (data: LeadFormData) => {
        setIsSubmitting(true);
        setSubmitResult(null);

        try {
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...data,
                    sourcePage: window.location.href,
                }),
            });

            const result = await response.json();

            if (response.ok) {
                setSubmitResult({ success: true, referenceId: result.referenceId });
                reset();
            } else {
                setSubmitResult({ success: false, message: result.error || 'Something went wrong' });
            }
        } catch {
            setSubmitResult({ success: false, message: 'Network error. Please try again.' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitResult?.success) {
        return (
            <div className="bg-white rounded-2xl p-6 md:p-8 text-center animate-in fade-in zoom-in duration-500">
                {/* Success Icon */}
                <div className="mx-auto w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6 shadow-sm border border-green-100">
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                
                <h3 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-3 tracking-tight">
                    Request Received Successfully!
                </h3>
                <p className="text-slate-600 mb-8 max-w-sm mx-auto text-sm md:text-base">
                    Thank you for trusting HealthExpress India. Your health is our priority.
                </p>

                {/* Reference ID Pill */}
                <div className="inline-flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 mb-10 shadow-sm">
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Ref ID:</span>
                    <span className="text-lg font-mono font-bold text-teal-700 tracking-wider">{submitResult.referenceId}</span>
                </div>

                {/* What's Next Timeline */}
                <div className="text-left bg-slate-50 rounded-2xl p-6 border border-slate-100">
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 text-center">What Happens Next?</h4>
                    <div className="space-y-6 relative before:absolute before:inset-0 before:ml-[1.125rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-teal-200 before:to-transparent">
                        
                        {/* Step 1 */}
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                            <div className="flex items-center justify-center w-9 h-9 rounded-full border-4 border-white bg-teal-100 text-teal-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                <UserCheck className="w-4 h-4" />
                            </div>
                            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                <h5 className="font-bold text-slate-900 text-sm mb-1">Expert Review</h5>
                                <p className="text-xs text-slate-500 leading-relaxed">A senior care coordinator is reviewing your medical requirements.</p>
                            </div>
                        </div>

                        {/* Step 2 */}
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                            <div className="flex items-center justify-center w-9 h-9 rounded-full border-4 border-white bg-teal-100 text-teal-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                <Clock className="w-4 h-4" />
                            </div>
                            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                <h5 className="font-bold text-slate-900 text-sm mb-1">Priority Callback</h5>
                                <p className="text-xs text-slate-500 leading-relaxed">You will receive a call within 24 hours to discuss options.</p>
                            </div>
                        </div>

                        {/* Step 3 */}
                        <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
                            <div className="flex items-center justify-center w-9 h-9 rounded-full border-4 border-white bg-teal-100 text-teal-600 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                                <Stethoscope className="w-4 h-4" />
                            </div>
                            <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                                <h5 className="font-bold text-slate-900 text-sm mb-1">Doctor Match</h5>
                                <p className="text-xs text-slate-500 leading-relaxed">We will connect you with the best surgeon and hospital for your needs.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {submitResult?.success === false && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100 mb-4">
                    {submitResult.message}
                </div>
            )}

            {/* Hidden fields */}
            <input type="hidden" {...register('surgeryId')} />
            <input type="hidden" {...register('surgeryName')} />

            {/* Honeypot field for spam protection */}
            <div className="hidden" aria-hidden="true">
                <input type="text" {...register('website')} tabIndex={-1} autoComplete="off" />
            </div>

            <div className="grid sm:grid-cols-2 gap-3">
                <Input
                    label="Full Name"
                    placeholder="Enter your full name"
                    {...register('fullName')}
                    error={errors.fullName?.message}
                    required
                />

                <Input
                    label="Phone Number"
                    placeholder="+91 XXXXX XXXXX"
                    type="tel"
                    {...register('phone')}
                    error={errors.phone?.message}
                    required
                />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
                <Input
                    label="Email"
                    placeholder="your.email@example.com"
                    type="email"
                    {...register('email')}
                    error={errors.email?.message}
                />

                <Input
                    label="City"
                    placeholder="Your city"
                    {...register('city')}
                    error={errors.city?.message}
                    required
                />
            </div>

            <Textarea
                label="Describe Your Symptoms / Requirements"
                placeholder="Please describe your symptoms..."
                rows={2}
                {...register('description')}
                error={errors.description?.message}
                required
            />

            <div className="grid sm:grid-cols-2 gap-4">
                <Select
                    label="Do you have health insurance?"
                    options={[
                        { value: 'YES', label: 'Yes, I have insurance' },
                        { value: 'NO', label: 'No, I will pay directly' },
                        { value: 'NOT_SURE', label: 'Not sure / Need guidance' },
                    ]}
                    placeholder="Select an option"
                    {...register('insurance')}
                    error={errors.insurance?.message}
                    required
                />

                <Input
                    label="Preferred Callback Time"
                    placeholder="e.g., Morning 10-12 PM"
                    {...register('callbackTime')}
                    error={errors.callbackTime?.message}
                />
            </div>

            <Checkbox
                label="I agree to be contacted by HealthExpress regarding my inquiry. I understand that my information will be kept confidential."
                {...register('consent')}
                error={errors.consent?.message}
            />

            <div className="pt-4">
                <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full relative overflow-hidden group bg-gradient-to-r from-teal-500 to-teal-700 hover:from-teal-600 hover:to-teal-800 text-white shadow-[0_0_20px_rgba(20,184,166,0.3)] hover:shadow-[0_0_25px_rgba(20,184,166,0.5)] transition-all duration-300 border-0 h-11 md:h-12 text-sm font-bold"
                    loading={isSubmitting}
                >
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
                    
                    <span className="relative z-20 flex items-center justify-center gap-2">
                        Submit Inquiry & Get Free Estimate
                        <CheckCircle2 className="w-5 h-5 opacity-80" />
                    </span>
                </Button>

                {/* Trust Badges under button */}
                <div className="mt-5 flex flex-col items-center gap-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                        <Lock className="w-3.5 h-3.5 text-teal-600" />
                        100% Secure & Confidential
                    </div>
                    <div className="flex items-center justify-center gap-6 text-[11px] text-slate-500 font-medium">
                        <span className="flex items-center gap-1.5">
                            <ShieldCheck className="w-3.5 h-3.5 text-teal-500" />
                            Data Encrypted
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Stethoscope className="w-3.5 h-3.5 text-teal-500" />
                            NMC Verified Doctors
                        </span>
                    </div>
                </div>
            </div>
        </form>
    );
}
