
import React, { useState } from 'react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import MenuTab from '../tabs/MenuTab';
import ServiceTab from '../tabs/ServiceTab';
import DemonstracaoTab from '../tabs/DemonstracaoTab';
import AplicacaoTab from '../tabs/AplicacaoTab';
import PasswordTab from '../tabs/PasswordTab';
import InstalacaoDemoTab from '../tabs/InstalacaoDemoTab';
import RawDataTab from '../tabs/RawDataTab';

const Index = () => {
  const [activeTab, setActiveTab] = useState('MENU');

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'MENU':
        return <MenuTab onNavigate={setActiveTab} />;
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
        return <MenuTab onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="Rep - SOLICITAÇÃO DEMO" />
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      <div className="flex-1">
        {renderActiveTab()}
      </div>
    </div>
  );
};

export default Index;
