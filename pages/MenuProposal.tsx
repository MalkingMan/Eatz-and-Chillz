import React, { useState, useMemo, useRef } from 'react';
import { User, UserRole, Proposal, ProposalStatus } from '../types';
import { Button } from '../components/ui/Button';
import { Plus, Check, X, Search, ChevronRight, Image, Upload } from 'lucide-react';

interface MenuProposalProps {
    user: User;
}

const INITIAL_PROPOSALS = [
    { id: '1', menuName: 'Soto Ayam Lamongan', rmName: 'Ahmad Wijaya', region: 'Surabaya', date: '2023-11-01', price: 28000, status: ProposalStatus.PENDING, description: 'Soto ayam khas Lamongan dengan bubuk koya gurih dan kuah kuning yang kaya rempah.', image: 'https://images.unsplash.com/photo-1628522307525-4c094406e287?auto=format&fit=crop&q=80&w=800' },
    { id: '2', menuName: 'Iced Lychee Tea', rmName: 'Dewi Kusuma', region: 'Jakarta Selatan', date: '2023-11-02', price: 25000, status: ProposalStatus.APPROVED, description: 'Teh leci segar dengan buah leci asli, sangat cocok untuk cuaca panas Jakarta Selatan.', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800' },
    { id: '3', menuName: 'Bubur Ayam Jakarta', rmName: 'Budi Santoso', region: 'Jakarta Pusat', date: '2023-10-30', price: 20000, status: ProposalStatus.REJECTED, description: 'Bubur ayam dengan topping cakwe, ayam suwir, dan kerupuk, menu sarapan favorit.', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=800' },
    { id: '4', menuName: 'Nasi Padang Komplit', rmName: 'Rizky Pratama', region: 'Padang', date: '2023-11-05', price: 45000, status: ProposalStatus.PENDING, description: 'Nasi Padang dengan rendang, sayur nangka, dan sambal hijau khas Minang.', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=800' },
    { id: '5', menuName: 'Gudeg Yu Djum', rmName: 'Sri Rahayu', region: 'Yogyakarta', date: '2023-11-06', price: 35000, status: ProposalStatus.PENDING, description: 'Gudeg nangka manis dengan krecek pedas dan telur bacem.', image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&q=80&w=800' },
    { id: '6', menuName: 'Empek-Empek Selam', rmName: 'Indra Gunawan', region: 'Palembang', date: '2023-11-03', price: 30000, status: ProposalStatus.APPROVED, description: 'Pempek kapal selam dengan isian telur besar dan cuko pedas manis.', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800' },
    { id: '7', menuName: 'Ayam Betutu Gilimanuk', rmName: 'Made Surya', region: 'Bali', date: '2023-11-07', price: 55000, status: ProposalStatus.PENDING, description: 'Ayam utuh dengan bumbu rempah khas Bali yang pedas dan aromatik.', image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&q=80&w=800' },
    { id: '8', menuName: 'Coto Makassar', rmName: 'Andi Rahman', region: 'Makassar', date: '2023-10-28', price: 38000, status: ProposalStatus.REJECTED, description: 'Soto daging sapi khas Makassar dengan kuah kacang kental.', image: 'https://images.unsplash.com/photo-1572656631137-7935297eff55?auto=format&fit=crop&q=80&w=800' },
    { id: '9', menuName: 'Batagor Riri', rmName: 'Rina Marlina', region: 'Bandung', date: '2023-11-04', price: 22000, status: ProposalStatus.APPROVED, description: 'Bakso tahu goreng ikan tenggiri dengan bumbu kacang legit.', image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&q=80&w=800' },
    { id: '10', menuName: 'Mie Aceh Tumis', rmName: 'Teuku Faisal', region: 'Aceh', date: '2023-11-08', price: 32000, status: ProposalStatus.PENDING, description: 'Mie tebal dengan bumbu kari pedas dan irisan daging sapi.', image: 'https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&q=80&w=800' },
    { id: '11', menuName: 'Bika Ambon Zulaikha', rmName: 'Dimas Harahap', region: 'Medan', date: '2023-11-09', price: 65000, status: ProposalStatus.PENDING, description: 'Kue basah khas Medan dengan tekstur bersarang dan aroma daun jeruk.', image: 'https://images.unsplash.com/photo-1601039641847-7857b994d704?auto=format&fit=crop&q=80&w=800' },
    { id: '12', menuName: 'Rawon Setan', rmName: 'Ahmad Wijaya', region: 'Surabaya', date: '2023-11-01', price: 42000, status: ProposalStatus.APPROVED, description: 'Sup daging sapi kuah hitam kluwek yang gurih dan legendaris.', image: 'https://images.unsplash.com/photo-1572656631137-7935297eff55?auto=format&fit=crop&q=80&w=800' },
    { id: '13', menuName: 'Es Pisang Ijo', rmName: 'Andi Rahman', region: 'Makassar', date: '2023-11-10', price: 25000, status: ProposalStatus.PENDING, description: 'Pisang balut adonan hijau dengan bubur sumsum dan sirup merah.', image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&q=80&w=800' },
    { id: '14', menuName: 'Kerak Telor Betawi', rmName: 'Hendra Putra', region: 'Jakarta Utara', date: '2023-10-25', price: 25000, status: ProposalStatus.REJECTED, description: 'Omelet beras ketan dengan serundeng dan telur bebek khas Jakarta.', image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=800' },
    { id: '15', menuName: 'Sate Lilit', rmName: 'Made Surya', region: 'Bali', date: '2023-11-11', price: 30000, status: ProposalStatus.PENDING, description: 'Sate daging cincang dengan bumbu basa genep yang dililitkan pada batang serai.', image: 'https://images.unsplash.com/photo-1631515243349-e0603690b6b8?auto=format&fit=crop&q=80&w=800' },
];

export const MenuProposal: React.FC<MenuProposalProps> = ({ user }) => {
    // State
    const [proposals, setProposals] = useState(INITIAL_PROPOSALS);
    const [selectedTab, setSelectedTab] = useState<ProposalStatus | 'All'>('All');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedProposal, setSelectedProposal] = useState<any | null>(null);
    const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

    // New Proposal Form State
    const [newMenuName, setNewMenuName] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [newPrice, setNewPrice] = useState('');
    const [newImage, setNewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Calculate Stats
    const stats = useMemo(() => {
        return {
            pending: proposals.filter(p => p.status === ProposalStatus.PENDING).length,
            approved: proposals.filter(p => p.status === ProposalStatus.APPROVED).length,
            rejected: proposals.filter(p => p.status === ProposalStatus.REJECTED).length,
        };
    }, [proposals]);

    const filteredProposals = useMemo(() => {
        return proposals.filter(p => {
            const matchesTab = selectedTab === 'All' || p.status === selectedTab;
            const matchesSearch = p.menuName.toLowerCase().includes(searchQuery.toLowerCase());
            return matchesTab && matchesSearch;
        });
    }, [proposals, selectedTab, searchQuery]);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const imageUrl = URL.createObjectURL(file);
            setNewImage(imageUrl);
        }
    };

    const handleSubmit = () => {
        if (!newMenuName || !newPrice) return;

        const newProposal = {
            id: Date.now().toString(),
            menuName: newMenuName,
            rmName: user.name,
            region: 'Jakarta Selatan', // Default region for demo
            date: new Date().toISOString().split('T')[0],
            price: parseInt(newPrice),
            status: ProposalStatus.PENDING,
            description: newDescription,
            image: newImage || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=800'
        };

        setProposals([newProposal, ...proposals]);

        // Reset and Close
        setNewMenuName('');
        setNewDescription('');
        setNewPrice('');
        setNewImage(null);
        setIsSubmitModalOpen(false);
    };

    const handleUpdateStatus = (id: string, status: ProposalStatus) => {
        setProposals(prev => prev.map(p => p.id === id ? { ...p, status } : p));
        setSelectedProposal(null);
    };

    const getStatusBadge = (status: ProposalStatus) => {
        switch (status) {
            case ProposalStatus.APPROVED:
                return <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-[#D1FAE5] text-[#065F46] tracking-wider">DISETUJUI</span>;
            case ProposalStatus.REJECTED:
                return <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-[#FEE2E2] text-[#991B1B] tracking-wider">DITOLAK</span>;
            default:
                return <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase bg-[#FEF3C7] text-[#92400E] tracking-wider">PENDING</span>;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header Actions for RM */}
            {user.role === UserRole.RM && (
                <div className="flex justify-end">
                    <Button onClick={() => setIsSubmitModalOpen(true)}>
                        <Plus className="w-5 h-5 mr-2" />
                        Submit Special Menu
                    </Button>
                </div>
            )}

            {/* Stats Section */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-border">
                <h2 className="text-lg font-bold text-textPrimary mb-4">Proposal Menu</h2>
                <div className="flex flex-wrap gap-4">
                    <div className="bg-gray-100 px-6 py-3 rounded-xl flex items-center gap-2 text-textPrimary min-w-[140px] justify-center">
                        <span className="font-bold text-lg">{stats.pending}</span> <span className="text-sm font-medium">Pending</span>
                    </div>
                    <div className="bg-gray-100 px-6 py-3 rounded-xl flex items-center gap-2 text-textPrimary min-w-[140px] justify-center">
                        <span className="font-bold text-lg">{stats.approved}</span> <span className="text-sm font-medium">Disetujui</span>
                    </div>
                    <div className="bg-gray-100 px-6 py-3 rounded-xl flex items-center gap-2 text-textPrimary min-w-[140px] justify-center">
                        <span className="font-bold text-lg">{stats.rejected}</span> <span className="text-sm font-medium">Ditolak</span>
                    </div>
                </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-border flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex gap-2 overflow-x-auto px-2 w-full md:w-auto no-scrollbar">
                    {[
                        { label: 'Semua', value: 'All' },
                        { label: 'Pending', value: ProposalStatus.PENDING },
                        { label: 'Disetujui', value: ProposalStatus.APPROVED },
                        { label: 'Ditolak', value: ProposalStatus.REJECTED }
                    ].map((tab) => (
                        <button
                            key={tab.value}
                            onClick={() => setSelectedTab(tab.value as any)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${selectedTab === tab.value
                                ? 'bg-secondary text-white shadow-sm'
                                : 'bg-gray-100 text-textSecondary hover:bg-gray-200'
                                }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
                <div className="relative w-full md:w-72 px-2 md:px-0">
                    <Search className="absolute left-5 md:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-white border border-border rounded-lg text-sm focus:ring-2 focus:ring-secondary focus:border-transparent outline-none transition-all placeholder-gray-400"
                        placeholder="Cari Nama Menu..."
                    />
                </div>
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProposals.map((proposal) => (
                    <div
                        key={proposal.id}
                        className="bg-white rounded-xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-shadow flex flex-col"
                    >
                        <div className="h-48 bg-primary relative flex items-center justify-center overflow-hidden">
                            <img src={proposal.image} alt={proposal.menuName} className="w-full h-full object-cover opacity-90" />
                            <div className="absolute top-4 right-4 z-10 shadow-sm">
                                {getStatusBadge(proposal.status)}
                            </div>
                            <div className="absolute bottom-4 left-4 z-10">
                                <h3 className="text-white text-xl font-bold tracking-wide drop-shadow-md">{proposal.menuName}</h3>
                            </div>
                        </div>

                        <div className="p-5 flex flex-col flex-1">
                            <div className="mb-4">
                                <p className="text-textPrimary font-bold text-sm">{proposal.rmName}</p>
                                <p className="text-textSecondary text-xs">Region {proposal.region}</p>
                            </div>

                            <div className="mt-auto flex items-end justify-between">
                                <div>
                                    <p className="text-textSecondary text-xs mb-1">Harga Pengajuan</p>
                                    <p className="text-textPrimary font-bold text-lg">
                                        Rp {proposal.price.toLocaleString('id-ID').replace(',', '.')}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setSelectedProposal(proposal)}
                                    className="flex items-center text-sm font-bold text-secondary hover:text-[#9a7658] transition-colors"
                                >
                                    Detail <span className="ml-1 text-xs">{'>>'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Detail Modal */}
            {selectedProposal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setSelectedProposal(null);
                    }}
                >
                    <div className="w-full max-w-md my-8 relative flex flex-col items-center">
                        {/* Title Outside */}
                        <h3 className="text-xl font-bold text-white mb-6 drop-shadow-md tracking-wide">Detail Usulan Menu</h3>

                        {/* Card Container */}
                        <div className="bg-[#E5E5E5] w-full rounded-[32px] p-6 space-y-3 shadow-2xl relative animate-in fade-in zoom-in duration-200">

                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedProposal(null)}
                                className="absolute top-4 right-4 p-2 bg-gray-200 hover:bg-gray-300 rounded-full text-gray-600 transition-colors z-10"
                            >
                                <X className="w-4 h-4" />
                            </button>

                            {/* Top Section: Image & Title */}
                            <div className="bg-white rounded-[24px] p-6 flex flex-col items-center justify-center text-center shadow-sm mb-2">
                                <div className="w-24 h-24 rounded-2xl overflow-hidden mb-3 shadow-inner">
                                    <img src={selectedProposal.image} alt={selectedProposal.menuName} className="w-full h-full object-cover" />
                                </div>
                                <h4 className="text-lg font-bold text-[#1F2933]">{selectedProposal.menuName}</h4>
                            </div>

                            {/* Manager Info Row */}
                            <div className="flex gap-3">
                                <div className="bg-white flex-1 p-3.5 rounded-xl shadow-sm">
                                    <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase">Nama Region Manager</p>
                                    <p className="text-xs font-bold text-[#1F2933] truncate">
                                        {selectedProposal.rmName}
                                    </p>
                                </div>
                                <div className="bg-white flex-1 p-3.5 rounded-xl shadow-sm">
                                    <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase">Asal Region</p>
                                    <p className="text-xs font-bold text-[#1F2933] truncate">
                                        {selectedProposal.region}
                                    </p>
                                </div>
                            </div>

                            {/* Price */}
                            <div className="bg-white p-3.5 rounded-xl shadow-sm">
                                <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase">Harga</p>
                                <p className="text-sm font-bold text-[#1F2933]">
                                    Rp {selectedProposal.price.toLocaleString('id-ID')}
                                </p>
                            </div>

                            {/* Description */}
                            <div className="bg-white p-3.5 rounded-xl shadow-sm">
                                <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase">Deskripsi</p>
                                <p className="text-xs font-medium text-[#1F2933] leading-relaxed">
                                    {selectedProposal.description}
                                </p>
                            </div>

                            {/* Catatan (Mock) */}
                            <div className="bg-white p-3.5 rounded-xl shadow-sm">
                                <p className="text-[10px] text-gray-400 font-bold mb-1 uppercase">Catatan dari Regional Manager</p>
                                <p className="text-xs font-medium text-[#1F2933]">
                                    Menu ini sangat diminati di area kampus dan perkantoran, potensi profit tinggi.
                                </p>
                            </div>

                            {/* GM Comment Input */}
                            <div className="bg-white p-3.5 rounded-xl shadow-sm">
                                <p className="text-[10px] text-gray-400 font-bold mb-2 uppercase">Komentar Untuk Region Manager</p>
                                <textarea
                                    className="w-full text-xs font-medium text-[#1F2933] outline-none resize-none bg-transparent placeholder-gray-300"
                                    placeholder="Tulis alasan disetujui/ditolak..."
                                    rows={3}
                                />
                            </div>

                            {/* Action Buttons */}
                            {user.role === UserRole.GM && selectedProposal.status === ProposalStatus.PENDING ? (
                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={() => handleUpdateStatus(selectedProposal.id, ProposalStatus.APPROVED)}
                                        className="flex-1 bg-white hover:bg-emerald-50 text-[#1F2933] font-bold py-3.5 rounded-xl shadow-sm text-sm transition-all border border-transparent hover:border-emerald-200 active:scale-[0.98]"
                                    >
                                        Disetujui
                                    </button>
                                    <button
                                        onClick={() => handleUpdateStatus(selectedProposal.id, ProposalStatus.REJECTED)}
                                        className="flex-1 bg-white hover:bg-red-50 text-[#1F2933] font-bold py-3.5 rounded-xl shadow-sm text-sm transition-all border border-transparent hover:border-red-200 active:scale-[0.98]"
                                    >
                                        Ditolak
                                    </button>
                                </div>
                            ) : (
                                <div className="pt-2">
                                    <button
                                        onClick={() => setSelectedProposal(null)}
                                        className="w-full bg-white hover:bg-gray-50 text-[#1F2933] font-bold py-3.5 rounded-xl shadow-sm text-sm transition-all active:scale-[0.98]"
                                    >
                                        Tutup
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Submit Modal (Improved Popup) */}
            {isSubmitModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 overflow-y-auto">
                    <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl relative flex flex-col max-h-[95vh]">
                        {/* Header */}
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-2xl z-10">
                            <h2 className="text-xl font-bold text-textPrimary">Ajukan Menu Khusus</h2>
                            <button onClick={() => setIsSubmitModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="p-8 space-y-6 overflow-y-auto custom-scrollbar">

                            {/* Image Upload Area */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed ${newImage ? 'border-[#B08968] bg-white' : 'border-gray-200 bg-gray-50'} rounded-xl h-48 flex flex-col items-center justify-center text-gray-500 cursor-pointer hover:bg-gray-100 transition-colors group overflow-hidden relative`}
                            >
                                {newImage ? (
                                    <img src={newImage} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <>
                                        <div className="bg-white p-3 rounded-full shadow-sm mb-3 group-hover:scale-110 transition-transform">
                                            <Plus className="w-6 h-6 text-[#1F2933]" />
                                        </div>
                                        <span className="text-sm font-semibold text-[#1F2933]">Upload Foto Menu</span>
                                    </>
                                )}
                                <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                            </div>

                            {/* Inputs */}
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-textPrimary mb-2 uppercase tracking-wide">Nama Menu</label>
                                    <input
                                        type="text"
                                        value={newMenuName}
                                        onChange={(e) => setNewMenuName(e.target.value)}
                                        placeholder="Masukkan nama menu"
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-textPrimary focus:ring-2 focus:ring-[#B08968] focus:border-transparent outline-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-textPrimary mb-2 uppercase tracking-wide">Deskripsi</label>
                                    <textarea
                                        value={newDescription}
                                        onChange={(e) => setNewDescription(e.target.value)}
                                        placeholder="Jelaskan detail menu ini..."
                                        rows={4}
                                        className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-textPrimary focus:ring-2 focus:ring-[#B08968] focus:border-transparent outline-none resize-none transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-textPrimary mb-2 uppercase tracking-wide">Harga</label>
                                    <div className="relative group">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-500">Rp.</span>
                                        <input
                                            type="number"
                                            value={newPrice}
                                            onChange={(e) => setNewPrice(e.target.value)}
                                            placeholder="0"
                                            className="w-full bg-gray-50 border border-gray-200 rounded-lg pl-12 pr-4 py-3 text-sm font-bold text-textPrimary focus:ring-2 focus:ring-[#B08968] focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Buttons */}
                        <div className="p-6 border-t border-gray-100 flex gap-4 bg-white rounded-b-2xl">
                            <button
                                onClick={() => setIsSubmitModalOpen(false)}
                                className="flex-1 bg-white border border-gray-300 hover:bg-gray-50 text-textSecondary font-bold py-3.5 rounded-xl text-sm transition-colors"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSubmit}
                                className="flex-1 bg-[#B08968] hover:bg-[#9a7658] text-white font-bold py-3.5 rounded-xl text-sm transition-colors shadow-lg shadow-[#B08968]/20"
                            >
                                Simpan
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};