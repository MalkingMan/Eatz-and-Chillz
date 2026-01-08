import React, { useState, useMemo, useEffect } from 'react';
import { Toggle } from '../components/ui/Toggle';
import { BarChart, Bar, XAxis, CartesianGrid, ResponsiveContainer, Cell, LabelList, Tooltip } from 'recharts';
import { Filter, Calendar, Map, Store, Shapes, ChevronDown, UtensilsCrossed } from 'lucide-react';

// Synchronized with MenuManagement Data (30 Items)
const ALL_MENUS = [
    { name: 'Nasi Goreng Spesial', category: 'Makanan', region: 'Jakarta Selatan', sales: 450 },
    { name: 'Sate Ayam Madura', category: 'Makanan', region: 'Jakarta Pusat', sales: 420 },
    { name: 'Rendang Sapi', category: 'Makanan', region: 'Jakarta Barat', sales: 380 },
    { name: 'Soto Betawi', category: 'Makanan', region: 'Jakarta Selatan', sales: 360 },
    { name: 'Ayam Geprek', category: 'Makanan', region: 'Bali', sales: 350 },
    { name: 'Mie Goreng Jawa', category: 'Makanan', region: 'Surabaya', sales: 330 },
    { name: 'Batagor Riri', category: 'Snack', region: 'Bandung', sales: 310 },
    { name: 'Siomay Bandung', category: 'Snack', region: 'Bandung', sales: 300 },
    { name: 'Gado-Gado Jakarta', category: 'Makanan', region: 'Jakarta Selatan', sales: 290 },
    { name: 'Ketoprak Ciragil', category: 'Makanan', region: 'Jakarta Barat', sales: 280 },
    { name: 'Kerak Telor', category: 'Snack', region: 'Jakarta Utara', sales: 150 },
    { name: 'Bebek Bengil', category: 'Makanan', region: 'Bali', sales: 270 },
    { name: 'Sate Lilit', category: 'Makanan', region: 'Bali', sales: 260 },
    { name: 'Rawon Setan', category: 'Makanan', region: 'Surabaya', sales: 340 },
    { name: 'Rujak Cingur', category: 'Makanan', region: 'Surabaya', sales: 220 },
    { name: 'Soto Medan', category: 'Makanan', region: 'Medan', sales: 240 },
    { name: 'Mie Gomak', category: 'Makanan', region: 'Medan', sales: 210 },
    { name: 'Bika Ambon', category: 'Snack', region: 'Medan', sales: 200 },
    { name: 'Kopi Gula Aren', category: 'Kopi', region: 'Jakarta Selatan', sales: 480 },
    { name: 'Cappuccino Dingin', category: 'Kopi', region: 'Bandung', sales: 390 },
    { name: 'Espresso Single', category: 'Kopi', region: 'Jakarta Pusat', sales: 180 },
    { name: 'Caffè Latte', category: 'Kopi', region: 'Bali', sales: 250 },
    { name: 'Es Teh Manis', category: 'Minuman', region: 'Semua Region', sales: 800 },
    { name: 'Jus Alpukat', category: 'Minuman', region: 'Jakarta Barat', sales: 320 },
    { name: 'Es Jeruk Segar', category: 'Minuman', region: 'Jakarta Utara', sales: 310 },
    { name: 'Es Kelapa Muda', category: 'Minuman', region: 'Bali', sales: 330 },
    { name: 'Pisang Goreng Keju', category: 'Snack', region: 'Jakarta Selatan', sales: 280 },
    { name: 'Roti Bakar Coklat', category: 'Snack', region: 'Bandung', sales: 290 },
    { name: 'Kentang Goreng', category: 'Snack', region: 'Jakarta Pusat', sales: 350 },
    { name: 'Matcha Latte', category: 'Minuman Instan', region: 'Jakarta Selatan', sales: 230 }
];

// Data Constants
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

