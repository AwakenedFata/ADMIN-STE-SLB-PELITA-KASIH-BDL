'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        setIsLoading(true);
        try {
            await signIn('google', { callbackUrl: '/' });
        } catch (error) {
            console.error("Login failed", error);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-500 via-cyan-400 to-blue-600">
            <div className="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>

            <div className="relative glass p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-md text-center transform transition-all hover:scale-[1.01]">
                <div className="mb-8">
                    <div className="h-20 w-20 bg-white rounded-full mx-auto mb-6 grid place-items-center shadow-lg text-blue-600 font-bold text-3xl">
                        SLB
                    </div>
                    <h1 className="text-3xl font-bold text-slate-800 mb-2">Admin Portal</h1>
                    <p className="text-slate-600">SLB Pelita Kasih Bandar Lampung</p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={handleLogin}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold py-4 px-6 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <div className="h-6 w-6 border-2 border-slate-300 border-t-blue-500 rounded-full animate-spin"></div>
                        ) : (
                            <FcGoogle className="text-2xl" />
                        )}
                        <span>Masuk dengan Google</span>
                    </button>
                </div>

                <p className="mt-8 text-sm text-slate-500">
                    Hanya akun terdaftar yang dapat mengakses sistem ini.
                </p>
            </div>
        </div>
    );
}
