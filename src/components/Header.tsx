
import React from 'react';
import { Calendar, User, Settings, Sparkles } from 'lucide-react';

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
    <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white shadow-2xl overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"1\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-30"></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      
      <div className="relative px-8 py-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-4">
              {/* Logo Icon */}
              <div className="relative">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-blue-500/30 rotate-3 hover:rotate-0 transition-transform duration-300">
                  <Settings className="w-7 h-7 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-yellow-800" />
                </div>
              </div>
              
              {/* Title and Version */}
              <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  {title}
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">
                    {version}
                  </div>
                  <span className="text-blue-200 text-sm font-medium">Sistema de Gestão Empresarial</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Section */}
          <div className="flex items-center gap-6">
            {/* Date Display */}
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 shadow-xl">
              <Calendar className="w-5 h-5 text-blue-300" />
              <span className="text-sm font-semibold">{date}</span>
            </div>
            
            {/* User Profile */}
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/20 shadow-xl hover:bg-white/15 transition-colors cursor-pointer">
              <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm font-semibold">Administrador</span>
            </div>
          </div>
        </div>
        
        {/* Bottom Accent Line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
      </div>
    </div>
  );
};

export default Header;
