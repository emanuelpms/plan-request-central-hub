import React, { useState, useEffect } from 'react';
import { Users, Plus, Edit2, Trash2, Shield, Building, AlertCircle, Eye, EyeOff } from 'lucide-react';
import { useCurrentUser } from '../../hooks/useCurrentUser';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'samsung' | 'callcenter' | 'representative';
  representation?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export const UserManagementPage: React.FC = () => {
  const { user } = useCurrentUser();
  const currentUser = user;
  const [users, setUsers] = useState<User[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'representative' as 'admin' | 'samsung' | 'callcenter' | 'representative',
    representation: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState('');

  const roles = {
    admin: { label: 'Administrador', color: 'bg-red-500', icon: '👑' },
    samsung: { label: 'Time Samsung', color: 'bg-blue-500', icon: '🏢' },
    callcenter: { label: 'Call Center', color: 'bg-green-500', icon: '📞' },
    representative: { label: 'Representante', color: 'bg-purple-500', icon: '🤝' }
  };

  const representations = [
    'Samsung Healthcare',
    'Região Norte',
    'Região Nordeste', 
    'Região Centro-Oeste',
    'Região Sudeste',
    'Região Sul',
    'Distribuidor Nacional',
    'Parceiro Premium'
  ];

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    const savedUsers = JSON.parse(localStorage.getItem('miniescopo_users') || '[]');
    // Add default admin if no users exist
    if (savedUsers.length === 0) {
      const defaultAdmin: User = {
        id: 'admin-001',
        name: 'Administrador',
        email: 'admin@miniescopo.com',
        role: 'admin',
        isActive: true,
        createdAt: new Date().toISOString()
      };
      savedUsers.push(defaultAdmin);
      localStorage.setItem('miniescopo_users', JSON.stringify(savedUsers));
    }
    setUsers(savedUsers);
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setGeneratedPassword(password);
    return password;
  };

  const saveUser = (user: User) => {
    const savedUsers = JSON.parse(localStorage.getItem('miniescopo_users') || '[]');
    const updatedUsers = editingUser 
      ? savedUsers.map((u: User) => u.id === user.id ? user : u)
      : [...savedUsers, user];
    
    localStorage.setItem('miniescopo_users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      alert('Nome e email são obrigatórios!');
      return;
    }

    if (formData.role === 'representative' && !formData.representation.trim()) {
      alert('Representação é obrigatória para representantes!');
      return;
    }

    // Check if email already exists
    const existingUser = users.find(u => u.email === formData.email && u.id !== editingUser?.id);
    if (existingUser) {
      alert('Este email já está sendo usado por outro usuário!');
      return;
    }

    const password = editingUser ? '' : generatePassword();

    const user: User = {
      id: editingUser?.id || `user-${Date.now()}`,
      name: formData.name,
      email: formData.email,
      role: formData.role,
      representation: formData.role === 'representative' ? formData.representation : undefined,
      isActive: true,
      createdAt: editingUser?.createdAt || new Date().toISOString()
    };

    saveUser(user);
    
    if (!editingUser) {
      alert(`Usuário criado!\nEmail: ${user.email}\nSenha: ${password}\n\nAnote a senha, ela não será exibida novamente.`);
    }
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      role: 'representative',
      representation: ''
    });
    setEditingUser(null);
    setShowForm(false);
    setGeneratedPassword('');
  };

  const editUser = (user: User) => {
    setFormData({
      name: user.name,
      email: user.email,
      role: user.role,
      representation: user.representation || ''
    });
    setEditingUser(user);
    setShowForm(true);
  };

  const deleteUser = (id: string) => {
    if (id === 'admin-001') {
      alert('Não é possível excluir o administrador principal!');
      return;
    }
    
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      const updatedUsers = users.filter(u => u.id !== id);
      localStorage.setItem('miniescope_users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
    }
  };

  const toggleUserStatus = (id: string) => {
    if (id === 'admin-001') {
      alert('Não é possível desativar o administrador principal!');
      return;
    }

    const updatedUsers = users.map(u => 
      u.id === id ? { ...u, isActive: !u.isActive } : u
    );
    localStorage.setItem('miniescope_users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  const resetPassword = (user: User) => {
    if (confirm(`Resetar senha do usuário ${user.name}?`)) {
      const newPassword = generatePassword();
      alert(`Nova senha para ${user.name}:\n${newPassword}\n\nAnote a senha, ela não será exibida novamente.`);
    }
  };

  const isAdmin = currentUser?.role === 'admin';

  if (!isAdmin) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-red-800 mb-2">Acesso Negado</h2>
          <p className="text-red-600">Apenas administradores podem gerenciar usuários.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-white" />
              <h1 className="text-2xl font-bold text-white">Gerenciar Usuários</h1>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-3 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Plus className="w-5 h-5" />
              <span>Novo Usuário</span>
            </button>
          </div>
        </div>

        {/* Form */}
        {showForm && (
          <div className="p-6 border-b border-gray-200">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="Digite o nome completo"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="usuario@exemplo.com"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nível de Acesso *
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value as any }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {Object.entries(roles).map(([key, role]) => (
                      <option key={key} value={key}>
                        {role.icon} {role.label}
                      </option>
                    ))}
                  </select>
                </div>

                {formData.role === 'representative' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Representação *
                    </label>
                    <select
                      value={formData.representation}
                      onChange={(e) => setFormData(prev => ({ ...prev, representation: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      required
                    >
                      <option value="">Selecione a representação</option>
                      {representations.map(rep => (
                        <option key={rep} value={rep}>{rep}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {!editingUser && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-800">Senha será gerada automaticamente</span>
                  </div>
                  <p className="text-sm text-blue-600">
                    Uma senha segura será gerada e exibida após a criação do usuário.
                  </p>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  {editingUser ? 'Atualizar' : 'Criar'} Usuário
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Users List */}
        <div className="p-6">
          {users.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum usuário</h3>
              <p className="text-gray-500">Clique em "Novo Usuário" para começar.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Nome</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Nível</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Representação</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-900">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const role = roles[user.role];
                    
                    return (
                      <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-4 px-4">
                          <div className="font-medium text-gray-900">{user.name}</div>
                          <div className="text-sm text-gray-500">
                            Criado em {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-gray-600">{user.email}</td>
                        <td className="py-4 px-4">
                          <span className={`${role.color} text-white px-3 py-1 rounded-full text-sm font-medium`}>
                            {role.icon} {role.label}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-gray-600">
                          {user.representation || '-'}
                        </td>
                        <td className="py-4 px-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            user.isActive 
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {user.isActive ? 'Ativo' : 'Inativo'}
                          </span>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => toggleUserStatus(user.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                user.isActive
                                  ? 'text-orange-600 hover:bg-orange-50'
                                  : 'text-green-600 hover:bg-green-50'
                              }`}
                              title={user.isActive ? 'Desativar' : 'Ativar'}
                              disabled={user.id === 'admin-001'}
                            >
                              {user.isActive ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => editUser(user)}
                              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Editar"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => resetPassword(user)}
                              className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                              title="Resetar Senha"
                            >
                              <Shield className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteUser(user.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Excluir"
                              disabled={user.id === 'admin-001'}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};