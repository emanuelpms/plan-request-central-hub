
import React from 'react';

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
    <div className="bg-gradient-to-r from-blue-800 to-blue-900 text-white p-4 shadow-lg">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <span className="bg-blue-700 px-2 py-1 rounded text-sm font-medium">
            {version}
          </span>
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
        <div className="text-sm">
          Data: {date}
        </div>
      </div>
    </div>
  );
};

export default Header;
