import React from 'react';
import { User, UserRole } from '../types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  TrendingUp, ShoppingBag, ClipboardList, UtensilsCrossed,
  Check, X, Clock, ChevronRight
} from 'lucide-react';

interface DashboardProps {
  user: User;
}

// Weekly Revenue Data
const weeklyRevenueData = [
  { name: 'Mon', revenue: 32000000 },
  { name: 'Tue', revenue: 28000000 },
  { name: 'Wed', revenue: 45200000 },
  { name: 'Thu', revenue: 38000000 },
  { name: 'Fri', revenue: 42000000 },
  { name: 'Sat', revenue: 52000000 },
  { name: 'Sun', revenue: 48000000 },
];

// Revenue by Category Data
const categoryData = [
  { name: 'Food', value: 45, color: '#B08968' },
  { name: 'Beverages', value: 25, color: '#DDB892' },
  { name: 'Coffee', value: 18, color: '#7F5539' },
  { name: 'Snacks', value: 12, color: '#E6CCB2' },
];

// Top Selling Items Data
const topSellingItems = [
  { id: 1, name: 'Signature Espresso Martini', category: 'Coffee/Beverages', sales: 1245, image: '☕' },
  { id: 2, name: 'Truffle Mushroom Risotto', category: 'Food', sales: 987, image: '🍝' },
  { id: 3, name: 'Classic Beef Burger', category: 'Food', sales: 850, image: '🍔' },
  { id: 4, name: 'Iced Caramel Macchiato', category: 'Coffee/Beverages', sales: 760, image: '🧋' },
  { id: 5, name: 'Crispy Chicken Bites', category: 'Snacks', sales: 690, image: '🍗' },
];

// Pending Proposals Data
const pendingProposals = [
  {
    id: 1,
    menuName: 'Spicy Tuna Poke Bowl',
    rmName: 'Alex Tan',
    region: 'West',
    description: 'A fresh addition for the summer menu.',
    submittedAt: '2 hours ago',
    price: 85000
  },
  {
    id: 2,
    menuName: 'Matcha Green Tea Latte',
    rmName: 'Maria Gomez',
    region: 'East',
    description: 'Popular demand item from surveys.',
    submittedAt: '1 day ago',
    price: 45000
  },
];

// ==================== DATA UNTUK REGIONAL MANAGER ====================

// Weekly Revenue Data untuk RM (per region)
const rmWeeklyRevenueData = [
  { name: 'Mon', revenue: 8500000 },
  { name: 'Tue', revenue: 7200000 },
  { name: 'Wed', revenue: 9800000 },
  { name: 'Thu', revenue: 8100000 },
  { name: 'Fri', revenue: 11200000 },
  { name: 'Sat', revenue: 14500000 },
  { name: 'Sun', revenue: 12800000 },
];

// Revenue per Branch Type untuk RM
const branchTypeData = [
  { name: 'Dine-in', value: 35, color: '#B08968' },
  { name: 'Coffee Shop', value: 28, color: '#7F5539' },
  { name: 'Express', value: 22, color: '#DDB892' },
  { name: 'Snack Stall', value: 10, color: '#E6CCB2' },
  { name: 'Drink Stall', value: 5, color: '#9C6644' },
];

// Branch Performance Data untuk RM
const branchPerformanceData = [
  { name: 'Cabang Sudirman', revenue: 18500000, orders: 425, trend: '+15%' },
  { name: 'Cabang Senayan', revenue: 15200000, orders: 380, trend: '+8%' },
  { name: 'Cabang Kemang', revenue: 12800000, orders: 320, trend: '+12%' },
  { name: 'Cabang Menteng', revenue: 11500000, orders: 290, trend: '-3%' },
  { name: 'Cabang Kuningan', revenue: 9800000, orders: 245, trend: '+5%' },
];

// Top Selling Items Regional
const rmTopSellingItems = [
  { id: 1, name: 'Nasi Goreng Spesial', category: 'Food', sales: 456, image: '🍛' },
  { id: 2, name: 'Es Kopi Susu', category: 'Coffee', sales: 398, image: '☕' },
  { id: 3, name: 'Ayam Geprek', category: 'Food', sales: 345, image: '🍗' },
  { id: 4, name: 'Mie Goreng', category: 'Food', sales: 312, image: '🍜' },
  { id: 5, name: 'Es Teh Manis', category: 'Beverages', sales: 289, image: '🧋' },
];

