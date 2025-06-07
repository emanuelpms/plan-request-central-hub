
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Users, Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'user';
  name: string;
  email: string;
  active: boolean;
  createdAt: string;
}

interface UserManagementProps {
  onClose: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ onClose }) => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem('miniescopo_users');
    return savedUsers ? JSON.parse(savedUsers) : [
      {
        id: '1',
        username: 'admin',
        password: 'admin123',
        role: 'admin',
        name: 'Administrador',
        email: 'admin@sistema.com',
        active: true,
        createdAt: new Date().toISOString()
      }
    ];
  });

  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    role: 'user' as 'admin' | 'user',
    name: '',
    email: '',
    active: true
  });

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showPassword, setShowPassword] = useState<{ [key: string]: boolean }>({});

  const saveUsers = (updatedUsers: User[]) => {
    setUsers(updatedUsers);
    localStorage.setItem('miniescopo_users', JSON.stringify(updatedUsers));
  };

  const handleAddUser = () => {
    if (!newUser.username || !newUser.password || !newUser.name || !newUser.email) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const userExists = users.some(u => u.username === newUser.username);
    if (userExists) {
      toast({
        title: "Erro",
        description: "Nome de usuário já existe.",
        variant: "destructive"
      });
      return;
    }

    const user: User = {
      id: Date.now().toString(),
      ...newUser,
      createdAt: new Date().toISOString()
    };

    saveUsers([...users, user]);
    setNewUser({
      username: '',
      password: '',
      role: 'user',
      name: '',
      email: '',
      active: true
    });

    toast({
      title: "Sucesso",
      description: "Usuário criado com sucesso.",
    });
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
  };

  const handleUpdateUser = () => {
    if (!editingUser) return;

    const updatedUsers = users.map(u => 
      u.id === editingUser.id ? editingUser : u
    );
    saveUsers(updatedUsers);
    setEditingUser(null);

    toast({
      title: "Sucesso",
      description: "Usuário atualizado com sucesso.",
    });
  };

  const handleDeleteUser = (userId: string) => {
    if (userId === '1') {
      toast({
        title: "Erro",
        description: "Não é possível excluir o administrador principal.",
        variant: "destructive"
      });
      return;
    }

    const updatedUsers = users.filter(u => u.id !== userId);
    saveUsers(updatedUsers);

    toast({
      title: "Sucesso",
      description: "Usuário excluído com sucesso.",
    });
  };

  const togglePasswordVisibility = (userId: string) => {
    setShowPassword(prev => ({
      ...prev,
      [userId]: !prev[userId]
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-auto bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="w-6 h-6" />
              <CardTitle className="text-xl">Gerenciamento de Usuários</CardTitle>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              ✕
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          {/* Add New User */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Adicionar Novo Usuário
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="username">Nome de Usuário *</Label>
                  <Input
                    id="username"
                    value={newUser.username}
                    onChange={(e) => setNewUser({...newUser, username: e.target.value})}
                    placeholder="Digite o nome de usuário"
                  />
                </div>
                <div>
                  <Label htmlFor="name">Nome Completo *</Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    placeholder="Digite o nome completo"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">E-mail *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    placeholder="Digite o e-mail"
                  />
                </div>
                <div>
                  <Label htmlFor="password">Senha *</Label>
                  <Input
                    id="password"
                    type="password"
                    value={newUser.password}
                    onChange={(e) => setNewUser({...newUser, password: e.target.value})}
                    placeholder="Digite a senha"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="role">Tipo de Usuário</Label>
                <select
                  id="role"
                  value={newUser.role}
                  onChange={(e) => setNewUser({...newUser, role: e.target.value as 'admin' | 'user'})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="user">Usuário</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>

              <Button onClick={handleAddUser} className="w-full">
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Usuário
              </Button>
            </CardContent>
          </Card>

          {/* Users List */}
          <Card>
            <CardHeader>
              <CardTitle>Usuários Cadastrados ({users.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold">{user.name}</span>
                        <Badge variant={user.role === 'admin' ? 'default' : 'secondary'}>
                          {user.role === 'admin' ? 'Admin' : 'Usuário'}
                        </Badge>
                        <Badge variant={user.active ? 'default' : 'destructive'}>
                          {user.active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      <div className="text-sm text-gray-600">
                        <div>Usuário: {user.username}</div>
                        <div>E-mail: {user.email}</div>
                        <div className="flex items-center gap-2">
                          Senha: {showPassword[user.id] ? user.password : '••••••••'}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePasswordVisibility(user.id)}
                          >
                            {showPassword[user.id] ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </Button>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditUser(user)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      {user.id !== '1' && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Editar Usuário</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Nome Completo</Label>
                <Input
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                />
              </div>
              <div>
                <Label>E-mail</Label>
                <Input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                />
              </div>
              <div>
                <Label>Senha</Label>
                <Input
                  type="password"
                  value={editingUser.password}
                  onChange={(e) => setEditingUser({...editingUser, password: e.target.value})}
                />
              </div>
              <div>
                <Label>Tipo</Label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value as 'admin' | 'user'})}
                  className="w-full p-2 border rounded-md"
                  disabled={editingUser.id === '1'}
                >
                  <option value="user">Usuário</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingUser.active}
                  onChange={(e) => setEditingUser({...editingUser, active: e.target.checked})}
                  disabled={editingUser.id === '1'}
                />
                <Label>Usuário Ativo</Label>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpdateUser} className="flex-1">
                  Salvar
                </Button>
                <Button variant="outline" onClick={() => setEditingUser(null)} className="flex-1">
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
