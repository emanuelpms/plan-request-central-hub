
import React from 'react';
import { Monitor } from 'lucide-react';

export const DemoForm: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
          <div className="flex items-center space-x-3">
            <Monitor className="w-8 h-8 text-white" />
            <h2 className="text-2xl font-bold text-white">Demonstração</h2>
          </div>
        </div>
        <div className="p-12 text-center">
          <Monitor className="w-24 h-24 text-green-500 mx-auto mb-6" />
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Em Desenvolvimento</h3>
          <p className="text-gray-600 text-lg">Esta seção está sendo desenvolvida e estará disponível em breve.</p>
        </div>
      </div>
    </div>
  );
};
