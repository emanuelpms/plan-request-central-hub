
import React from 'react';
import { Calendar, User, Settings } from 'lucide-react';

interface HeaderProps {
  title: string;
  version?: string;
  date?: string;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  version = "V4.9", 
  date = new Date().toLocaleDateString('pt-BR') 
}) => {
  return (
    <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white shadow-2xl border-b border-blue-700">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <Settings className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <span className="bg-blue-600 px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                    {version}
                  </span>
                  <span className="text-blue-200 text-sm">Sistema de Gestão</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 bg-blue-800/50 px-4 py-2 rounded-lg backdrop-blur-sm">
              <Calendar className="w-4 h-4 text-blue-300" />
              <span className="text-sm font-medium">{date}</span>
            </div>
            
            <div className="flex items-center gap-2 bg-blue-800/50 px-4 py-2 rounded-lg backdrop-blur-sm">
              <User className="w-4 h-4 text-blue-300" />
              <span className="text-sm font-medium">Usuário</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
