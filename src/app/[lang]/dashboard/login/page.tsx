'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormData } from '@/lib/validations';
import { Button, Input } from '@/components/ui';

export default function AdminLoginPage() {
    const router = useRouter();
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);
        setError('');

        const timeoutId = setTimeout(() => {
            setError('The server is taking longer than expected to respond. This usually happens when the database is starting up. Please wait a moment and try again.');
        }, 12000); // 12 second warning

        try {
            const response = await fetch('/api/dashboard/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });

            clearTimeout(timeoutId);
            const result = await response.json();

            if (response.ok) {
                router.push('/dashboard');
                router.refresh();
            } else {
                setError(result.error || 'Invalid credentials');
            }
        } catch (err) {
            clearTimeout(timeoutId);
            console.error('Login Error:', err);
            setError('Unable to connect to the server. The database might be waking up. Please try again in 10-20 seconds.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="mb-4">
                            <img
                                src="/prism-logo.jpg"
                                alt="Prism Healthcure Logo"
                                className="h-16 w-auto object-contain mix-blend-multiply mx-auto transition-transform hover:scale-105"
                            />
                        </div>
                        <h1 className="text-2xl font-bold text-slate-900">Admin Login</h1>
                        <p className="text-slate-600 mt-2">Sign in to access the dashboard</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <Input
                            label="Email"
                            type="email"
                            placeholder="admin@prismhealthcure.com"
                            {...register('email')}
                            error={errors.email?.message}
                            required
                        />

                        <Input
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            {...register('password')}
                            error={errors.password?.message}
                            required
                        />

                        <Button type="submit" className="w-full" loading={isLoading}>
                            Sign In
                        </Button>
                    </form>

                    <div className="mt-6 text-center text-sm text-slate-500">
                        <p>Demo credentials:</p>
                        <p className="font-mono text-xs mt-1">admin@prismhealthcure.com / admin123</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
