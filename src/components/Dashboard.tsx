
import React, { useState, useEffect } from 'react';
import { Header } from './Header';
import { Navigation } from './Navigation';
import { MenuPage } from './pages/MenuPage';
import { ServiceForm } from './pages/ServiceForm';
import { DemoForm } from './pages/DemoForm';
import { AppForm } from './pages/AppForm';
import { PasswordForm } from './pages/PasswordForm';
import { InstallForm } from './pages/InstallForm';
import { DataPage } from './pages/DataPage';
import { ConfigPage } from './pages/ConfigPage';
import { useUser } from '../context/UserContext';

type Tab = 'menu' | 'service' | 'demo' | 'app' | 'password' | 'install' | 'data' | 'config';

interface DashboardProps {
  onLogout: () => void;
}

interface FormData {
  id: string;
  type: string;
  data: any;
  createdAt: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<Tab>('menu');
  const [editingForm, setEditingForm] = useState<FormData | null>(null);
  const { user } = useUser();

  const hasPermission = (permission: string) => {
    return user?.permissions.includes('all') || user?.permissions.includes(permission);
  };

  const handleEditForm = (formData: FormData) => {
    setEditingForm(formData);
    setActiveTab(formData.type as Tab);
  };

  const clearEditingForm = () => {
    setEditingForm(null);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'menu':
        return <MenuPage onNavigate={setActiveTab} />;
      case 'service':
        return hasPermission('service') ? 
          <ServiceForm editingData={editingForm} onClearEdit={clearEditingForm} /> : 
          <div className="text-red-500">Acesso negado</div>;
      case 'demo':
        return hasPermission('demo') ? 
          <DemoForm editingData={editingForm} onClearEdit={clearEditingForm} /> : 
          <div className="text-red-500">Acesso negado</div>;
      case 'app':
        return hasPermission('app') ? 
          <AppForm editingData={editingForm} onClearEdit={clearEditingForm} /> : 
          <div className="text-red-500">Acesso negado</div>;
      case 'password':
        return hasPermission('password') ? 
          <PasswordForm editingData={editingForm} onClearEdit={clearEditingForm} /> : 
          <div className="text-red-500">Acesso negado</div>;
      case 'install':
        return <InstallForm editingData={editingForm} onClearEdit={clearEditingForm} />;
      case 'data':
        return (user?.role === 'admin' || user?.role === 'samsung' || user?.role === 'callcenter' || user?.role === 'representante') ? 
          <DataPage onEditForm={handleEditForm} userRole={user.role} representativeId={user.representativeId} /> : 
          <div className="text-red-500">Acesso negado</div>;
      case 'config':
        return user?.role === 'admin' ? 
          <ConfigPage /> : 
          <div className="text-red-500">Acesso negado</div>;
      default:
        return <MenuPage onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLogout={onLogout} />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="container mx-auto px-4 py-8">
        {renderContent()}
      </main>
    </div>
  );
};
