
import React from 'react';
import { Wrench, Monitor, FileText, Key, Download, Database } from 'lucide-react';
import { useUser } from '../../context/UserContext';

type Tab = 'menu' | 'service' | 'demo' | 'app' | 'password' | 'install' | 'data';

interface MenuPageProps {
  onNavigate: (tab: Tab) => void;
}

export const MenuPage: React.FC<MenuPageProps> = ({ onNavigate }) => {
  const { user } = useUser();

  const hasPermission = (permission: string) => {
    return user?.permissions.includes('all') || user?.permissions.includes(permission);
  };

  const menuItems = [
    {
      id: 'service' as Tab,
      title: 'Serviço Técnico',
      description: 'Solicitações de manutenção, reparo e suporte técnico especializado',
      icon: Wrench,
      color: 'from-blue-500 to-blue-600',
      show: hasPermission('service')
    },
    {
      id: 'demo' as Tab,
      title: 'Demonstração',
      description: 'Agendamento de demonstrações de produtos e apresentações técnicas',
      icon: Monitor,
      color: 'from-green-500 to-green-600',
      show: hasPermission('demo')
    },
    {
      id: 'app' as Tab,
      title: 'Aplicação',
      description: 'Solicitações de configuração e aplicação de software',
      icon: FileText,
      color: 'from-purple-500 to-purple-600',
      show: hasPermission('app')
    },
    {
      id: 'password' as Tab,
      title: 'Licenças',
      description: 'Solicitações de passwords, licenças e ativação de funcionalidades',
      icon: Key,
      color: 'from-orange-500 to-orange-600',
      show: hasPermission('password')
    },
    {
      id: 'install' as Tab,
      title: 'Instalação',
      description: 'Instalação de versões demonstrativas para avaliação',
      icon: Download,
      color: 'from-indigo-500 to-indigo-600',
      show: true
    },
    {
      id: 'data' as Tab,
      title: 'Dados do Sistema',
      description: 'Visualização e gerenciamento de dados administrativos',
      icon: Database,
      color: 'from-gray-500 to-gray-600',
      show: user?.role === 'admin'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Bem-vindo, {user?.name}!
        </h1>
        <p className="text-xl text-gray-600">
          Selecione uma das opções abaixo para começar
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {menuItems.filter(item => item.show).map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer hover:-translate-y-2 border border-gray-100"
            >
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${item.color} flex items-center justify-center mb-6 shadow-lg`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
              <p className="text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};