// My Proposals untuk RM
const myProposals = [
  { id: 1, name: 'Sate Padang Spesial', status: 'approved', submittedAt: '3 days ago', price: 55000 },
  { id: 2, name: 'Mango Sticky Rice', status: 'pending', submittedAt: '1 day ago', price: 35000 },
  { id: 3, name: 'Durian Coffee', status: 'rejected', submittedAt: '5 days ago', price: 42000, rejectReason: 'Tidak sesuai target market' },
];

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const isGM = user.role === UserRole.GM;

  // Stats data based on role
  const stats = isGM ? [
    {
      label: 'Total Revenue',
      value: 'Rp 245.8M',
      trend: '+12%',
      trendUp: true,
      icon: TrendingUp,
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    },
    {
      label: 'Total Orders',
      value: '5,847',
      trend: '+8%',
      trendUp: true,
      icon: ShoppingBag,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      label: 'Pending Proposals',
      value: '8',
      trend: 'Needs attention',
      trendUp: false,
      icon: ClipboardList,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
    {
      label: 'Active Menu Items',
      value: '156',
      trend: 'Across all categories',
      trendUp: null,
      icon: UtensilsCrossed,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
  ] : [
    {
      label: 'Region Revenue',
      value: 'Rp 45.2M',
      trend: '+15%',
      trendUp: true,
      icon: TrendingUp,
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600'
    },
    {
      label: 'Region Orders',
      value: '1,234',
      trend: '+5%',
      trendUp: true,
      icon: ShoppingBag,
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      label: 'My Proposals',
      value: '3',
      trend: '2 pending',
      trendUp: null,
      icon: ClipboardList,
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
    {
      label: 'Branch Count',
      value: '12',
      trend: 'Active branches',
      trendUp: null,
      icon: UtensilsCrossed,
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
  ];

  const formatCurrency = (value: number) => {
    if (value >= 1000000) {
      return `Rp ${(value / 1000000).toFixed(1)}M`;
    }
    return `Rp ${(value / 1000).toFixed(0)}K`;
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1E1510] via-[#4A3222] to-[#8C5E35] rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-[#DDB892] font-semibold text-sm uppercase tracking-wider mb-2">
            {isGM ? 'General Manager Dashboard' : 'Region Manager Dashboard'}
          </p>
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, <span className="text-[#F5E6D3]">{user.name}</span>!
          </h1>
          <p className="text-gray-200 text-lg">
            Here's what's happening at Eatz and Chillz today.
          </p>
        </div>
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-[#D4955A] opacity-20 rounded-full -mr-20 -mt-20 blur-3xl"></div>
        <div className="absolute bottom-0 right-32 w-48 h-48 bg-[#A8896A] opacity-20 rounded-full -mb-16 blur-2xl"></div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm font-medium mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-[#1F2933]">{stat.value}</p>
                <p className={`text-sm font-medium mt-2 ${stat.trendUp === true ? 'text-emerald-600' :
                  stat.trendUp === false ? 'text-orange-600' :
                    'text-gray-500'
                  }`}>
                  {stat.trend}
                </p>
              </div>
              <div className={`${stat.bgColor} p-3 rounded-xl group-hover:scale-110 transition-transform`}>
                <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Revenue Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#1F2933]">
                {isGM ? 'Weekly Revenue Overview (Nasional)' : 'Weekly Revenue Overview (Region)'}
              </h3>
              <p className="text-sm text-gray-500">
                {isGM ? 'Total revenue performance this week' : 'Your region revenue this week'}
              </p>
            </div>
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#B08968]">
              <option>This Week</option>
              <option>Last Week</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={isGM ? weeklyRevenueData : rmWeeklyRevenueData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis
                  dataKey="name"
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#6B7280"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
                />
                <Tooltip
                  formatter={(value: number) => [formatCurrency(value), 'Revenue']}
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    border: '1px solid #E5E7EB',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Bar
                  dataKey="revenue"
                  fill={isGM ? '#B08968' : '#7F5539'}
                  radius={[6, 6, 0, 0]}
                  barSize={36}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue by Category/Branch Type */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-[#1F2933]">
              {isGM ? 'Revenue by Category' : 'Revenue by Branch Type'}
            </h3>
            <p className="text-sm text-gray-500">
              {isGM ? 'Distribution across categories' : 'Distribution across branch types'}
            </p>
          </div>
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={isGM ? categoryData : branchTypeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {(isGM ? categoryData : branchTypeData).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value}%`, 'Share']}
                  contentStyle={{
                    backgroundColor: '#fff',
                    borderRadius: '12px',
                    border: '1px solid #E5E7EB'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {(isGM ? categoryData : branchTypeData).map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-semibold text-[#1F2933]">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Items */}
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#1F2933]">
                {isGM ? 'Top Selling Items (Nasional)' : 'Top Selling Items (Region)'}
              </h3>
              <p className="text-sm text-gray-500">
                {isGM ? 'Best performers nationwide' : 'Best performers in your region'}
              </p>
            </div>
            <button className="text-[#B08968] text-sm font-semibold hover:underline flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {(isGM ? topSellingItems : rmTopSellingItems).map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-gray-400 w-4">#{index + 1}</span>
                    <div className="w-10 h-10 bg-[#F5F0EB] rounded-xl flex items-center justify-center text-xl">
                      {item.image}
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-[#1F2933] text-sm">{item.name}</p>
                    <p className="text-xs text-gray-500">{item.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-[#1F2933]">{item.sales.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">sales</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Menu Proposals - Only for GM */}
        {isGM ? (
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#1F2933]">Pending Menu Proposals</h3>
                <p className="text-sm text-gray-500">Awaiting your review</p>
              </div>
              <button className="text-[#B08968] text-sm font-semibold hover:underline flex items-center gap-1">
                View All <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="space-y-4">
              {pendingProposals.map((proposal) => (
                <div
                  key={proposal.id}
                  className="p-4 border border-gray-100 rounded-xl hover:border-[#B08968]/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-[#B08968] to-[#DDB892] rounded-full flex items-center justify-center text-white font-bold text-sm">
                        {proposal.rmName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-[#1F2933] text-sm">{proposal.rmName}</p>
                        <p className="text-xs text-gray-500">RM - {proposal.region}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-semibold rounded-full flex items-center gap-1">
                      <Clock className="w-3 h-3" /> Pending
                    </span>
                  </div>
                  <div className="mb-3">
                    <p className="font-semibold text-[#1F2933]">
                      Proposed Item: {proposal.menuName}
                    </p>
                    <p className="text-sm text-gray-500 mt-1">{proposal.description}</p>
                    <p className="text-sm font-medium text-[#B08968] mt-1">
                      Rp {proposal.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-400">Submitted: {proposal.submittedAt}</p>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors">
                        <Check className="w-3 h-3" /> Approve
                      </button>
                      <button className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors">
                        <X className="w-3 h-3" /> Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* My Proposals Status - For RM */
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-[#1F2933]">My Proposal Status</h3>
                <p className="text-sm text-gray-500">Track your submitted proposals</p>
              </div>
              <button className="bg-[#B08968] hover:bg-[#9C6644] text-white text-sm font-semibold px-4 py-2 rounded-lg flex items-center gap-1 transition-colors">
                + Submit New
              </button>
            </div>
            <div className="space-y-3">
              {myProposals.map((proposal) => {
                const statusConfig = {
                  approved: { bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-500', icon: '✓' },
                  pending: { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-500', icon: '⏳' },
                  rejected: { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-500', icon: '✗' },
                };
                const config = statusConfig[proposal.status as keyof typeof statusConfig];

                return (
                  <div key={proposal.id} className={`p-4 border ${config.border} ${config.bg} rounded-xl`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-[#1F2933]">{proposal.name}</p>
                          <span className="text-sm text-[#B08968] font-medium">
                            Rp {proposal.price.toLocaleString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500">Submitted {proposal.submittedAt}</p>
                        {proposal.status === 'rejected' && proposal.rejectReason && (
                          <p className="text-xs text-red-600 mt-1">Reason: {proposal.rejectReason}</p>
                        )}
                      </div>
                      <span className={`px-3 py-1 ${config.badge} text-white text-xs font-semibold rounded-full capitalize`}>
                        {proposal.status}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Branch Performance - Only for RM */}
      {!isGM && (
        <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-[#1F2933]">Branch Performance</h3>
              <p className="text-sm text-gray-500">Revenue and orders per branch in your region</p>
            </div>
            <select className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#B08968]">
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Branch Name</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Revenue</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Orders</th>
                  <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-4">Trend</th>
                </tr>
              </thead>
              <tbody>
                {branchPerformanceData.map((branch, index) => (
                  <tr key={index} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#B08968] to-[#DDB892] rounded-lg flex items-center justify-center text-white font-bold text-xs">
                          {index + 1}
                        </div>
                        <span className="font-medium text-[#1F2933]">{branch.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-[#1F2933]">
                      Rp {(branch.revenue / 1000000).toFixed(1)}M
                    </td>
                    <td className="py-4 px-4 text-right text-gray-600">
                      {branch.orders.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${branch.trend.startsWith('+')
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-700'
                        }`}>
                        {branch.trend}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};