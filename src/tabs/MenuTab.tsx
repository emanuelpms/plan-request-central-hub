
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { 
  Settings, 
  Monitor, 
  FileText, 
  Key, 
  Download, 
  Database,
  Users,
  BarChart3,
  Shield,
  Zap
} from 'lucide-react';

interface MenuTabProps {
  onNavigate: (tab: string) => void;
}

const MenuTab: React.FC<MenuTabProps> = ({ onNavigate }) => {
  const menuItems = [
    { 
      id: 'SERVICE', 
      title: 'SERVIÇO TÉCNICO', 
      description: 'Registro e acompanhamento de solicitações de serviço técnico especializado',
      icon: Settings,
      color: 'from-blue-600 to-blue-700',
      stats: '15 pendentes'
    },
    { 
      id: 'DEMONSTRACAO', 
      title: 'DEMONSTRAÇÃO', 
      description: 'Agendamento e gestão de demonstrações comerciais para clientes',
      icon: Monitor,
      color: 'from-green-600 to-green-700',
      stats: '8 agendadas'
    },
    { 
      id: 'APLICACAO', 
      title: 'APLICAÇÃO', 
      description: 'Solicitações de aplicação técnica e implementação de soluções',
      icon: FileText,
      color: 'from-purple-600 to-purple-700',
      stats: '12 em análise'
    },
    { 
      id: 'PASSWORD', 
      title: 'GESTÃO DE SENHAS', 
      description: 'Controle seguro de credenciais e acessos do sistema',
      icon: Key,
      color: 'from-orange-600 to-orange-700',
      stats: '3 solicitações'
    },
    { 
      id: 'INSTALACAO_DEMO', 
      title: 'INSTALAÇÃO DEMO', 
      description: 'Configuração e instalação de ambientes demonstrativos',
      icon: Download,
      color: 'from-indigo-600 to-indigo-700',
      stats: '5 instalações'
    },
    { 
      id: 'RAWDATA', 
      title: 'DADOS CONSOLIDADOS', 
      description: 'Visualização e análise de dados consolidados do sistema',
      icon: Database,
      color: 'from-gray-600 to-gray-700',
      stats: '247 registros'
    },
  ];

  const statsCards = [
    { label: 'Total de Solicitações', value: '247', icon: FileText, color: 'text-blue-600' },
    { label: 'Usuários Ativos', value: '34', icon: Users, color: 'text-green-600' },
    { label: 'Pendências', value: '15', icon: BarChart3, color: 'text-orange-600' },
    { label: 'Concluídas Hoje', value: '8', icon: Shield, color: 'text-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Welcome Section */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Sistema MiniEscopo
            <span className="text-blue-600"> V4.9</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Plataforma integrada para gestão completa de solicitações, demonstrações e análise de dados empresariais
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((stat, index) => (
            <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <stat.icon className={cn("w-8 h-8", stat.color)} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* System Alert */}
        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 border-0 shadow-xl text-white">
          <CardHeader className="pb-4">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6" />
              <CardTitle className="text-xl">Sistema Atualizado</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold text-lg mb-2">Novidades da Versão 4.9</h3>
              <ul className="space-y-2 text-sm text-blue-100">
                <li>• Interface completamente redesenhada e modernizada</li>
                <li>• Integração automática com APIs de CEP e CNPJ</li>
                <li>• Validação em tempo real de CPF/CNPJ</li>
                <li>• Formatação automática de campos</li>
                <li>• Sistema de notificações aprimorado</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Main Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Card 
                key={item.id} 
                className="group bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 cursor-pointer overflow-hidden"
                onClick={() => onNavigate(item.id)}
              >
                <div className={cn("h-2 bg-gradient-to-r", item.color)}></div>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className={cn("p-3 rounded-xl bg-gradient-to-r", item.color, "shadow-lg")}>
                      <IconComponent className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                      {item.stats}
                    </span>
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-800 group-hover:text-blue-700 transition-colors">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    {item.description}
                  </p>
                  <Button 
                    className={cn(
                      "w-full bg-gradient-to-r text-white font-semibold py-3 rounded-lg",
                      "transform group-hover:scale-105 transition-all duration-300 shadow-md hover:shadow-lg",
                      item.color
                    )}
                  >
                    Acessar Módulo
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">
            © 2024 Sistema MiniEscopo - Desenvolvido com tecnologia de ponta
          </p>
        </div>
      </div>
    </div>
  );
};

export default MenuTab;
