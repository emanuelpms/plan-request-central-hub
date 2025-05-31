
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MenuTabProps {
  onNavigate: (tab: string) => void;
}

const MenuTab: React.FC<MenuTabProps> = ({ onNavigate }) => {
  const menuItems = [
    { id: 'SERVICE', title: 'SERVICE', description: 'Solicitações de serviço técnico' },
    { id: 'DEMONSTRACAO', title: 'DEMONSTRAÇÃO', description: 'Agendamento de demonstrações' },
    { id: 'APLICACAO', title: 'APLICAÇÃO', description: 'Solicitações de aplicação' },
    { id: 'PASSWORD', title: 'PASSWORD', description: 'Gerenciamento de senhas' },
    { id: 'INSTALACAO_DEMO', title: 'INSTALAÇÃO DEMO', description: 'Instalações demonstrativas' },
    { id: 'RAWDATA', title: 'RAWDATA', description: 'Visualizar dados consolidados' },
  ];

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto">
        <Card className="mb-6">
          <CardHeader className="bg-blue-800 text-white">
            <CardTitle>Avisos</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Sistema MiniEscopo V4.9</h3>
              <p className="text-yellow-700">
                Sistema de gestão de solicitações para registro, gerenciamento e consolidação 
                de diferentes tipos de solicitações de clientes. Selecione uma das opções abaixo 
                para começar.
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {menuItems.map((item) => (
            <Card key={item.id} className="hover:shadow-lg transition-shadow cursor-pointer">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg text-blue-800 mb-2">{item.title}</h3>
                <p className="text-gray-600 mb-4">{item.description}</p>
                <Button 
                  onClick={() => onNavigate(item.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Acessar
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MenuTab;
