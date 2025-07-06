
import React, { useState } from 'react';
import { Eye, EyeOff, Shield, User, Lock } from 'lucide-react';
import { useUser } from '../context/UserContext';

const USERS = {
  admin: { password: 'admin123', name: 'Administrador', role: 'admin' as const, permissions: ['all'] },
  tecnico: { password: 'tec123', name: 'Técnico', role: 'tecnico' as const, permissions: ['service', 'data'] },
  vendas: { password: 'vendas123', name: 'Vendedor', role: 'vendedor' as const, permissions: ['demo', 'app'] }
};

interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLogging, setIsLogging] = useState(false);
  const [error, setError] = useState('');
  const { setUser } = useUser();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLogging(true);
    setError('');

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));

    const user = USERS[username as keyof typeof USERS];
    if (user && user.password === password) {
      const userData = {
        username,
        name: user.name,
        role: user.role,
        permissions: user.permissions
      };
      setUser(userData);
      localStorage.setItem('miniescopo_auth', JSON.stringify(userData));
      onLogin();
    } else {
      setError('Usuário ou senha incorretos');
    }
    setIsLogging(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="glass rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-4 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Sistema MiniEscopo</h1>
            <p className="text-white/70">V4.9 - Gestão Empresarial</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">Usuário</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                  placeholder="Digite seu usuário"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white/90 text-sm font-medium mb-2">Senha</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/50" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-12 pr-12 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                  placeholder="Digite sua senha"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 text-red-200 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLogging}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLogging ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-2"></div>
                  Entrando...
                </span>
              ) : (
                'Entrar no Sistema'
              )}
            </button>
          </form>

          <div className="mt-8 p-4 bg-white/5 rounded-lg border border-white/10">
            <h4 className="text-white/90 font-medium mb-3 text-sm">Usuários de Acesso:</h4>
            <div className="space-y-2 text-xs text-white/70">
              <div><strong>Admin:</strong> admin / admin123</div>
              <div><strong>Técnico:</strong> tecnico / tec123</div>
              <div><strong>Vendedor:</strong> vendas / vendas123</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
