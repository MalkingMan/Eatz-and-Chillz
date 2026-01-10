import React, { useState, useEffect, useMemo, useRef } from 'react';
import { MenuItemStatus } from '../types';
import { Button } from '../components/ui/Button';
import { Plus, Edit2, ChevronDown, X, Check, Image, Trash2, Camera, Upload } from 'lucide-react';

// Initial Data - Expanded to 30 Items
export const INITIAL_MENU = [
    { id: '1', name: 'Nasi Goreng Spesial', region: 'Jakarta Selatan', price: 35000, sales: 450, status: MenuItemStatus.ACTIVE, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&q=80&w=800', category: 'Makanan', forms: ['Dine-in', 'Express'] },
    { id: '2', name: 'Sate Ayam Madura', region: 'Jakarta Pusat', price: 40000, sales: 420, status: MenuItemStatus.ACTIVE, image: 'https://images.unsplash.com/photo-1631515243349-e0603690b6b8?auto=format&fit=crop&q=80&w=800', category: 'Makanan', forms: ['Dine-in'] },
    { id: '3', name: 'Rendang Sapi', region: 'Jakarta Barat', price: 55000, sales: 380, status: MenuItemStatus.ACTIVE, image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=800', category: 'Makanan', forms: ['Dine-in'] },
    { id: '4', name: 'Soto Betawi', region: 'Jakarta Selatan', price: 45000, sales: 360, status: MenuItemStatus.ACTIVE, image: 'https://images.unsplash.com/photo-1572656631137-7935297eff55?auto=format&fit=crop&q=80&w=800', category: 'Makanan', forms: ['Dine-in'] },
    { id: '5', name: 'Ayam Geprek', region: 'Bali', price: 30000, sales: 350, status: MenuItemStatus.ACTIVE, image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=800', category: 'Makanan', forms: ['Express'] },
    { id: '6', name: 'Mie Goreng Jawa', region: 'Surabaya', price: 28000, sales: 330, status: MenuItemStatus.DRAFT, image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&q=80&w=800', category: 'Makanan', forms: ['Dine-in', 'Express'] },
    { id: '7', name: 'Batagor Riri', region: 'Bandung', price: 25000, sales: 310, status: MenuItemStatus.ACTIVE, image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=800', category: 'Snack', forms: ['Snack Stall'] },
    { id: '8', name: 'Siomay Bandung', region: 'Bandung', price: 25000, sales: 300, status: MenuItemStatus.ACTIVE, image: 'https://images.unsplash.com/photo-1594969248232-2d1746274026?auto=format&fit=crop&q=80&w=800', category: 'Snack', forms: ['Snack Stall'] },
    { id: '9', name: 'Gado-Gado Jakarta', region: 'Jakarta Selatan', price: 32000, sales: 290, status: MenuItemStatus.ACTIVE, image: 'https://images.unsplash.com/photo-1625937759420-26d7e6344283?auto=format&fit=crop&q=80&w=800', category: 'Makanan', forms: ['Dine-in'] },
    { id: '10', name: 'Ketoprak Ciragil', region: 'Jakarta Barat', price: 28000, sales: 280, status: MenuItemStatus.ACTIVE, image: 'https://images.unsplash.com/photo-1559404229-3d601369f442?auto=format&fit=crop&q=80&w=800', category: 'Makanan', forms: ['Dine-in', 'Express'] },
    { id: '11', name: 'Kerak Telor', region: 'Jakarta Utara', price: 30000, sales: 150, status: MenuItemStatus.DRAFT, image: 'https://images.unsplash.com/photo-1504567961542-e24d9439a724?auto=format&fit=crop&q=80&w=800', category: 'Snack', forms: ['Snack Stall'] },
    { id: '12', name: 'Bebek Bengil', region: 'Bali', price: 95000, sales: 270, status: MenuItemStatus.ACTIVE, image: 'https://images.unsplash.com/photo-1596783060634-8c85743b1297?auto=format&fit=crop&q=80&w=800', category: 'Makanan', forms: ['Dine-in'] },
    { id: '13', name: 'Sate Lilit', region: 'Bali', price: 45000, sales: 260, status: MenuItemStatus.ACTIVE, image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?auto=format&fit=crop&q=80&w=800', category: 'Makanan', forms: ['Dine-in'] },
    { id: '14', name: 'Rawon Setan', region: 'Surabaya', price: 42000, sales: 340, status: MenuItemStatus.ACTIVE, image: 'https://images.unsplash.com/photo-1594969248232-2d1746274026?auto=format&fit=crop&q=80&w=800', category: 'Makanan', forms: ['Dine-in'] },
    { id: '15', name: 'Rujak Cingur', region: 'Surabaya', price: 35000, sales: 220, status: MenuItemStatus.DRAFT, image: 'https://images.unsplash.com/photo-1626804475297-411fcc069919?auto=format&fit=crop&q=80&w=800', category: 'Makanan', forms: ['Dine-in'] },
    { id: '16', name: 'Soto Medan', region: 'Medan', price: 38000, sales: 240, status: MenuItemStatus.ACTIVE, image: 'https://images.unsplash.com/photo-1572656631137-7935297eff55?auto=format&fit=crop&q=80&w=800', category: 'Makanan', forms: ['Dine-in'] },
    { id: '17', name: 'Mie Gomak', region: 'Medan', price: 30000, sales: 210, status: MenuItemStatus.ACTIVE, image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&q=80&w=800', category: 'Makanan', forms: ['Dine-in'] },
    { id: '18', name: 'Bika Ambon', region: 'Medan', price: 65000, sales: 200, status: MenuItemStatus.ACTIVE, image: 'https://images.unsplash.com/photo-1601039641847-7857b994d704?auto=format&fit=crop&q=80&w=800', category: 'Snack', forms: ['Snack Stall'] },
    { id: '19', name: 'Kopi Gula Aren', region: 'Jakarta Selatan', price: 22000, sales: 480, status: MenuItemStatus.ACTIVE, image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?auto=format&fit=crop&q=80&w=800', category: 'Kopi', forms: ['Coffee Shop', 'Drink Stall'] },
    { id: '20', name: 'Cappuccino Dingin', region: 'Bandung', price: 28000, sales: 390, status: MenuItemStatus.ACTIVE, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=800', category: 'Kopi', forms: ['Coffee Shop'] },
    { id: '21', name: 'Espresso Single', region: 'Jakarta Pusat', price: 18000, sales: 180, status: MenuItemStatus.ACTIVE, image: 'https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?auto=format&fit=crop&q=80&w=800', category: 'Kopi', forms: ['Coffee Shop'] },
    { id: '22', name: 'Caffè Latte', region: 'Bali', price: 32000, sales: 250, status: MenuItemStatus.ACTIVE, image: 'https://images.unsplash.com/photo-1551024601-5637ade9b8c6?auto=format&fit=crop&q=80&w=800', category: 'Kopi', forms: ['Coffee Shop'] },
    { id: '23', name: 'Es Teh Manis', region: 'Semua Region', price: 8000, sales: 800, status: MenuItemStatus.ACTIVE, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800', category: 'Minuman', forms: ['Dine-in', 'Express', 'Drink Stall'] },
    { id: '24', name: 'Jus Alpukat', region: 'Jakarta Barat', price: 20000, sales: 320, status: MenuItemStatus.ACTIVE, image: 'https://images.unsplash.com/photo-1601039641847-7857b994d704?auto=format&fit=crop&q=80&w=800', category: 'Minuman', forms: ['Drink Stall'] },
    { id: '25', name: 'Es Jeruk Segar', region: 'Jakarta Utara', price: 15000, sales: 310, status: MenuItemStatus.ACTIVE, image: 'https://images.unsplash.com/photo-1613478223719-2ab802602423?auto=format&fit=crop&q=80&w=800', category: 'Minuman', forms: ['Drink Stall'] },
    { id: '26', name: 'Es Kelapa Muda', region: 'Bali', price: 25000, sales: 330, status: MenuItemStatus.ACTIVE, image: 'https://images.unsplash.com/photo-1625943553852-781c6dd161bd?auto=format&fit=crop&q=80&w=800', category: 'Minuman', forms: ['Dine-in', 'Drink Stall'] },
    { id: '27', name: 'Pisang Goreng Keju', region: 'Jakarta Selatan', price: 20000, sales: 280, status: MenuItemStatus.ACTIVE, image: 'https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&q=80&w=800', category: 'Snack', forms: ['Snack Stall'] },
    { id: '28', name: 'Roti Bakar Coklat', region: 'Bandung', price: 18000, sales: 290, status: MenuItemStatus.ACTIVE, image: 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&q=80&w=800', category: 'Snack', forms: ['Snack Stall'] },
    { id: '29', name: 'Kentang Goreng', region: 'Jakarta Pusat', price: 22000, sales: 350, status: MenuItemStatus.ACTIVE, image: 'https://images.unsplash.com/photo-1573080496987-a199f8cd75ec?auto=format&fit=crop&q=80&w=800', category: 'Snack', forms: ['Snack Stall'] },
    { id: '30', name: 'Matcha Latte', region: 'Jakarta Selatan', price: 28000, sales: 230, status: MenuItemStatus.ACTIVE, image: 'https://images.unsplash.com/photo-1515825838458-f2a94b20105a?auto=format&fit=crop&q=80&w=800', category: 'Minuman Instan', forms: ['Coffee Shop', 'Drink Stall'] },
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

export const MenuManagement: React.FC = () => {
    // Main Data State
    const [menus, setMenus] = useState(INITIAL_MENU);

    // Modal States
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [editingMenu, setEditingMenu] = useState<any | null>(null);

    // Filter States
    const [filterRegion, setFilterRegion] = useState('');
    const [filterBranch, setFilterBranch] = useState('');
    const [filterCategory, setFilterCategory] = useState('');
    const [filterForm, setFilterForm] = useState('');

    // Form States
    const [menuName, setMenuName] = useState('');
    const [description, setDescription] = useState('');
    const [rawPrice, setRawPrice] = useState('');
    const [selectedForms, setSelectedForms] = useState<string[]>(['Dine-in']);
    const [selectedCategory, setSelectedCategory] = useState('Makanan');
    const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
    const [uploadedImage, setUploadedImage] = useState<string | null>(null);

    // Refs for File Input
    const addFileInputRef = useRef<HTMLInputElement>(null);
    const editFileInputRef = useRef<HTMLInputElement>(null);

    // Derived State for Branch Filter
    const availableBranches = useMemo(() => {
        return filterRegion && BRANCH_DATA[filterRegion] ? BRANCH_DATA[filterRegion] : [];
    }, [filterRegion]);

    // Derived Menu List based on filters
    const filteredMenus = useMemo(() => {
        return menus.filter(menu => {
            const matchRegion = !filterRegion || menu.region === 'Semua Region' || menu.region === filterRegion;
            const matchCategory = !filterCategory || menu.category === filterCategory;
            const matchForm = !filterForm || (menu.forms && menu.forms.includes(filterForm));
            return matchRegion && matchCategory && matchForm;
        });
    }, [menus, filterRegion, filterCategory, filterForm]);

    // Calculations
    const numericPrice = useMemo(() => parseInt(rawPrice.replace(/\D/g, '') || '0', 10), [rawPrice]);
    const hasServiceFee = useMemo(() => selectedForms.some(f => ['Dine-in', 'Coffee Shop'].includes(f)), [selectedForms]);
    const serviceFee = useMemo(() => hasServiceFee ? numericPrice * 0.05 : 0, [hasServiceFee, numericPrice]);
    const tax = useMemo(() => (numericPrice + serviceFee) * 0.1, [numericPrice, serviceFee]);
    const totalPrice = useMemo(() => numericPrice + serviceFee + tax, [numericPrice, serviceFee, tax]);

    // -- Handlers --

    const resetForm = () => {
        setMenuName('');
        setDescription('');
        setRawPrice('');
        setSelectedForms(['Dine-in']);
        setSelectedCategory('Makanan');
        setSelectedRegions([]);
        setUploadedImage(null);
    };

    const handleEditClick = (menu: any) => {
        setEditingMenu(menu);
        // Pre-fill form state
        setMenuName(menu.name);
        setDescription('Deskripsi menu default...');
        setRawPrice(menu.price.toString());
        setSelectedCategory(menu.category || 'Makanan');
        setSelectedForms(menu.forms || ['Dine-in']);
        setSelectedRegions(menu.region === 'Semua Region' ? REGION_OPTIONS : [menu.region]);
        setUploadedImage(menu.image);
    };

    const closeModals = () => {
        setIsAddModalOpen(false);
        setEditingMenu(null);
        resetForm();
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setUploadedImage(imageUrl);
        }
    };

    const handleSaveNewMenu = () => {
        if (!menuName || !rawPrice) return; // Simple validation

        const newMenu = {
            id: Date.now().toString(),
            name: menuName,
            price: numericPrice,
            category: selectedCategory,
            forms: selectedForms,
            region: selectedRegions.length === REGION_OPTIONS.length ? 'Semua Region' : (selectedRegions[0] || 'Jakarta Selatan'),
            status: MenuItemStatus.ACTIVE,
            image: uploadedImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800' // Fallback image
        };

        setMenus([newMenu, ...menus]);
        closeModals();
    };

    const handleSaveEditMenu = () => {
        if (!editingMenu) return;

        const updatedMenus = menus.map(m => {
            if (m.id === editingMenu.id) {
                return {
                    ...m,
                    name: menuName,
                    price: numericPrice,
                    image: uploadedImage || m.image
                    // Note: Category, Forms, Region are read-only in Edit mode per design, so we don't update them here
                };
            }
            return m;
        });

        setMenus(updatedMenus);
        closeModals();
    };

    const handleDeleteMenu = () => {
        if (!editingMenu) return;
        const updatedMenus = menus.filter(m => m.id !== editingMenu.id);
        setMenus(updatedMenus);
        closeModals();
    };

    const handleRegionFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilterRegion(e.target.value);
        setFilterBranch('');
    };

    const handleFormToggle = (form: string) => {
        const isExclusive = form === 'Snack Stall' || form === 'Drink Stall';
        const hasExclusiveSelected = selectedForms.some(f => f === 'Snack Stall' || f === 'Drink Stall');

        if (isExclusive) {
            if (selectedForms.includes(form)) {
                setSelectedForms([]);
            } else {
                setSelectedForms([form]);
            }
        } else {
            if (hasExclusiveSelected) {
                setSelectedForms([form]);
            } else {
                setSelectedForms(prev =>
                    prev.includes(form)
                        ? prev.filter(f => f !== form)
                        : [...prev, form]
                );
            }
        }
    };

    const handleRegionToggle = (region: string) => {
        setSelectedRegions(prev => prev.includes(region) ? prev.filter(r => r !== region) : [...prev, region]);
    };

    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value.replace(/\D/g, '');
        setRawPrice(val);
    };

    useEffect(() => {
        if (isAddModalOpen) {
            if (selectedForms.includes('Snack Stall')) {
                setSelectedCategory('Snack');
            } else if (selectedForms.includes('Drink Stall')) {
                setSelectedCategory('Minuman Instan');
            }
        }
    }, [selectedForms, isAddModalOpen]);

    const isCategoryDisabled = (cat: string) => {
        if (selectedForms.includes('Snack Stall')) return cat !== 'Snack';
        if (selectedForms.includes('Drink Stall')) return cat !== 'Minuman Instan';
        return false;
    };

    const formatCurrency = (val: number) => `Rp ${val.toLocaleString('id-ID')}`;

    return (
        <div className="space-y-6">
            {/* Top Summary Card */}
            <div className="bg-white rounded-2xl p-6 border border-border shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h2 className="text-xl font-bold text-textPrimary mb-3">Daftar Menu Restoran</h2>
                    <span className="bg-gray-200 text-gray-600 px-4 py-1.5 rounded-lg text-sm font-medium">
                        {filteredMenus.length} Menu Aktif
                    </span>
                </div>
                <Button
                    onClick={() => { resetForm(); setIsAddModalOpen(true); }}
                    className="bg-[#B08968] hover:bg-[#9a7658] text-white px-6 py-3 rounded-xl font-semibold shadow-sm"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Tambah Menu Baru
                </Button>
            </div>

            {/* Filter Bar */}
            <div className="bg-white rounded-xl p-3 border border-border shadow-sm flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex gap-3 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 items-center">
                    <div className="relative min-w-[160px]">
                        <select value={filterRegion} onChange={handleRegionFilterChange} className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg py-2 pl-4 pr-10 text-sm text-textSecondary font-medium focus:outline-none focus:ring-2 focus:ring-[#B08968] focus:border-transparent cursor-pointer hover:bg-gray-100 transition-colors">
                            <option value="">Semua Region</option>
                            {REGION_OPTIONS.map(region => <option key={region} value={region}>{region}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    {/* Filter Cabang */}
                    <div className="relative min-w-[160px]">
                        <select value={filterBranch} onChange={(e) => setFilterBranch(e.target.value)} disabled={!filterRegion} className={`w-full appearance-none border border-gray-200 rounded-lg py-2 pl-4 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#B08968] focus:border-transparent cursor-pointer transition-colors ${!filterRegion ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-50 text-textSecondary hover:bg-gray-100'}`}>
                            <option value="">Semua Cabang</option>
                            {availableBranches.map(branch => <option key={branch} value={branch}>{branch}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                    {/* Filter Kategori */}
                    <div className="relative min-w-[160px]">
                        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="w-full appearance-none bg-gray-50 border border-gray-200 rounded-lg py-2 pl-4 pr-10 text-sm text-textSecondary font-medium focus:outline-none focus:ring-2 focus:ring-[#B08968] focus:border-transparent cursor-pointer hover:bg-gray-100 transition-colors">
                            <option value="">Semua Kategori</option>
                            {CATEGORY_OPTIONS.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>
            </div>

            {/* Menu Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMenus.map((item) => (
                    <div key={item.id} className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow group">
                        <div className="h-56 bg-[#4A5568] relative flex items-center justify-center overflow-hidden">
                            <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                            <div
                                onClick={() => handleEditClick(item)}
                                className="absolute top-4 right-4 bg-white/90 hover:bg-white p-2.5 rounded-full cursor-pointer transition-colors shadow-sm z-10 backdrop-blur-sm"
                            >
                                <Edit2 className="w-4 h-4 text-[#B08968]" />
                            </div>
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                            <h3 className="text-lg font-bold text-textPrimary mb-1">{item.name}</h3>
                            <p className="text-sm text-textSecondary mb-8">{item.region}</p>
                            <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4">
                                <span className="text-lg font-bold text-textPrimary">
                                    Rp {item.price.toLocaleString('id-ID').replace(',', '.')}
                                </span>
                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.status === MenuItemStatus.ACTIVE ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                                    {item.status === MenuItemStatus.ACTIVE ? 'Active' : 'Draft'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* --- Detail Menu Modal (Edit Mode) --- */}
            {editingMenu && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm overflow-y-auto py-8 px-4">
                    <div className="bg-[#F2F2F2] rounded-2xl w-full max-w-[500px] shadow-2xl relative flex flex-col max-h-[95vh] overflow-hidden">

                        {/* Image Preview Header */}
                        <div className="h-64 bg-gray-200 relative group shrink-0">
                            <img src={uploadedImage || editingMenu.image} alt="Menu Preview" className="w-full h-full object-cover" />
                            <div
                                onClick={() => editFileInputRef.current?.click()}
                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer"
                            >
                                <Camera className="w-8 h-8 text-white mb-2" />
                                <span className="text-white font-bold text-lg drop-shadow-md">Ganti Foto Menu</span>
                            </div>
                            <input
                                type="file"
                                ref={editFileInputRef}
                                onChange={handleImageUpload}
                                className="hidden"
                                accept="image/*"
                            />
                            <button onClick={closeModals} className="absolute top-4 right-4 bg-white/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-sm transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Scrollable Form Content */}
                        <div className="p-6 space-y-5 overflow-y-auto bg-[#F2F2F2]">
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <label className="block text-[11px] font-bold text-[#1F2933] uppercase tracking-wide mb-2">Nama Menu</label>
                                <input
                                    type="text"
                                    value={menuName}
                                    onChange={(e) => setMenuName(e.target.value)}
                                    className="w-full bg-[#F2F2F2] border-transparent rounded-lg px-4 py-3 text-sm font-semibold text-[#1F2933] focus:ring-2 focus:ring-[#B08968] outline-none"
                                />
                            </div>

                            {/* Category (Read Only) */}
                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative">
                                <div className="flex justify-between items-center mb-3">
                                    <label className="text-[11px] font-bold text-[#1F2933] uppercase tracking-wide">Kategori</label>
                                    <span className="text-[10px] font-bold text-[#6B7280]">*tidak bisa diubah</span>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {CATEGORY_OPTIONS.map(cat => (
                                        <div key={cat} className={`px-4 py-2 rounded-lg text-xs font-bold border transition-colors ${selectedCategory === cat ? 'bg-[#5f6c7b] text-white border-[#5f6c7b]' : 'bg-gray-100 text-gray-400 border-transparent'}`}>
                                            {cat}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <label className="block text-[11px] font-bold text-[#1F2933] uppercase tracking-wide mb-2">Deskripsi</label>
                                <textarea
                                    rows={4}
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-[#F2F2F2] border-transparent rounded-lg px-4 py-3 text-sm text-[#1F2933] font-medium focus:ring-2 focus:ring-[#B08968] outline-none resize-none"
                                />
                            </div>

                            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <label className="block text-[11px] font-bold text-[#1F2933] uppercase tracking-wide mb-2">Harga</label>
                                <div className="relative">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-500">Rp.</span>
                                    <input
                                        type="text"
                                        value={rawPrice ? parseInt(rawPrice).toLocaleString('id-ID') : ''}
                                        onChange={handlePriceChange}
                                        className="w-full bg-[#F2F2F2] border-transparent rounded-lg pl-12 pr-4 py-3 text-lg font-bold text-[#1F2933] focus:ring-2 focus:ring-[#B08968] outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Action Footer */}
                        <div className="p-6 bg-[#F2F2F2] space-y-3 pt-2">
                            <div className="grid grid-cols-2 gap-3">
                                <button onClick={closeModals} className="w-full bg-[#D1D5DB] hover:bg-gray-400 text-[#1F2933] font-bold py-3.5 rounded-xl text-sm transition-colors">Batal</button>
                                <button onClick={handleDeleteMenu} className="w-full bg-[#D1D5DB] hover:bg-red-100 text-[#1F2933] hover:text-red-600 font-bold py-3.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2 group">Hapus Menu</button>
                            </div>
                            <button onClick={handleSaveEditMenu} className="w-full bg-[#B08968] hover:bg-[#9a7658] text-white font-bold py-4 rounded-xl text-sm transition-colors shadow-lg shadow-[#B08968]/20">Simpan</button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- Add Menu Modal --- */}
            {isAddModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-10 px-4">
                    <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl relative flex flex-col max-h-[95vh]">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-2xl z-10">
                            <h2 className="text-xl font-bold text-textPrimary">Tambah Menu Baru</h2>
                            <button onClick={closeModals} className="text-gray-400 hover:text-gray-600"><X className="w-6 h-6" /></button>
                        </div>

                        <div className="p-8 space-y-6 overflow-y-auto">
                            <div
                                onClick={() => addFileInputRef.current?.click()}
                                className={`border-2 border-dashed ${uploadedImage ? 'border-[#B08968] bg-white' : 'border-gray-300 bg-gray-50'} rounded-xl h-40 flex flex-col items-center justify-center text-gray-400 cursor-pointer hover:bg-gray-100 transition-colors group overflow-hidden relative`}
                            >
                                {uploadedImage ? (
                                    <img src={uploadedImage} alt="Uploaded" className="w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                            <Upload className="w-6 h-6 text-[#B08968]" />
                                        </div>
                                        <span className="text-xs font-medium text-gray-500">Klik untuk upload gambar</span>
                                    </>
                                )}
                                <input
                                    type="file"
                                    ref={addFileInputRef}
                                    onChange={handleImageUpload}
                                    className="hidden"
                                    accept="image/*"
                                />
                            </div>

                            {/* Inputs similar to edit but editable */}
                            <div>
                                <label className="block text-xs font-bold text-textPrimary mb-2 uppercase tracking-wide">Nama Menu</label>
                                <input type="text" value={menuName} onChange={(e) => setMenuName(e.target.value)} placeholder="Masukkan nama menu" className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-textPrimary focus:ring-2 focus:ring-[#B08968] focus:border-transparent outline-none transition-all" />
                            </div>

                            {/* Forms & Category & Region Selection (Fully Editable) */}
                            <div>
                                <label className="block text-xs font-bold text-textPrimary mb-3 uppercase tracking-wide">Bentuk yang diizinkan</label>
                                <div className="flex flex-wrap gap-2">
                                    {FORM_OPTIONS.map(form => (
                                        <button key={form} onClick={() => handleFormToggle(form)} className={`px-4 py-2 rounded-full text-[11px] font-bold transition-all border ${selectedForms.includes(form) ? 'bg-[#B08968] text-white border-[#B08968] shadow-sm' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>{form}</button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-3">
                                    <label className="block text-xs font-bold text-textPrimary uppercase tracking-wide">Kategori</label>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {CATEGORY_OPTIONS.map(cat => (
                                        <button key={cat} onClick={() => !isCategoryDisabled(cat) && setSelectedCategory(cat)} disabled={isCategoryDisabled(cat)} className={`px-4 py-2 rounded-full text-[11px] font-bold transition-all border ${selectedCategory === cat ? 'bg-[#2F3E46] text-white border-[#2F3E46] shadow-sm' : isCategoryDisabled(cat) ? 'bg-gray-100 text-gray-300 border-transparent cursor-not-allowed' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'}`}>{cat}</button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-textPrimary mb-3 uppercase tracking-wide">Region yang Diizinkan</label>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {REGION_OPTIONS.map((region) => (
                                        <div key={region} onClick={() => handleRegionToggle(region)} className={`cursor-pointer rounded-lg p-3 text-center border transition-all duration-200 relative overflow-hidden ${selectedRegions.includes(region) ? 'bg-[#B08968]/10 border-[#B08968] text-[#B08968]' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'}`}>
                                            <span className="text-xs font-bold">{region}</span>
                                            {selectedRegions.includes(region) && <div className="absolute top-1 right-1"><div className="w-3 h-3 bg-[#B08968] rounded-full flex items-center justify-center"><Check className="w-2 h-2 text-white" /></div></div>}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-textPrimary mb-2 uppercase tracking-wide">Harga Menu</label>
                                <div className="relative group">
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-500">Rp.</span>
                                    <input type="text" value={rawPrice ? parseInt(rawPrice).toLocaleString('id-ID') : ''} onChange={handlePriceChange} placeholder="0" className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-12 pr-4 py-3 text-sm text-textPrimary font-bold focus:ring-2 focus:ring-[#B08968] focus:border-transparent outline-none transition-all group-hover:bg-gray-100" />
                                </div>
                            </div>

                            {/* Rincian Harga - Dynamic Price Breakdown */}
                            {numericPrice > 0 && (
                                <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl p-5 space-y-4 shadow-inner">
                                    <h4 className="text-sm font-bold text-[#B08968] underline underline-offset-4">Rincian Harga</h4>

                                    <div className="space-y-3">
                                        {/* Harga Dasar */}
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-semibold text-gray-700">Harga Dasar :</span>
                                            <span className="text-sm font-bold text-gray-900">{formatCurrency(numericPrice)}</span>
                                        </div>

                                        {/* Service Fee - Only shows for Dine-in or Coffee Shop */}
                                        {hasServiceFee && (
                                            <div className="flex justify-between items-center">
                                                <span className="text-sm font-semibold text-gray-700">Service Fee :</span>
                                                <span className="text-sm font-bold text-gray-900">{formatCurrency(serviceFee)}</span>
                                            </div>
                                        )}

                                        {/* Pajak - Always shows */}
                                        <div className="flex justify-between items-center">
                                            <span className="text-sm font-semibold text-gray-700">Pajak :</span>
                                            <span className="text-sm font-bold text-gray-900">{formatCurrency(tax)}</span>
                                        </div>

                                        {/* Divider */}
                                        <div className="border-t border-gray-400 pt-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-base font-bold text-gray-800">Total Harga:</span>
                                                <span className="text-xl font-black text-gray-900">{formatCurrency(totalPrice)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer Note */}
                                    <p className="text-[10px] text-gray-500 mt-2">
                                        *Service Fee 5% dikenakan untuk Dine-in dan Coffee Shop
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-white rounded-b-2xl flex gap-4 z-10">
                            <button onClick={closeModals} className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-textSecondary font-bold py-3.5 rounded-xl text-sm transition-colors">Batal</button>
                            <button onClick={handleSaveNewMenu} className="flex-1 bg-[#2F3E46] hover:bg-[#1f2a30] text-white font-bold py-3.5 rounded-xl text-sm transition-colors shadow-lg shadow-gray-200">Simpan Menu</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};