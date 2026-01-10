import React, { useState, useMemo, useEffect } from 'react';
import { Toggle } from '../components/ui/Toggle';
import { AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { SlidersHorizontal, Calendar, Sparkles, ChevronDown } from 'lucide-react';
import { User, UserRole } from '../types';

const REGION_OPTIONS = ['Jakarta Selatan', 'Jakarta Pusat', 'Jakarta Barat', 'Jakarta Utara', 'Bali', 'Surabaya', 'Medan', 'Bandung'];
const BRANCH_DATA: Record<string, string[]> = {
    'Jakarta Selatan': ['Senopati', 'Kemang', 'Tebet', 'Blok M'],
    'Jakarta Pusat': ['Menteng', 'Thamrin', 'Cikini'],
    'Jakarta Barat': ['Puri Indah', 'Kebon Jeruk', 'Tanjung Duren'],
    'Jakarta Utara': ['PIK', 'Kelapa Gading', 'Pluit'],
    'Bali': ['Kuta', 'Ubud', 'Canggu', 'Seminyak'],
    'Surabaya': ['Tunjungan', 'Gubeng', 'Pakuwon'],
    'Medan': ['Merdeka Walk', 'Polonia', 'Setiabudi'],
    'Bandung': ['Dago', 'Braga', 'Riau']
};
const FORM_OPTIONS = ['Dine-in', 'Coffee Shop', 'Express', 'Snack Stall', 'Drink Stall'];
const CATEGORY_OPTIONS = ['Makanan', 'Minuman', 'Kopi', 'Snack', 'Minuman Instan'];

// Data for Regional Manager Charts
const rmBranchRevenueData = [
    { name: 'Sudirman', revenue: 18500000 },
    { name: 'Senayan', revenue: 15200000 },
    { name: 'Kemang', revenue: 12800000 },
    { name: 'Menteng', revenue: 11500000 },
    { name: 'Kuningan', revenue: 9800000 },
];

const rmFormRevenueData = [
    { name: 'Dine-in', revenue: 22000000 },
    { name: 'Coffee Shop', revenue: 18500000 },
    { name: 'Express', revenue: 14200000 },
    { name: 'Snack Stall', revenue: 8500000 },
    { name: 'Drink Stall', revenue: 4800000 },
];

const rmRegionRevenueData = [
    { name: 'Jakarta Selatan', revenue: 45200000 },
    { name: 'Jakarta Pusat', revenue: 38500000 },
    { name: 'Jakarta Barat', revenue: 32100000 },
    { name: 'Jakarta Utara', revenue: 28700000 },
    { name: 'Bali', revenue: 25400000 },
    { name: 'Surabaya', revenue: 22800000 },
    { name: 'Medan', revenue: 18500000 },
    { name: 'Bandung', revenue: 16200000 },
];

// Weekly Revenue Data for RM
const rmWeeklyRevenueData = [
    { name: 'Mon', revenue: 8500000 },
    { name: 'Tue', revenue: 7200000 },
    { name: 'Wed', revenue: 9800000 },
    { name: 'Thu', revenue: 8100000 },
    { name: 'Fri', revenue: 11200000 },
    { name: 'Sat', revenue: 14500000 },
    { name: 'Sun', revenue: 12800000 },
];

interface AnalyticsProps {
    user: User;
}

export const Analytics: React.FC<AnalyticsProps> = ({ user }) => {
    const isGM = user.role === UserRole.GM;
    const [isComparison, setIsComparison] = useState(false);
    const [period, setPeriod] = useState<'Mingguan' | 'Bulanan' | 'Tahunan'>('Mingguan');

    // Date Pickers State
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const [filterRegion, setFilterRegion] = useState('');
    const [filterBranch, setFilterBranch] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterForm, setFilterForm] = useState('');

    const availableBranches = useMemo(() => {
        return filterRegion && BRANCH_DATA[filterRegion] ? BRANCH_DATA[filterRegion] : [];
    }, [filterRegion]);

    const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterRegion(e.target.value);
        setFilterBranch('');
    };

    const chartLabels = useMemo(() => {
        if (period === 'Mingguan') return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        if (period === 'Bulanan') return ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    }, [period]);

    // Data generation depends on dates now
    const generateChartData = (isPrev = false) => {
        // Increased base revenue to reflect 30+ menu items volume
        let baseRevenue = 15000000;

        // Influence revenue by filters
        if (filterRegion) baseRevenue /= 4;
        if (filterBranch) baseRevenue /= 2;
        if (filterCategory) baseRevenue *= 0.6;
        if (filterForm) baseRevenue *= 0.8;

        if (period === 'Bulanan') baseRevenue *= 4;
        if (period === 'Tahunan') baseRevenue *= 48;

        // Use date to simulate random seed change
        const dateSeed = (dateFrom.length + dateTo.length) * 100;

        return chartLabels.map((label, index) => {
            const randomFactor = 0.8 + Math.random() * 0.4;
            const trendFactor = isPrev ? 0.9 : 1.05;
            const wave = Math.sin(index + dateSeed) * 0.1 + 1; // Seed affects wave

            return {
                name: label,
                value: Math.floor(baseRevenue * randomFactor * trendFactor * wave)
            };
        });
    };

    const currentData = useMemo(() => generateChartData(false), [period, filterRegion, filterBranch, filterCategory, filterForm, chartLabels, dateFrom, dateTo]);
    const previousData = useMemo(() => generateChartData(true), [period, filterRegion, filterBranch, filterCategory, filterForm, chartLabels, dateFrom, dateTo]);

    const totalRevenue = useMemo(() => currentData.reduce((acc, curr) => acc + curr.value, 0), [currentData]);
    const totalRevenuePrev = useMemo(() => previousData.reduce((acc, curr) => acc + curr.value, 0), [previousData]);
    const growth = ((totalRevenue - totalRevenuePrev) / totalRevenuePrev * 100).toFixed(1);

    const peakData = useMemo(() => [...currentData].sort((a, b) => b.value - a.value)[0], [currentData]);
    const lowestData = useMemo(() => [...currentData].sort((a, b) => a.value - b.value)[0], [currentData]);

    return (
        <div className="space-y-6 pb-10">
            {/* Filter Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-border overflow-hidden">
                <div className="bg-primary px-6 py-4 flex items-center gap-2 text-white">
                    <SlidersHorizontal className="w-5 h-5" />
                    <span className="font-bold tracking-wide">Filter</span>
                </div>
                <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="relative">
                        <label className="block text-xs font-bold text-textSecondary uppercase mb-2 ml-1 tracking-wider">Region</label>
                        <div className="relative">
                            <select value={filterRegion} onChange={handleRegionChange} className="w-full appearance-none bg-gray-50 border border-border text-textPrimary rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-secondary cursor-pointer font-medium transition-shadow">
                                <option value="">Semua Region</option>
                                {REGION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                    </div>
                    {/* ... Other filters ... */}
                    <div className="relative">
                        <label className="block text-xs font-bold text-textSecondary uppercase mb-2 ml-1 tracking-wider">Cabang</label>
                        <div className="relative">
                            <select value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)} disabled={!filterRegion} className={`w-full appearance-none border border-border text-textPrimary rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-secondary cursor-pointer font-medium transition-shadow ${!filterRegion ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-50'}`}>
                                <option value="">Semua Cabang</option>
                                {availableBranches.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                    </div>
                    <div className="relative">
                        <label className="block text-xs font-bold text-textSecondary uppercase mb-2 ml-1 tracking-wider">Kategori</label>
                        <div className="relative">
                            <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="w-full appearance-none bg-gray-50 border border-border text-textPrimary rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-secondary cursor-pointer font-medium transition-shadow">
                                <option value="">Semua Kategori</option>
                                {CATEGORY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                    </div>
                    <div className="relative">
                        <label className="block text-xs font-bold text-textSecondary uppercase mb-2 ml-1 tracking-wider">Bentuk</label>
                        <div className="relative">
                            <select value={filterForm} onChange={(e) => setFilterForm(e.target.value)} className="w-full appearance-none bg-gray-50 border border-border text-textPrimary rounded-xl px-4 py-3 pr-10 focus:outline-none focus:ring-2 focus:ring-secondary cursor-pointer font-medium transition-shadow">
                                <option value="">Semua Bentuk</option>
                                {FORM_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-border p-8">
                <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-8">
                    <div className="space-y-6">
                        <div className="flex flex-wrap items-center gap-4">
                            <span className="font-bold text-textPrimary min-w-[80px]">Periode :</span>
                            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
                                {['Mingguan', 'Bulanan', 'Tahunan'].map((p) => (
                                    <button key={p} onClick={() => setPeriod(p as any)} className={`px-6 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${period === p ? 'bg-primary text-white shadow-md' : 'text-textSecondary hover:bg-gray-200'}`}>
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                            <span className="font-bold text-textPrimary min-w-[80px]">Tanggal :</span>
                            <div className="flex items-center gap-4">
                                <div className="relative group">
                                    <input
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                        className="pl-4 pr-4 py-2 border border-border rounded-lg text-sm text-textPrimary focus:ring-2 focus:ring-secondary outline-none w-44 placeholder-textSecondary"
                                    />
                                </div>
                                <span className="text-gray-400">to</span>
                                <div className="relative group">
                                    <input
                                        type="date"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                        className="pl-4 pr-4 py-2 border border-border rounded-lg text-sm text-textPrimary focus:ring-2 focus:ring-secondary outline-none w-44 placeholder-textSecondary"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 border-t lg:border-t-0 border-border pt-6 lg:pt-0">
                        <span className="font-bold text-textPrimary text-lg">Bandingkan</span>
                        <Toggle checked={isComparison} onChange={setIsComparison} />
                    </div>
                </div>
            </div>

            {/* Charts Section - Different Layout for GM vs RM */}
            {isGM ? (
                /* GM Layout - Original Chart */
                <div className="bg-white rounded-2xl shadow-sm border border-border p-6">
                    <div className="border-2 border-dashed border-gray-200 rounded-2xl p-4 md:p-8">
                        {!isComparison ? (
                            <div className="h-[450px] w-full bg-[#FAF9F6] rounded-2xl flex flex-col items-center relative overflow-hidden">
                                <div className="mt-8 text-center z-10">
                                    <h3 className="text-xl font-bold text-textPrimary mb-1">Grafik Tren Pemasukan</h3>
                                    <p className="text-textSecondary font-medium">{filterRegion ? `Region ${filterRegion}` : 'Nasional'} • {period}</p>
                                </div>
                                <div className="absolute inset-x-0 bottom-0 h-[350px] px-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <AreaChart data={currentData}>
                                            <defs>
                                                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="5%" stopColor="#B08968" stopOpacity={0.3} />
                                                    <stop offset="95%" stopColor="#B08968" stopOpacity={0} />
                                                </linearGradient>
                                            </defs>
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 12 }} dy={10} />
                                            <YAxis hide domain={['auto', 'auto']} />
                                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Revenue']} />
                                            <Area type="monotone" dataKey="value" stroke="#B08968" strokeWidth={4} fill="url(#colorValue)" animationDuration={1000} />
                                        </AreaChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="h-[400px] bg-[#F3F4F6] rounded-2xl relative overflow-hidden flex flex-col">
                                    <h3 className="text-center font-bold text-textPrimary z-10 mt-8">Periode Ini</h3>
                                    <div className="absolute inset-x-0 bottom-0 h-[300px] px-2">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={currentData}>
                                                <defs>
                                                    <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#B08968" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#B08968" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 10 }} dy={10} />
                                                <Tooltip formatter={(value: number) => [`Rp ${value.toLocaleString()}`, 'Revenue']} />
                                                <Area type="monotone" dataKey="value" stroke="#B08968" strokeWidth={4} fill="url(#colorCurrent)" animationDuration={1000} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                                <div className="h-[400px] bg-[#F3F4F6] rounded-2xl relative overflow-hidden flex flex-col">
                                    <h3 className="text-center font-bold text-textPrimary z-10 mt-8">Periode Sebelumnya</h3>
                                    <div className="absolute inset-x-0 bottom-0 h-[300px] px-2">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <AreaChart data={previousData}>
                                                <defs>
                                                    <linearGradient id="colorPrev" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="5%" stopColor="#6B7280" stopOpacity={0.3} />
                                                        <stop offset="95%" stopColor="#6B7280" stopOpacity={0} />
                                                    </linearGradient>
                                                </defs>
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 10 }} dy={10} />
                                                <Tooltip formatter={(value: number) => [`Rp ${value.toLocaleString()}`, 'Revenue']} />
                                                <Area type="monotone" dataKey="value" stroke="#6B7280" strokeWidth={4} fill="url(#colorPrev)" animationDuration={1000} />
                                            </AreaChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                /* RM Layout - Different based on period */
                <div className="space-y-6">
                    {period === 'Mingguan' ? (
                        /* Weekly: Single Chart - Grafik Trend Keuntungan per Minggu */
                        <div className="bg-white rounded-2xl shadow-sm border-2 border-primary p-6">
                            <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 md:p-6">
                                <div className="text-center mb-6">
                                    <h3 className="text-xl font-bold text-textPrimary">Grafik Trend Keuntungan per Minggu (Bar Chart)</h3>
                                </div>
                                <div className="h-[350px] w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={rmWeeklyRevenueData}>
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                            <XAxis
                                                dataKey="name"
                                                stroke="#6B7280"
                                                fontSize={12}
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <YAxis
                                                tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                                                stroke="#6B7280"
                                                fontSize={11}
                                                tickLine={false}
                                                axisLine={false}
                                            />
                                            <Tooltip
                                                formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Revenue']}
                                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                            />
                                            <Bar dataKey="revenue" fill="#B08968" radius={[6, 6, 0, 0]} barSize={48} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* Bulanan/Tahunan: 3 Charts - 2 on top, 1 on bottom */
                        <>
                            {/* Top Row: 2 Charts Side by Side */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                {/* Chart 1: Grafik Trend Keuntungan Per Cabang */}
                                <div className="bg-white rounded-2xl shadow-sm border-2 border-primary p-6">
                                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-4">
                                        <div className="text-center mb-4">
                                            <h3 className="text-lg font-bold text-textPrimary">Grafik Trend Keuntungan</h3>
                                            <p className="text-textSecondary font-medium">Per Cabang (Bar Chart)</p>
                                        </div>
                                        <div className="h-[280px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={rmBranchRevenueData} layout="vertical">
                                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
                                                    <XAxis
                                                        type="number"
                                                        tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                                                        stroke="#6B7280"
                                                        fontSize={11}
                                                        tickLine={false}
                                                        axisLine={false}
                                                    />
                                                    <YAxis
                                                        dataKey="name"
                                                        type="category"
                                                        stroke="#6B7280"
                                                        fontSize={11}
                                                        tickLine={false}
                                                        axisLine={false}
                                                        width={80}
                                                    />
                                                    <Tooltip
                                                        formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Revenue']}
                                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                                    />
                                                    <Bar dataKey="revenue" fill="#B08968" radius={[0, 6, 6, 0]} barSize={24} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>

                                {/* Chart 2: Grafik Trend Keuntungan Per Bentuk */}
                                <div className="bg-white rounded-2xl shadow-sm border-2 border-primary p-6">
                                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-4">
                                        <div className="text-center mb-4">
                                            <h3 className="text-lg font-bold text-textPrimary">Grafik Trend Keuntungan</h3>
                                            <p className="text-textSecondary font-medium">Per Bentuk (Bar Chart)</p>
                                        </div>
                                        <div className="h-[280px] w-full">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <BarChart data={rmFormRevenueData} layout="vertical">
                                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#E5E7EB" />
                                                    <XAxis
                                                        type="number"
                                                        tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                                                        stroke="#6B7280"
                                                        fontSize={11}
                                                        tickLine={false}
                                                        axisLine={false}
                                                    />
                                                    <YAxis
                                                        dataKey="name"
                                                        type="category"
                                                        stroke="#6B7280"
                                                        fontSize={11}
                                                        tickLine={false}
                                                        axisLine={false}
                                                        width={90}
                                                    />
                                                    <Tooltip
                                                        formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Revenue']}
                                                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                                    />
                                                    <Bar dataKey="revenue" fill="#7F5539" radius={[0, 6, 6, 0]} barSize={24} />
                                                </BarChart>
                                            </ResponsiveContainer>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Bottom Row: Full Width Chart */}
                            <div className="bg-white rounded-2xl shadow-sm border-2 border-primary p-6">
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 md:p-6">
                                    <div className="text-center mb-6">
                                        <h3 className="text-xl font-bold text-textPrimary">Grafik Trend Keuntungan per Region (Bar Chart)</h3>
                                    </div>
                                    <div className="h-[300px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={rmRegionRevenueData}>
                                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                                <XAxis
                                                    dataKey="name"
                                                    stroke="#6B7280"
                                                    fontSize={11}
                                                    tickLine={false}
                                                    axisLine={false}
                                                    angle={-20}
                                                    textAnchor="end"
                                                    height={60}
                                                />
                                                <YAxis
                                                    tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                                                    stroke="#6B7280"
                                                    fontSize={11}
                                                    tickLine={false}
                                                    axisLine={false}
                                                />
                                                <Tooltip
                                                    formatter={(value: number) => [`Rp ${value.toLocaleString('id-ID')}`, 'Revenue']}
                                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                                                />
                                                <Bar dataKey="revenue" fill="#9C6644" radius={[6, 6, 0, 0]} barSize={48} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Insight Section - Only for GM */}
            {isGM && (
                <div className="bg-white rounded-2xl shadow-sm border border-border p-10 relative overflow-hidden min-h-[200px] flex items-center justify-center">
                    <div className="absolute top-6 left-6 w-10 h-10 border-t-[3px] border-l-[3px] border-gray-200 rounded-tl-2xl"></div>
                    <div className="absolute top-6 right-6 w-10 h-10 border-t-[3px] border-r-[3px] border-gray-200 rounded-tr-2xl"></div>
                    <div className="absolute bottom-6 left-6 w-10 h-10 border-b-[3px] border-l-[3px] border-gray-200 rounded-bl-2xl"></div>
                    <div className="absolute bottom-6 right-6 w-10 h-10 border-b-[3px] border-r-[3px] border-gray-200 rounded-br-2xl"></div>

                    <div className="flex flex-col items-center text-center max-w-2xl">
                        <div className="flex items-center gap-3 mb-6">
                            <Sparkles className="w-6 h-6 text-secondary fill-secondary" />
                            <h3 className="text-xl font-bold tracking-widest text-textPrimary uppercase">Insight {filterRegion ? `Region ${filterRegion}` : 'Nasional'}</h3>
                        </div>

                        <ul className="space-y-4">
                            <li className="flex items-center gap-3 text-textPrimary font-semibold text-lg">
                                <div className="w-2 h-2 rounded-full bg-[#B08968]"></div>
                                Puncak pemasukan tertinggi terjadi pada <span className="font-bold underline decoration-secondary decoration-2 ml-1">{peakData.name}</span>
                            </li>
                            <li className="flex items-center gap-3 text-textPrimary font-semibold text-lg">
                                <div className="w-2 h-2 rounded-full bg-[#6B7280]"></div>
                                Pemasukan terendah tercatat pada <span className="font-bold underline decoration-gray-400 decoration-2 ml-1">{lowestData.name}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};