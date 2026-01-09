import React, { useState } from 'react';
import { UserRole } from '../types';
import { UtensilsCrossed, ArrowRight, Mail, Lock, User } from 'lucide-react';

interface RegisterProps {
    onRegister: (role: UserRole) => void;
    onSwitchToLogin: () => void;
}

export const Register: React.FC<RegisterProps> = ({ onRegister, onSwitchToLogin }) => {
    const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.GM);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically validate and send data to backend
        onRegister(selectedRole);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-screen w-full flex overflow-hidden font-sans">
            {/* Left Side - Visuals */}
            <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-16 bg-gradient-to-br from-[#2C2C2C] via-[#5F4B3B] to-[#D4955A]">
                {/* Overlay for better text readability if needed, though gradient does the job */}
                <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>

                {/* Content Container */}
                <div className="relative z-10 flex flex-col justify-between h-full">
                    {/* Top Empty Space or Logo if needed later */}
                    <div></div>

                    {/* Center Content */}
                    <div className="max-w-xl">
                        <h1 className="text-7xl font-extrabold text-white leading-[1.1] mb-8 tracking-tight">
                            Join the <br />
                            <span className="text-[#D4955A]">Team.</span> <br />
                            Start Your <br />
                            <span className="text-white">Journey.</span>
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
                    <div className="mb-8">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-[#B08968]/20 p-2.5 rounded-lg">
                                <UtensilsCrossed className="w-6 h-6 text-[#B08968]" />
                            </div>
                            <span className="font-black text-xl text-[#1F2933] tracking-tighter uppercase">Eatz & Chillz</span>
                        </div>

                        <h2 className="text-4xl font-extrabold text-[#1F2933] mb-3 tracking-tight">Buat Akun Baru</h2>
                        <p className="text-gray-500 text-lg">Daftar untuk mulai mengelola restoran Anda</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Role Toggle */}
                        <div className="bg-gray-100 p-1.5 rounded-xl flex mb-6">
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
                        <div className="space-y-4">
                            {/* Name Input */}
                            <div>
                                <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-widest mb-2">Nama Lengkap</label>
                                <div className="relative group">
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Masukkan nama lengkap"
                                        className="w-full pl-5 pr-12 py-4 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[#1F2933] font-medium focus:ring-2 focus:ring-[#B08968] focus:border-[#B08968] outline-none transition-all placeholder-gray-400"
                                    />
                                    <User className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                </div>
                            </div>

                            {/* Email Input */}
                            <div>
                                <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-widest mb-2">Email</label>
                                <div className="relative group">
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="nama@eatzchill.com"
                                        className="w-full pl-5 pr-12 py-4 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[#1F2933] font-medium focus:ring-2 focus:ring-[#B08968] focus:border-[#B08968] outline-none transition-all placeholder-gray-400"
                                    />
                                    <Mail className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                </div>
                            </div>

                            {/* Password Input */}
                            <div>
                                <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-widest mb-2">Password</label>
                                <div className="relative group">
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="••••••••"
                                        className="w-full pl-5 pr-12 py-4 bg-[#F9FAFB] border border-gray-200 rounded-xl text-[#1F2933] font-medium focus:ring-2 focus:ring-[#B08968] focus:border-[#B08968] outline-none transition-all placeholder-gray-400 tracking-widest"
                                    />
                                    <Lock className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                </div>
                            </div>

                            {/* Confirm Password Input */}
                            <div>
                                <label className="block text-[11px] font-bold text-gray-800 uppercase tracking-widest mb-2">Konfirmasi Password</label>
                                <div className="relative group">
                                    <input
                                        type="password"
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
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
                            className="w-full bg-[#1F2933] hover:bg-black text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.99] shadow-lg shadow-gray-200 mt-6"
                        >
                            Daftar Sekarang
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500 font-medium">
                            Sudah punya akun? <button onClick={onSwitchToLogin} className="font-bold text-[#B08968] hover:underline">Masuk di sini</button>
                        </p>
                    </div>

                    <div className="mt-12 text-center border-t border-gray-100 pt-6">
                        <p className="text-xs text-gray-400 font-medium">© 2026 Eatz & Chill System. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};
