
import React from 'react';
import { Calendar, User, Settings, Sparkles, LogOut, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface HeaderProps {
  title: string;
  version?: string;
  date?: string;
  onOpenConfig?: () => void;
  notificationCount?: number;
}

const Header: React.FC<HeaderProps> = ({ 
  title, 
  version = "V4.9", 
  date = new Date().toLocaleDateString('pt-BR'),
  onOpenConfig,
  notificationCount = 0
}) => {
  const { user, logout } = useAuth();

  return (
    <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white shadow-2xl overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="w-full h-full" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"></div>
      
      <div className="relative px-8 py-4">
        <div className="flex justify-between items-center">
          {/* Left Section - Logo and Title */}
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              {/* Logo Icon */}
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-xl shadow-blue-500/30">
                  <Settings className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Sparkles className="w-2.5 h-2.5 text-yellow-800" />
                </div>
              </div>
              
              {/* Title and Version */}
              <div>
                <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                  {title}
                </h1>
                <div className="flex items-center gap-3 mt-1">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-500 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                    {version}
                  </div>
                  <span className="text-blue-200 text-xs font-medium">Sistema de Gestão Empresarial</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Right Section - Controls */}
          <div className="flex items-center gap-4">
            {/* Date Display */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 shadow-lg">
              <Calendar className="w-4 h-4 text-blue-300" />
              <span className="text-xs font-semibold">{date}</span>
            </div>
            
            {/* Notifications */}
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20 shadow-lg hover:bg-white/15 text-white"
              >
                <Bell className="w-4 h-4" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </Button>
            </div>

            {/* Config Button (Admin only) */}
            {user?.role === 'admin' && onOpenConfig && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenConfig}
                className="bg-white/10 backdrop-blur-md px-3 py-2 rounded-xl border border-white/20 shadow-lg hover:bg-white/15 text-white"
              >
                <Settings className="w-4 h-4" />
              </Button>
            )}
            
            {/* User Profile */}
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/20 shadow-lg">
              <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                <User className="w-3 h-3 text-white" />
              </div>
              <span className="text-xs font-semibold">{user?.username || 'Usuário'}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={logout}
                className="ml-2 p-1 hover:bg-white/20 rounded text-white"
              >
                <LogOut className="w-3 h-3" />
              </Button>
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
