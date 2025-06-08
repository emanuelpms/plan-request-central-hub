
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, Plus, Edit, Trash2, Mail, Bell, Users, Wrench } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import UserManagement from './UserManagement';
import EmailConfig from './EmailConfig';

interface Model {
  id: string;
  name: string;
  category: 'HUMANO' | 'VETERINARIO' | 'GERAL';
  active: boolean;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  active: boolean;
  createdAt: string;
}

interface AdminConfigProps {
  onClose: () => void;
}

const AdminConfig: React.FC<AdminConfigProps> = ({ onClose }) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('models');
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [showEmailConfig, setShowEmailConfig] = useState(false);

  // Models State
  const [models, setModels] = useState<Model[]>(() => {
    const saved = localStorage.getItem('miniescopo_models');
    return saved ? JSON.parse(saved) : [
      { id: '1', name: 'LABGEO PT1000', category: 'HUMANO', active: true },
      { id: '2', name: 'LABGEO PT3000', category: 'HUMANO', active: true },
      { id: '3', name: 'LABGEO PT1000 VET', category: 'VETERINARIO', active: true },
      { id: '4', name: 'LABGEO PT3000 VET', category: 'VETERINARIO', active: true },
      { id: '5', name: 'OUTROS', category: 'GERAL', active: true }
    ];
  });

  const [newModel, setNewModel] = useState({
    name: '',
    category: 'GERAL' as 'HUMANO' | 'VETERINARIO' | 'GERAL',
    active: true
  });

  const [editingModel, setEditingModel] = useState<Model | null>(null);

  // Notifications State
  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('miniescopo_notifications');
    return saved ? JSON.parse(saved) : [];
  });

  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'warning' | 'success',
    active: true
  });

  // Model Functions
  const saveModels = (updatedModels: Model[]) => {
    setModels(updatedModels);
    localStorage.setItem('miniescopo_models', JSON.stringify(updatedModels));
  };

  const handleAddModel = () => {
    if (!newModel.name.trim()) {
      toast({
        title: "Erro",
        description: "Nome do modelo é obrigatório.",
        variant: "destructive"
      });
      return;
    }

    const model: Model = {
      id: Date.now().toString(),
      ...newModel,
      name: newModel.name.toUpperCase()
    };

    saveModels([...models, model]);
    setNewModel({ name: '', category: 'GERAL', active: true });

    toast({
      title: "Sucesso",
      description: "Modelo adicionado com sucesso.",
    });
  };

  const handleEditModel = (model: Model) => {
    setEditingModel(model);
  };

  const handleUpdateModel = () => {
    if (!editingModel) return;

    const updatedModels = models.map(m => 
      m.id === editingModel.id ? editingModel : m
    );
    saveModels(updatedModels);
    setEditingModel(null);

    toast({
      title: "Sucesso",
      description: "Modelo atualizado com sucesso.",
    });
  };

  const handleDeleteModel = (modelId: string) => {
    const updatedModels = models.filter(m => m.id !== modelId);
    saveModels(updatedModels);

    toast({
      title: "Sucesso",
      description: "Modelo excluído com sucesso.",
    });
  };

  // Notification Functions
  const saveNotifications = (updatedNotifications: Notification[]) => {
    setNotifications(updatedNotifications);
    localStorage.setItem('miniescopo_notifications', JSON.stringify(updatedNotifications));
  };

  const handleAddNotification = () => {
    if (!newNotification.title.trim() || !newNotification.message.trim()) {
      toast({
        title: "Erro",
        description: "Título e mensagem são obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    const notification: Notification = {
      id: Date.now().toString(),
      ...newNotification,
      createdAt: new Date().toISOString()
    };

    saveNotifications([...notifications, notification]);
    setNewNotification({ title: '', message: '', type: 'info', active: true });

    toast({
      title: "Sucesso",
      description: "Notificação criada com sucesso.",
    });
  };

  const toggleNotification = (notificationId: string) => {
    const updatedNotifications = notifications.map(n =>
      n.id === notificationId ? { ...n, active: !n.active } : n
    );
    saveNotifications(updatedNotifications);
  };

  const deleteNotification = (notificationId: string) => {
    const updatedNotifications = notifications.filter(n => n.id !== notificationId);
    saveNotifications(updatedNotifications);
  };

  if (showUserManagement) {
    return <UserManagement onClose={() => setShowUserManagement(false)} />;
  }

  if (showEmailConfig) {
    return <EmailConfig onClose={() => setShowEmailConfig(false)} />;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-6xl max-h-[90vh] overflow-auto bg-white">
        <CardHeader className="bg-gradient-to-r from-gray-600 to-gray-700 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6" />
              <CardTitle className="text-xl">Configurações do Sistema</CardTitle>
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
        
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="models">Modelos</TabsTrigger>
              <TabsTrigger value="notifications">Notificações</TabsTrigger>
              <TabsTrigger value="users">Usuários</TabsTrigger>
              <TabsTrigger value="emails">E-mails</TabsTrigger>
              <TabsTrigger value="system">Sistema</TabsTrigger>
            </TabsList>

            {/* Models Tab */}
            <TabsContent value="models" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="w-5 h-5" />
                    Gerenciar Modelos de Equipamentos
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="modelName">Nome do Modelo</Label>
                      <Input
                        id="modelName"
                        value={newModel.name}
                        onChange={(e) => setNewModel({...newModel, name: e.target.value})}
                        placeholder="Digite o nome do modelo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="modelCategory">Categoria</Label>
                      <select
                        id="modelCategory"
                        value={newModel.category}
                        onChange={(e) => setNewModel({...newModel, category: e.target.value as any})}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="GERAL">Geral</option>
                        <option value="HUMANO">Humano</option>
                        <option value="VETERINARIO">Veterinário</option>
                      </select>
                    </div>
                    <div className="flex items-end">
                      <Button onClick={handleAddModel} className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Adicionar
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Modelos Cadastrados ({models.length})</h4>
                    {models.map((model) => (
                      <div
                        key={model.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-medium">{model.name}</span>
                          <Badge variant="outline">{model.category}</Badge>
                          <Badge variant={model.active ? 'default' : 'destructive'}>
                            {model.active ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditModel(model)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteModel(model.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notifications Tab */}
            <TabsContent value="notifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="w-5 h-5" />
                    Gerenciar Notificações do Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="notificationTitle">Título</Label>
                      <Input
                        id="notificationTitle"
                        value={newNotification.title}
                        onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                        placeholder="Digite o título da notificação"
                      />
                    </div>
                    <div>
                      <Label htmlFor="notificationType">Tipo</Label>
                      <select
                        id="notificationType"
                        value={newNotification.type}
                        onChange={(e) => setNewNotification({...newNotification, type: e.target.value as any})}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="info">Informação</option>
                        <option value="warning">Aviso</option>
                        <option value="success">Sucesso</option>
                      </select>
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="notificationMessage">Mensagem</Label>
                    <Textarea
                      id="notificationMessage"
                      value={newNotification.message}
                      onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                      placeholder="Digite a mensagem da notificação"
                      rows={3}
                    />
                  </div>

                  <Button onClick={handleAddNotification} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Criar Notificação
                  </Button>

                  <div className="space-y-3">
                    <h4 className="font-semibold">Notificações Criadas ({notifications.length})</h4>
                    {notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className="p-4 border rounded-lg space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{notification.title}</span>
                            <Badge variant={
                              notification.type === 'success' ? 'default' :
                              notification.type === 'warning' ? 'destructive' : 'secondary'
                            }>
                              {notification.type}
                            </Badge>
                            <Badge variant={notification.active ? 'default' : 'outline'}>
                              {notification.active ? 'Ativa' : 'Inativa'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => toggleNotification(notification.id)}
                            >
                              {notification.active ? 'Desativar' : 'Ativar'}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteNotification(notification.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600">{notification.message}</p>
                        <p className="text-xs text-gray-400">
                          Criado em: {new Date(notification.createdAt).toLocaleString('pt-BR')}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Gerenciamento de Usuários
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setShowUserManagement(true)} className="w-full">
                    <Users className="w-4 h-4 mr-2" />
                    Abrir Gerenciamento de Usuários
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Emails Tab */}
            <TabsContent value="emails">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="w-5 h-5" />
                    Configuração de E-mails
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600 mb-4">
                    Configure os destinatários e templates de email para cada tipo de formulário. 
                    Os emails serão enviados automaticamente via Outlook com o layout exato dos formulários.
                  </p>
                  <Button onClick={() => setShowEmailConfig(true)} className="w-full">
                    <Mail className="w-4 h-4 mr-2" />
                    Configurar E-mails do Sistema
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            {/* System Tab */}
            <TabsContent value="system">
              <Card>
                <CardHeader>
                  <CardTitle>Informações do Sistema</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold">Versão</h4>
                      <p className="text-sm text-gray-600">4.9.0</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold">Modelos Cadastrados</h4>
                      <p className="text-sm text-gray-600">{models.length}</p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold">Usuários Ativos</h4>
                      <p className="text-sm text-gray-600">
                        {JSON.parse(localStorage.getItem('miniescopo_users') || '[]').filter((u: any) => u.active).length}
                      </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-semibold">Notificações Ativas</h4>
                      <p className="text-sm text-gray-600">
                        {notifications.filter(n => n.active).length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Edit Model Modal */}
      {editingModel && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Editar Modelo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Nome do Modelo</Label>
                <Input
                  value={editingModel.name}
                  onChange={(e) => setEditingModel({...editingModel, name: e.target.value})}
                />
              </div>
              <div>
                <Label>Categoria</Label>
                <select
                  value={editingModel.category}
                  onChange={(e) => setEditingModel({...editingModel, category: e.target.value as any})}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="GERAL">Geral</option>
                  <option value="HUMANO">Humano</option>
                  <option value="VETERINARIO">Veterinário</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={editingModel.active}
                  onChange={(e) => setEditingModel({...editingModel, active: e.target.checked})}
                />
                <Label>Modelo Ativo</Label>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleUpdateModel} className="flex-1">
                  Salvar
                </Button>
                <Button variant="outline" onClick={() => setEditingModel(null)} className="flex-1">
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

export default AdminConfig;
