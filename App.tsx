

import React, { useState, useEffect, useMemo, FC, PropsWithChildren } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';

// --- ICONS (Embedded SVGs for simplicity) ---
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
const ProposalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const AnalyticsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18" /></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

// --- TYPESCRIPT TYPES ---
type UserRole = 'GM' | 'RM';
type Page = 'Dashboard' | 'Menu Management' | 'Menu Proposals' | 'Analytics' | 'Settings';
type MenuCategory = 'Makanan' | 'Minuman' | 'Kopi' | 'Snack' | 'Minuman Instan';
type StoreType = 'Dine-in' | 'Coffee Shop' | 'Express' | 'Snack Stall' | 'Drink Stall';
type ProposalStatus = 'Pending' | 'Approved' | 'Rejected';

interface User {
  id: number;
  name: string;
  role: UserRole;
  region?: string;
}

interface Menu {
  id: number;
  name: string;
  category: MenuCategory;
  price: number;
  description: string;
  imageUrl: string;
  allowedStores: StoreType[];
  allowedRegions: string[]; // Region tertentu atau ['All'] untuk semua region
  hasServiceFee?: boolean; // Otomatis true untuk Dine-in & Coffee Shop
  taxRate: number; // Default 10% untuk semua
}

interface Proposal {
  id: number;
  menuName: string;
  description: string;
  price: number;
  imageUrl: string;
  rmNotes: string;
  status: ProposalStatus;
    // Targeting & business rule metadata carried from RM proposal
    category: MenuCategory;
    allowedStores: StoreType[];
    allowedRegions: string[];
    hasServiceFee?: boolean;
    taxRate: number;
  proposer: {
    id: number;
    name: string;
    region: string;
  };
}

interface AnalyticsDataPoint {
    label: string;
    value: number;
}
interface TrendDataItem {
    name: string;
    sales: number;
}
type MenuFormData = Omit<Menu, 'id'> & { rmNotes?: string };

// --- MOCK DATA ---
const USERS: Record<UserRole, User> = {
  GM: { id: 1, name: 'Alex Johnson', role: 'GM' },
  RM: { id: 2, name: 'Benny Carter', role: 'RM', region: 'Jakarta' },
};

const MENUS_DATA: Menu[] = [
  { id: 1, name: 'Nasi Goreng Spesial', category: 'Makanan', price: 45000, description: 'Nasi goreng klasik dengan telur, ayam, dan udang.', imageUrl: 'https://images.unsplash.com/photo-1512058564366-185109023977?auto=format&fit=crop&q=60&w=500', allowedStores: ['Dine-in', 'Express'], allowedRegions: ['All'], hasServiceFee: true, taxRate: 10 },
  { id: 2, name: 'Americano', category: 'Kopi', price: 25000, description: 'Espresso dengan tambahan air panas.', imageUrl: 'https://images.unsplash.com/photo-1507133750040-4a8f570215de?auto=format&fit=crop&q=60&w=500', allowedStores: ['Dine-in', 'Coffee Shop'], allowedRegions: ['All'], hasServiceFee: true, taxRate: 10 },
  { id: 3, name: 'French Fries', category: 'Snack', price: 20000, description: 'Kentang goreng renyah.', imageUrl: 'https://images.unsplash.com/photo-1576107232684-c7be35d0879a?auto=format&fit=crop&q=60&w=500', allowedStores: ['Snack Stall', 'Dine-in', 'Express'], allowedRegions: ['All'], hasServiceFee: false, taxRate: 10 },
  { id: 4, name: 'Iced Lemon Tea', category: 'Minuman', price: 18000, description: 'Teh dingin dengan perasan lemon segar.', imageUrl: 'https://images.unsplash.com/photo-1556679343-af51b89736f5?auto=format&fit=crop&q=60&w=500', allowedStores: ['Dine-in', 'Express', 'Coffee Shop'], allowedRegions: ['All'], hasServiceFee: false, taxRate: 10 },
  { id: 5, name: 'Instant Coffee Sachet', category: 'Minuman Instan', price: 10000, description: 'Kopi instan sachet siap seduh.', imageUrl: 'https://images.unsplash.com/photo-1596591603954-4a0b0f792646?auto=format&fit=crop&q=60&w=500', allowedStores: ['Drink Stall'], allowedRegions: ['All'], hasServiceFee: false, taxRate: 10 },
];

const PROPOSALS_DATA: Proposal[] = [
    { id: 1, menuName: 'Kopi Gula Aren', description: 'Kopi susu dengan pemanis gula aren asli.', price: 28000, imageUrl: 'https://images.unsplash.com/photo-1579888069124-4f4955b2d72b?auto=format&fit=crop&q=60&w=500', rmNotes: 'Sangat populer di kalangan anak muda Jakarta saat ini. Potensi sales tinggi.', status: 'Pending', category: 'Kopi', allowedStores: ['Coffee Shop', 'Dine-in'], allowedRegions: ['All'], hasServiceFee: true, taxRate: 10, proposer: { id: 2, name: 'Benny Carter', region: 'Jakarta' } },
    { id: 2, menuName: 'Soto Betawi', description: 'Soto khas Jakarta dengan kuah santan dan daging sapi.', price: 55000, imageUrl: 'https://images.unsplash.com/photo-1627891152229-285d03a11a32?auto=format&fit=crop&q=60&w=500', rmNotes: 'Menu otentik yang dapat menarik wisatawan dan penduduk lokal.', status: 'Approved', category: 'Makanan', allowedStores: ['Dine-in', 'Express'], allowedRegions: ['All'], hasServiceFee: true, taxRate: 10, proposer: { id: 3, name: 'Citra Dewi', region: 'Bandung' } },
    { id: 3, menuName: 'Cireng Bumbu Rujak', description: 'Camilan aci goreng dengan saus rujak pedas manis.', price: 22000, imageUrl: 'https://images.unsplash.com/photo-1629278282361-18579d57a5e9?auto=format&fit=crop&q=60&w=500', rmNotes: 'Menu ini tidak cocok dengan citra brand kita yang premium.', status: 'Rejected', category: 'Snack', allowedStores: ['Snack Stall', 'Dine-in', 'Express'], allowedRegions: ['All'], hasServiceFee: false, taxRate: 10, proposer: { id: 4, name: 'Dodi Hermawan', region: 'Surabaya' } },
];

const MOCK_PROFIT_DATA: Record<string, AnalyticsDataPoint[]> = {
  Weekly: [{ label: 'W1', value: 280 }, { label: 'W2', value: 310 }, { label: 'W3', value: 290 }, { label: 'W4', value: 350 },],
  Monthly: [{ label: 'Jan', value: 1200 }, { label: 'Feb', value: 1100 }, { label: 'Mar', value: 1400 }, { label: 'Apr', value: 1350 },],
  Yearly: [{ label: '2022', value: 15000 }, { label: '2023', value: 18000 }, { label: '2024', value: 22000 },],
};

const MOCK_TREND_DATA: { best: TrendDataItem[], worst: TrendDataItem[] } = {
  best: [{ name: 'Nasi Goreng', sales: 5400 }, { name: 'Americano', sales: 4800 }, { name: 'Kopi Aren', sales: 4500 },],
  worst: [{ name: 'Instant Coffee', sales: 300 }, { name: 'Cireng', sales: 550 }, { name: 'Iced Lemon Tea', sales: 900 },],
};

// --- UTILITY FUNCTIONS ---
const formatCurrency = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

// --- REUSABLE UI COMPONENTS ---
const Sidebar: FC<{ userRole: UserRole, currentPage: Page, setPage: (page: Page) => void, onLogout: () => void }> = ({ userRole, currentPage, setPage, onLogout }) => {
  const gmNav = ['Dashboard', 'Menu Management', 'Menu Proposals', 'Analytics', 'Settings'];
  const rmNav = ['Dashboard', 'Menu Proposals', 'Analytics', 'Settings'];
  const navItems = userRole === 'GM' ? gmNav : rmNav;

  const NavLink: FC<{ name: Page, icon: React.ReactElement }> = ({ name, icon }) => (
    <button
      onClick={() => setPage(name)}
      className={`flex items-center w-full px-4 py-3 text-left transition-all duration-200 rounded-xl group ${
        currentPage === name 
          ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25' 
          : 'text-slate-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      <span className={`transition-transform duration-200 ${currentPage === name ? 'scale-110' : 'group-hover:scale-110'}`}>
        {icon}
      </span>
      <span className="ml-3 text-sm font-medium">{name}</span>
    </button>
  );

  return (
    <aside className="hidden md:flex flex-col w-72 bg-gradient-to-b from-slate-900 to-slate-800 p-6">
      <div className="flex items-center mb-10">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center mr-3">
          <span className="text-white font-bold text-lg">E</span>
        </div>
        <div>
          <h1 className="text-xl font-bold text-white">Eatz & Chillz</h1>
          <p className="text-xs text-slate-500">Analytics Dashboard</p>
        </div>
      </div>
      <nav className="flex-1 space-y-2">
        <NavLink name="Dashboard" icon={<DashboardIcon />} />
        {userRole === 'GM' && <NavLink name="Menu Management" icon={<MenuIcon />} />}
        <NavLink name="Menu Proposals" icon={<ProposalIcon />} />
        <NavLink name="Analytics" icon={<AnalyticsIcon />} />
        <NavLink name="Settings" icon={<SettingsIcon />} />
      </nav>
      <div className="pt-6 border-t border-slate-700/50">
        <button onClick={onLogout} className="flex items-center w-full px-4 py-3 text-left text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200 rounded-xl group">
          <span className="transition-transform duration-200 group-hover:scale-110"><LogoutIcon /></span>
          <span className="ml-3 text-sm font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

const Header: FC<{ user: User, page: Page, onSwitchRole: () => void }> = ({ user, page, onSwitchRole }) => (
  <header className="bg-white/80 backdrop-blur-xl p-4 sm:px-8 sm:py-5 flex items-center justify-between border-b border-slate-200/50 sticky top-0 z-40">
    <div>
      <h2 className="text-2xl font-bold text-slate-800">{page}</h2>
      <p className="text-sm text-slate-500">Kelola bisnis Anda dengan mudah</p>
    </div>
    <div className="flex items-center gap-4">
      <div className="text-right hidden sm:block">
        <p className="font-semibold text-slate-800">{user.name}</p>
        <p className="text-xs text-slate-500">{user.role === 'GM' ? 'General Manager' : `Region Manager • ${user.region}`}</p>
      </div>
      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center text-white font-semibold">
        {user.name.charAt(0)}
      </div>
      <button onClick={onSwitchRole} className="px-4 py-2.5 text-sm font-medium text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all duration-200">
        Switch Role
      </button>
    </div>
  </header>
);

const StatCard: FC<{ title: string; value: string; change?: string; changeType?: 'increase' | 'decrease' }> = ({ title, value, change, changeType }) => (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-lg hover:border-slate-200 transition-all duration-300">
        <h3 className="text-sm font-medium text-slate-500 mb-1">{title}</h3>
        <p className="text-3xl font-bold text-slate-800">{value}</p>
        {change && (
            <div className={`mt-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-sm font-medium ${changeType === 'increase' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                <span>{changeType === 'increase' ? '↑' : '↓'}</span>
                {change}
            </div>
        )}
    </div>
);

const Modal: FC<PropsWithChildren<{ isOpen: boolean; onClose: () => void; title: string }>> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" aria-modal="true" role="dialog">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between p-6 border-b border-slate-100">
                    <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-xl transition-all"><CloseIcon /></button>
                </div>
                <div className="p-6 overflow-y-auto">{children}</div>
            </div>
        </div>
    );
};

