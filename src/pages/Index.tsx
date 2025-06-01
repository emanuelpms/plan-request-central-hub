
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import MenuTab from '../tabs/MenuTab';
import ServiceTab from '../tabs/ServiceTab';
import DemonstracaoTab from '../tabs/DemonstracaoTab';
import AplicacaoTab from '../tabs/AplicacaoTab';
import PasswordTab from '../tabs/PasswordTab';
import InstalacaoDemoTab from '../tabs/InstalacaoDemoTab';
import RawDataTab from '../tabs/RawDataTab';
import AdminConfig from '../components/AdminConfig';
import EmailConfig from '../components/EmailConfig';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const [activeTab, setActiveTab] = useState('MENU');
  const [showAdminConfig, setShowAdminConfig] = useState(false);
  const [showEmailConfig, setShowEmailConfig] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    // Carregar notificações ativas
    const savedNotifications = localStorage.getItem('miniescopo_notifications');
    if (savedNotifications) {
      const allNotifications = JSON.parse(savedNotifications);
      setNotifications(allNotifications.filter((n: any) => n.active));
    }

    // Listener para abrir configuração de email
    const handleOpenEmailConfig = () => setShowEmailConfig(true);
    window.addEventListener('openEmailConfig', handleOpenEmailConfig);
    
    return () => {
      window.removeEventListener('openEmailConfig', handleOpenEmailConfig);
    };
  }, []);

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'MENU':
        return <MenuTab onNavigate={setActiveTab} notifications={notifications} />;
      case 'SERVICE':
        return <ServiceTab />;
      case 'DEMONSTRACAO':
        return <DemonstracaoTab />;
      case 'APLICACAO':
        return <AplicacaoTab />;
      case 'PASSWORD':
        return <PasswordTab />;
      case 'INSTALACAO_DEMO':
        return <InstalacaoDemoTab />;
      case 'RAWDATA':
        return <RawDataTab />;
      default:
        return <MenuTab onNavigate={setActiveTab} notifications={notifications} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        title="Rep - SOLICITAÇÃO DEMO" 
        onOpenConfig={user?.role === 'admin' ? () => setShowAdminConfig(true) : undefined}
        notificationCount={notifications.length}
      />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1">
        {renderActiveTab()}
      </div>

      {/* Admin Config Modal */}
      {showAdminConfig && (
        <AdminConfig onClose={() => setShowAdminConfig(false)} />
      )}

      {/* Email Config Modal */}
      {showEmailConfig && (
        <EmailConfig onClose={() => setShowEmailConfig(false)} />
      )}
    </div>
  );
};

export default Index;