const FilterSelect = ({ icon: Icon, label, value, onChange, options, disabled = false, placeholder }: any) => (
    <div className={`relative border border-border rounded-xl px-4 py-3 flex items-center gap-3 bg-white min-w-[200px] transition-colors group shadow-sm ${disabled ? 'opacity-60 bg-gray-50' : 'hover:border-gray-400'}`}>
        <div className="bg-primary p-2 rounded-lg text-white">
            <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-textPrimary uppercase tracking-wider mb-0.5">{label}</p>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                disabled={disabled}
                className="w-full bg-transparent text-sm text-textPrimary font-medium outline-none appearance-none cursor-pointer disabled:cursor-not-allowed"
            >
                <option value="">{placeholder}</option>
                {options.map((opt: string) => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
        <ChevronDown className="w-4 h-4 text-gray-400 pointer-events-none" />
    </div>
);

export const TrenMakanan: React.FC = () => {
    const [isComparison, setIsComparison] = useState(false);
    const [period, setPeriod] = useState<'Mingguan' | 'Bulanan' | 'Tahunan'>('Bulanan');
    const [categoryType, setCategoryType] = useState<'Laris' | 'Kurang Laris'>('Laris');

    // Date Picker State
    const [dateFrom, setDateFrom] = useState('');
    const [dateTo, setDateTo] = useState('');

    const [filterRegion, setFilterRegion] = useState('');
    const [filterBranch, setFilterBranch] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterForm, setFilterForm] = useState('');

    const [menu1, setMenu1] = useState('');
    const [menu2, setMenu2] = useState('');

    const availableBranches = useMemo(() => {
        return filterRegion && BRANCH_DATA[filterRegion] ? BRANCH_DATA[filterRegion] : [];
    }, [filterRegion]);

    const handleRegionChange = (val: string) => {
        setFilterRegion(val);
        setFilterBranch('');
    };

    const filteredMenus = useMemo(() => {
        // If no filters applied, show all menus
        if (!filterRegion && !filterCategory) {
            return ALL_MENUS;
        }
        return ALL_MENUS.filter(menu => {
            const matchRegion = !filterRegion || menu.region === 'Semua Region' || menu.region === filterRegion;
            const matchCategory = !filterCategory || menu.category === filterCategory;
            return matchRegion && matchCategory;
        });
    }, [filterRegion, filterCategory]);

    // Data generation depending on dates
    const topSellingData = useMemo(() => {
        // Date variance (mock)
        const dateFactor = (dateFrom.length + dateTo.length) % 5;

        const sorted = [...filteredMenus].sort((a, b) => {
            // Apply slight random variance based on date factor to simulate change
            const aSales = a.sales + (dateFactor * 5);
            const bSales = b.sales + (dateFactor * 3);
            return categoryType === 'Laris' ? bSales - aSales : aSales - bSales;
        });

        return sorted.slice(0, 7).map(item => ({
            name: item.name,
            value: item.sales + (dateFactor * 2), // Visible change
            fill: categoryType === 'Laris' ? (item.sales > 300 ? '#B08968' : '#2F3E46') : '#E74C3C'
        }));
    }, [filteredMenus, categoryType, dateFrom, dateTo]);

    useEffect(() => {
        if (filteredMenus.length > 0) {
            setMenu1(filteredMenus[0]?.name || '');
            setMenu2(filteredMenus[1]?.name || filteredMenus[0]?.name || '');
        } else {
            setMenu1('');
            setMenu2('');
        }
    }, [filteredMenus]);

    const generateTimeSeriesData = (menuName: string) => {
        if (!menuName) return [];

        let labels = [];
        if (period === 'Mingguan') labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        else if (period === 'Bulanan') labels = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
        else labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

        const dateSeed = dateFrom.length + dateTo.length;
        const base = (menuName.length * 100) + (period === 'Tahunan' ? 1000 : 0);

        return labels.map((label, idx) => ({
            name: label,
            value: Math.floor(base * (0.5 + Math.random() * 0.5) + (idx * 10) + (dateSeed * 5)),
            fill: idx === labels.length - 1 ? '#B08968' : '#2F3E46'
        }));
    };

    const dataMenu1 = useMemo(() => generateTimeSeriesData(menu1), [menu1, period, dateFrom, dateTo]);
    const dataMenu2 = useMemo(() => generateTimeSeriesData(menu2), [menu2, period, dateFrom, dateTo]);

    const renderCustomLabel = (props: any) => {
        const { x, y, width, height, value, index } = props;
        if (!topSellingData[index]) return null;
        const name = topSellingData[index].name;
        const displayName = name.length > 15 ? name.substring(0, 15) + '...' : name;

        return (
            <text x={x + width + 10} y={y + height / 2} fill="#1F2933" textAnchor="start" dominantBaseline="middle" fontWeight="bold" fontSize={12}>
                {displayName}
            </text>
        );
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Filter Section */}
            <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                    <Filter className="w-5 h-5 text-[#B08968] fill-[#B08968]" />
                    <h2 className="text-lg font-bold text-textPrimary">Filter</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <FilterSelect icon={Map} label="Region" placeholder="Semua Region" value={filterRegion} onChange={handleRegionChange} options={REGION_OPTIONS} />
                    <FilterSelect icon={Store} label="Cabang" placeholder="Semua Cabang" value={filterBranch} onChange={setFilterBranch} options={availableBranches} disabled={!filterRegion} />
                    <FilterSelect icon={Shapes} label="Kategori" placeholder="Semua Kategori" value={filterCategory} onChange={setFilterCategory} options={CATEGORY_OPTIONS} />
                    <FilterSelect icon={UtensilsCrossed} label="Bentuk" placeholder="Semua Bentuk" value={filterForm} onChange={setFilterForm} options={FORM_OPTIONS} />
                </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-border shadow-sm">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
                        <div className="flex items-center gap-4">
                            <span className="font-bold text-textPrimary text-sm w-20">Periode :</span>
                            <div className="flex bg-[#E5E7EB] p-1 rounded-full">
                                {['Mingguan', 'Bulanan', 'Tahunan'].map((p) => (
                                    <button key={p} onClick={() => setPeriod(p as any)} className={`px-6 py-2 rounded-full text-xs font-bold transition-all duration-200 ${period === p ? 'bg-[#B08968] text-white shadow-sm' : 'text-textSecondary hover:text-textPrimary'}`}>
                                        {p}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="font-bold text-textPrimary text-sm w-20 xl:text-right">Kategori:</span>
                            <div className="flex gap-3">
                                <button onClick={() => setCategoryType('Laris')} className={`px-8 py-2 rounded-full text-xs font-bold border shadow-sm transition-colors ${categoryType === 'Laris' ? 'bg-[#10B981] text-white border-[#10B981]' : 'bg-white text-textSecondary border-gray-200 hover:bg-gray-50'}`}>Laris</button>
                                <button onClick={() => setCategoryType('Kurang Laris')} className={`px-6 py-2 rounded-full text-xs font-bold border shadow-sm transition-colors ${categoryType === 'Kurang Laris' ? 'bg-red-500 text-white border-red-500' : 'bg-white text-textSecondary border-gray-200 hover:bg-gray-50'}`}>Kurang Laris</button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-6">
                        <div className="flex items-center gap-4">
                            <span className="font-bold text-textPrimary text-sm w-20">Tanggal :</span>
                            <div className="flex gap-3">
                                <div className="relative group">
                                    <input
                                        type="date"
                                        value={dateFrom}
                                        onChange={(e) => setDateFrom(e.target.value)}
                                        className="pl-3 pr-9 py-2.5 border border-gray-300 rounded-lg text-xs w-40 outline-none focus:ring-1 focus:ring-secondary text-textPrimary placeholder-gray-500 font-medium bg-white shadow-sm"
                                    />
                                </div>
                                <span className="text-gray-400 self-center">to</span>
                                <div className="relative group">
                                    <input
                                        type="date"
                                        value={dateTo}
                                        onChange={(e) => setDateTo(e.target.value)}
                                        className="pl-3 pr-9 py-2.5 border border-gray-300 rounded-lg text-xs w-40 outline-none focus:ring-1 focus:ring-secondary text-textPrimary placeholder-gray-500 font-medium bg-white shadow-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="font-bold text-textPrimary text-sm w-20 xl:text-right">Bandingkan :</span>
                            <div className="flex items-center">
                                <Toggle checked={isComparison} onChange={setIsComparison} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-border shadow-sm min-h-[600px]">
                {!isComparison ? (
                    <div className="flex flex-col h-full">
                        <h3 className="text-xl font-bold text-textPrimary text-center mb-8">Menu {categoryType} {filterRegion ? `(${filterRegion})` : 'Nasional'}</h3>
                        {topSellingData && topSellingData.length > 0 ? (
                            <div className="w-full" style={{ height: '500px' }}>
                                <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                                    <BarChart
                                        data={topSellingData}
                                        margin={{ top: 20, right: 20, left: 20, bottom: 80 }}
                                    >
                                        <CartesianGrid strokeDasharray="0" vertical={false} stroke="#e5e7eb" />
                                        <XAxis
                                            dataKey="name"
                                            angle={0}
                                            textAnchor="middle"
                                            height={80}
                                            interval={0}
                                            tick={({ x, y, payload }) => {
                                                const name = payload.value;
                                                // Truncate name to max 12 characters
                                                const displayName = name.length > 12 ? name.substring(0, 12) + '...' : name;
                                                // Split into 2 lines if still long
                                                const words = displayName.split(' ');
                                                const line1 = words.slice(0, Math.ceil(words.length / 2)).join(' ');
                                                const line2 = words.slice(Math.ceil(words.length / 2)).join(' ');

                                                return (
                                                    <g transform={`translate(${x},${y})`}>
                                                        <text
                                                            x={0}
                                                            y={0}
                                                            dy={12}
                                                            textAnchor="middle"
                                                            fill="#1F2933"
                                                            fontSize={10}
                                                            fontWeight={600}
                                                        >
                                                            <tspan x={0} dy="0">{line1}</tspan>
                                                            {line2 && <tspan x={0} dy="14">{line2}</tspan>}
                                                        </text>
                                                    </g>
                                                );
                                            }}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <Tooltip cursor={{ fill: 'rgba(0,0,0,0.05)' }} />
                                        <Bar dataKey="value" fill="#B08968" radius={[8, 8, 0, 0]} isAnimationActive={true} label={{ position: 'top', fill: '#1F2933', fontWeight: 'bold', fontSize: 12 }}>
                                            {topSellingData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.fill} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-400"><p>Tidak ada data untuk filter yang dipilih.</p></div>
                        )}
                    </div>
                ) : (
                    <div className="space-y-8">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="flex-1 flex items-center gap-4">
                                <span className="font-bold text-textPrimary">Menu 1:</span>
                                <div className="relative flex-1">
                                    <select value={menu1} onChange={(e) => setMenu1(e.target.value)} className="w-full appearance-none border border-border rounded-lg px-4 py-3 pr-10 outline-none focus:ring-1 focus:ring-secondary cursor-pointer bg-white font-medium">
                                        {filteredMenus.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary pointer-events-none" />
                                </div>
                            </div>
                            <div className="flex-1 flex items-center gap-4">
                                <span className="font-bold text-textPrimary">Menu 2:</span>
                                <div className="relative flex-1">
                                    <select value={menu2} onChange={(e) => setMenu2(e.target.value)} className="w-full appearance-none border border-border rounded-lg px-4 py-3 pr-10 outline-none focus:ring-1 focus:ring-secondary cursor-pointer bg-white font-medium">
                                        {filteredMenus.map(m => <option key={m.name} value={m.name}>{m.name}</option>)}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-textSecondary pointer-events-none" />
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-[#FAF9F6] rounded-2xl p-6 border border-gray-100">
                                <h4 className="text-center font-bold text-textPrimary mb-6">Grafik Tren ({menu1})</h4>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={dataMenu1} barCategoryGap="20%">
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                                            <Tooltip />
                                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                                {dataMenu1.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div className="bg-[#FAF9F6] rounded-2xl p-6 border border-gray-100">
                                <h4 className="text-center font-bold text-textPrimary mb-6">Grafik Tren ({menu2})</h4>
                                <div className="h-[300px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={dataMenu2} barCategoryGap="20%">
                                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6B7280' }} dy={10} />
                                            <Tooltip />
                                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                                {dataMenu2.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.fill} />)}
                                            </Bar>
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};