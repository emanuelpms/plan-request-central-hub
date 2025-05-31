
import React from 'react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const tabs = [
  { id: 'MENU', label: 'MENU' },
  { id: 'SERVICE', label: 'SERVICE' },
  { id: 'DEMONSTRACAO', label: 'DEMONSTRAÇÃO' },
  { id: 'APLICACAO', label: 'APLICAÇÃO' },
  { id: 'PASSWORD', label: 'PASSWORD' },
  { id: 'INSTALACAO_DEMO', label: 'INSTALAÇÃO DEMO' },
  { id: 'RAWDATA', label: 'RAWDATA' },
];

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <div className="bg-gray-200 border-b border-gray-300">
      <div className="flex overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "px-6 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
              activeTab === tab.id
                ? "bg-white border-blue-600 text-blue-600"
                : "border-transparent text-gray-700 hover:text-gray-900 hover:bg-gray-100"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Navigation;
