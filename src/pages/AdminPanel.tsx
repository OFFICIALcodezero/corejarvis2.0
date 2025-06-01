
import React, { useState, useEffect } from 'react';
import { AdminAuthService } from '@/services/adminAuthService';
import AdminLogin from '@/components/AdminLogin';
import AdminApiKeyManager from '@/components/AdminApiKeyManager';

const AdminPanel: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if already authenticated
    const authenticated = AdminAuthService.isAuthenticated();
    setIsAuthenticated(authenticated);
    setIsLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-blue-400 text-xl">Loading Admin Panel...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AdminLogin onLoginSuccess={handleLoginSuccess} />;
  }

  return <AdminApiKeyManager />;
};

export default AdminPanel;
