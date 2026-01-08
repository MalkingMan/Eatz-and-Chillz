import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { User, UserRole } from './types';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { MenuManagement } from './pages/MenuManagement';
import { MenuProposal } from './pages/MenuProposal';
import { Analytics } from './pages/Analytics';
import { TrenMakanan } from './pages/TrenMakanan';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogin = (role: UserRole) => {
    setUser({
      id: '1',
      name: role === UserRole.GM ? 'Muhammad Array' : 'Dzaky Pratama',
      role: role,
      avatar: `https://i.pravatar.cc/150?u=${role}`,
    });
  };

  const handleRegister = (role: UserRole) => {
    // After registration, log the user in
    setUser({
      id: '1',
      name: role === UserRole.GM ? 'New GM User' : 'New RM User',
      role: role,
      avatar: `https://i.pravatar.cc/150?u=${role}`,
    });
    setShowRegister(false);
  };

  const handleLogout = () => {
    setUser(null);
    setShowRegister(false);
  };

  if (!user) {
    if (showRegister) {
      return <Register onRegister={handleRegister} onSwitchToLogin={() => setShowRegister(false)} />;
    }
    return <Login onLogin={handleLogin} onSwitchToRegister={() => setShowRegister(true)} />;
  }

  return (
    <HashRouter>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard user={user} />} />

          {/* GM Only Route */}
          {user.role === UserRole.GM && (
            <Route path="/menu-management" element={<MenuManagement />} />
          )}

          {/* Shared Routes */}
          <Route path="/menu-proposal" element={<MenuProposal user={user} />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/trends" element={<TrenMakanan />} />

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}