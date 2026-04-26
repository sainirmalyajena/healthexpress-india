"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

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
      <div className="bg-white p-8 rounded-2xl text-center shadow-lg border border-teal-100">
        <div className="w-16 h-16 bg-teal-100 text-teal-700 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
          ✓
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Request Received!</h3>
        <p className="text-gray-600 mb-6">Our care coordinator will contact you shortly to confirm your appointment.</p>
        <button 
          onClick={() => setSuccess(false)}
          className="text-teal-700 font-semibold hover:underline"
        >
          Book another appointment
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-2xl flex flex-col gap-4 shadow-lg">
      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm mb-2">
          {error}
        </div>
      )}
      
      <div>
        <input 
          {...register('name')}
          type="text" 
          placeholder="Full Name" 
          className={`w-full p-4 border rounded-xl outline-none transition-colors ${errors.name ? 'border-red-500' : 'border-gray-200 focus:border-teal-600 focus:ring-2 focus:ring-teal-100'}`}
        />
        {errors.name && <span className="text-red-500 text-sm mt-1 block">{errors.name.message}</span>}
      </div>

      <div>
        <input 
          {...register('mobile')}
          type="tel" 
          placeholder="Phone Number" 
          className={`w-full p-4 border rounded-xl outline-none transition-colors ${errors.mobile ? 'border-red-500' : 'border-gray-200 focus:border-teal-600 focus:ring-2 focus:ring-teal-100'}`}
        />
        {errors.mobile && <span className="text-red-500 text-sm mt-1 block">{errors.mobile.message}</span>}
      </div>

      <div>
        <select 
          {...register('service')}
          className={`w-full p-4 border rounded-xl outline-none bg-white transition-colors ${errors.service ? 'border-red-500' : 'border-gray-200 focus:border-teal-600 focus:ring-2 focus:ring-teal-100'}`}
          defaultValue=""
        >
          <option value="" disabled>Select Service</option>
          <option value="General Eye Checkup">General Eye Checkup</option>
          <option value="Cataract Evaluation">Cataract Evaluation</option>
          <option value="LASIK Consultation">LASIK Consultation</option>
          <option value="Retina Care">Retina Care</option>
          <option value="Glaucoma Clinic">Glaucoma Clinic</option>
          <option value="Other">Other</option>
        </select>
        {errors.service && <span className="text-red-500 text-sm mt-1 block">{errors.service.message}</span>}
      </div>

      <button 
        type="submit" 
        disabled={isSubmitting}
        className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-70 flex justify-center items-center"
      >
        {isSubmitting ? (
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        ) : 'Request Appointment'}
      </button>
    </form>
  );
}
