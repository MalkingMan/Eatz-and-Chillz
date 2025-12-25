

import React, { useState, useEffect, useMemo, FC, PropsWithChildren } from 'react';
import Login from './pages/Login';
import Register from './pages/Register';

// --- ICONS (Embedded SVGs for simplicity) ---
const DashboardIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>;
const MenuIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>;
const ProposalIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
const AnalyticsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18" /></svg>;
const TrendIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>;
const LogoutIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

// --- TYPESCRIPT TYPES ---
type UserRole = 'GM' | 'RM';
type Page = 'Dashboard' | 'Menu Management' | 'Menu Proposals' | 'Analytics' | 'Tren Makanan';
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
  gmComment?: string; // Komentar dari GM saat review
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
  GM: { id: 1, name: 'Muhammad Array', role: 'GM' },
  RM: { id: 2, name: 'Dzaky Putra', role: 'RM', region: 'Jakarta' },
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
    { id: 4, menuName: 'Es Teh Manis Jumbo', description: 'Teh manis dingin dalam ukuran jumbo 500ml.', price: 12000, imageUrl: 'https://images.unsplash.com/photo-1556679343-c7a3b4dc8789?auto=format&fit=crop&q=60&w=500', rmNotes: 'Cocok untuk pelanggan yang haus saat cuaca panas. Margin keuntungan tinggi.', status: 'Pending', category: 'Minuman', allowedStores: ['Dine-in', 'Express', 'Coffee Shop'], allowedRegions: ['Jakarta'], hasServiceFee: false, taxRate: 10, proposer: { id: 2, name: 'Benny Carter', region: 'Jakarta' } },
    { id: 5, menuName: 'Nasi Uduk Komplit', description: 'Nasi uduk dengan ayam goreng, telur, tempe, dan sambal.', price: 35000, imageUrl: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=60&w=500', rmNotes: 'Menu sarapan favorit di Jakarta. Permintaan tinggi di pagi hari.', status: 'Pending', category: 'Makanan', allowedStores: ['Dine-in', 'Express'], allowedRegions: ['Jakarta'], hasServiceFee: true, taxRate: 10, proposer: { id: 2, name: 'Benny Carter', region: 'Jakarta' } },
    { id: 6, menuName: 'Cappuccino Vanilla', description: 'Cappuccino dengan sirup vanilla premium.', price: 32000, imageUrl: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=60&w=500', rmNotes: 'Variasi menu kopi yang diminati pelanggan setia coffee shop.', status: 'Pending', category: 'Kopi', allowedStores: ['Coffee Shop', 'Dine-in'], allowedRegions: ['Bandung'], hasServiceFee: true, taxRate: 10, proposer: { id: 3, name: 'Citra Dewi', region: 'Bandung' } },
    { id: 7, menuName: 'Pisang Goreng Keju', description: 'Pisang goreng crispy dengan taburan keju parut.', price: 18000, imageUrl: 'https://images.unsplash.com/photo-1587241321921-91ced6d6320b?auto=format&fit=crop&q=60&w=500', rmNotes: 'Snack favorit untuk teman ngopi. Mudah dibuat dan cepat laku.', status: 'Pending', category: 'Snack', allowedStores: ['Snack Stall', 'Dine-in', 'Coffee Shop'], allowedRegions: ['All'], hasServiceFee: false, taxRate: 10, proposer: { id: 5, name: 'Eko Prasetyo', region: 'Surabaya' } },
    { id: 8, menuName: 'Jus Alpukat Spesial', description: 'Jus alpukat dengan susu coklat dan topping es krim.', price: 25000, imageUrl: 'https://images.unsplash.com/photo-1623428187969-5da2dcea5ebf?auto=format&fit=crop&q=60&w=500', rmNotes: 'Menu sehat dan menyegarkan. Potensi best seller di musim panas.', status: 'Pending', category: 'Minuman', allowedStores: ['Dine-in', 'Coffee Shop'], allowedRegions: ['Surabaya'], hasServiceFee: true, taxRate: 10, proposer: { id: 5, name: 'Eko Prasetyo', region: 'Surabaya' } },
    { id: 9, menuName: 'Mie Goreng Jawa', description: 'Mie goreng dengan bumbu khas Jawa, dilengkapi telur mata sapi.', price: 38000, imageUrl: 'https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=60&w=500', rmNotes: 'Menu khas yang sudah teruji di market Semarang. Repeat order tinggi.', status: 'Pending', category: 'Makanan', allowedStores: ['Dine-in', 'Express'], allowedRegions: ['Semarang'], hasServiceFee: true, taxRate: 10, proposer: { id: 6, name: 'Fitri Handayani', region: 'Semarang' } },
    { id: 10, menuName: 'Teh Tarik Susu', description: 'Teh susu khas dengan teknik tarik yang menghasilkan foam lembut.', price: 20000, imageUrl: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=60&w=500', rmNotes: 'Minuman signature yang bisa menjadi ciri khas outlet kita.', status: 'Pending', category: 'Minuman', allowedStores: ['Dine-in', 'Coffee Shop', 'Drink Stall'], allowedRegions: ['All'], hasServiceFee: false, taxRate: 10, proposer: { id: 7, name: 'Gilang Ramadhan', region: 'Medan' } },
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
  const gmNav = ['Dashboard', 'Menu Management', 'Menu Proposals', 'Analytics', 'Tren Makanan'];
  const rmNav = ['Dashboard', 'Menu Proposals', 'Analytics', 'Tren Makanan'];
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
        <NavLink name="Tren Makanan" icon={<TrendIcon />} />
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
    const [filterKategori, setFilterKategori] = useState('Semua');
    const [filterBentuk, setFilterBentuk] = useState('Semua');
    const [filterRegion, setFilterRegion] = useState('Semua');

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

    const hasActiveFilters = filterKategori !== 'Semua' || filterBentuk !== 'Semua' || filterRegion !== 'Semua';

    // Minimalist Stat Card
    const StatCard: FC<{ 
        title: string; 
        value: string; 
        change?: string; 
        changeType?: 'up' | 'down';
        icon: string;
    }> = ({ title, value, change, changeType, icon }) => (
        <div className="bg-white rounded-lg p-5 border border-slate-200 hover:border-purple-300 hover:shadow-sm transition-all">
            <div className="flex items-start justify-between mb-3">
                <span className="text-2xl">{icon}</span>
                {change && (
                    <span className={`text-xs font-medium px-2 py-0.5 rounded ${changeType === 'up' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                        {changeType === 'up' ? '↑' : '↓'} {change}
                    </span>
                )}
            </div>
            <p className="text-slate-500 text-sm mb-1">{title}</p>
            <p className="text-2xl font-bold text-slate-900">{value}</p>
        </div>
    );

    // Minimalist Filter Select
    const FilterSelect: FC<{
        label: string;
        value: string;
        options: string[];
        onChange: (value: string) => void;
    }> = ({ label, value, options, onChange }) => (
        <div className="flex-1 min-w-[150px]">
            <label className="block text-xs font-medium text-slate-500 mb-1.5">{label}</label>
            <select 
                value={value} 
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-purple-400 transition-colors"
            >
                {options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        </div>
    );
    
    return (
      <div className="p-4 lg:p-6 space-y-6 max-w-7xl mx-auto">
        {/* Minimalist Header */}
        <div className="bg-white rounded-lg p-6 border border-slate-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-slate-500 text-sm mb-1">
                        {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                    </p>
                    <h2 className="text-2xl font-bold text-slate-900">
                        {user.role === 'GM' ? 'Dashboard General Manager' : `Dashboard ${user.region}`}
                    </h2>
                    <p className="text-slate-600 mt-1">{user.name} • {user.role}</p>
                </div>
                <button 
                    onClick={() => onNav('Analytics')} 
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                >
                    Analytics
                </button>
            </div>
        </div>

        {/* Filters - GM Only */}
        {user.role === 'GM' && (
            <div className="bg-white rounded-lg p-5 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">Filter Data</h3>
                    {hasActiveFilters && (
                        <button
                            onClick={() => {
                                setFilterKategori('Semua');
                                setFilterBentuk('Semua');
                                setFilterRegion('Semua');
                            }}
                            className="text-xs text-red-600 hover:text-red-700 font-medium"
                        >
                            Reset Filter
                        </button>
                    )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FilterSelect
                        label="Kategori"
                        value={filterKategori}
                        options={['Semua', 'Makanan', 'Minuman', 'Dessert', 'Snack']}
                        onChange={setFilterKategori}
                    />
                    <FilterSelect
                        label="Bentuk Outlet"
                        value={filterBentuk}
                        options={['Semua', 'Dine-in', 'Coffee Shop', 'Express', 'Snack Stall', 'Drink Stall']}
                        onChange={setFilterBentuk}
                    />
                    <FilterSelect
                        label="Region"
                        value={filterRegion}
                        options={['Semua', 'Jakarta Selatan', 'Jakarta Pusat', 'Jakarta Utara', 'Jakarta Barat', 'Jakarta Timur', 'Bandung', 'Surabaya']}
                        onChange={setFilterRegion}
                    />
                </div>
            </div>
        )}

        {/* Stats Cards */}
        {user.role === 'GM' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
                title="Total Profit Bulan Ini" 
                value={formatCurrency(1200000000)} 
                change="5.2%" 
                changeType="up"
                icon="💰"
            />
            <StatCard 
                title="Proposal Pending" 
                value={String(pendingProposalsCount)}
                icon="📋"
            />
            <StatCard 
                title="Total Menu Aktif" 
                value={String(totalMenus)}
                icon="🍽️"
            />
            <StatCard 
                title="Menu Disetujui" 
                value={String(approvedCount)}
                icon="✅"
            />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
                title={`Profit ${user.region}`}
                value={formatCurrency(250000000)} 
                change="1.8%" 
                changeType="down"
                icon="💰"
            />
            <StatCard 
                title="Proposal Aktif" 
                value={String(rmProposalsCount)}
                icon="📝"
            />
            <StatCard 
                title="Terlaris Region" 
                value="Kopi Aren"
                icon="☕"
            />
            <StatCard 
                title="Total Transaksi" 
                value="2,847"
                change="12.5%" 
                changeType="up"
                icon="📊"
            />
          </div>
        )}

        {/* Quick Actions */}
        <div className="bg-white rounded-lg p-5 border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-4">Aksi Cepat</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {user.role === 'GM' && (
                    <button 
                        onClick={() => onNav('Menu Proposals')} 
                        className="flex items-center gap-3 p-4 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors text-left border border-amber-200"
                    >
                        <span className="text-2xl">📋</span>
                        <div>
                            <p className="font-medium text-slate-900">Review Proposal</p>
                            <p className="text-xs text-slate-500">{pendingProposalsCount} pending</p>
                        </div>
                    </button>
                )}
                {user.role === 'RM' && (
                    <button 
                        onClick={() => onNav('Menu Proposals')} 
                        className="flex items-center gap-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left border border-purple-200"
                    >
                        <span className="text-2xl">📝</span>
                        <div>
                            <p className="font-medium text-slate-900">Ajukan Menu</p>
                            <p className="text-xs text-slate-500">Propose menu baru</p>
                        </div>
                    </button>
                )}
                {user.role === 'GM' && (
                    <button 
                        onClick={() => onNav('Menu Management')} 
                        className="flex items-center gap-3 p-4 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-left border border-slate-200"
                    >
                        <span className="text-2xl">🍽️</span>
                        <div>
                            <p className="font-medium text-slate-900">Kelola Menu</p>
                            <p className="text-xs text-slate-500">{totalMenus} menu aktif</p>
                        </div>
                    </button>
                )}
                <button 
                    onClick={() => onNav('Analytics')} 
                    className="flex items-center gap-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left border border-blue-200"
                >
                    <span className="text-2xl">📊</span>
                    <div>
                        <p className="font-medium text-slate-900">Analytics</p>
                        <p className="text-xs text-slate-500">Lihat performa</p>
                    </div>
                </button>
            </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Menu */}
            <div className="bg-white rounded-lg p-5 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">Menu Terlaris</h3>
                    <span className="text-xs text-slate-500">Minggu ini</span>
                </div>
                <div className="space-y-3">
                    {[
                        { name: 'Nasi Goreng Spesial', sales: 1240, img: 'https://images.unsplash.com/photo-1512058564366-185109023977?auto=format&fit=crop&q=60&w=100' },
                        { name: 'Americano', sales: 980, img: 'https://images.unsplash.com/photo-1507133750040-4a8f570215de?auto=format&fit=crop&q=60&w=100' },
                        { name: 'Kopi Gula Aren', sales: 875, img: 'https://images.unsplash.com/photo-1579888069124-4f4955b2d72b?auto=format&fit=crop&q=60&w=100' },
                    ].map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                            <span className="text-sm font-bold text-slate-400 w-6">{idx + 1}</span>
                            <img src={item.img} alt={item.name} className="w-10 h-10 rounded-lg object-cover" />
                            <div className="flex-1">
                                <p className="font-medium text-slate-900 text-sm">{item.name}</p>
                                <p className="text-xs text-slate-500">{item.sales.toLocaleString()} terjual</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Recent Proposals */}
            <div className="bg-white rounded-lg p-5 border border-slate-200">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-slate-900">Proposal Terbaru</h3>
                    <button onClick={() => onNav('Menu Proposals')} className="text-xs text-purple-600 hover:text-purple-700 font-medium">
                        Lihat Semua
                    </button>
                </div>
                <div className="space-y-3">
                    {proposals.slice(0, 3).map((proposal, idx) => {
                        const statusStyles: Record<ProposalStatus, string> = {
                            Pending: 'bg-amber-100 text-amber-700',
                            Approved: 'bg-emerald-100 text-emerald-700',
                            Rejected: 'bg-red-100 text-red-700',
                        };
                        return (
                            <div key={idx} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                <img src={proposal.imageUrl} alt={proposal.menuName} className="w-10 h-10 rounded-lg object-cover" />
                                <div className="flex-1 min-w-0">
                                    <p className="font-medium text-slate-900 text-sm truncate">{proposal.menuName}</p>
                                    <p className="text-xs text-slate-500">{proposal.proposer.region}</p>
                                </div>
                                <span className={`text-xs font-medium px-2 py-1 rounded ${statusStyles[proposal.status]}`}>
                                    {proposal.status}
                                </span>
                            </div>
                        );
                    })}
                    {proposals.length === 0 && (
                        <div className="text-center py-8 text-slate-400 text-sm">
                            Belum ada proposal
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
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        const timer = setTimeout(() => setAnimated(true), 100);
        return () => clearTimeout(timer);
    }, []);
    
    const filteredMenus = menus.filter(menu => {
        const matchesSearch = menu.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            menu.description.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
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

            {/* Search & View Controls */}
            <div 
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4"
                style={{
                    opacity: animated ? 1 : 0,
                    transform: animated ? 'translateY(0)' : 'translateY(20px)',
                    transition: 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.15s'
                }}
            >
                <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
                    {/* Search Input */}
                    <div className="flex-1 relative">
                        <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input
                            type="text"
                            placeholder="Cari nama menu atau deskripsi..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Results Count */}
                    <div className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl">
                        <span className="text-sm text-slate-500">Menampilkan</span>
                        <span className="text-lg font-bold text-purple-600">{filteredMenus.length}</span>
                        <span className="text-sm text-slate-500">menu</span>
                    </div>

                    {/* View Toggle */}
                    <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-purple-600' : 'text-slate-500 hover:text-slate-700'}`}
                            title="Grid View"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                            </svg>
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-purple-600' : 'text-slate-500 hover:text-slate-700'}`}
                            title="List View"
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
                    <p className="text-slate-500 mt-2">Coba ubah kata kunci pencarian</p>
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

const MenuProposalsPage: FC<{ user: User; proposals: Proposal[]; showToast: (msg: string) => void; onAddProposal: (data: MenuFormData) => void; onUpdateStatus: (id: number, status: ProposalStatus, comment?: string) => void; }> = ({ user, proposals, showToast, onAddProposal, onUpdateStatus }) => {
    const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
    const [isProposeModalOpen, setIsProposeModalOpen] = useState(false);
    const [animated, setAnimated] = useState(false);
    const [filterStatus, setFilterStatus] = useState<ProposalStatus | 'All'>('All');
    const [gmComment, setGmComment] = useState('');

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
            onUpdateStatus(selectedProposal.id, status, gmComment);
            setSelectedProposal(null);
            setGmComment('');
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
                        
                        {selectedProposal.gmComment && (
                            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                                <p className="text-xs text-blue-600 uppercase font-medium mb-2">💼 Komentar GM</p>
                                <p className="text-slate-700 italic">"{selectedProposal.gmComment}"</p>
                            </div>
                        )}
                        
                        {user.role === 'GM' && selectedProposal.status === 'Pending' && (
                            <div className="space-y-4">
                                <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                                    <label className="block text-xs text-slate-600 uppercase font-medium mb-2">
                                        💬 Komentar Review (Opsional)
                                    </label>
                                    <textarea
                                        value={gmComment}
                                        onChange={(e) => setGmComment(e.target.value)}
                                        placeholder="Berikan komentar atau catatan untuk proposal ini..."
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all resize-none bg-white"
                                        rows={3}
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
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

const AnalyticsPage: FC<{ user: User }> = ({ user }) => {
    const [mode, setMode] = useState<'Profit' | 'Trend'>('Profit');
    const [timeline, setTimeline] = useState<'Weekly' | 'Monthly' | 'Yearly' | 'Custom'>('Monthly');
    const [trendType, setTrendType] = useState<'best' | 'worst'>('best');
    const [compare, setCompare] = useState(false);
    const [selectedMenu1, setSelectedMenu1] = useState('Nasi Goreng Spesial');
    const [selectedMenu2, setSelectedMenu2] = useState('Americano');
    const [timeRange, setTimeRange] = useState<'7days' | '30days' | '90days'>('30days');

    const [selectedRegion, setSelectedRegion] = useState<string>('Semua');
    const [selectedCabang, setSelectedCabang] = useState<string>('Semua');
    const [selectedOutlet, setSelectedOutlet] = useState<string>('Semua');

    const formatLocalDate = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const parseLocalDate = (value: string) => {
        const [y, m, d] = value.split('-').map(Number);
        return new Date(y, (m || 1) - 1, d || 1);
    };

    const addDays = (date: Date, days: number) => {
        const copy = new Date(date);
        copy.setDate(copy.getDate() + days);
        return copy;
    };

    const diffDaysInclusive = (start: string, end: string) => {
        const s = parseLocalDate(start);
        const e = parseLocalDate(end);
        const ms = e.getTime() - s.getTime();
        const days = Math.floor(ms / (1000 * 60 * 60 * 24)) + 1;
        return Math.max(1, days);
    };

    const today = new Date();
    const defaultStart = addDays(today, -29);
    const [profitStart1, setProfitStart1] = useState<string>(() => formatLocalDate(defaultStart));
    const [profitEnd1, setProfitEnd1] = useState<string>(() => formatLocalDate(today));
    const [profitStart2, setProfitStart2] = useState<string>(() => formatLocalDate(addDays(defaultStart, -30)));

    useEffect(() => {
        // jaga agar end >= start
        if (profitEnd1 < profitStart1) setProfitEnd1(profitStart1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [profitStart1]);

    const durationDays = diffDaysInclusive(profitStart1, profitEnd1);
    const profitEnd2 = formatLocalDate(addDays(parseLocalDate(profitStart2), durationDays - 1));

    useEffect(() => {
        // saat compare aktif, pastikan range 2 valid dan durasinya sama (end2 derived)
        if (!compare) return;
        // jika user memilih start2 setelah end1, tetap boleh; end2 akan dihitung
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [compare, profitStart2, durationDays]);

    const seededSeries = (seedText: string, count: number) => {
        let seed = 0;
        for (let i = 0; i < seedText.length; i++) seed = (seed * 31 + seedText.charCodeAt(i)) >>> 0;
        let state = seed || 123456789;
        const next = () => {
            state = (1664525 * state + 1013904223) >>> 0;
            return state / 0xffffffff;
        };
        return Array.from({ length: count }, () => next());
    };

    const buildCustomProfitData = (start: string, end: string, seed: string): AnalyticsDataPoint[] => {
        const days = diffDaysInclusive(start, end);
        const points = days <= 14 ? days : days <= 90 ? Math.min(12, Math.ceil(days / 7)) : Math.min(12, Math.ceil(days / 30));
        const labels = Array.from({ length: points }, (_, i) => `P${i + 1}`);
        const noise = seededSeries(`${seed}-${start}-${end}`, points);
        const base = 120;
        return labels.map((label, idx) => {
            const drift = (idx / Math.max(points - 1, 1)) * 0.18;
            const jitter = (noise[idx] - 0.5) * 0.22;
            const factor = Math.max(0.25, 0.78 + drift + jitter);
            return { label, value: Math.round(base * factor) };
        });
    };

    const profitData = timeline === 'Custom'
        ? buildCustomProfitData(profitStart1, profitEnd1, 'profit-range-1')
        : MOCK_PROFIT_DATA[timeline];

    const compareProfitData = timeline === 'Custom'
        ? buildCustomProfitData(profitStart2, profitEnd2, 'profit-range-2')
        : profitData.map((d, i) => ({ ...d, value: Math.round(d.value * (0.82 + seededSeries(`profit-prev-${timeline}`, profitData.length)[i] * 0.2)) }));
    const trendData = MOCK_TREND_DATA[trendType];

    // Data region dan cabang yang sesuai
    const regionCabangMap: Record<string, string[]> = {
        'Yogyakarta': ['Sleman', 'Bantul', 'Kulon Progo', 'Gunungkidul', 'Kota Yogyakarta'],
        'Jakarta': ['Jakarta Selatan', 'Jakarta Pusat', 'Jakarta Utara', 'Jakarta Barat', 'Jakarta Timur'],
        'Bandung': ['Bandung Utara', 'Bandung Selatan', 'Bandung Barat', 'Bandung Timur', 'Cimahi'],
        'Surabaya': ['Surabaya Pusat', 'Surabaya Utara', 'Surabaya Selatan', 'Surabaya Barat', 'Surabaya Timur'],
        'Semarang': ['Semarang Tengah', 'Semarang Utara', 'Semarang Selatan', 'Semarang Barat', 'Semarang Timur'],
        'Medan': ['Medan Kota', 'Medan Petisah', 'Medan Barat', 'Medan Timur', 'Medan Utara'],
        'Bali': ['Denpasar', 'Badung', 'Gianyar', 'Tabanan', 'Kuta'],
    };

    const availableCabang = selectedRegion !== 'Semua' && regionCabangMap[selectedRegion]
        ? regionCabangMap[selectedRegion]
        : [];

    // Reset cabang when region changes
    useEffect(() => {
        if (selectedRegion === 'Semua') {
            setSelectedCabang('Semua');
        } else if (availableCabang.length > 0 && selectedCabang !== 'Semua' && !availableCabang.includes(selectedCabang)) {
            setSelectedCabang('Semua');
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRegion]);

    const hasActiveFilters = selectedRegion !== 'Semua' || selectedCabang !== 'Semua' || selectedOutlet !== 'Semua';
    
    // Mock data untuk perbandingan menu
    const availableMenus = [
        'Nasi Goreng Spesial',
        'Americano',
        'Kopi Gula Aren',
        'French Fries',
        'Iced Lemon Tea',
        'Soto Betawi'
    ];
    
    // Generate mock data untuk perbandingan menu berdasarkan time range
    const generateMenuComparisonData = (menuName: string): AnalyticsDataPoint[] => {
        const dataPoints = timeRange === '7days' ? 7 : timeRange === '30days' ? 30 : 90;
        const baseValue = menuName.includes('Kopi') || menuName.includes('Americano') ? 120 : 180;
        const variance = menuName === selectedMenu1 ? 1.2 : 0.8;
        
        return Array.from({ length: dataPoints }, (_, i) => ({
            label: timeRange === '7days' ? `D${i + 1}` : timeRange === '30days' ? `${i + 1}` : `D${i + 1}`,
            value: Math.floor(baseValue * variance * (0.7 + Math.random() * 0.6))
        }));
    };
    
    const menu1Data = generateMenuComparisonData(selectedMenu1);
    const menu2Data = generateMenuComparisonData(selectedMenu2);

    const FilterButton: FC<{ label: string; active: boolean; onClick: () => void; }> = ({ label, active, onClick }) => (
        <button
            onClick={onClick}
            className={`px-4 py-2 text-sm rounded-xl transition-all duration-200 font-medium ${active ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
        >
            {label}
        </button>
    );

    const timelineLabel = timeline === 'Weekly' ? 'Mingguan' : timeline === 'Monthly' ? 'Bulanan' : timeline === 'Yearly' ? 'Tahunan' : 'Kisaran Waktu';

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

    const LineChart: FC<{ data: AnalyticsDataPoint[]; color?: string }> = ({ data, color = '#9333ea' }) => {
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
                    <linearGradient id={`lineGradient-${color}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor={color} />
                        <stop offset="100%" stopColor={color === '#9333ea' ? '#3b82f6' : '#f59e0b'} />
                    </linearGradient>
                    <linearGradient id={`areaGradient-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor={color} stopOpacity="0.3" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                </defs>
                {/* Area fill under the line */}
                <polygon 
                    fill={`url(#areaGradient-${color})`}
                    points={`0,100 ${points} 100,100`}
                    style={{
                        opacity: animated ? 1 : 0,
                        transition: 'opacity 1s ease-out 0.5s'
                    }}
                />
                {/* Animated line */}
                <polyline 
                    fill="none" 
                    stroke={`url(#lineGradient-${color})`}
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
                        fill={color}
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
                        fill={color}
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
    
    // Comparison Line Chart untuk 2 menu
    const ComparisonLineChart: FC<{ data1: AnalyticsDataPoint[]; data2: AnalyticsDataPoint[]; label1: string; label2: string }> = ({ data1, data2, label1, label2 }) => {
        const [animated, setAnimated] = useState(false);
        
        useEffect(() => {
            const timer = setTimeout(() => setAnimated(true), 100);
            return () => clearTimeout(timer);
        }, [data1, data2]);

        if (!data1 || !data2 || data1.length === 0 || data2.length === 0) {
            return <div className="flex items-center justify-center h-full text-slate-500">No data</div>;
        }
        
        const maxValue = Math.max(...data1.map(d => d.value), ...data2.map(d => d.value));
        const points1 = data1.map((d, i) => `${(i / (data1.length - 1)) * 100},${100 - (d.value / Math.max(maxValue, 1)) * 90}`).join(' ');
        const points2 = data2.map((d, i) => `${(i / (data2.length - 1)) * 100},${100 - (d.value / Math.max(maxValue, 1)) * 90}`).join(' ');
        
        const pathLength = 300;

        return (
            <div className="w-full h-full">
                <div className="flex justify-center gap-6 mb-3">
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                        <span className="text-xs font-medium text-slate-600">{label1}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                        <span className="text-xs font-medium text-slate-600">{label2}</span>
                    </div>
                </div>
                <svg viewBox="0 0 100 100" className="w-full h-[calc(100%-2rem)]" preserveAspectRatio="none">
                    <defs>
                        <linearGradient id="lineGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#9333ea" />
                            <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                        <linearGradient id="lineGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#ef4444" />
                        </linearGradient>
                        <linearGradient id="areaGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#9333ea" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#9333ea" stopOpacity="0" />
                        </linearGradient>
                        <linearGradient id="areaGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.2" />
                            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    
                    {/* Area Menu 1 */}
                    <polygon 
                        fill="url(#areaGradient1)" 
                        points={`0,100 ${points1} 100,100`}
                        style={{
                            opacity: animated ? 1 : 0,
                            transition: 'opacity 1s ease-out 0.5s'
                        }}
                    />
                    
                    {/* Area Menu 2 */}
                    <polygon 
                        fill="url(#areaGradient2)" 
                        points={`0,100 ${points2} 100,100`}
                        style={{
                            opacity: animated ? 1 : 0,
                            transition: 'opacity 1s ease-out 0.6s'
                        }}
                    />
                    
                    {/* Line Menu 1 */}
                    <polyline 
                        fill="none" 
                        stroke="url(#lineGradient1)" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        points={points1}
                        style={{
                            strokeDasharray: pathLength,
                            strokeDashoffset: animated ? 0 : pathLength,
                            transition: 'stroke-dashoffset 1.5s ease-out'
                        }}
                    />
                    
                    {/* Line Menu 2 */}
                    <polyline 
                        fill="none" 
                        stroke="url(#lineGradient2)" 
                        strokeWidth="2.5" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                        points={points2}
                        style={{
                            strokeDasharray: pathLength,
                            strokeDashoffset: animated ? 0 : pathLength,
                            transition: 'stroke-dashoffset 1.5s ease-out 0.3s'
                        }}
                    />
                    
                    {/* Dots Menu 1 */}
                    {data1.map((d, i) => (
                        <circle 
                            key={`m1-${i}`}
                            cx={`${(i / (data1.length - 1)) * 100}`} 
                            cy={`${100 - (d.value / Math.max(maxValue, 1)) * 90}`} 
                            r="3"
                            fill="#9333ea"
                            style={{
                                opacity: animated ? 1 : 0,
                                transition: `opacity 0.3s ease-out ${0.5 + i * 0.05}s`,
                            }}
                        />
                    ))}
                    
                    {/* Dots Menu 2 */}
                    {data2.map((d, i) => (
                        <circle 
                            key={`m2-${i}`}
                            cx={`${(i / (data2.length - 1)) * 100}`} 
                            cy={`${100 - (d.value / Math.max(maxValue, 1)) * 90}`} 
                            r="3"
                            fill="#f59e0b"
                            style={{
                                opacity: animated ? 1 : 0,
                                transition: `opacity 0.3s ease-out ${0.8 + i * 0.05}s`,
                            }}
                        />
                    ))}
                </svg>
            </div>
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
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-slate-500 mr-2">Periode:</span>
                            <FilterButton label="Mingguan" active={timeline === 'Weekly'} onClick={() => setTimeline('Weekly')} />
                            <FilterButton label="Bulanan" active={timeline === 'Monthly'} onClick={() => setTimeline('Monthly')} />
                            <FilterButton label="Tahunan" active={timeline === 'Yearly'} onClick={() => setTimeline('Yearly')} />
                            <FilterButton label="Kisaran" active={timeline === 'Custom'} onClick={() => setTimeline('Custom')} />
                        </div>

                        {timeline === 'Custom' && (
                            <div className="flex flex-wrap items-end gap-3">
                                <div>
                                    <label className="block text-[11px] font-medium text-slate-500 mb-1">Mulai</label>
                                    <input
                                        type="date"
                                        value={profitStart1}
                                        onChange={(e) => setProfitStart1(e.target.value)}
                                        className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-medium text-slate-500 mb-1">Selesai</label>
                                    <input
                                        type="date"
                                        value={profitEnd1}
                                        onChange={(e) => setProfitEnd1(e.target.value)}
                                        className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
                                    />
                                </div>

                                {compare && (
                                    <div className="flex flex-wrap items-end gap-3">
                                        <div className="h-10 w-px bg-slate-200 mx-1 hidden md:block" />
                                        <div>
                                            <label className="block text-[11px] font-medium text-slate-500 mb-1">Mulai (Bandingkan)</label>
                                            <input
                                                type="date"
                                                value={profitStart2}
                                                onChange={(e) => setProfitStart2(e.target.value)}
                                                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-[11px] font-medium text-slate-500 mb-1">Selesai (Auto)</label>
                                            <input
                                                type="date"
                                                value={profitEnd2}
                                                disabled
                                                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
                                            />
                                        </div>
                                        <div className="text-[11px] text-slate-500 pb-1">
                                            Durasi sama: <span className="font-medium text-slate-700">{durationDays} hari</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {mode === 'Trend' && !compare && (
                     <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-500 mr-2">Kategori:</span>
                        <FilterButton label="🏆 Terlaris" active={trendType === 'best'} onClick={() => setTrendType('best')} />
                        <FilterButton label="📉 Kurang Laris" active={trendType === 'worst'} onClick={() => setTrendType('worst')} />
                    </div>
                )}

                <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-2">
                    <span className="text-sm font-medium text-slate-600">🔄 Bandingkan Menu</span>
                    <button onClick={() => setCompare(!compare)} className={`relative inline-flex items-center h-7 rounded-full w-12 transition-all duration-200 ${compare ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-slate-300'}`}>
                        <span className={`inline-block w-5 h-5 transform bg-white rounded-full shadow transition-transform duration-200 ${compare ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                </div>
            </div>

            {/* Filter Menu (dipindahkan dari Menu Management) */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-slate-800 flex items-center gap-2">
                        <span>🔍</span> Filter Menu
                    </h4>
                    {hasActiveFilters && (
                        <button
                            onClick={() => {
                                setSelectedRegion('Semua');
                                setSelectedCabang('Semua');
                                setSelectedOutlet('Semua');
                            }}
                            className="text-xs text-red-600 hover:text-red-700 font-medium"
                        >
                            Reset Filter
                        </button>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">Region</label>
                        <select
                            value={selectedRegion}
                            onChange={(e) => setSelectedRegion(e.target.value)}
                            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-purple-400 transition-colors"
                        >
                            <option value="Semua">Semua Region</option>
                            <option value="Yogyakarta">Yogyakarta</option>
                            <option value="Jakarta">Jakarta</option>
                            <option value="Bandung">Bandung</option>
                            <option value="Surabaya">Surabaya</option>
                            <option value="Semarang">Semarang</option>
                            <option value="Medan">Medan</option>
                            <option value="Bali">Bali</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">Cabang</label>
                        <select
                            value={selectedCabang}
                            onChange={(e) => setSelectedCabang(e.target.value)}
                            disabled={selectedRegion === 'Semua'}
                            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-purple-400 transition-colors disabled:bg-slate-50 disabled:cursor-not-allowed"
                        >
                            <option value="Semua">Semua Cabang</option>
                            {availableCabang.map((cabang) => (
                                <option key={cabang} value={cabang}>{cabang}</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">Outlet</label>
                        <select
                            value={selectedOutlet}
                            onChange={(e) => setSelectedOutlet(e.target.value)}
                            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-purple-400 transition-colors"
                        >
                            <option value="Semua">Semua Outlet</option>
                            <option value="Dine-in">Dine-in</option>
                            <option value="Coffee Shop">Coffee Shop</option>
                            <option value="Express">Express</option>
                            <option value="Snack Stall">Snack Stall</option>
                            <option value="Drink Stall">Drink Stall</option>
                        </select>
                    </div>
                </div>

                {hasActiveFilters && (
                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-slate-500">Filter aktif:</span>
                        {selectedRegion !== 'Semua' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                                Region: {selectedRegion}
                                <button onClick={() => setSelectedRegion('Semua')} className="hover:text-red-600">×</button>
                            </span>
                        )}
                        {selectedCabang !== 'Semua' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                                Cabang: {selectedCabang}
                                <button onClick={() => setSelectedCabang('Semua')} className="hover:text-red-600">×</button>
                            </span>
                        )}
                        {selectedOutlet !== 'Semua' && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                                Outlet: {selectedOutlet}
                                <button onClick={() => setSelectedOutlet('Semua')} className="hover:text-red-600">×</button>
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Menu Comparison Controls - Tampil hanya saat mode Trend dan compare aktif */}
            {mode === 'Trend' && compare && (
                <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                    <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2">
                        <span>⚖️</span> Pengaturan Perbandingan Menu
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Pilih Menu 1 */}
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-2">Menu 1</label>
                            <select 
                                value={selectedMenu1}
                                onChange={(e) => setSelectedMenu1(e.target.value)}
                                className="w-full px-4 py-2.5 bg-purple-50 border-2 border-purple-200 rounded-xl text-sm font-medium text-purple-700 focus:outline-none focus:border-purple-400 transition-colors"
                            >
                                {availableMenus.map(menu => (
                                    <option key={menu} value={menu}>{menu}</option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Pilih Menu 2 */}
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-2">Menu 2</label>
                            <select 
                                value={selectedMenu2}
                                onChange={(e) => setSelectedMenu2(e.target.value)}
                                className="w-full px-4 py-2.5 bg-amber-50 border-2 border-amber-200 rounded-xl text-sm font-medium text-amber-700 focus:outline-none focus:border-amber-400 transition-colors"
                            >
                                {availableMenus.filter(m => m !== selectedMenu1).map(menu => (
                                    <option key={menu} value={menu}>{menu}</option>
                                ))}
                            </select>
                        </div>
                        
                        {/* Pilih Durasi Waktu */}
                        <div>
                            <label className="block text-xs font-medium text-slate-500 mb-2">Durasi Timeline</label>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => setTimeRange('7days')}
                                    className={`flex-1 px-3 py-2.5 text-xs rounded-xl font-medium transition-all ${timeRange === '7days' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                >
                                    7 Hari
                                </button>
                                <button 
                                    onClick={() => setTimeRange('30days')}
                                    className={`flex-1 px-3 py-2.5 text-xs rounded-xl font-medium transition-all ${timeRange === '30days' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                >
                                    30 Hari
                                </button>
                                <button 
                                    onClick={() => setTimeRange('90days')}
                                    className={`flex-1 px-3 py-2.5 text-xs rounded-xl font-medium transition-all ${timeRange === '90days' ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                                >
                                    90 Hari
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    {/* Info Perbandingan */}
                    <div className="mt-4 p-3 bg-blue-50 rounded-xl flex items-start gap-2">
                        <span className="text-blue-600">ℹ️</span>
                        <p className="text-xs text-blue-700">
                            Bandingkan performa penjualan 2 menu dalam periode yang sama. Data ditampilkan dalam satuan penjualan per hari.
                        </p>
                    </div>
                </div>
            )}

            {/* Charts */}
            <div className={`grid gap-6 ${compare && mode === 'Trend' ? 'grid-cols-1' : compare ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                {mode === 'Profit' ? (
                    <>
                        <ChartContainer title={`📈 Trend Profit (${timelineLabel})`} insight="Profit naik 5.2% periode ini.">
                            <LineChart data={profitData} />
                        </ChartContainer>
                        {compare && (
                             <ChartContainer title={`📊 Perbandingan Periode Sebelumnya`} insight="Data periode perbandingan.">
                                <LineChart data={compareProfitData} color="#f59e0b" />
                             </ChartContainer>
                        )}
                    </>
                ) : compare ? (
                    // Mode Perbandingan 2 Menu
                    <>
                        <ChartContainer 
                            title={`📊 Perbandingan: ${selectedMenu1} vs ${selectedMenu2}`} 
                            insight={`Periode ${timeRange === '7days' ? '7 hari' : timeRange === '30days' ? '30 hari' : '90 hari'} terakhir`}
                        >
                            <ComparisonLineChart 
                                data1={menu1Data} 
                                data2={menu2Data}
                                label1={selectedMenu1}
                                label2={selectedMenu2}
                            />
                        </ChartContainer>
                        
                        {/* Statistics Cards */}
                        <div className="grid grid-cols-2 gap-4">
                            {/* Stats Menu 1 */}
                            <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-5 border-2 border-purple-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-3 h-3 rounded-full bg-purple-600"></div>
                                    <h5 className="font-semibold text-slate-800">{selectedMenu1}</h5>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-slate-500">Total Penjualan</p>
                                        <p className="text-2xl font-bold text-purple-600">
                                            {menu1Data.reduce((sum, d) => sum + d.value, 0).toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Rata-rata per Hari</p>
                                        <p className="text-lg font-semibold text-slate-700">
                                            {Math.round(menu1Data.reduce((sum, d) => sum + d.value, 0) / menu1Data.length).toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Penjualan Tertinggi</p>
                                        <p className="text-lg font-semibold text-slate-700">
                                            {Math.max(...menu1Data.map(d => d.value)).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Stats Menu 2 */}
                            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border-2 border-amber-200">
                                <div className="flex items-center gap-2 mb-3">
                                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                    <h5 className="font-semibold text-slate-800">{selectedMenu2}</h5>
                                </div>
                                <div className="space-y-3">
                                    <div>
                                        <p className="text-xs text-slate-500">Total Penjualan</p>
                                        <p className="text-2xl font-bold text-amber-600">
                                            {menu2Data.reduce((sum, d) => sum + d.value, 0).toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Rata-rata per Hari</p>
                                        <p className="text-lg font-semibold text-slate-700">
                                            {Math.round(menu2Data.reduce((sum, d) => sum + d.value, 0) / menu2Data.length).toLocaleString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-slate-500">Penjualan Tertinggi</p>
                                        <p className="text-lg font-semibold text-slate-700">
                                            {Math.max(...menu2Data.map(d => d.value)).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Winner Card */}
                            <div className="col-span-2 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl p-5 text-white">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm opacity-90 mb-1">🏆 Menu Terbaik</p>
                                        <p className="text-2xl font-bold">
                                            {menu1Data.reduce((sum, d) => sum + d.value, 0) > menu2Data.reduce((sum, d) => sum + d.value, 0) 
                                                ? selectedMenu1 
                                                : selectedMenu2}
                                        </p>
                                        <p className="text-sm opacity-90 mt-1">
                                            Unggul {Math.abs(menu1Data.reduce((sum, d) => sum + d.value, 0) - menu2Data.reduce((sum, d) => sum + d.value, 0)).toLocaleString()} penjualan
                                        </p>
                                    </div>
                                    <div className="text-5xl">🎯</div>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    // Mode Trend biasa (tanpa perbandingan)
                    <>
                        <ChartContainer title={`${trendType === 'best' ? '🏆 Menu Terlaris' : '📉 Menu Kurang Laris'}`} insight={`${trendData[0].name} adalah yang teratas.`}>
                           <BarChart data={trendData} />
                        </ChartContainer>
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

const TrenMakananPage: FC = () => {
    const [animated, setAnimated] = useState(false);
    const [selectedKategori, setSelectedKategori] = useState<string>('Semua');
    const [selectedBentuk, setSelectedBentuk] = useState<string>('Semua');
    const [selectedRegion, setSelectedRegion] = useState<string>('Semua');
    const [periode, setPeriode] = useState<'Mingguan' | 'Bulanan' | 'Tahunan' | 'Custom'>('Bulanan');
    const [kategoriTren, setKategoriTren] = useState<'Laris' | 'Kurang Laris'>('Laris');
    const [showComparison, setShowComparison] = useState(false);
    const [compareMenu1, setCompareMenu1] = useState<string>('Kopi Gula Aren');
    const [compareMenu2, setCompareMenu2] = useState<string>('Nasi Goreng');

    const formatLocalDate = (date: Date) => {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    };

    const parseLocalDate = (value: string) => {
        const [y, m, d] = value.split('-').map(Number);
        return new Date(y, (m || 1) - 1, d || 1);
    };

    const addDays = (date: Date, days: number) => {
        const copy = new Date(date);
        copy.setDate(copy.getDate() + days);
        return copy;
    };

    const diffDaysInclusive = (start: string, end: string) => {
        const s = parseLocalDate(start);
        const e = parseLocalDate(end);
        const ms = e.getTime() - s.getTime();
        const days = Math.floor(ms / (1000 * 60 * 60 * 24)) + 1;
        return Math.max(1, days);
    };

    const today = new Date();
    const defaultStart = addDays(today, -29);
    const [trendStart1, setTrendStart1] = useState<string>(() => formatLocalDate(defaultStart));
    const [trendEnd1, setTrendEnd1] = useState<string>(() => formatLocalDate(today));
    const [trendStart2, setTrendStart2] = useState<string>(() => formatLocalDate(addDays(defaultStart, -30)));

    useEffect(() => {
        if (trendEnd1 < trendStart1) setTrendEnd1(trendStart1);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [trendStart1]);

    useEffect(() => {
        const timer = setTimeout(() => setAnimated(true), 100);
        return () => clearTimeout(timer);
    }, []);

    // Mock data tren makanan
    const trendingMenus = [
        { name: 'Kopi Gula Aren', sales: 850, category: 'Minuman', region: 'Jakarta' },
        { name: 'Nasi Goreng', sales: 720, category: 'Makanan', region: 'Bandung' },
        { name: 'Dzaky Putra', sales: 680, category: 'Makanan', region: 'Yogyakarta', highlighted: true },
        { name: 'Mie Ayam', sales: 620, category: 'Makanan', region: 'Surabaya' },
        { name: 'Coca Cola', sales: 590, category: 'Minuman', region: 'Jakarta' },
        { name: 'Lemon Tea', sales: 540, category: 'Minuman', region: 'Bali' },
    ];

    const maxSales = Math.max(...trendingMenus.map(m => m.sales), 1);

    const durationDays = diffDaysInclusive(trendStart1, trendEnd1);
    const trendEnd2 = formatLocalDate(addDays(parseLocalDate(trendStart2), durationDays - 1));

    useEffect(() => {
        // Pastikan GM membandingkan 2 menu berbeda
        if (compareMenu1 === compareMenu2) {
            const fallback = trendingMenus.find(m => m.name !== compareMenu1)?.name;
            if (fallback) setCompareMenu2(fallback);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [compareMenu1]);

    const getTimeLabels = (p: typeof periode, start?: string, end?: string) => {
        if (p === 'Mingguan') return Array.from({ length: 7 }, (_, i) => `H${i + 1}`);
        if (p === 'Bulanan') return Array.from({ length: 12 }, (_, i) => `B${i + 1}`);
        if (p === 'Tahunan') return ['T1', 'T2', 'T3', 'T4', 'T5'];

        // Custom: bikin titik berdasarkan durasi, supaya tetap ringkas dan mudah dibandingkan
        const days = start && end ? diffDaysInclusive(start, end) : 30;
        const points = days <= 14 ? days : days <= 90 ? Math.min(12, Math.ceil(days / 7)) : Math.min(12, Math.ceil(days / 30));
        return Array.from({ length: points }, (_, i) => `P${i + 1}`);
    };

    const seededSeries = (seedText: string, count: number) => {
        // Simple deterministic PRNG (LCG) supaya grafik stabil (tidak berubah-ubah tiap render)
        let seed = 0;
        for (let i = 0; i < seedText.length; i++) seed = (seed * 31 + seedText.charCodeAt(i)) >>> 0;
        let state = seed || 123456789;
        const next = () => {
            state = (1664525 * state + 1013904223) >>> 0;
            return state / 0xffffffff;
        };
        return Array.from({ length: count }, () => next());
    };

    const buildMenuTrend = (menuName: string, start?: string, end?: string) => {
        const base = trendingMenus.find(m => m.name === menuName)?.sales ?? 500;
        const labels = periode === 'Custom' ? getTimeLabels(periode, start, end) : getTimeLabels(periode);
        const noise = seededSeries(`${menuName}-${periode}-${kategoriTren}-${start ?? ''}-${end ?? ''}`, labels.length);
        // Buat trend sederhana: naik/turun sedikit + noise
        return labels.map((label, idx) => {
            const drift = (idx / Math.max(labels.length - 1, 1)) * 0.18; // 0..18%
            const jitter = (noise[idx] - 0.5) * 0.22; // -11%..+11%
            const factor = Math.max(0.25, 0.78 + drift + jitter);
            return { label, value: Math.round(base * factor) };
        });
    };

    const MiniBarChart: FC<{ title: string; data: { label: string; value: number }[] }> = ({ title, data }) => {
        const maxValue = Math.max(...data.map(d => d.value), 1);
        return (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                <h5 className="font-semibold text-slate-800 mb-4">{title}</h5>
                <div className="bg-slate-100 rounded-2xl p-4">
                    <div className="relative flex items-end justify-between gap-2 h-56">
                        <div className="absolute left-0 right-0 bottom-0 h-px bg-slate-300" />
                        {data.map((d, i) => (
                            <div key={d.label} className="relative flex-1 h-full">
                                <div
                                    className="absolute left-0 right-0 text-[11px] font-medium text-slate-500 text-center"
                                    style={{
                                        bottom: `${(d.value / maxValue) * 100}%`,
                                        transform: 'translateY(-6px)'
                                    }}
                                >
                                    {d.value}
                                </div>
                                <div className="absolute inset-x-0 bottom-0 h-full">
                                    <div
                                        className="absolute inset-x-0 bottom-0 bg-slate-300 rounded-sm"
                                        style={{
                                            height: animated ? `${(d.value / maxValue) * 100}%` : '0%',
                                            transition: `height 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) ${i * 0.06}s`
                                        }}
                                    />
                                </div>
                                <div className="absolute left-0 right-0 -bottom-6 text-[11px] text-slate-500 text-center">
                                    {d.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    };

    const FilterButton: FC<{ label: string; active: boolean; onClick: () => void; }> = ({ label, active, onClick }) => (
        <button
            onClick={onClick}
            className={`px-4 py-2 text-sm rounded-xl transition-all duration-200 font-medium ${active ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg shadow-purple-500/25' : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'}`}
        >
            {label}
        </button>
    );

    return (
        <div className="p-6 lg:p-8 space-y-6">
            {/* Header Banner */}
            <div 
                className="relative overflow-hidden bg-gradient-to-br from-orange-500 via-red-500 to-pink-600 rounded-3xl p-8 text-white"
                style={{
                    opacity: animated ? 1 : 0,
                    transform: animated ? 'translateY(0)' : 'translateY(-20px)',
                    transition: 'all 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
                }}
            >
                <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-yellow-400/30 rounded-full blur-3xl translate-y-1/2 -translate-x-1/3" />
                
                <div className="relative z-10 flex items-center gap-6">
                    <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center text-3xl shadow-lg shadow-orange-500/30">
                        🔥
                    </div>
                    <div>
                        <h3 className="text-3xl font-bold">Tren Makanan</h3>
                        <p className="text-orange-100 mt-1">Pantau menu terlaris dan tren penjualan di seluruh outlet</p>
                    </div>
                </div>
            </div>

            {/* Filter Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                <h4 className="font-semibold text-slate-800 flex items-center gap-2 mb-4">
                    <span>🔍</span> Filter
                </h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Filter Kategori */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">Kategori</label>
                        <select
                            value={selectedKategori}
                            onChange={(e) => setSelectedKategori(e.target.value)}
                            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-purple-400 transition-colors"
                        >
                            <option value="Semua">Semua Kategori</option>
                            <option value="Makanan">Makanan</option>
                            <option value="Minuman">Minuman</option>
                            <option value="Dessert">Dessert</option>
                            <option value="Snack">Snack</option>
                        </select>
                    </div>

                    {/* Filter Bentuk */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">Bentuk</label>
                        <select
                            value={selectedBentuk}
                            onChange={(e) => setSelectedBentuk(e.target.value)}
                            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-purple-400 transition-colors"
                        >
                            <option value="Semua">Semua Bentuk</option>
                            <option value="Dine-in">Dine-in</option>
                            <option value="Coffee Shop">Coffee Shop</option>
                            <option value="Express">Express</option>
                        </select>
                    </div>

                    {/* Filter Region */}
                    <div>
                        <label className="block text-xs font-medium text-slate-500 mb-2">Region</label>
                        <select
                            value={selectedRegion}
                            onChange={(e) => setSelectedRegion(e.target.value)}
                            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:border-purple-400 transition-colors"
                        >
                            <option value="Semua">Semua Region</option>
                            <option value="Jakarta">Jakarta</option>
                            <option value="Bandung">Bandung</option>
                            <option value="Yogyakarta">Yogyakarta</option>
                            <option value="Surabaya">Surabaya</option>
                            <option value="Bali">Bali</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Period and Category Controls */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    {/* Period Selector */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-500 mr-2">Periode :</span>
                        <FilterButton label="Mingguan" active={periode === 'Mingguan'} onClick={() => setPeriode('Mingguan')} />
                        <FilterButton label="Bulanan" active={periode === 'Bulanan'} onClick={() => setPeriode('Bulanan')} />
                        <FilterButton label="Tahunan" active={periode === 'Tahunan'} onClick={() => setPeriode('Tahunan')} />
                        <FilterButton label="Kisaran" active={periode === 'Custom'} onClick={() => setPeriode('Custom')} />
                    </div>

                    {/* Kategori Selector */}
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-500 mr-2">Kategori :</span>
                        <FilterButton label="Laris" active={kategoriTren === 'Laris'} onClick={() => setKategoriTren('Laris')} />
                        <FilterButton label="Kurang Laris" active={kategoriTren === 'Kurang Laris'} onClick={() => setKategoriTren('Kurang Laris')} />
                    </div>

                    {/* Comparison Toggle */}
                    <div className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-2">
                        <span className="text-sm font-medium text-slate-600">Bandingkan</span>
                        <button onClick={() => setShowComparison(!showComparison)} className={`relative inline-flex items-center h-7 rounded-full w-12 transition-all duration-200 ${showComparison ? 'bg-gradient-to-r from-purple-600 to-blue-600' : 'bg-slate-300'}`}>
                            <span className={`inline-block w-5 h-5 transform bg-white rounded-full shadow transition-transform duration-200 ${showComparison ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>
                </div>

                {periode === 'Custom' && (
                    <div className="mt-4 flex flex-wrap items-end gap-3">
                        <div>
                            <label className="block text-[11px] font-medium text-slate-500 mb-1">Mulai</label>
                            <input
                                type="date"
                                value={trendStart1}
                                onChange={(e) => setTrendStart1(e.target.value)}
                                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-medium text-slate-500 mb-1">Selesai</label>
                            <input
                                type="date"
                                value={trendEnd1}
                                onChange={(e) => setTrendEnd1(e.target.value)}
                                className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
                            />
                        </div>

                        {showComparison && (
                            <div className="flex flex-wrap items-end gap-3">
                                <div className="h-10 w-px bg-slate-200 mx-1 hidden md:block" />
                                <div>
                                    <label className="block text-[11px] font-medium text-slate-500 mb-1">Mulai (Bandingkan)</label>
                                    <input
                                        type="date"
                                        value={trendStart2}
                                        onChange={(e) => setTrendStart2(e.target.value)}
                                        className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-medium text-slate-500 mb-1">Selesai (Auto)</label>
                                    <input
                                        type="date"
                                        value={trendEnd2}
                                        disabled
                                        className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 cursor-not-allowed"
                                    />
                                </div>
                                <div className="text-[11px] text-slate-500 pb-1">
                                    Durasi sama: <span className="font-medium text-slate-700">{durationDays} hari</span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Menu Terlaris Section - Bar Chart */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
                <h4 className="text-xl font-bold text-slate-800 mb-8 text-center">{kategoriTren === 'Laris' ? 'Menu Terlaris' : 'Menu Kurang Laris'}</h4>

                {!showComparison ? (
                    <div className="bg-slate-100 rounded-2xl p-6">
                        <div className="relative flex items-end justify-between gap-6 h-64">
                            {/* baseline */}
                            <div className="absolute left-0 right-0 bottom-0 h-px bg-slate-300" />

                            {trendingMenus.map((menu, index) => {
                                const heightPercentage = (menu.sales / maxSales) * 100;
                                const barHeight = animated ? `${heightPercentage}%` : '0%';

                                return (
                                    <div
                                        key={index}
                                        className="relative flex-1 h-full"
                                        style={{
                                            opacity: animated ? 1 : 0,
                                            transform: animated ? 'translateY(0)' : 'translateY(12px)',
                                            transition: `all 0.45s ease-out ${index * 0.08}s`
                                        }}
                                    >
                                        <div
                                            className="absolute left-0 right-0 text-sm font-semibold text-slate-800"
                                            style={{
                                                bottom: `${heightPercentage}%`,
                                                transform: 'translateY(-10px)'
                                            }}
                                        >
                                            {menu.name}
                                        </div>

                                        <div className="absolute inset-x-0 bottom-0 h-full" title={`${menu.name}: ${menu.sales}`}>
                                            <div
                                                className="absolute inset-x-0 bottom-0 bg-slate-300 rounded-sm"
                                                style={{
                                                    height: barHeight,
                                                    transition: `height 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 0.08}s`
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-slate-50 rounded-2xl px-4 py-3 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-slate-600">Menu 1:</span>
                                <select
                                    value={compareMenu1}
                                    onChange={(e) => setCompareMenu1(e.target.value)}
                                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
                                >
                                    {trendingMenus.map(m => (
                                        <option key={m.name} value={m.name}>{m.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-slate-600">Menu 2:</span>
                                <select
                                    value={compareMenu2}
                                    onChange={(e) => setCompareMenu2(e.target.value)}
                                    className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-sm"
                                >
                                    {trendingMenus.filter(m => m.name !== compareMenu1).map(m => (
                                        <option key={m.name} value={m.name}>{m.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="text-xs text-slate-500">
                                Timeline sama: <span className="font-medium text-slate-700">{periode}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <MiniBarChart
                                title={`Grafik Tren (${periode === 'Custom' ? 'Kisaran' : periode}) - ${compareMenu1}`}
                                data={periode === 'Custom' ? buildMenuTrend(compareMenu1, trendStart1, trendEnd1) : buildMenuTrend(compareMenu1)}
                            />
                            <MiniBarChart
                                title={`Grafik Tren (${periode === 'Custom' ? 'Kisaran' : periode}) - ${compareMenu2}`}
                                data={periode === 'Custom' ? buildMenuTrend(compareMenu2, trendStart2, trendEnd2) : buildMenuTrend(compareMenu2)}
                            />
                        </div>
                    </div>
                )}
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
  
  const handleUpdateProposalStatus = (id: number, status: ProposalStatus, comment?: string) => {
      let approvedProposal: Proposal | undefined;
      setProposals(prev => prev.map(p => {
          if (p.id === id) {
              const updatedProposal = {...p, status, gmComment: comment || p.gmComment};
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
      case 'Tren Makanan':
        return <TrenMakananPage />;
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