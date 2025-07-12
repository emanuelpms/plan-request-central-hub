
import React from 'react';
import { Home, Wrench, Monitor, FileText, Key, Download, Database, Settings, Bell, User } from 'lucide-react';
import { useUser } from '../context/UserContext';

type Tab = 'menu' | 'service' | 'demo' | 'app' | 'password' | 'install' | 'data' | 'config' | 'news' | 'users';

interface NavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  const { user } = useUser();

  const hasPermission = (permission: string) => {
    return user?.permissions.includes('all') || user?.permissions.includes(permission);
  };

  const tabs = [
    { id: 'menu' as Tab, label: 'Menu', icon: Home, show: true },
    { id: 'service' as Tab, label: 'Serviço', icon: Wrench, show: hasPermission('service') },
    { id: 'demo' as Tab, label: 'Demonstração', icon: Monitor, show: hasPermission('demo') },
    { id: 'app' as Tab, label: 'Aplicação', icon: FileText, show: hasPermission('app') },
    { id: 'password' as Tab, label: 'Licenças', icon: Key, show: hasPermission('password') },
    { id: 'install' as Tab, label: 'Instalação', icon: Download, show: true },
    { id: 'data' as Tab, label: 'Dados', icon: Database, show: user?.role === 'admin' || user?.role === 'samsung' || user?.role === 'callcenter' || user?.role === 'representante' },
    { id: 'config' as Tab, label: 'Configurações', icon: Settings, show: user?.role === 'admin' },
    { id: 'news' as Tab, label: 'Notícias', icon: Bell, show: user?.role === 'admin' },
    { id: 'users' as Tab, label: 'Usuários', icon: User, show: user?.role === 'admin' },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex space-x-8 overflow-x-auto">
          {tabs.filter(tab => tab.show).map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-blue-600 hover:border-blue-300'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
