
import React, { useState, useEffect } from 'react';
import { Wrench, Monitor, FileText, Key, Download, Database, Bell, User } from 'lucide-react';
import { useUser } from '../../context/UserContext';

type Tab = 'menu' | 'service' | 'demo' | 'app' | 'password' | 'install' | 'data' | 'news' | 'users';

interface MenuPageProps {
  onNavigate: (tab: Tab) => void;
}

interface NewsItem {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  createdBy: string;
}

export const MenuPage: React.FC<MenuPageProps> = ({ onNavigate }) => {
  const { user } = useUser();
  const [news, setNews] = useState<NewsItem[]>([]);

  // Carregar notícias
  useEffect(() => {
    const savedNews = JSON.parse(localStorage.getItem('miniescopo_news') || '[]');
    setNews(savedNews.slice(0, 3)); // Mostrar apenas as 3 mais recentes
  }, []);

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
      show: user?.role === 'admin' || user?.role === 'samsung' || user?.role === 'callcenter' || user?.role === 'representante'
    },
    {
      id: 'news' as Tab,
      title: 'Notícias',
      description: 'Gerenciar notícias e comunicados do sistema',
      icon: Bell,
      color: 'from-red-500 to-red-600',
      show: user?.role === 'admin'
    },
    {
      id: 'users' as Tab,
      title: 'Usuários',
      description: 'Gerenciar usuários e níveis de acesso',
      icon: User,
      color: 'from-teal-500 to-teal-600',
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

      {/* Seção de Notícias */}
      {news.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Últimas Notícias</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <div key={item.id} className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-3">{item.content}</p>
                <div className="text-xs text-gray-500">
                  {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

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
