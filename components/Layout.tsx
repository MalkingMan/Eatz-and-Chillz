import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { LayoutDashboard, UtensilsCrossed, FileText, BarChart2, TrendingUp, LogOut, Menu as MenuIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { User, UserRole } from '../types';

interface LayoutProps {
  user: User;
  children: React.ReactNode;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ user, children, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const getNavClass = (isActive: boolean) => {
    return `flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-4'} py-3 rounded-lg transition-all duration-200 ${
      isActive 
        ? 'bg-secondary text-white font-medium shadow-md' 
        : 'text-gray-300 hover:bg-white/10 hover:text-white'
    }`;
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      {/* Sidebar */}
      <aside 
        className={`${
          isCollapsed ? 'w-20' : 'w-64'
        } bg-primary flex-shrink-0 flex flex-col text-white shadow-xl z-20 transition-all duration-300 relative`}
      >
        {/* Collapse Toggle Button - Updated Position & Style */}
        <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-3 top-7 z-50 flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-white text-primary shadow-lg transition-all hover:bg-gray-50 hover:text-secondary hover:scale-110 focus:outline-none"
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
            {isCollapsed ? <ChevronRight size={16} strokeWidth={3} /> : <ChevronLeft size={16} strokeWidth={3} />}
        </button>

        <div className={`p-6 flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'} transition-all duration-300 overflow-hidden h-[88px]`}>
            <div className="bg-secondary p-2 rounded-lg flex-shrink-0 shadow-lg">
                <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <h1 className={`text-xl font-bold tracking-tight whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}`}>
                Eatz & Chillz
            </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 py-4 overflow-y-auto overflow-x-hidden">
            <NavLink to="/dashboard" className={({ isActive }) => getNavClass(isActive)} title={isCollapsed ? "Dashboard" : ""}>
                <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
                <span className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 overflow-hidden hidden' : 'w-auto opacity-100 block'}`}>Dashboard</span>
            </NavLink>

            {user.role === UserRole.GM && (
                <NavLink to="/menu-management" className={({ isActive }) => getNavClass(isActive)} title={isCollapsed ? "Menu Management" : ""}>
                    <MenuIcon className="w-5 h-5 flex-shrink-0" />
                    <span className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 overflow-hidden hidden' : 'w-auto opacity-100 block'}`}>Menu Management</span>
                </NavLink>
            )}

            <NavLink to="/menu-proposal" className={({ isActive }) => getNavClass(isActive)} title={isCollapsed ? "Menu Proposal" : ""}>
                <FileText className="w-5 h-5 flex-shrink-0" />
                <span className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 overflow-hidden hidden' : 'w-auto opacity-100 block'}`}>Menu Proposal</span>
            </NavLink>

            <NavLink to="/analytics" className={({ isActive }) => getNavClass(isActive)} title={isCollapsed ? "Analytics" : ""}>
                <BarChart2 className="w-5 h-5 flex-shrink-0" />
                <span className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 overflow-hidden hidden' : 'w-auto opacity-100 block'}`}>Analytics</span>
            </NavLink>

            <NavLink to="/trends" className={({ isActive }) => getNavClass(isActive)} title={isCollapsed ? "Tren Makanan" : ""}>
                <TrendingUp className="w-5 h-5 flex-shrink-0" />
                <span className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 overflow-hidden hidden' : 'w-auto opacity-100 block'}`}>Tren Makanan</span>
            </NavLink>
        </nav>

        <div className="p-4 border-t border-white/10">
            <button 
                onClick={onLogout}
                className={`flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-3 px-4'} py-3 w-full text-gray-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors group`}
                title={isCollapsed ? "Logout" : ""}
            >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                <span className={`whitespace-nowrap transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 overflow-hidden hidden' : 'w-auto opacity-100 block'}`}>Logout</span>
            </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full min-w-0 overflow-hidden transition-all duration-300">
        {/* Header */}
        <header className="h-16 bg-white border-b border-border flex items-center justify-between px-8 flex-shrink-0 z-10">
            <h2 className="text-2xl font-bold text-textPrimary capitalize">
                {location.pathname.replace('/', '').replace('-', ' ') || 'Dashboard'}
            </h2>
            
            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="text-sm font-semibold text-textPrimary">{user.name}</p>
                    <p className="text-xs text-textSecondary">{user.role}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden border-2 border-white shadow-sm">
                    <img src={user.avatar} alt="User" className="w-full h-full object-cover" />
                </div>
            </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-auto p-8">
            <div className="mx-auto max-w-7xl animate-fade-in">
                {children}
            </div>
        </div>
      </main>
    </div>
  );
};