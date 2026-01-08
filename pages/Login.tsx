import React, { useState } from 'react';
import { UserRole } from '../types';
import { UtensilsCrossed, Star, ArrowRight, Mail, Lock } from 'lucide-react';

interface LoginProps {
    onLogin: (role: UserRole) => void;
    onSwitchToRegister: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onSwitchToRegister }) => {
    const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.GM);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin(selectedRole);
    };

    return (
        <div className="min-h-screen w-full flex overflow-hidden font-sans">
            {/* Left Side - Visuals */}
            <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-16 bg-gradient-to-br from-[#4A4A4A] via-[#8B735B] to-[#D4B483]">
                {/* Overlay for better text readability if needed, though gradient does the job */}
                <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>

                {/* Content Container */}
                <div className="relative z-10 flex flex-col justify-between h-full">
                    {/* Top Empty Space or Logo if needed later */}
                    <div></div>

                    {/* Center Content */}
                    <div className="max-w-xl">
                        <h1 className="text-7xl font-extrabold text-white leading-[1.1] mb-8 tracking-tight">
                            Taste the <br />
                            <span className="text-[#D4B483]">Difference.</span> <br />
                            Manage the <br />
                            <span className="text-white">Excellence.</span>
                        </h1>

                    </div>

                    {/* Bottom Space */}
                    <div></div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 bg-white flex flex-col justify-center px-8 md:px-24 py-12 relative">
                <div className="max-w-[480px] w-full mx-auto">
                    {/* Mobile Logo */}
                    <div className="lg:hidden flex items-center gap-2 mb-8 text-primary">
                        <UtensilsCrossed className="w-6 h-6" />
                        <span className="font-bold text-xl">Eatz & Chillz</span>
                    </div>

                    {/* Header */}
                    <div className="mb-10">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-[#B08968]/20 p-2.5 rounded-lg">
                                <UtensilsCrossed className="w-6 h-6 text-[#B08968]" />
                            </div>
                            <span className="font-black text-xl text-[#1F2933] tracking-tighter uppercase">Eatz & Chillz</span>
                        </div>

                        <h2 className="text-4xl font-extrabold text-[#1F2933] mb-3 tracking-tight">Selamat Datang</h2>
                        <p className="text-gray-500 text-lg">Masuk ke akun Anda untuk melanjutkan</p>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-6">
                        {/* Role Toggle */}
                        <div className="bg-gray-100 p-1.5 rounded-xl flex mb-8">
                            <button
                                type="button"
                                onClick={() => setSelectedRole(UserRole.GM)}
                                className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all duration-200 ${selectedRole === UserRole.GM
                                    ? 'bg-white text-[#1F2933] shadow-sm'
                                    : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                General Manager
                            </button>
                            <button
                                type="button"
                                onClick={() => setSelectedRole(UserRole.RM)}
                                className={`flex-1 py-3 text-sm font-bold rounded-lg transition-all duration-200 ${selectedRole === UserRole.RM
                                    ? 'bg-white text-[#1F2933] shadow-sm'
                                    : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                Region Manager
                            </button>
                        </div>

                        {/* Inputs */}
                        <div className="space-y-5">
                            <div>
                                <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-widest mb-2">Email</label>
                                <div className="relative group">
                                    <input
                                        type="email"
                                        placeholder="nama@eatzchill.com"
                                        className="w-full pl-5 pr-12 py-4 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[#1F2933] font-medium focus:ring-2 focus:ring-[#B08968] focus:border-[#B08968] outline-none transition-all placeholder-gray-400"
                                    />
                                    <Mail className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-widest">Password</label>
                                    <a href="#" className="text-xs font-bold text-[#B08968] hover:text-[#8d6e53] transition-colors">Lupa Password?</a>
                                </div>
                                <div className="relative group">
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        className="w-full pl-5 pr-12 py-4 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[#1F2933] font-medium focus:ring-2 focus:ring-[#B08968] focus:border-[#B08968] outline-none transition-all placeholder-gray-400 tracking-widest"
                                    />
                                    <Lock className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-[#1F2933] hover:bg-black text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-lg shadow-gray-200 mt-8"
                        >
                            Masuk
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-500 font-medium">
                            Belum punya akun? <button onClick={onSwitchToRegister} className="font-bold text-[#B08968] hover:underline">Daftar sekarang</button>
                        </p>
                    </div>

                    <div className="mt-16 text-center border-t border-gray-100 pt-8">
                        <p className="text-xs text-gray-400 font-medium">© 2026 Eatz & Chill System. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};