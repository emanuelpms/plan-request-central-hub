
import React, { useState, useEffect } from 'react';
import { Bell, Settings, LogOut, Calendar } from 'lucide-react';
import { useUser } from '../context/UserContext';

interface HeaderProps {
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogout }) => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { user } = useUser();

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">MS</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold gradient-text">MiniEscopo</h1>
              <p className="text-sm text-gray-600">Sistema de Gestão V4.9</p>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{currentTime.toLocaleDateString('pt-BR', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}</span>
            </div>

            <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
            </button>

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user?.name.charAt(0)}
                </span>
              </div>
              <div className="text-sm">
                <div className="font-semibold text-gray-900">{user?.name}</div>
                <div className="text-gray-600 capitalize">{user?.role}</div>
              </div>
            </div>

            <button
              onClick={onLogout}
              className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