const Toast: FC<{ message: string; show: boolean; onDismiss: () => void }> = ({ message, show, onDismiss }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => onDismiss(), 3000);
            return () => clearTimeout(timer);
        }
    }, [show, onDismiss]);

    return (
        <div className={`fixed top-5 right-5 z-50 transition-all duration-300 ${show ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'}`}>
            <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-xl shadow-lg shadow-purple-500/25 py-4 px-6 flex items-center gap-3">
                <span className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-sm">✓</span>
                {message}
            </div>
        </div>
    );
};

const MenuForm: FC<{ onSave: (data: MenuFormData) => void, onCancel: () => void, initialData?: Menu | null, isProposal?: boolean }> = ({ onSave, onCancel, initialData, isProposal }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState<MenuCategory>('Makanan');
    const [imageUrl, setImageUrl] = useState('');
    const [rmNotes, setRmNotes] = useState('');
    const [previewImage, setPreviewImage] = useState('');
    const [allowedStores, setAllowedStores] = useState<StoreType[]>([]);
    const [allowedRegions, setAllowedRegions] = useState<string[]>(['All']);
    const [taxRate] = useState(10); // Fixed 10% untuk semua
    
    useEffect(() => {
        if(initialData) {
            setName(initialData.name);
            setDescription(initialData.description);
            setPrice(String(initialData.price));
            setCategory(initialData.category);
            setImageUrl(initialData.imageUrl);
            setPreviewImage(initialData.imageUrl);
            setAllowedStores(initialData.allowedStores);
            setAllowedRegions(initialData.allowedRegions);
        }
    }, [initialData]);

    // Aturan kategori vs store type (SRS Point 4, 5)
    const getAvailableStores = (): StoreType[] => {
        switch(category) {
            case 'Snack':
                return ['Snack Stall', 'Dine-in', 'Express'];
            case 'Minuman Instan':
                return ['Drink Stall'];
            case 'Kopi':
                return ['Coffee Shop', 'Dine-in'];
            case 'Makanan':
                return ['Dine-in', 'Express'];
            case 'Minuman':
                return ['Dine-in', 'Coffee Shop', 'Express'];
            default:
                return [];
        }
    };

    // Auto-update allowed stores saat kategori berubah
    useEffect(() => {
        const available = getAvailableStores();
        setAllowedStores(prevStores => prevStores.filter(store => available.includes(store)));
    }, [category]);

    const handleImageUrlChange = (url: string) => {
        setImageUrl(url);
        if (url) {
            setPreviewImage(url);
        }
    };

    const toggleStore = (store: StoreType) => {
        setAllowedStores(prev => 
            prev.includes(store) ? prev.filter(s => s !== store) : [...prev, store]
        );
    };

    const toggleRegion = (region: string) => {
        if (region === 'All') {
            setAllowedRegions(['All']);
        } else {
            setAllowedRegions(prev => {
                const filtered = prev.filter(r => r !== 'All');
                return filtered.includes(region) 
                    ? filtered.filter(r => r !== region)
                    : [...filtered, region];
            });
        }
    };

    // Hitung service fee otomatis (SRS Point 9)
    const hasServiceFee = allowedStores.some(store => store === 'Dine-in' || store === 'Coffee Shop');

    const calculateFinalPrice = () => {
        const basePrice = Number(price);
        const serviceFee = hasServiceFee ? basePrice * 0.05 : 0; // 5% service fee
        const tax = basePrice * (taxRate / 100); // 10% tax
        return basePrice + serviceFee + tax;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (allowedStores.length === 0) {
            alert('Pilih minimal 1 jenis outlet!');
            return;
        }

        onSave({
            name,
            description,
            price: Number(price),
            category,
            imageUrl: imageUrl || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=60&w=500',
            allowedStores,
            allowedRegions: allowedRegions.length === 0 ? ['All'] : allowedRegions,
            hasServiceFee,
            taxRate,
            rmNotes
        });
    };

    const categoryOptions = [
        { value: 'Makanan', icon: '🍜', color: 'from-orange-500 to-red-500' },
        { value: 'Minuman', icon: '🥤', color: 'from-blue-500 to-cyan-500' },
        { value: 'Kopi', icon: '☕', color: 'from-amber-600 to-yellow-600' },
        { value: 'Snack', icon: '🍿', color: 'from-purple-500 to-pink-500' },
        { value: 'Minuman Instan', icon: '🧃', color: 'from-green-500 to-emerald-500' },
    ];

    const formatRupiah = (value: string) => {
        const number = value.replace(/\D/g, '');
        return new Intl.NumberFormat('id-ID').format(Number(number));
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Image Preview Section */}
            <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 rounded-2xl p-6 border-2 border-dashed border-slate-200">
                <div className="flex flex-col items-center">
                    {previewImage ? (
                        <div className="relative group">
                            <img 
                                src={previewImage} 
                                alt="Preview" 
                                className="w-full h-48 object-cover rounded-xl shadow-lg"
                                onError={() => setPreviewImage('')}
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                                <button 
                                    type="button"
                                    onClick={() => { setPreviewImage(''); setImageUrl(''); }}
                                    className="px-4 py-2 bg-white text-slate-800 rounded-lg font-medium hover:bg-slate-100 transition-colors"
                                >
                                    Hapus Gambar
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full h-48 flex flex-col items-center justify-center text-slate-400">
                            <svg className="w-16 h-16 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <p className="font-medium">Pratinjau gambar akan muncul di sini</p>
                            <p className="text-sm mt-1">Masukkan URL gambar di bawah</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Form Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Nama Menu */}
                <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                        <span className="w-6 h-6 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center text-white text-xs">📝</span>
                        Nama Menu
                    </label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={e => setName(e.target.value)} 
                        required 
                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-white hover:border-purple-300" 
                        placeholder="Contoh: Nasi Goreng Spesial"
                    />
                </div>

                {/* Kategori */}
                <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-3">
                        <span className="w-6 h-6 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center text-white text-xs">🏷️</span>
                        Kategori
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        {categoryOptions.map((cat) => (
                            <button
                                key={cat.value}
                                type="button"
                                onClick={() => setCategory(cat.value as MenuCategory)}
                                className={`relative overflow-hidden rounded-xl p-4 border-2 transition-all ${
                                    category === cat.value
                                        ? `border-transparent bg-gradient-to-br ${cat.color} text-white shadow-lg scale-105`
                                        : 'border-slate-200 hover:border-purple-300 bg-white hover:shadow-md'
                                }`}
                            >
                                <div className="flex flex-col items-center gap-2">
                                    <span className="text-2xl">{cat.icon}</span>
                                    <span className={`text-xs font-semibold ${category === cat.value ? 'text-white' : 'text-slate-700'}`}>
                                        {cat.value}
                                    </span>
                                </div>
                                {category === cat.value && (
                                    <div className="absolute top-2 right-2 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                                        <span className="text-xs">✓</span>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Deskripsi */}
                <div className="md:col-span-2">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                        <span className="w-6 h-6 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white text-xs">📄</span>
                        Deskripsi Menu
                    </label>
                    <textarea 
                        value={description} 
                        onChange={e => setDescription(e.target.value)} 
                        required 
                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-white hover:border-purple-300 resize-none" 
                        rows={3} 
                        placeholder="Deskripsikan menu ini secara detail..."
                    />
                    <p className="text-xs text-slate-400 mt-1.5">{description.length}/200 karakter</p>
                </div>

                {/* Harga */}
                <div className="md:col-span-1">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                        <span className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-white text-xs">💰</span>
                        Harga (IDR)
                    </label>
                    <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">Rp</span>
                        <input 
                            type="text" 
                            value={formatRupiah(price)} 
                            onChange={e => setPrice(e.target.value.replace(/\D/g, ''))} 
                            required 
                            className="w-full border-2 border-slate-200 rounded-xl pl-12 pr-4 py-3 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-white hover:border-purple-300 font-semibold" 
                            placeholder="0"
                        />
                    </div>
                    {price && (
                        <p className="text-xs text-emerald-600 mt-1.5 font-medium">= {formatCurrency(Number(price))}</p>
                    )}
                </div>

                {/* URL Gambar */}
                <div className="md:col-span-1">
                    <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 mb-2">
                        <span className="w-6 h-6 bg-gradient-to-br from-pink-500 to-rose-500 rounded-lg flex items-center justify-center text-white text-xs">🖼️</span>
                        URL Gambar
                    </label>
                    <input 
                        type="text" 
                        value={imageUrl} 
                        onChange={e => handleImageUrlChange(e.target.value)} 
                        className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 bg-white hover:border-purple-300" 
                        placeholder="https://images.unsplash.com/..."
                    />
                    <p className="text-xs text-slate-400 mt-1.5">Paste URL gambar dari Unsplash atau sumber lain</p>
                </div>
            </div>

            {/* Bentuk Outlet (Store Types) */}
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-5 border-2 border-indigo-200">
                <label className="flex items-center gap-2 text-sm font-semibold text-indigo-800 mb-3">
                    <span className="w-6 h-6 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center text-white text-xs">🏪</span>
                    Bentuk Outlet yang Diizinkan
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                    {getAvailableStores().map((store) => {
                        const storeIcons: Record<StoreType, string> = {
                            'Dine-in': '🍽️',
                            'Coffee Shop': '☕',
                            'Express': '⚡',
                            'Snack Stall': '🍿',
                            'Drink Stall': '🥤',
                        };
                        const isSelected = allowedStores.includes(store);
                        return (
                            <button
                                key={store}
                                type="button"
                                onClick={() => toggleStore(store)}
                                className={`relative rounded-xl p-3 border-2 transition-all ${
                                    isSelected
                                        ? 'border-indigo-500 bg-indigo-500 text-white shadow-lg'
                                        : 'border-indigo-200 bg-white text-slate-700 hover:border-indigo-300 hover:shadow-md'
                                }`}
                            >
                                <div className="flex flex-col items-center gap-1">
                                    <span className="text-xl">{storeIcons[store]}</span>
                                    <span className="text-xs font-semibold text-center">{store}</span>
                                </div>
                                {isSelected && (
                                    <div className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                                        <span className="text-indigo-500 text-xs font-bold">✓</span>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
                <div className="mt-3 flex items-start gap-2 p-3 bg-indigo-100 rounded-xl">
                    <span className="text-indigo-600">ℹ️</span>
                    <p className="text-xs text-indigo-700">
                        {category === 'Snack' && 'Snack hanya bisa dijual di Snack Stall, Dine-in, dan Express'}
                        {category === 'Minuman Instan' && 'Minuman Instan hanya bisa dijual di Drink Stall'}
                        {category === 'Kopi' && 'Kopi bisa dijual di Coffee Shop dan Dine-in'}
                        {category === 'Makanan' && 'Makanan bisa dijual di Dine-in dan Express'}
                        {category === 'Minuman' && 'Minuman bisa dijual di Dine-in, Coffee Shop, dan Express'}
                    </p>
                </div>
            </div>

            {/* Region Selection */}
            <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-2xl p-5 border-2 border-cyan-200">
                <label className="flex items-center gap-2 text-sm font-semibold text-cyan-800 mb-3">
                    <span className="w-6 h-6 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center text-white text-xs">📍</span>
                    Region yang Diizinkan
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['All', 'Jakarta Selatan', 'Jakarta Pusat', 'Jakarta Utara', 'Jakarta Barat', 'Jakarta Timur', 'Bandung', 'Surabaya'].map((region) => {
                        const isSelected = allowedRegions.includes(region);
                        return (
                            <button
                                key={region}
                                type="button"
                                onClick={() => toggleRegion(region)}
                                className={`relative rounded-xl p-3 border-2 transition-all ${
                                    isSelected
                                        ? 'border-cyan-500 bg-cyan-500 text-white shadow-lg'
                                        : 'border-cyan-200 bg-white text-slate-700 hover:border-cyan-300 hover:shadow-md'
                                }`}
                            >
                                <div className="flex items-center justify-center gap-2">
                                    <span className="text-xs font-semibold">{region === 'All' ? '🌏 Semua' : region}</span>
                                </div>
                                {isSelected && (
                                    <div className="absolute top-1 right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                                        <span className="text-cyan-500 text-xs font-bold">✓</span>
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
                <p className="text-xs text-cyan-600 mt-3">💡 Pilih "Semua" untuk menu yang tersedia di seluruh region</p>
            </div>

            {/* Price Breakdown */}
            {price && allowedStores.length > 0 && (
                <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-2xl p-5 border-2 border-emerald-200">
                    <label className="flex items-center gap-2 text-sm font-semibold text-emerald-800 mb-3">
                        <span className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-green-500 rounded-lg flex items-center justify-center text-white text-xs">🧾</span>
                        Rincian Harga
                    </label>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-600">Harga Dasar:</span>
                            <span className="font-semibold text-slate-800">{formatCurrency(Number(price))}</span>
                        </div>
                        {hasServiceFee && (
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-slate-600">Service Fee (5%):</span>
                                <span className="font-semibold text-amber-600">{formatCurrency(Number(price) * 0.05)}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-slate-600">Pajak ({taxRate}%):</span>
                            <span className="font-semibold text-slate-800">{formatCurrency(Number(price) * (taxRate / 100))}</span>
                        </div>
                        <div className="flex justify-between items-center text-base pt-2 border-t-2 border-emerald-200">
                            <span className="text-emerald-800 font-bold">Total Harga:</span>
                            <span className="font-bold text-xl text-emerald-700">{formatCurrency(calculateFinalPrice())}</span>
                        </div>
                    </div>
                    {hasServiceFee && (
                        <div className="mt-3 flex items-start gap-2 p-3 bg-amber-100 rounded-xl">
                            <span>💡</span>
                            <p className="text-xs text-amber-700">Service fee 5% dikenakan untuk Dine-in dan Coffee Shop</p>
                        </div>
                    )}
                </div>
            )}

            {/* Catatan untuk GM */}
            {isProposal && (
                <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border-2 border-amber-200">
                    <label className="flex items-center gap-2 text-sm font-semibold text-amber-800 mb-3">
                        <span className="w-6 h-6 bg-gradient-to-br from-amber-500 to-orange-500 rounded-lg flex items-center justify-center text-white text-xs">💬</span>
                        Catatan untuk General Manager
                    </label>
                    <textarea 
                        value={rmNotes} 
                        onChange={e => setRmNotes(e.target.value)} 
                        className="w-full border-2 border-amber-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all duration-200 bg-white resize-none" 
                        rows={3} 
                        placeholder="Jelaskan mengapa menu ini layak ditambahkan..."
                    />
                    <p className="text-xs text-amber-600 mt-2">💡 Tips: Sertakan alasan mengapa menu ini cocok untuk region Anda</p>
                </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-6 border-t-2 border-slate-100">
                <button 
                    type="button" 
                    onClick={onCancel} 
                    className="flex-1 px-6 py-3 text-sm font-semibold text-slate-600 bg-slate-100 rounded-xl hover:bg-slate-200 transition-all hover:scale-105"
                >
                    ← Batal
                </button>
                <button 
                    type="submit" 
                    className="flex-1 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/25 transition-all hover:scale-105 flex items-center justify-center gap-2"
                >
                    {isProposal ? (
                        <>
                            <span>🚀</span>
                            Kirim Proposal
                        </>
                    ) : (
                        <>
                            <span>✓</span>
                            Simpan Menu
                        </>
                    )}
                </button>
            </div>
        </form>
    );
};

// --- PAGE COMPONENTS ---
const DashboardPage: FC<{ user: User, onNav: (page: Page) => void, proposals: Proposal[], menus: Menu[] }> = ({ user, onNav, proposals, menus }) => {
    const [animated, setAnimated] = useState(false);
    const [filterKategori, setFilterKategori] = useState('Semua');
    const [filterBentuk, setFilterBentuk] = useState('Semua');
    const [filterRegion, setFilterRegion] = useState('Semua');
    const [activeFilter, setActiveFilter] = useState<string | null>(null);

    const pendingProposalsCount = proposals.filter(p => p.status === 'Pending').length;
    const rmProposalsCount = proposals.filter(p => p.proposer.id === user.id && p.status === 'Pending').length;
    const approvedCount = proposals.filter(p => p.status === 'Approved').length;
    const filteredMenusGM = useMemo(() => {
        return menus.filter(m => {
            const byCategory = filterKategori === 'Semua' || m.category === (filterKategori as MenuCategory);
            const byStore = filterBentuk === 'Semua' || m.allowedStores.includes(filterBentuk as StoreType);
            const byRegion = filterRegion === 'Semua' || m.allowedRegions.includes('All') || m.allowedRegions.includes(filterRegion);
            return byCategory && byStore && byRegion;
        });
    }, [menus, filterKategori, filterBentuk, filterRegion]);
    const totalMenus = filteredMenusGM.length;
    
    useEffect(() => {
        const timer = setTimeout(() => setAnimated(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Close filter when clicking outside
    useEffect(() => {
        const handleClickOutside = () => setActiveFilter(null);
        if (activeFilter) {
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [activeFilter]);

    // Filter options with icons
    const filterConfigs = [
        {
            id: 'kategori',
            label: 'Kategori',
            icon: '🍽️',
            value: filterKategori,
            setValue: setFilterKategori,
            options: [
                { value: 'Semua', label: 'Semua Kategori', icon: '📋' },
                { value: 'Makanan', label: 'Makanan', icon: '🍜' },
                { value: 'Minuman', label: 'Minuman', icon: '🥤' },
                { value: 'Dessert', label: 'Dessert', icon: '🍰' },
                { value: 'Snack', label: 'Snack', icon: '🍿' },
            ],
            gradient: 'from-orange-500 to-red-500',
            bgGradient: 'from-orange-50 to-red-50',
        },
        {
            id: 'bentuk',
            label: 'Bentuk Outlet',
            icon: '🏪',
            value: filterBentuk,
            setValue: setFilterBentuk,
            options: [
                { value: 'Semua', label: 'Semua Bentuk', icon: '🏢' },
                { value: 'Dine-in', label: 'Dine-in', icon: '🪑' },
                { value: 'Coffee Shop', label: 'Coffee Shop', icon: '☕' },
                { value: 'Express', label: 'Express', icon: '⚡' },
                { value: 'Snack Stall', label: 'Snack Stall', icon: '🍿' },
                { value: 'Drink Stall', label: 'Drink Stall', icon: '🥤' },
            ],
            gradient: 'from-blue-500 to-cyan-500',
            bgGradient: 'from-blue-50 to-cyan-50',
        },
        {
            id: 'region',
            label: 'Region',
            icon: '📍',
            value: filterRegion,
            setValue: setFilterRegion,
            options: [
                { value: 'Semua', label: 'Semua Region', icon: '🌏' },
                { value: 'Jakarta Selatan', label: 'Jakarta Selatan', icon: '🏙️' },
                { value: 'Jakarta Pusat', label: 'Jakarta Pusat', icon: '🏛️' },
                { value: 'Jakarta Utara', label: 'Jakarta Utara', icon: '⚓' },
                { value: 'Jakarta Barat', label: 'Jakarta Barat', icon: '🌆' },
                { value: 'Jakarta Timur', label: 'Jakarta Timur', icon: '🌅' },
                { value: 'Bandung', label: 'Bandung', icon: '🌄' },
                { value: 'Surabaya', label: 'Surabaya', icon: '🦈' },
            ],
            gradient: 'from-purple-500 to-pink-500',
            bgGradient: 'from-purple-50 to-pink-50',
        },
    ];

    const hasActiveFilters = filterKategori !== 'Semua' || filterBentuk !== 'Semua' || filterRegion !== 'Semua';
    const activeFiltersCount = [filterKategori, filterBentuk, filterRegion].filter(f => f !== 'Semua').length;

    const FilterCard: FC<{
        config: typeof filterConfigs[0];
    }> = ({ config }) => {
        const isOpen = activeFilter === config.id;
        const isActive = config.value !== 'Semua';
        const selectedOption = config.options.find(o => o.value === config.value);
        
        return (
            <div className="relative flex-1 min-w-[180px]" onClick={(e) => e.stopPropagation()}>
                <button 
                    onClick={() => setActiveFilter(isOpen ? null : config.id)}
                    className={`w-full group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                        isOpen 
                            ? 'border-purple-400 shadow-lg shadow-purple-500/20' 
                            : isActive 
                                ? 'border-purple-200 bg-gradient-to-br ' + config.bgGradient
                                : 'border-slate-200 hover:border-purple-300 bg-white hover:shadow-md'
                    }`}
                >
                    {/* Animated background on hover */}
                    <div className={`absolute inset-0 bg-gradient-to-r ${config.gradient} opacity-0 group-hover:opacity-5 transition-opacity`} />
                    
                    <div className="relative p-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center text-lg shadow-lg`}>
                                    {selectedOption?.icon || config.icon}
                                </div>
                                <div className="text-left">
                                    <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">{config.label}</p>
                                    <p className={`font-semibold ${isActive ? 'text-purple-600' : 'text-slate-800'}`}>
                                        {selectedOption?.label || config.value}
                                    </p>
                                </div>
                            </div>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                isOpen ? 'bg-purple-100 rotate-180' : 'bg-slate-100 group-hover:bg-purple-50'
                            }`}>
                                <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </button>
                
                {/* Dropdown */}
                {isOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-[100] animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="p-2 max-h-72 overflow-y-auto">
                            {config.options.map((opt, idx) => (
                                <button
                                    key={opt.value}
                                    onClick={() => { config.setValue(opt.value); setActiveFilter(null); }}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                                        config.value === opt.value 
                                            ? `bg-gradient-to-r ${config.gradient} text-white shadow-lg` 
                                            : 'hover:bg-slate-50 text-slate-700'
                                    }`}
                                    style={{
                                        animationDelay: `${idx * 30}ms`
                                    }}
                                >
                                    <span className={`text-lg ${config.value === opt.value ? 'animate-bounce' : ''}`}>
                                        {opt.icon}
                                    </span>
                                    <span className="font-medium">{opt.label}</span>
                                    {config.value === opt.value && (
                                        <span className="ml-auto">✓</span>
                                    )}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    // Mini sparkline data
    const sparklineData = [30, 45, 35, 50, 40, 60, 55, 70, 65, 80, 75, 90];
    
    const StatCardEnhanced: FC<{ 
        title: string; 
        value: string; 
        change?: string; 
        changeType?: 'increase' | 'decrease';
        icon: React.ReactElement;
        gradient: string;
        delay: number;
    }> = ({ title, value, change, changeType, icon, gradient, delay }) => (
        <div 
            className={`relative overflow-hidden bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-xl hover:border-slate-200 transition-all duration-500 group`}
            style={{
                opacity: animated ? 1 : 0,
                transform: animated ? 'translateY(0)' : 'translateY(20px)',
                transition: `all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) ${delay}s`
            }}
        >
            {/* Background gradient decoration */}
            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full ${gradient} opacity-10 group-hover:opacity-20 group-hover:scale-125 transition-all duration-500`}></div>
            
            <div className="relative flex items-start justify-between">
                <div>
                    <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
                    <p className="text-3xl font-bold text-slate-800">{value}</p>
                    {change && (
                        <div className={`mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${changeType === 'increase' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                            <span className="text-base">{changeType === 'increase' ? '↑' : '↓'}</span>
                            {change}
                        </div>
                    )}
                </div>
                <div className={`w-12 h-12 rounded-xl ${gradient} flex items-center justify-center text-white shadow-lg`}>
                    {icon}
                </div>
            </div>
        </div>
    );

    // Mini chart component
    const MiniSparkline: FC<{ data: number[], color: string }> = ({ data, color }) => {
        const max = Math.max(...data);
        const points = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - (d / max) * 80}`).join(' ');
        return (
            <svg viewBox="0 0 100 100" className="w-full h-12" preserveAspectRatio="none">
                <defs>
                    <linearGradient id={`spark-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>
                <polygon fill={`url(#spark-${color})`} points={`0,100 ${points} 100,100`} />
                <polyline fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" points={points} />
            </svg>
        );
    };
    
    return (
      <div className="p-6 lg:p-8 space-y-8">
        {/* Welcome Banner */}
        <div 
            className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-3xl p-8 text-white"
            style={{
                opacity: animated ? 1 : 0,
                transform: animated ? 'translateY(0)' : 'translateY(20px)',
                transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}
        >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4"></div>
            <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-white/30 rounded-full animate-pulse"></div>
            <div className="absolute top-1/3 right-1/3 w-2 h-2 bg-white/40 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
            
            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div>
                    <p className="text-purple-200 text-sm font-medium mb-2">
                        {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                    <h2 className="text-3xl lg:text-4xl font-bold mb-2">
                        Selamat datang, {user.name.split(' ')[0]}! 👋
                    </h2>
                    <p className="text-purple-100 text-lg">
                        {user.role === 'GM' 
                            ? 'Pantau performa bisnis nasional Anda' 
                            : `Kelola region ${user.region} dengan mudah`}
                    </p>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={() => onNav('Analytics')} 
                        className="px-6 py-3 bg-white/20 backdrop-blur-sm rounded-xl font-medium hover:bg-white/30 transition-all flex items-center gap-2"
                    >
                        <AnalyticsIcon />
                        Lihat Analytics
                    </button>
                </div>
            </div>
        </div>

        {/* Filter Section - GM Only */}
        {user.role === 'GM' && (
            <div 
                className="relative z-30"
                style={{
                    opacity: animated ? 1 : 0,
                    transform: animated ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s'
                }}
            >
                {/* Filter Header */}
                <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-t-2xl px-6 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
                                <span className="text-lg">🔍</span>
                            </div>
                            <div>
                                <h4 className="font-semibold text-white">Filter Dashboard</h4>
                                <p className="text-slate-400 text-sm">Sesuaikan tampilan data</p>
                            </div>
                        </div>
                        {hasActiveFilters && (
                            <div className="flex items-center gap-3">
                                <span className="px-3 py-1 bg-purple-500/20 text-purple-300 text-sm font-medium rounded-full">
                                    {activeFiltersCount} filter aktif
                                </span>
                                <button
                                    onClick={() => {
                                        setFilterKategori('Semua');
                                        setFilterBentuk('Semua');
                                        setFilterRegion('Semua');
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-white bg-red-500/20 hover:bg-red-500/30 rounded-xl transition-colors flex items-center gap-2"
                                >
                                    <span>✕</span> Reset Semua
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Filter Cards */}
                <div className="bg-white rounded-b-2xl shadow-lg border border-slate-100 border-t-0 p-6">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {filterConfigs.map((config) => (
                            <FilterCard key={config.id} config={config} />
                        ))}
                    </div>
                    
                    {/* Active Filters Tags */}
                    {hasActiveFilters && (
                        <div className="mt-4 pt-4 border-t border-slate-100">
                            <div className="flex items-center gap-2 flex-wrap">
                                <span className="text-sm text-slate-500">Filter aktif:</span>
                                {filterKategori !== 'Semua' && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-orange-100 to-red-100 text-orange-700 text-sm font-medium rounded-full">
                                        🍽️ {filterKategori}
                                        <button onClick={() => setFilterKategori('Semua')} className="hover:text-red-600 ml-1">×</button>
                                    </span>
                                )}
                                {filterBentuk !== 'Semua' && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 text-sm font-medium rounded-full">
                                        🏪 {filterBentuk}
                                        <button onClick={() => setFilterBentuk('Semua')} className="hover:text-red-600 ml-1">×</button>
                                    </span>
                                )}
                                {filterRegion !== 'Semua' && (
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 text-sm font-medium rounded-full">
                                        📍 {filterRegion}
                                        <button onClick={() => setFilterRegion('Semua')} className="hover:text-red-600 ml-1">×</button>
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        )}

        {/* Stats Grid */}
        {user.role === 'GM' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCardEnhanced 
                title="Total Profit Bulan Ini" 
                value={formatCurrency(1200000000)} 
                change="+5.2%" 
                changeType="increase"
                icon={<span className="text-xl">💰</span>}
                gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
                delay={0.1}
            />
            <StatCardEnhanced 
                title="Proposal Pending" 
                value={String(pendingProposalsCount)}
                icon={<span className="text-xl">📋</span>}
                gradient="bg-gradient-to-br from-amber-500 to-orange-600"
                delay={0.2}
            />
            <StatCardEnhanced 
                title="Total Menu Aktif" 
                value={String(totalMenus)}
                icon={<span className="text-xl">🍽️</span>}
                gradient="bg-gradient-to-br from-purple-500 to-indigo-600"
                delay={0.3}
            />
            <StatCardEnhanced 
                title="Menu Disetujui" 
                value={String(approvedCount)}
                icon={<span className="text-xl">✅</span>}
                gradient="bg-gradient-to-br from-blue-500 to-cyan-600"
                delay={0.4}
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <StatCardEnhanced 
                title={`Profit ${user.region}`}
                value={formatCurrency(250000000)} 
                change="-1.8%" 
                changeType="decrease"
                icon={<span className="text-xl">💰</span>}
                gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
                delay={0.1}
            />
            <StatCardEnhanced 
                title="Proposal Aktif" 
                value={String(rmProposalsCount)}
                icon={<span className="text-xl">📝</span>}
                gradient="bg-gradient-to-br from-amber-500 to-orange-600"
                delay={0.2}
            />
            <StatCardEnhanced 
                title="Terlaris Region" 
                value="Kopi Aren"
                icon={<span className="text-xl">☕</span>}
                gradient="bg-gradient-to-br from-purple-500 to-indigo-600"
                delay={0.3}
            />
            <StatCardEnhanced 
                title="Total Transaksi" 
                value="2,847"
                change="+12.5%" 
                changeType="increase"
                icon={<span className="text-xl">📊</span>}
                gradient="bg-gradient-to-br from-blue-500 to-cyan-600"
                delay={0.4}
            />
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Chart Section */}
            <div 
                className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
                style={{
                    opacity: animated ? 1 : 0,
                    transform: animated ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.5s'
                }}
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h4 className="font-semibold text-slate-800 text-lg">Performa Penjualan</h4>
                        <p className="text-slate-500 text-sm">Trend minggu ini</p>
                    </div>
                    <button 
                        onClick={() => onNav('Analytics')}
                        className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                    >
                        Lihat Detail →
                    </button>
                </div>
                <div className="h-48">
                    <MiniSparkline data={sparklineData} color="#9333ea" />
                </div>
                <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-slate-100">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-slate-800">Rp 45M</p>
                        <p className="text-xs text-slate-500">Hari ini</p>
                    </div>
                    <div className="text-center border-x border-slate-100">
                        <p className="text-2xl font-bold text-slate-800">Rp 280M</p>
                        <p className="text-xs text-slate-500">Minggu ini</p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-emerald-600">+18%</p>
                        <p className="text-xs text-slate-500">vs minggu lalu</p>
                    </div>
                </div>
            </div>

            {/* Quick Actions Card */}
            <div 
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
                style={{
                    opacity: animated ? 1 : 0,
                    transform: animated ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.6s'
                }}
            >
                <h4 className="font-semibold text-slate-800 text-lg mb-4">Aksi Cepat</h4>
                <div className="space-y-3">
                    <button 
                        onClick={() => onNav('Analytics')} 
                        className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 hover:from-purple-100 hover:to-blue-100 transition-all group"
                    >
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                            <AnalyticsIcon />
                        </div>
                        <div className="text-left">
                            <p className="font-medium text-slate-800">Analytics</p>
                            <p className="text-xs text-slate-500">Lihat performa bisnis</p>
                        </div>
                    </button>
                    
                    {user.role === 'GM' ? (
                        <button 
                            onClick={() => onNav('Menu Proposals')} 
                            className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                <ProposalIcon />
                            </div>
                            <div className="text-left flex-1">
                                <p className="font-medium text-slate-800">Review Proposal</p>
                                <p className="text-xs text-slate-500">{pendingProposalsCount} menunggu review</p>
                            </div>
                            {pendingProposalsCount > 0 && (
                                <span className="px-2 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">{pendingProposalsCount}</span>
                            )}
                        </button>
                    ) : (
                        <button 
                            onClick={() => onNav('Menu Proposals')} 
                            className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                <ProposalIcon />
                            </div>
                            <div className="text-left">
                                <p className="font-medium text-slate-800">Ajukan Menu</p>
                                <p className="text-xs text-slate-500">Propose menu baru</p>
                            </div>
                        </button>
                    )}

                    {user.role === 'GM' && (
                        <button 
                            onClick={() => onNav('Menu Management')} 
                            className="w-full flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-slate-50 to-slate-100 hover:from-slate-100 hover:to-slate-200 transition-all group"
                        >
                            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                                <MenuIcon />
                            </div>
                            <div className="text-left">
                                <p className="font-medium text-slate-800">Kelola Menu</p>
                                <p className="text-xs text-slate-500">{totalMenus} menu aktif</p>
                            </div>
                        </button>
                    )}
                </div>
            </div>
        </div>

        {/* Recent Activity / Top Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Selling Items */}
            <div 
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
                style={{
                    opacity: animated ? 1 : 0,
                    transform: animated ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.7s'
                }}
            >
                <div className="flex items-center justify-between mb-5">
                    <h4 className="font-semibold text-slate-800 text-lg">🏆 Menu Terlaris</h4>
                    <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full">Minggu ini</span>
                </div>
                <div className="space-y-4">
                    {[
                        { name: 'Nasi Goreng Spesial', sales: 1240, trend: '+12%', img: 'https://images.unsplash.com/photo-1512058564366-185109023977?auto=format&fit=crop&q=60&w=100' },
                        { name: 'Americano', sales: 980, trend: '+8%', img: 'https://images.unsplash.com/photo-1507133750040-4a8f570215de?auto=format&fit=crop&q=60&w=100' },
                        { name: 'Kopi Gula Aren', sales: 875, trend: '+15%', img: 'https://images.unsplash.com/photo-1579888069124-4f4955b2d72b?auto=format&fit=crop&q=60&w=100' },
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                            <div className="relative">
                                <img src={item.img} alt={item.name} className="w-12 h-12 rounded-xl object-cover" />
                                <span className="absolute -top-1 -left-1 w-5 h-5 bg-gradient-to-br from-amber-400 to-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                    {idx + 1}
                                </span>
                            </div>
                            <div className="flex-1">
                                <p className="font-medium text-slate-800">{item.name}</p>
                                <p className="text-xs text-slate-500">{item.sales.toLocaleString()} terjual</p>
                            </div>
                            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">{item.trend}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Proposals */}
            <div 
                className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100"
                style={{
                    opacity: animated ? 1 : 0,
                    transform: animated ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) 0.8s'
                }}
            >
                <div className="flex items-center justify-between mb-5">
                    <h4 className="font-semibold text-slate-800 text-lg">📬 Proposal Terbaru</h4>
                    <button onClick={() => onNav('Menu Proposals')} className="text-sm text-purple-600 hover:text-purple-700 font-medium">
                        Lihat Semua →
                    </button>
                </div>
                <div className="space-y-4">
                    {proposals.slice(0, 3).map((proposal, idx) => {
                        const statusStyles: Record<ProposalStatus, string> = {
                            Pending: 'bg-amber-100 text-amber-700',
                            Approved: 'bg-emerald-100 text-emerald-700',
                            Rejected: 'bg-red-100 text-red-700',
                        };
                        return (
                            <div key={idx} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                                <img src={proposal.imageUrl} alt={proposal.menuName} className="w-12 h-12 rounded-xl object-cover" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-slate-800 truncate">{proposal.menuName}</p>
                                    <p className="text-xs text-slate-500">{proposal.proposer.name} • {proposal.proposer.region}</p>
                                </div>
                                <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg ${statusStyles[proposal.status]}`}>
                                    {proposal.status}
                                </span>
                            </div>
                        );
                    })}
                    {proposals.length === 0 && (
                        <div className="text-center py-8 text-slate-500">
                            <p>Belum ada proposal</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>
    );
};

const MenuManagementPage: FC<{ menus: Menu[], showToast: (msg: string) => void, onAddMenu: (data: MenuFormData) => void, onUpdateMenu: (id: number, data: MenuFormData) => void }> = ({ menus, showToast, onAddMenu, onUpdateMenu }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingMenu, setEditingMenu] = useState<Menu | null>(null);
    const [animated, setAnimated] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        const timer = setTimeout(() => setAnimated(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const categories = ['Semua', ...Array.from(new Set(menus.map(m => m.category)))];
    
    const filteredMenus = menus.filter(menu => {
        const matchesSearch = menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            menu.description.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategory === 'Semua' || menu.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    const openAddModal = () => {
        setEditingMenu(null);
        setIsModalOpen(true);
    };
    
    const openEditModal = (menu: Menu) => {
        setEditingMenu(menu);
        setIsModalOpen(true);
    };
    
    const handleSave = (data: MenuFormData) => {
        if (editingMenu) {
            onUpdateMenu(editingMenu.id, data);
            showToast("Menu berhasil diperbarui!");
        } else {
            onAddMenu(data);
            showToast("Menu baru berhasil ditambahkan!");
        }
        setIsModalOpen(false);
        setEditingMenu(null);
    };

    const MenuCard: FC<{ menu: Menu; index: number }> = ({ menu, index }) => {
        const categoryColors: Record<string, string> = {
            'Makanan': 'from-orange-500 to-red-500',
            'Minuman': 'from-blue-500 to-cyan-500',
            'Dessert': 'from-pink-500 to-rose-500',
            'Snack': 'from-amber-500 to-yellow-500',
        };
        const gradientClass = categoryColors[menu.category] || 'from-purple-500 to-blue-500';
        
        return (
            <div 
                className="group bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:border-purple-200 hover:-translate-y-1 transition-all duration-300"
                style={{
                    opacity: animated ? 1 : 0,
                    transform: animated ? 'translateY(0)' : 'translateY(30px)',
                    transition: `all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.08}s`
                }}
            >
                <div className="relative overflow-hidden">
                    <img 
                        src={menu.imageUrl} 
                        alt={menu.name} 
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className={`absolute top-3 left-3 px-3 py-1.5 bg-gradient-to-r ${gradientClass} text-white text-xs font-semibold rounded-full shadow-lg`}>
                        {menu.category}
                    </div>
                    <button 
                        onClick={() => openEditModal(menu)}
                        className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-white hover:scale-110 shadow-lg"
                    >
                        <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                    </button>
                </div>
                <div className="p-5">
                    <h4 className="font-bold text-slate-800 text-lg group-hover:text-purple-600 transition-colors">{menu.name}</h4>
                    <p className="text-sm text-slate-500 mt-2 line-clamp-2">{menu.description}</p>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                        <div className="flex flex-col">
                            <span className="text-xs text-slate-400">Harga</span>
                            <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">{formatCurrency(menu.price)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                            {menu.allowedStores.map((store, i) => (
                                <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">{store}</span>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };
    
    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header Banner */}
            <div 
                className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-3xl p-8 text-white"
                style={{
                    opacity: animated ? 1 : 0,
                    transform: animated ? 'translateY(0)' : 'translateY(-20px)',
                    transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
            >
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
                <div className="relative z-10">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div>
                            <h3 className="text-3xl font-bold flex items-center gap-3">
                                🍽️ Daftar Menu Nasional
                            </h3>
                            <p className="text-purple-100 mt-2">Kelola dan pantau semua menu yang tersedia di seluruh outlet</p>
                            <div className="flex items-center gap-4 mt-4">
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                                    <span className="text-2xl font-bold">{menus.length}</span>
                                    <span className="text-sm text-purple-100">Total Menu</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
                                    <span className="text-2xl font-bold">{categories.length - 1}</span>
                                    <span className="text-sm text-purple-100">Kategori</span>
                                </div>
                            </div>
                        </div>
                        <button 
                            onClick={openAddModal} 
                            className="px-6 py-3 text-sm font-semibold bg-white text-purple-600 rounded-xl hover:bg-purple-50 shadow-lg shadow-purple-900/30 transition-all hover:scale-105 flex items-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                            Tambah Menu Baru
                        </button>
                    </div>
                </div>
            </div>

            {/* Search & Filter Bar */}
            <div 
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4"
                style={{
                    opacity: animated ? 1 : 0,
                    transform: animated ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s'
                }}
            >
                <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
                    {/* Search Input */}
                    <div className="flex-1 relative">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Cari menu..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                    </div>
                    
                    {/* Category Filter */}
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat)}
                                className={`px-4 py-2.5 text-sm font-medium rounded-xl whitespace-nowrap transition-all ${
                                    selectedCategory === cat 
                                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25' 
                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-purple-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-purple-600' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Menu Grid/List */}
            {filteredMenus.length === 0 ? (
                <div 
                    className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100"
                    style={{
                        opacity: animated ? 1 : 0,
                        transition: 'all 0.5s ease-out 0.2s'
                    }}
                >
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <svg className="w-10 h-10 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800">Menu Tidak Ditemukan</h3>
                    <p className="text-slate-500 mt-2">Coba ubah filter atau kata kunci pencarian</p>
                </div>
            ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredMenus.map((menu, index) => (
                        <MenuCard key={menu.id} menu={menu} index={index} />
                    ))}
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredMenus.map((menu, index) => (
                        <div 
                            key={menu.id}
                            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 hover:shadow-lg hover:border-purple-200 transition-all duration-300 flex items-center gap-6"
                            style={{
                                opacity: animated ? 1 : 0,
                                transform: animated ? 'translateX(0)' : 'translateX(-20px)',
                                transition: `all 0.4s ease-out ${index * 0.05}s`
                            }}
                        >
                            <img src={menu.imageUrl} alt={menu.name} className="w-20 h-20 rounded-xl object-cover" />
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-3">
                                    <h4 className="font-bold text-slate-800">{menu.name}</h4>
                                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-medium">{menu.category}</span>
                                </div>
                                <p className="text-sm text-slate-500 mt-1 truncate">{menu.description}</p>
                            </div>
                            <div className="text-right">
                                <span className="font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">{formatCurrency(menu.price)}</span>
                            </div>
                            <button 
                                onClick={() => openEditModal(menu)}
                                className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-xl hover:bg-purple-100 transition-colors"
                            >
                                Edit
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingMenu ? 'Edit Menu' : 'Tambah Menu Baru'}>
                <MenuForm onSave={handleSave} onCancel={() => setIsModalOpen(false)} initialData={editingMenu} />
            </Modal>
        </div>
    );
};

const MenuProposalsPage: FC<{ user: User; proposals: Proposal[]; showToast: (msg: string) => void; onAddProposal: (data: MenuFormData) => void; onUpdateStatus: (id: number, status: ProposalStatus) => void; }> = ({ user, proposals, showToast, onAddProposal, onUpdateStatus }) => {
    const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
    const [isProposeModalOpen, setIsProposeModalOpen] = useState(false);
    const [animated, setAnimated] = useState(false);
    const [filterStatus, setFilterStatus] = useState<ProposalStatus | 'All'>('All');

    useEffect(() => {
        const timer = setTimeout(() => setAnimated(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const filteredProposals = (user.role === 'GM' ? proposals : proposals.filter(p => p.proposer.id === user.id))
        .filter(p => filterStatus === 'All' || p.status === filterStatus);

    const statusCounts = {
        All: proposals.length,
        Pending: proposals.filter(p => p.status === 'Pending').length,
        Approved: proposals.filter(p => p.status === 'Approved').length,
        Rejected: proposals.filter(p => p.status === 'Rejected').length,
    };

    const handlePropose = (data: MenuFormData) => {
        onAddProposal(data);
        setIsProposeModalOpen(false);
        showToast("Proposal berhasil dikirim!");
    };
    
    const handleStatusUpdate = (status: ProposalStatus) => {
        if (selectedProposal) {
            onUpdateStatus(selectedProposal.id, status);
            setSelectedProposal(null);
            showToast(`Proposal telah ${status === 'Approved' ? 'disetujui' : 'ditolak'}.`);
        }
    };

    const ProposalCard: FC<{ proposal: Proposal; onSelect: () => void; index: number }> = ({ proposal, onSelect, index }) => {
        const statusStyles = {
            Pending: 'bg-gradient-to-r from-amber-400 to-orange-400 text-white shadow-amber-500/30',
            Approved: 'bg-gradient-to-r from-emerald-400 to-green-500 text-white shadow-emerald-500/30',
            Rejected: 'bg-gradient-to-r from-red-400 to-rose-500 text-white shadow-red-500/30',
        };
        const statusIcons = {
            Pending: '⏳',
            Approved: '✅',
            Rejected: '❌',
        };
        return (
            <div 
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl hover:border-purple-200 hover:-translate-y-2 transition-all duration-300 group"
                style={{
                    opacity: animated ? 1 : 0,
                    transform: animated ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
                    transition: `all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.1}s`
                }}
            >
                <div className="relative overflow-hidden">
                    <img src={proposal.imageUrl} alt={proposal.menuName} className="w-full h-44 object-cover group-hover:scale-110 transition-transform duration-500"/>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <span className={`absolute top-3 right-3 px-3 py-1.5 text-xs font-semibold rounded-full shadow-lg ${statusStyles[proposal.status]} flex items-center gap-1.5`}>
                        <span>{statusIcons[proposal.status]}</span>
                        {proposal.status}
                    </span>
                    <div className="absolute bottom-3 left-3 right-3">
                        <h4 className="font-bold text-white text-lg drop-shadow-lg">{proposal.menuName}</h4>
                    </div>
                </div>
                <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                            {proposal.proposer.name.charAt(0)}
                        </div>
                        <div>
                            <p className="font-medium text-slate-800 text-sm">{proposal.proposer.name}</p>
                            <p className="text-xs text-slate-500 flex items-center gap-1">
                                <span>📍</span> {proposal.proposer.region}
                            </p>
                        </div>
                    </div>
                    <p className="text-sm text-slate-600 line-clamp-2">{proposal.description}</p>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                        <div>
                            <span className="text-xs text-slate-400">Harga</span>
                            <p className="font-bold text-lg bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">{formatCurrency(proposal.price)}</p>
                        </div>
                        <button 
                            onClick={onSelect} 
                            className="px-4 py-2 text-sm font-medium text-purple-600 bg-purple-50 rounded-xl hover:bg-purple-100 transition-all hover:scale-105"
                        >
                            Detail →
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header Banner */}
            <div 
                className="relative overflow-hidden bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 rounded-3xl p-8 text-white"
                style={{
                    opacity: animated ? 1 : 0,
                    transform: animated ? 'translateY(0)' : 'translateY(-20px)',
                    transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
            >
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-pink-500/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl" />
                
                <div className="relative z-10">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div>
                            <h3 className="text-3xl font-bold flex items-center gap-3">
                                📋 Proposal Menu
                            </h3>
                            <p className="text-purple-100 mt-2">
                                {user.role === 'GM' ? 'Review dan kelola proposal menu dari Region Manager' : 'Ajukan dan pantau proposal menu Anda'}
                            </p>
                            
                            {/* Stats Pills */}
                            <div className="flex flex-wrap items-center gap-3 mt-5">
                                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2">
                                    <span className="w-2 h-2 bg-amber-400 rounded-full animate-pulse" />
                                    <span className="text-sm">{statusCounts.Pending} Pending</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2">
                                    <span className="w-2 h-2 bg-emerald-400 rounded-full" />
                                    <span className="text-sm">{statusCounts.Approved} Disetujui</span>
                                </div>
                                <div className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2">
                                    <span className="w-2 h-2 bg-red-400 rounded-full" />
                                    <span className="text-sm">{statusCounts.Rejected} Ditolak</span>
                                </div>
                            </div>
                        </div>
                        
                        {user.role === 'RM' && (
                            <button 
                                onClick={() => setIsProposeModalOpen(true)} 
                                className="px-6 py-3 text-sm font-semibold bg-white text-purple-600 rounded-xl hover:bg-purple-50 shadow-lg shadow-purple-900/30 transition-all hover:scale-105 flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                                </svg>
                                Ajukan Menu Baru
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Filter Tabs */}
            <div 
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-2 flex flex-wrap gap-2"
                style={{
                    opacity: animated ? 1 : 0,
                    transform: animated ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s'
                }}
            >
                {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((status) => {
                    const colors = {
                        All: 'from-slate-500 to-slate-600',
                        Pending: 'from-amber-500 to-orange-500',
                        Approved: 'from-emerald-500 to-green-500',
                        Rejected: 'from-red-500 to-rose-500',
                    };
                    const labels = {
                        All: 'Semua',
                        Pending: 'Pending',
                        Approved: 'Disetujui',
                        Rejected: 'Ditolak',
                    };
                    return (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-5 py-2.5 text-sm font-medium rounded-xl transition-all flex items-center gap-2 ${
                                filterStatus === status
                                    ? `bg-gradient-to-r ${colors[status]} text-white shadow-lg`
                                    : 'text-slate-600 hover:bg-slate-100'
                            }`}
                        >
                            {labels[status]}
                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                                filterStatus === status ? 'bg-white/20' : 'bg-slate-200'
                            }`}>
                                {statusCounts[status]}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Proposals Grid */}
            {filteredProposals.length === 0 ? (
                <div 
                    className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100"
                    style={{
                        opacity: animated ? 1 : 0,
                        transition: 'all 0.5s ease-out 0.2s'
                    }}
                >
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <ProposalIcon />
                    </div>
                    <h3 className="text-xl font-semibold text-slate-800">Belum Ada Proposal</h3>
                    <p className="text-slate-500 mt-2 max-w-md mx-auto">
                        {user.role === 'RM' 
                            ? 'Mulai ajukan menu baru untuk ditampilkan di outlet Anda'
                            : 'Tidak ada proposal yang perlu direview saat ini'
                        }
                    </p>
                    {user.role === 'RM' && (
                        <button 
                            onClick={() => setIsProposeModalOpen(true)}
                            className="mt-6 px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/25 transition-all"
                        >
                            + Ajukan Menu Pertama
                        </button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProposals.map((p, index) => (
                        <ProposalCard key={p.id} proposal={p} onSelect={() => setSelectedProposal(p)} index={index} />
                    ))}
                </div>
            )}

            {/* Detail Modal */}
            <Modal isOpen={!!selectedProposal} onClose={() => setSelectedProposal(null)} title={`Proposal: ${selectedProposal?.menuName}`}>
                {selectedProposal && (
                    <div className="space-y-5">
                        <div className="relative rounded-2xl overflow-hidden">
                            <img src={selectedProposal.imageUrl} alt={selectedProposal.menuName} className="w-full h-52 object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                            <div className="absolute bottom-4 left-4 right-4">
                                <h3 className="text-2xl font-bold text-white drop-shadow-lg">{selectedProposal.menuName}</h3>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-4 border border-purple-100">
                                <p className="text-xs text-purple-600 uppercase font-medium flex items-center gap-1">
                                    <span>👤</span> Pengusul
                                </p>
                                <p className="font-semibold text-slate-800 mt-1">{selectedProposal.proposer.name}</p>
                            </div>
                            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border border-blue-100">
                                <p className="text-xs text-blue-600 uppercase font-medium flex items-center gap-1">
                                    <span>📍</span> Region
                                </p>
                                <p className="font-semibold text-slate-800 mt-1">{selectedProposal.proposer.region}</p>
                            </div>
                        </div>
                        
                        <div className="bg-slate-50 rounded-xl p-4">
                            <p className="text-xs text-slate-500 uppercase font-medium mb-2">📝 Deskripsi</p>
                            <p className="text-slate-700">{selectedProposal.description}</p>
                        </div>
                        
                        <div className="bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl p-5 text-white">
                            <p className="text-xs text-purple-100 uppercase font-medium mb-1">💰 Harga yang Diusulkan</p>
                            <p className="text-3xl font-bold">{formatCurrency(selectedProposal.price)}</p>
                        </div>
                        
                        <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                           <p className="text-xs text-amber-600 uppercase font-medium mb-2">💬 Catatan dari RM</p>
                           <p className="text-slate-700 italic">"{selectedProposal.rmNotes}"</p>
                        </div>
                        
                        {user.role === 'GM' && selectedProposal.status === 'Pending' && (
                            <div className="flex justify-end gap-3 pt-5 border-t border-slate-100">
                                <button 
                                    onClick={() => handleStatusUpdate('Rejected')} 
                                    className="px-6 py-3 text-sm font-medium text-red-600 bg-red-100 rounded-xl hover:bg-red-200 transition-all flex items-center gap-2"
                                >
                                    <span>❌</span> Tolak
                                </button>
                                <button 
                                    onClick={() => handleStatusUpdate('Approved')} 
                                    className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-emerald-500 to-green-500 rounded-xl hover:from-emerald-600 hover:to-green-600 shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2"
                                >
                                    <span>✅</span> Setujui
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
            
            <Modal isOpen={isProposeModalOpen} onClose={() => setIsProposeModalOpen(false)} title="Ajukan Menu Baru">
                <MenuForm onSave={handlePropose} onCancel={() => setIsProposeModalOpen(false)} isProposal={true} />
            </Modal>
        </div>
    );
};

const AnalyticsPage: FC<{ user: User }> = () => {
    const [mode, setMode] = useState<'Profit' | 'Trend'>('Profit');
    const [timeline, setTimeline] = useState<'Weekly' | 'Monthly' | 'Yearly'>('Monthly');
    const [trendType, setTrendType] = useState<'best' | 'worst'>('best');
    const [compare, setCompare] = useState(false);

    const profitData = MOCK_PROFIT_DATA[timeline];
    const trendData = MOCK_TREND_DATA[trendType];

    const FilterButton: FC<{ label: string; active: boolean; onClick: () => void; }> = ({ label, active, onClick }) => (
        <button
            onClick={onClick}
            className={`px-4 py-2 text-sm rounded-xl transition-all duration-200 font-medium ${active ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
        >
            {label}
        </button>
    );

    const ChartContainer: FC<PropsWithChildren<{ title: string; insight: string }>> = ({ title, insight, children }) => (
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex justify-between items-start mb-6">
              <div>
                  <h4 className="text-lg font-semibold text-slate-800">{title}</h4>
                  <p className="text-sm text-slate-500 mt-1">{insight}</p>
              </div>
              <button className="text-sm text-purple-600 hover:text-purple-700 font-medium">↓ Download</button>
          </div>
          <div className="h-64">{children}</div>
      </div>
    );

    const LineChart: FC<{ data: AnalyticsDataPoint[] }> = ({ data }) => {
        const [animated, setAnimated] = useState(false);
        
        useEffect(() => {
            const timer = setTimeout(() => setAnimated(true), 100);
            return () => clearTimeout(timer);
        }, [data]);

        if (!data || data.length === 0) return <div className="flex items-center justify-center h-full text-slate-500">No data</div>;
        const maxValue = Math.max(...data.map(d => d.value));
        const points = data.map((d, i) => `${(i / (data.length - 1)) * 100},${100 - (d.value / Math.max(maxValue, 1)) * 95}`).join(' ');
        
        // Calculate path length for animation
        const pathLength = 300;

        return (
            <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#9333ea" />
                        <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#9333ea" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#9333ea" stopOpacity="0" />
                    </linearGradient>
                </defs>
                {/* Area fill under the line */}
                <polygon 
                    fill="url(#areaGradient)" 
                    points={`0,100 ${points} 100,100`}
                    style={{
                        opacity: animated ? 1 : 0,
                        transition: 'opacity 1s ease-out 0.5s'
                    }}
                />
                {/* Animated line */}
                <polyline 
                    fill="none" 
                    stroke="url(#lineGradient)" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    points={points}
                    style={{
                        strokeDasharray: pathLength,
                        strokeDashoffset: animated ? 0 : pathLength,
                        transition: 'stroke-dashoffset 1.5s ease-out'
                    }}
                />
                {/* Animated dots */}
                {data.map((d, i) => (
                    <circle 
                        key={i} 
                        cx={`${(i / (data.length - 1)) * 100}`} 
                        cy={`${100 - (d.value / Math.max(maxValue, 1)) * 95}`} 
                        r={animated ? 3 : 0}
                        fill="#9333ea"
                        style={{
                            transition: `r 0.3s ease-out ${0.5 + i * 0.2}s`,
                        }}
                    >
                        <animate 
                            attributeName="r" 
                            values="0;4;3" 
                            dur="0.5s" 
                            begin={`${0.3 + i * 0.3}s`} 
                            fill="freeze"
                            calcMode="spline"
                            keySplines="0.4 0 0.2 1; 0.4 0 0.2 1"
                        />
                    </circle>
                ))}
                {/* Animated glow effect on dots */}
                {data.map((d, i) => (
                    <circle 
                        key={`glow-${i}`} 
                        cx={`${(i / (data.length - 1)) * 100}`} 
                        cy={`${100 - (d.value / Math.max(maxValue, 1)) * 95}`} 
                        r="6"
                        fill="#9333ea"
                        opacity="0"
                    >
                        <animate 
                            attributeName="opacity" 
                            values="0;0.4;0" 
                            dur="0.6s" 
                            begin={`${0.3 + i * 0.3}s`} 
                            fill="freeze"
                        />
                        <animate 
                            attributeName="r" 
                            values="3;8;6" 
                            dur="0.6s" 
                            begin={`${0.3 + i * 0.3}s`} 
                            fill="freeze"
                        />
                    </circle>
                ))}
            </svg>
        );
    };

    const BarChart: FC<{ data: TrendDataItem[] }> = ({ data }) => {
        const [animated, setAnimated] = useState(false);
        
        useEffect(() => {
            const timer = setTimeout(() => setAnimated(true), 100);
            return () => clearTimeout(timer);
        }, [data]);

        if (!data || data.length === 0) return <div className="flex items-center justify-center h-full text-slate-500">No data</div>;
        const maxValue = Math.max(...data.map(d => d.sales));
        return (
            <div className="w-full h-full flex items-end justify-around gap-4 px-4">
                {data.map((item, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center justify-end h-full">
                        <div
                            className="w-full bg-gradient-to-t from-purple-600 to-blue-500 rounded-t-xl hover:from-purple-700 hover:to-blue-600 relative overflow-hidden"
                            style={{ 
                                height: animated ? `${(item.sales / Math.max(maxValue, 1)) * 100}%` : '0%',
                                transition: `height 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.15}s`
                            }}
                            title={`${item.name}: ${item.sales}`}
                        >
                            {/* Shimmer effect */}
                            <div 
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                                style={{
                                    transform: animated ? 'translateX(200%)' : 'translateX(-100%)',
                                    transition: `transform 1s ease-out ${0.5 + index * 0.15}s`
                                }}
                            />
                        </div>
                        <span 
                            className="text-xs text-slate-500 mt-3 font-medium truncate max-w-full"
                            style={{
                                opacity: animated ? 1 : 0,
                                transform: animated ? 'translateY(0)' : 'translateY(10px)',
                                transition: `all 0.4s ease-out ${0.3 + index * 0.15}s`
                            }}
                        >
                            {item.name}
                        </span>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header Banner */}
            <div className="relative overflow-hidden bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-700 rounded-3xl p-8 text-white">
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-cyan-400/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
                
                <div className="relative z-10">
                    <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                        <div>
                            <h3 className="text-3xl font-bold flex items-center gap-3">
                                📊 Analytics Dashboard
                            </h3>
                            <p className="text-blue-100 mt-2">Pantau dan analisis performa bisnis secara real-time</p>
                        </div>
                        
                        {/* Quick Stats */}
                        <div className="flex items-center gap-4">
                            <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3 text-center">
                                <p className="text-2xl font-bold">+15.2%</p>
                                <p className="text-xs text-blue-100">vs Bulan Lalu</p>
                            </div>
                            <div className="bg-white/15 backdrop-blur-sm rounded-2xl px-5 py-3 text-center">
                                <p className="text-2xl font-bold">Rp 142M</p>
                                <p className="text-xs text-blue-100">Total Revenue</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Insight Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { icon: '📈', label: 'Pertumbuhan', value: '+12.5%', desc: 'Dari periode sebelumnya', color: 'from-emerald-500 to-green-500', bg: 'bg-emerald-50' },
                    { icon: '🎯', label: 'Target Tercapai', value: '87%', desc: 'Dari target bulanan', color: 'from-amber-500 to-orange-500', bg: 'bg-amber-50' },
                    { icon: '⭐', label: 'Rating Pelanggan', value: '4.8', desc: 'Rata-rata ulasan', color: 'from-purple-500 to-pink-500', bg: 'bg-purple-50' },
                ].map((item, idx) => (
                    <div key={idx} className={`${item.bg} rounded-2xl p-5 border border-white/50`}>
                        <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center text-2xl shadow-lg`}>
                                {item.icon}
                            </div>
                            <div>
                                <p className="text-sm text-slate-500">{item.label}</p>
                                <p className="text-2xl font-bold text-slate-800">{item.value}</p>
                                <p className="text-xs text-slate-400">{item.desc}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Filter Controls */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-500 mr-2">Mode:</span>
                    <FilterButton label="📊 Profit" active={mode === 'Profit'} onClick={() => setMode('Profit')} />
                    <FilterButton label="🔥 Trend" active={mode === 'Trend'} onClick={() => setMode('Trend')} />
                </div>
                
                {mode === 'Profit' && (
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-500 mr-2">Periode:</span>
                        <FilterButton label="Mingguan" active={timeline === 'Weekly'} onClick={() => setTimeline('Weekly')} />
                        <FilterButton label="Bulanan" active={timeline === 'Monthly'} onClick={() => setTimeline('Monthly')} />
                        <FilterButton label="Tahunan" active={timeline === 'Yearly'} onClick={() => setTimeline('Yearly')} />
                    </div>
                )}

                {mode === 'Trend' && (
                     <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-500 mr-2">Kategori:</span>
                        <FilterButton label="🏆 Terlaris" active={trendType === 'best'} onClick={() => setTrendType('best')} />
                        <FilterButton label="📉 Kurang Laris" active={trendType === 'worst'} onClick={() => setTrendType('worst')} />
                    </div>
                )}

                <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-2">
                    <span className="text-sm font-medium text-slate-600">🔄 Bandingkan</span>
                    <button onClick={() => setCompare(!compare)} className={`relative inline-flex items-center h-7 rounded-full w-12 transition-all duration-200 ${compare ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-slate-300'}`}>
                        <span className={`inline-block w-5 h-5 transform bg-white rounded-full shadow transition-transform duration-200 ${compare ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
            </div>

            {/* Charts */}
            <div className={`grid gap-6 ${compare ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                {mode === 'Profit' ? (
                    <>
                        <ChartContainer title={`📈 Trend Profit (${timeline === 'Weekly' ? 'Mingguan' : timeline === 'Monthly' ? 'Bulanan' : 'Tahunan'})`} insight="Profit naik 5.2% periode ini.">
                            <LineChart data={profitData} />
                        </ChartContainer>
                        {compare && (
                             <ChartContainer title={`📊 Perbandingan Periode Sebelumnya`} insight="Data periode perbandingan.">
                                <LineChart data={profitData.map(d => ({...d, value: d.value * (0.8 + Math.random() * 0.2)}))} />
                             </ChartContainer>
                        )}
                    </>
                ) : (
                    <>
                        <ChartContainer title={`${trendType === 'best' ? '🏆 Menu Terlaris' : '📉 Menu Kurang Laris'}`} insight={`${trendData[0].name} adalah yang teratas.`}>
                           <BarChart data={trendData} />
                        </ChartContainer>
                        {compare && (
                             <ChartContainer title={`🔄 Perbandingan Trend`} insight={`Membandingkan performa menu.`}>
                                <BarChart data={MOCK_TREND_DATA[trendType === 'best' ? 'worst' : 'best']} />
                             </ChartContainer>
                        )}
                    </>
                )}
            </div>
            
            {/* Additional Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h4 className="font-semibold text-slate-800 text-lg mb-4 flex items-center gap-2">
                        💡 Insight Cerdas
                    </h4>
                    <div className="space-y-3">
                        {[
                            { text: 'Menu "Nasi Goreng Spesial" naik 23% dibanding minggu lalu', type: 'success' },
                            { text: 'Puncak penjualan terjadi di jam 12:00 - 14:00', type: 'info' },
                            { text: 'Region Jakarta Selatan menunjukkan pertumbuhan tertinggi', type: 'success' },
                        ].map((insight, idx) => (
                            <div key={idx} className={`p-4 rounded-xl flex items-start gap-3 ${insight.type === 'success' ? 'bg-emerald-50' : 'bg-blue-50'}`}>
                                <span className="text-lg">{insight.type === 'success' ? '✅' : 'ℹ️'}</span>
                                <p className={`text-sm ${insight.type === 'success' ? 'text-emerald-700' : 'text-blue-700'}`}>{insight.text}</p>
                            </div>
                        ))}
                    </div>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                    <h4 className="font-semibold text-slate-800 text-lg mb-4 flex items-center gap-2">
                        🎯 Rekomendasi
                    </h4>
                    <div className="space-y-3">
                        {[
                            { text: 'Pertimbangkan promosi untuk menu dengan penjualan rendah', action: 'Lihat Menu' },
                            { text: 'Tambah stok bahan untuk menu terlaris menjelang weekend', action: 'Cek Stok' },
                            { text: 'Review harga kompetitor di area Jakarta Pusat', action: 'Analisis' },
                        ].map((rec, idx) => (
                            <div key={idx} className="p-4 rounded-xl bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-100 flex items-center justify-between gap-4">
                                <p className="text-sm text-slate-700">{rec.text}</p>
                                <button className="px-3 py-1.5 text-xs font-medium text-purple-600 bg-white rounded-lg hover:bg-purple-50 transition-colors whitespace-nowrap shadow-sm">
                                    {rec.action}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const SettingsPage: FC = () => {
    const [animated, setAnimated] = useState(false);
    const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'appearance' | 'security'>('profile');
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        sms: false,
        weekly: true,
    });
    const [darkMode, setDarkMode] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setAnimated(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const tabs = [
        { id: 'profile' as const, label: 'Profil', icon: '👤' },
        { id: 'notifications' as const, label: 'Notifikasi', icon: '🔔' },
        { id: 'appearance' as const, label: 'Tampilan', icon: '🎨' },
        { id: 'security' as const, label: 'Keamanan', icon: '🔒' },
    ];

    const ToggleSwitch: FC<{ enabled: boolean; onChange: () => void }> = ({ enabled, onChange }) => (
        <button 
            onClick={onChange}
            className={`relative inline-flex items-center h-7 rounded-full w-12 transition-all duration-200 ${enabled ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-slate-300'}`}
        >
            <span className={`inline-block w-5 h-5 transform bg-white rounded-full shadow transition-transform duration-200 ${enabled ? 'translate-x-6' : 'translate-x-1'}`} />
        </button>
    );

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header Banner */}
            <div 
                className="relative overflow-hidden bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 rounded-3xl p-8 text-white"
                style={{
                    opacity: animated ? 1 : 0,
                    transform: animated ? 'translateY(0)' : 'translateY(-20px)',
                    transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
            >
                <div className="absolute top-0 right-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-blue-500/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
                
                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-purple-500/30">
                        ⚙️
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold">Pengaturan</h3>
                        <p className="text-slate-300 mt-1">Kelola profil, notifikasi, dan preferensi aplikasi Anda</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Tabs */}
                <div 
                    className="bg-white rounded-2xl shadow-sm border border-slate-100 p-3 lg:col-span-1"
                    style={{
                        opacity: animated ? 1 : 0,
                        transform: animated ? 'translateX(0)' : 'translateX(-20px)',
                        transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.1s'
                    }}
                >
                    <div className="space-y-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                                    activeTab === tab.id
                                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25'
                                        : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                <span className="text-xl">{tab.icon}</span>
                                <span className="font-medium">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div 
                    className="lg:col-span-3 space-y-6"
                    style={{
                        opacity: animated ? 1 : 0,
                        transform: animated ? 'translateX(0)' : 'translateX(20px)',
                        transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s'
                    }}
                >
                    {activeTab === 'profile' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
                            <h4 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                👤 Informasi Profil
                            </h4>
                            
                            <div className="flex items-center gap-6 pb-6 border-b border-slate-100">
                                <div className="relative">
                                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg shadow-purple-500/30">
                                        JD
                                    </div>
                                    <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center text-purple-600 hover:bg-purple-50 transition-colors">
                                        📷
                                    </button>
                                </div>
                                <div>
                                    <h5 className="text-xl font-bold text-slate-800">John Doe</h5>
                                    <p className="text-slate-500">General Manager</p>
                                    <p className="text-sm text-purple-600 mt-1">john.doe@eatzchillz.com</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-2">Nama Lengkap</label>
                                    <input type="text" defaultValue="John Doe" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-2">Email</label>
                                    <input type="email" defaultValue="john.doe@eatzchillz.com" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-2">Nomor Telepon</label>
                                    <input type="tel" defaultValue="+62 812 3456 7890" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-600 mb-2">Role</label>
                                    <input type="text" defaultValue="General Manager" disabled className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-slate-500" />
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/25 transition-all">
                                    Simpan Perubahan
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'notifications' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
                            <h4 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                🔔 Pengaturan Notifikasi
                            </h4>

                            <div className="space-y-4">
                                {[
                                    { key: 'email' as const, title: 'Notifikasi Email', desc: 'Terima update dan laporan via email' },
                                    { key: 'push' as const, title: 'Push Notification', desc: 'Notifikasi langsung di browser Anda' },
                                    { key: 'sms' as const, title: 'SMS Alert', desc: 'Peringatan penting via SMS' },
                                    { key: 'weekly' as const, title: 'Laporan Mingguan', desc: 'Ringkasan performa setiap minggu' },
                                ].map((item) => (
                                    <div key={item.key} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
                                        <div>
                                            <p className="font-medium text-slate-800">{item.title}</p>
                                            <p className="text-sm text-slate-500">{item.desc}</p>
                                        </div>
                                        <ToggleSwitch 
                                            enabled={notifications[item.key]} 
                                            onChange={() => setNotifications(prev => ({ ...prev, [item.key]: !prev[item.key] }))} 
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'appearance' && (
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
                            <h4 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                🎨 Tampilan Aplikasi
                            </h4>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                    <div>
                                        <p className="font-medium text-slate-800">Mode Gelap</p>
                                        <p className="text-sm text-slate-500">Aktifkan tema gelap untuk tampilan malam</p>
                                    </div>
                                    <ToggleSwitch enabled={darkMode} onChange={() => setDarkMode(!darkMode)} />
                                </div>

                                <div>
                                    <p className="font-medium text-slate-800 mb-3">Warna Aksen</p>
                                    <div className="flex gap-3">
                                        {[
                                            { color: 'from-purple-600 to-blue-600', active: true },
                                            { color: 'from-emerald-500 to-teal-500', active: false },
                                            { color: 'from-orange-500 to-red-500', active: false },
                                            { color: 'from-pink-500 to-rose-500', active: false },
                                            { color: 'from-slate-700 to-slate-900', active: false },
                                        ].map((item, idx) => (
                                            <button 
                                                key={idx}
                                                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.color} shadow-lg transition-all hover:scale-110 ${item.active ? 'ring-4 ring-purple-300' : ''}`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <p className="font-medium text-slate-800 mb-3">Ukuran Font</p>
                                    <div className="flex gap-2">
                                        {['Kecil', 'Normal', 'Besar'].map((size, idx) => (
                                            <button
                                                key={idx}
                                                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                                                    idx === 1 
                                                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' 
                                                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                                }`}
                                            >
                                                {size}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'security' && (
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
                                <h4 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                    🔒 Keamanan Akun
                                </h4>

                                <div className="space-y-4">
                                    <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">✅</span>
                                            <div>
                                                <p className="font-medium text-emerald-700">Email Terverifikasi</p>
                                                <p className="text-sm text-emerald-600">john.doe@eatzchillz.com</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <span className="text-2xl">⚠️</span>
                                            <div>
                                                <p className="font-medium text-amber-700">Two-Factor Authentication</p>
                                                <p className="text-sm text-amber-600">Belum diaktifkan - Amankan akun Anda</p>
                                            </div>
                                        </div>
                                        <button className="px-4 py-2 text-sm font-medium text-amber-700 bg-amber-100 rounded-xl hover:bg-amber-200 transition-colors">
                                            Aktifkan
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-6">
                                <h4 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
                                    🔑 Ubah Password
                                </h4>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-2">Password Saat Ini</label>
                                        <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-2">Password Baru</label>
                                        <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-600 mb-2">Konfirmasi Password Baru</label>
                                        <input type="password" placeholder="••••••••" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all" />
                                    </div>
                                </div>

                                <div className="flex justify-end pt-2">
                                    <button className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl hover:from-purple-700 hover:to-blue-700 shadow-lg shadow-purple-500/25 transition-all">
                                        Update Password
                                    </button>
                                </div>
                            </div>

                            <div className="bg-red-50 rounded-2xl border border-red-200 p-6">
                                <h4 className="text-lg font-semibold text-red-700 flex items-center gap-2">
                                    ⚠️ Zona Berbahaya
                                </h4>
                                <p className="text-sm text-red-600 mt-2">Tindakan ini tidak dapat dibatalkan. Harap berhati-hati.</p>
                                <button className="mt-4 px-4 py-2 text-sm font-medium text-red-600 bg-white border border-red-300 rounded-xl hover:bg-red-100 transition-colors">
                                    Hapus Akun
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


// --- MAIN APP COMPONENT ---
const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authView, setAuthView] = useState<'login' | 'register'>('login');
  const [userRole, setUserRole] = useState<UserRole>('GM');
  const [currentPage, setCurrentPage] = useState<Page>('Dashboard');
  const [toast, setToast] = useState({ show: false, message: '' });
  
  const [menus, setMenus] = useState<Menu[]>(MENUS_DATA);
  const [proposals, setProposals] = useState<Proposal[]>(PROPOSALS_DATA);

  const currentUser = USERS[userRole];

    const handleLogin = (_email: string, _password: string, role: UserRole) => {
        setUserRole(role);
        setIsAuthenticated(true);
        setCurrentPage('Dashboard');
    };

    const handleRegister = (_name: string, _email: string, _password: string, role: UserRole) => {
        setUserRole(role);
        setIsAuthenticated(true);
        setCurrentPage('Dashboard');
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setAuthView('login');
    };

  const handleSwitchRole = () => {
    setUserRole(prev => (prev === 'GM' ? 'RM' : 'GM'));
    setCurrentPage('Dashboard');
  };
  
  const showToast = (message: string) => {
      setToast({ show: true, message });
  };
  
  const handleAddMenu = (data: MenuFormData) => {
      const newMenu: Menu = {
          id: Date.now(),
          name: data.name,
          category: data.category,
          price: data.price,
          description: data.description,
          imageUrl: data.imageUrl,
          allowedStores: data.allowedStores,
          allowedRegions: data.allowedRegions,
          hasServiceFee: data.hasServiceFee,
          taxRate: data.taxRate,
      };
      setMenus(prev => [...prev, newMenu]);
  };
  
  const handleUpdateMenu = (id: number, data: MenuFormData) => {
      setMenus(prev => prev.map(menu => menu.id === id ? {...menu, ...data, price: data.price } : menu));
  };
  
  const handleAddProposal = (data: MenuFormData) => {
      const newProposal: Proposal = {
          id: Date.now(),
          menuName: data.name,
          description: data.description,
          price: data.price,
          imageUrl: data.imageUrl,
          rmNotes: data.rmNotes || '',
          category: data.category,
          allowedStores: data.allowedStores,
          allowedRegions: data.allowedRegions,
          hasServiceFee: data.hasServiceFee,
          taxRate: data.taxRate,
          status: 'Pending',
          proposer: {
              id: currentUser.id,
              name: currentUser.name,
              region: currentUser.region || 'N/A',
          }
      };
      setProposals(prev => [newProposal, ...prev]);
  };
  
  const handleUpdateProposalStatus = (id: number, status: ProposalStatus) => {
      let approvedProposal: Proposal | undefined;
      setProposals(prev => prev.map(p => {
          if (p.id === id) {
              const updatedProposal = {...p, status};
              if (status === 'Approved') {
                  approvedProposal = updatedProposal;
              }
              return updatedProposal;
          }
          return p;
      }));
      
      // If a proposal was approved, add it to the main menu list
      if (approvedProposal) {
          const newMenu: Menu = {
              id: Date.now(),
              name: approvedProposal.menuName,
              category: approvedProposal.category,
              price: approvedProposal.price,
              description: approvedProposal.description,
              imageUrl: approvedProposal.imageUrl,
              allowedStores: approvedProposal.allowedStores,
              allowedRegions: approvedProposal.allowedRegions,
              hasServiceFee: approvedProposal.hasServiceFee,
              taxRate: approvedProposal.taxRate,
          };
          setMenus(prev => [...prev, newMenu]);
      }
  };

  // Update proposal data (used for RM editing pending proposals or GM pre-approval edits)
  const handleUpdateProposalData = (id: number, data: MenuFormData) => {
      setProposals(prev => prev.map(p => {
          if (p.id === id) {
              return {
                  ...p,
                  menuName: data.name,
                  description: data.description,
                  price: data.price,
                  imageUrl: data.imageUrl,
                  rmNotes: data.rmNotes || p.rmNotes,
                  category: data.category,
                  allowedStores: data.allowedStores,
                  allowedRegions: data.allowedRegions,
                  hasServiceFee: data.hasServiceFee,
                  taxRate: data.taxRate,
              };
          }
          return p;
      }));
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'Dashboard':
        return <DashboardPage user={currentUser} onNav={setCurrentPage} proposals={proposals} menus={menus} />;
      case 'Menu Management':
        return <MenuManagementPage menus={menus} showToast={showToast} onAddMenu={handleAddMenu} onUpdateMenu={handleUpdateMenu} />;
      case 'Menu Proposals':
                return <MenuProposalsPage user={currentUser} proposals={proposals} showToast={showToast} onAddProposal={handleAddProposal} onUpdateStatus={handleUpdateProposalStatus} />;
      case 'Analytics':
        return <AnalyticsPage user={currentUser} />;
      case 'Settings':
        return <SettingsPage />;
      default:
        return <DashboardPage user={currentUser} onNav={setCurrentPage} proposals={proposals} menus={menus} />;
    }
  };

    if (!isAuthenticated) {
        return authView === 'login' ? (
            <Login onSubmit={handleLogin} goToRegister={() => setAuthView('register')} />
        ) : (
            <Register onSubmit={handleRegister} goToLogin={() => setAuthView('login')} />
        );
    }

    return (
    <div className="h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 flex font-sans">
            <Sidebar userRole={userRole} currentPage={currentPage} setPage={setCurrentPage} onLogout={handleLogout} />
      <main className="flex-1 flex flex-col overflow-y-auto">
        <Header user={currentUser} page={currentPage} onSwitchRole={handleSwitchRole} />
        {renderPage()}
      </main>
      <Toast message={toast.message} show={toast.show} onDismiss={() => setToast({ show: false, message: '' })} />
    </div>
  );
};

export default App;