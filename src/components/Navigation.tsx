
import React from 'react';
import { cn } from '@/lib/utils';
import { Settings, Monitor, FileText, Key, Download, Database, Menu } from 'lucide-react';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'MENU', label: 'MENU', icon: Menu },
  { id: 'SERVICE', label: 'SERVIÇO', icon: Settings },
  { id: 'DEMONSTRACAO', label: 'DEMONSTRAÇÃO', icon: Monitor },
  { id: 'APLICACAO', label: 'APLICAÇÃO', icon: FileText },
  { id: 'PASSWORD', label: 'SENHA', icon: Key },
  { id: 'INSTALACAO_DEMO', label: 'INSTALAÇÃO DEMO', icon: Download },
  { id: 'RAWDATA', label: 'DADOS', icon: Database },
];

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-lg sticky top-0 z-40">
      <div className="overflow-x-auto scrollbar-hide">
        <div className="flex min-w-max px-4">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={cn(
                  "flex items-center gap-3 px-6 py-4 text-sm font-semibold transition-all duration-300 border-b-3 relative group",
                  "hover:bg-blue-50/80 hover:scale-105 transform-gpu",
                  isActive
                    ? "border-blue-500 text-blue-600 bg-blue-50/50 shadow-lg"
                    : "border-transparent text-gray-600 hover:text-gray-900"
                )}
              >
                <div className={cn(
                  "p-2 rounded-xl transition-all duration-300",
                  isActive 
                    ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30" 
                    : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                )}>
                  <IconComponent className="w-4 h-4" />
                </div>
                
                <span className="whitespace-nowrap font-bold tracking-wide">
                  {tab.label}
                </span>
                
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full"></div>
                )}
                
                {/* Hover Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-blue-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
