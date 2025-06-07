
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Shield, Lock, User } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface LoginFormProps {
  onLogin: (user: { username: string; role: string; name: string }) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async () => {
    setLoading(true);
    
    // Buscar usuários cadastrados
    const savedUsers = localStorage.getItem('miniescopo_users');
    const users = savedUsers ? JSON.parse(savedUsers) : [
      {
        id: '1',
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        name: 'Administrador',
        email: 'admin@sistema.com',
        active: true
      }
    ];

    const user = users.find((u: any) => 
      u.username === username && 
      u.password === password && 
      u.active
    );

    if (user) {
      onLogin({ 
        username: user.username, 
        role: user.role,
        name: user.name
      });
      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo ao sistema, ${user.name}.`,
      });
    } else {
      toast({
        title: "Erro de autenticação",
        description: "Usuário, senha incorretos ou usuário inativo.",
        variant: "destructive"
      });
    }
    
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-6">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-0 shadow-2xl">
        <CardHeader className="text-center pb-8">
          <div className="mx-auto w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center mb-4 shadow-xl">
            <Shield className="w-10 h-10 text-white" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-800">Sistema MiniEscopo</CardTitle>
          <p className="text-gray-600">Entre com suas credenciais</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="username" className="text-sm font-semibold text-gray-700">
              Usuário
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 h-12 bg-gray-50 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                placeholder="Digite seu usuário"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
              Senha
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 h-12 bg-gray-50 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                placeholder="Digite sua senha"
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
          </div>

          <Button
            onClick={handleLogin}
            disabled={loading || !username || !password}
            className="w-full h-12 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-semibold rounded-xl shadow-lg"
          >
            {loading ? 'Entrando...' : 'Entrar no Sistema'}
          </Button>

          <div className="text-center text-xs text-gray-500 mt-4">
            <p>Usuário padrão: <span className="font-semibold">admin</span></p>
            <p>Senha padrão: <span className="font-semibold">admin123</span></p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginForm;
