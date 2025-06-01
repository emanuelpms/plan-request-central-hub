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
  TrendingUp,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Bell,
  Info,
  AlertTriangle
} from 'lucide-react';

interface MenuTabProps {
  onNavigate: (tab: string) => void;
  notifications?: any[];
}

const MenuTab: React.FC<MenuTabProps> = ({ onNavigate, notifications = [] }) => {
  const menuItems = [
    { 
      id: 'SERVICE', 
      title: 'SERVIÇO TÉCNICO', 
      description: 'Registro e acompanhamento de solicitações de serviço técnico especializado com controle total do processo',
      icon: Settings,
      gradient: 'from-blue-600 via-blue-700 to-indigo-800',
      stats: '15 pendentes',
      trending: '+12% este mês'
    },
    { 
      id: 'DEMONSTRACAO', 
      title: 'DEMONSTRAÇÃO', 
      description: 'Agendamento e gestão de demonstrações comerciais para clientes com acompanhamento completo',
      icon: Monitor,
      gradient: 'from-emerald-600 via-green-700 to-teal-800',
      stats: '8 agendadas',
      trending: '+25% este mês'
    },
    { 
      id: 'APLICACAO', 
      title: 'APLICAÇÃO', 
      description: 'Solicitações de aplicação técnica e implementação de soluções personalizadas',
      icon: FileText,
      gradient: 'from-purple-600 via-violet-700 to-indigo-800',
      stats: '12 em análise',
      trending: '+8% este mês'
    },
    { 
      id: 'PASSWORD', 
      title: 'GESTÃO DE SENHAS', 
      description: 'Controle seguro de credenciais e acessos do sistema com máxima segurança',
      icon: Key,
      gradient: 'from-orange-600 via-red-600 to-pink-700',
      stats: '3 solicitações',
      trending: 'Estável'
    },
    { 
      id: 'INSTALACAO_DEMO', 
      title: 'INSTALAÇÃO DEMO', 
      description: 'Configuração e instalação de ambientes demonstrativos com setup completo',
      icon: Download,
      gradient: 'from-indigo-600 via-purple-700 to-pink-800',
      stats: '5 instalações',
      trending: '+40% este mês'
    },
    { 
      id: 'RAWDATA', 
      title: 'DADOS CONSOLIDADOS', 
      description: 'Visualização e análise de dados consolidados do sistema com relatórios avançados',
      icon: Database,
      gradient: 'from-gray-700 via-slate-800 to-gray-900',
      stats: '247 registros',
      trending: 'Crescendo'
    },
  ];

  const statsCards = [
    { label: 'Total de Solicitações', value: '247', icon: FileText, color: 'from-blue-500 to-cyan-600', change: '+15%' },
    { label: 'Usuários Ativos', value: '34', icon: Users, color: 'from-green-500 to-emerald-600', change: '+8%' },
    { label: 'Pendências', value: '15', icon: BarChart3, color: 'from-orange-500 to-red-600', change: '-12%' },
    { label: 'Concluídas Hoje', value: '8', icon: Shield, color: 'from-purple-500 to-indigo-600', change: '+22%' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-100/30">
      <div className="max-w-7xl mx-auto p-8 space-y-10">
        {/* Notifications Section */}
        {notifications.length > 0 && (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <Card key={notification.id} className={cn(
                "border-l-4",
                notification.type === 'info' ? 'border-l-blue-500 bg-blue-50' :
                notification.type === 'warning' ? 'border-l-yellow-500 bg-yellow-50' :
                'border-l-green-500 bg-green-50'
              )}>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "p-2 rounded-full",
                      notification.type === 'info' ? 'bg-blue-100 text-blue-600' :
                      notification.type === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                      'bg-green-100 text-green-600'
                    )}>
                      {notification.type === 'warning' ? (
                        <AlertTriangle className="w-5 h-5" />
                      ) : notification.type === 'success' ? (
                        <CheckCircle className="w-5 h-5" />
                      ) : (
                        <Info className="w-5 h-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{notification.title}</h3>
                      <p className="text-gray-600 mt-1">{notification.message}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(notification.createdAt).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Hero Section */}
        <div className="text-center py-12 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 via-transparent to-purple-600/10 rounded-3xl"></div>
          <div className="relative">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-2 rounded-full text-white text-sm font-bold mb-6 shadow-lg">
              <Sparkles className="w-4 h-4" />
              SISTEMA ATUALIZADO V4.9
            </div>
            <h1 className="text-6xl font-black text-transparent bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-900 bg-clip-text mb-6">
              MiniEscopo
            </h1>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed font-medium">
              Plataforma integrada para gestão completa de solicitações, demonstrações e análise de dados empresariais com tecnologia de ponta
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statsCards.map((stat, index) => (
            <Card key={index} className="group relative overflow-hidden bg-white/80 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 rounded-2xl">
              <div className={cn("absolute inset-0 bg-gradient-to-br opacity-5", stat.color)}></div>
              <CardContent className="p-6 relative">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn("p-3 rounded-2xl bg-gradient-to-br shadow-lg", stat.color)}>
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-xs font-bold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                    {stat.change}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-black text-gray-900">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* System Alert */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 border-0 shadow-2xl text-white rounded-3xl">
          <div className="absolute inset-0 opacity-30">
            <div className="w-full h-full" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
          </div>
          <CardHeader className="pb-4 relative">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl">
                <TrendingUp className="w-8 h-8" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">Novidades da Versão 4.9</CardTitle>
                <p className="text-blue-100 font-medium">Sistema completamente redesenhado</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="relative">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    Melhorias Principais
                  </h3>
                  <ul className="space-y-3 text-sm text-blue-100">
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-blue-300" />
                      Interface moderna estilo Apple
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-blue-300" />
                      Integração automática ViaCEP e CNPJ
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-blue-300" />
                      Validação em tempo real
                    </li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-300" />
                    Recursos Avançados
                  </h3>
                  <ul className="space-y-3 text-sm text-blue-100">
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-blue-300" />
                      Formatação automática de campos
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-blue-300" />
                      Sistema de notificações aprimorado
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-blue-300" />
                      Performance otimizada
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Card 
                key={item.id} 
                className="group relative overflow-hidden bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 cursor-pointer rounded-3xl"
                onClick={() => onNavigate(item.id)}
              >
                {/* Background Gradient */}
                <div className={cn("absolute inset-0 bg-gradient-to-br opacity-5 group-hover:opacity-10 transition-opacity", item.gradient)}></div>
                
                {/* Top Accent */}
                <div className={cn("h-2 bg-gradient-to-r", item.gradient)}></div>
                
                <CardHeader className="pb-4 relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className={cn("p-4 rounded-2xl bg-gradient-to-br shadow-xl group-hover:scale-110 transition-transform duration-300", item.gradient)}>
                      <IconComponent className="w-7 h-7 text-white" />
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full mb-1">
                        {item.stats}
                      </div>
                      <div className="text-xs text-green-600 font-semibold">
                        {item.trending}
                      </div>
                    </div>
                  </div>
                  <CardTitle className="text-xl font-black text-gray-800 group-hover:text-blue-700 transition-colors leading-tight">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="pt-0 relative">
                  <p className="text-gray-600 text-sm mb-8 leading-relaxed font-medium">
                    {item.description}
                  </p>
                  <Button 
                    className={cn(
                      "w-full text-white font-bold py-4 h-14 rounded-2xl text-base",
                      "transform group-hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl",
                      "bg-gradient-to-r", item.gradient,
                      "relative overflow-hidden"
                    )}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      ACESSAR MÓDULO
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center py-12">
          <div className="inline-flex items-center gap-2 text-gray-500 text-sm font-medium bg-white/50 backdrop-blur-sm px-6 py-3 rounded-2xl border border-gray-200">
            <Sparkles className="w-4 h-4" />
            © 2024 Sistema MiniEscopo - Desenvolvido com tecnologia de ponta
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuTab;
