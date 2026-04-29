"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Phone as PhoneIcon, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  mobile: z.string().min(10, 'Please enter a valid phone number'),
  service: z.string().min(1, 'Please select a service'),
});

type FormData = z.infer<typeof formSchema>;

export default function AppointmentForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setError('');
    
    try {
      const res = await fetch('/api/cratio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await res.json();
      
      if (!res.ok) throw new Error(result.error || 'Failed to submit request');
      
      setSuccess(true);
      reset();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white p-10 rounded-3xl text-center shadow-2xl border border-teal-100 animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 bg-teal-50 text-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h3 className="text-2xl font-black text-slate-900 mb-3">Request Received!</h3>
        <p className="text-slate-600 mb-8 leading-relaxed">Our senior care coordinator will contact you within 15 minutes to confirm your slot.</p>
        <button 
          onClick={() => setSuccess(false)}
          className="text-teal-700 font-bold hover:text-teal-800 transition-colors flex items-center justify-center gap-2 mx-auto"
        >
          Book another consultation <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Premium Badge */}
      <div className="absolute -top-4 -right-4 bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-lg z-10 animate-bounce" style={{ animationDuration: '3s' }}>
        Free Consultation
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 md:p-10 rounded-3xl flex flex-col gap-5 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-teal-500 to-emerald-500" />
        
        <div className="mb-2">
          <h3 className="text-xl font-bold text-slate-900">Book Your Slot</h3>
          <p className="text-sm text-slate-500">Quick 30-second appointment request</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm flex items-start gap-3 animate-in slide-in-from-top-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p>{error}</p>
          </div>
        )}
        
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Full Name</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors">
              <User className="w-5 h-5" />
            </div>
            <input 
              {...register('name')}
              type="text" 
              placeholder="Enter your name" 
              className={`w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl outline-none transition-all ${errors.name ? 'border-red-300 bg-red-50/30' : 'border-slate-100 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10'}`}
            />
          </div>
          {errors.name && <span className="text-red-500 text-xs font-medium mt-1 block ml-1">{errors.name.message}</span>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Mobile Number</label>
          <div className="relative group">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-teal-600 transition-colors">
              <PhoneIcon className="w-5 h-5" />
            </div>
            <input 
              {...register('mobile')}
              type="tel" 
              placeholder="Enter 10-digit number" 
              className={`w-full pl-12 pr-4 py-4 bg-slate-50 border rounded-2xl outline-none transition-all ${errors.mobile ? 'border-red-300 bg-red-50/30' : 'border-slate-100 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10'}`}
            />
          </div>
          {errors.mobile && <span className="text-red-500 text-xs font-medium mt-1 block ml-1">{errors.mobile.message}</span>}
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Required Service</label>
          <select 
            {...register('service')}
            className={`w-full p-4 bg-slate-50 border rounded-2xl outline-none transition-all appearance-none cursor-pointer ${errors.service ? 'border-red-300 bg-red-50/30' : 'border-slate-100 focus:border-teal-500 focus:bg-white focus:ring-4 focus:ring-teal-500/10'}`}
            defaultValue=""
          >
            <option value="" disabled>Choose specialized care</option>
            <option value="General Eye Checkup">General Eye Checkup</option>
            <option value="Cataract Evaluation">Cataract Evaluation</option>
            <option value="LASIK Consultation">LASIK Consultation</option>
            <option value="Retina Care">Retina Care</option>
            <option value="Glaucoma Clinic">Glaucoma Clinic</option>
            <option value="Other">Other</option>
          </select>
          {errors.service && <span className="text-red-500 text-xs font-medium mt-1 block ml-1">{errors.service.message}</span>}
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          className="w-full bg-teal-700 hover:bg-teal-800 text-white font-black py-5 px-6 rounded-2xl transition-all shadow-xl shadow-teal-700/20 active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-3 mt-2"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>Request Appointment</span>
              <ChevronRight className="w-5 h-5" />
            </>
          )}
        </button>
        
        <p className="text-[10px] text-center text-slate-400 mt-2 uppercase tracking-tighter">
          By clicking, you agree to be contacted by our medical team.
        </p>
      </form>
    </div>
  );
}
