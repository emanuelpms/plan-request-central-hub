
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, Edit, Save, Mail, Settings, Bell, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdminConfigProps {
  onClose: () => void;
}

interface ModelConfig {
  id: string;
  name: string;
  category: string;
}

interface NotificationConfig {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  active: boolean;
  createdAt: string;
}

const AdminConfig: React.FC<AdminConfigProps> = ({ onClose }) => {
  const [models, setModels] = useState<ModelConfig[]>([]);
  const [notifications, setNotifications] = useState<NotificationConfig[]>([]);
  const [newModel, setNewModel] = useState({ name: '', category: '' });
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info' as const
  });
  const { toast } = useToast();

  useEffect(() => {
    loadConfigurations();
  }, []);

  const loadConfigurations = () => {
    // Carregar modelos salvos
    const savedModels = localStorage.getItem('miniescopo_models');
    if (savedModels) {
      setModels(JSON.parse(savedModels));
    } else {
      // Modelos padrão
      const defaultModels = [
        { id: '1', name: 'DR-X40', category: 'DR' },
        { id: '2', name: 'DR-X70', category: 'DR' },
        { id: '3', name: 'CR-X30', category: 'CR' },
        { id: '4', name: 'Mammography', category: 'Mamografia' },
        { id: '5', name: 'Ultrassom', category: 'Ultrassom' }
      ];
      setModels(defaultModels);
      localStorage.setItem('miniescopo_models', JSON.stringify(defaultModels));
    }

    // Carregar notificações
    const savedNotifications = localStorage.getItem('miniescopo_notifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  };

  const saveModels = (updatedModels: ModelConfig[]) => {
    setModels(updatedModels);
    localStorage.setItem('miniescopo_models', JSON.stringify(updatedModels));
  };

  const saveNotifications = (updatedNotifications: NotificationConfig[]) => {
    setNotifications(updatedNotifications);
    localStorage.setItem('miniescopo_notifications', JSON.stringify(updatedNotifications));
  };

  const addModel = () => {
    if (!newModel.name || !newModel.category) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos do modelo.",
        variant: "destructive"
      });
      return;
    }

    const model: ModelConfig = {
      id: Date.now().toString(),
      name: newModel.name,
      category: newModel.category
    };

    const updatedModels = [...models, model];
    saveModels(updatedModels);
    setNewModel({ name: '', category: '' });
    
    toast({
      title: "Sucesso",
      description: "Modelo adicionado com sucesso."
    });
  };

  const removeModel = (id: string) => {
    const updatedModels = models.filter(m => m.id !== id);
    saveModels(updatedModels);
    
    toast({
      title: "Sucesso",
      description: "Modelo removido com sucesso."
    });
  };

  const addNotification = () => {
    if (!newNotification.title || !newNotification.message) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos da notificação.",
        variant: "destructive"
      });
      return;
    }

    const notification: NotificationConfig = {
      id: Date.now().toString(),
      title: newNotification.title,
      message: newNotification.message,
      type: newNotification.type,
      active: true,
      createdAt: new Date().toISOString()
    };

    const updatedNotifications = [...notifications, notification];
    saveNotifications(updatedNotifications);
    setNewNotification({ title: '', message: '', type: 'info' });
    
    toast({
      title: "Sucesso",
      description: "Notificação criada com sucesso."
    });
  };

  const toggleNotification = (id: string) => {
    const updatedNotifications = notifications.map(n => 
      n.id === id ? { ...n, active: !n.active } : n
    );
    saveNotifications(updatedNotifications);
  };

  const removeNotification = (id: string) => {
    const updatedNotifications = notifications.filter(n => n.id !== id);
    saveNotifications(updatedNotifications);
    
    toast({
      title: "Sucesso",
      description: "Notificação removida com sucesso."
    });
  };

  const exportDatabase = () => {
    const data = {
      models,
      notifications,
      rawData: JSON.parse(localStorage.getItem('miniescopo_rawdata') || '[]'),
      database: JSON.parse(localStorage.getItem('miniescopo_database') || '[]'),
      emailConfig: JSON.parse(localStorage.getItem('miniescopo_email_config') || '{}')
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `miniescopo_backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: "Sucesso",
      description: "Backup exportado com sucesso."
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl bg-white max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
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
          <Tabs defaultValue="models" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="models">Modelos</TabsTrigger>
              <TabsTrigger value="emails">E-mails</TabsTrigger>
              <TabsTrigger value="notifications">Notificações</TabsTrigger>
              <TabsTrigger value="database">Banco de Dados</TabsTrigger>
            </TabsList>

            <TabsContent value="models" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Gerenciar Modelos de Equipamentos</h3>
                
                {/* Adicionar novo modelo */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-base">Adicionar Novo Modelo</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Nome do Modelo</Label>
                        <Input
                          value={newModel.name}
                          onChange={(e) => setNewModel({...newModel, name: e.target.value})}
                          placeholder="Ex: DR-X40"
                        />
                      </div>
                      <div>
                        <Label>Categoria</Label>
                        <Input
                          value={newModel.category}
                          onChange={(e) => setNewModel({...newModel, category: e.target.value})}
                          placeholder="Ex: DR, CR, Mamografia"
                        />
                      </div>
                    </div>
                    <Button onClick={addModel} className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Modelo
                    </Button>
                  </CardContent>
                </Card>

                {/* Lista de modelos */}
                <div className="grid gap-3">
                  {models.map((model) => (
                    <div key={model.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <span className="font-medium">{model.name}</span>
                        <span className="text-gray-500 ml-2">({model.category})</span>
                      </div>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeModel(model.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="emails" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Configurações de E-mail</h3>
                <p className="text-gray-600 mb-4">
                  As configurações de e-mail podem ser acessadas através do botão "CONFIG EMAIL" em cada formulário.
                </p>
                <Button
                  onClick={() => {
                    onClose();
                    // Trigger email config modal
                    setTimeout(() => {
                      const event = new CustomEvent('openEmailConfig');
                      window.dispatchEvent(event);
                    }, 100);
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Abrir Configurações de E-mail
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Gerenciar Notificações</h3>
                
                {/* Adicionar notificação */}
                <Card className="mb-6">
                  <CardHeader>
                    <CardTitle className="text-base">Criar Nova Notificação</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Título</Label>
                      <Input
                        value={newNotification.title}
                        onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                        placeholder="Título da notificação"
                      />
                    </div>
                    <div>
                      <Label>Mensagem</Label>
                      <Textarea
                        value={newNotification.message}
                        onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                        placeholder="Conteúdo da notificação"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>Tipo</Label>
                      <select
                        value={newNotification.type}
                        onChange={(e) => setNewNotification({...newNotification, type: e.target.value as any})}
                        className="w-full p-2 border rounded"
                      >
                        <option value="info">Informação</option>
                        <option value="warning">Aviso</option>
                        <option value="success">Sucesso</option>
                      </select>
                    </div>
                    <Button onClick={addNotification} className="w-full">
                      <Bell className="w-4 h-4 mr-2" />
                      Criar Notificação
                    </Button>
                  </CardContent>
                </Card>

                {/* Lista de notificações */}
                <div className="space-y-3">
                  {notifications.map((notification) => (
                    <Card key={notification.id} className={notification.active ? 'border-green-200' : 'border-gray-200'}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{notification.title}</h4>
                            <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                            <span className={`inline-block px-2 py-1 rounded text-xs mt-2 ${
                              notification.type === 'info' ? 'bg-blue-100 text-blue-800' :
                              notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {notification.type}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant={notification.active ? "default" : "outline"}
                              size="sm"
                              onClick={() => toggleNotification(notification.id)}
                            >
                              {notification.active ? 'Ativo' : 'Inativo'}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => removeNotification(notification.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="database" className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-4">Gerenciar Banco de Dados</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Exportar Dados</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-600 mb-4">
                        Exporta todos os dados do sistema em formato JSON para backup.
                      </p>
                      <Button onClick={exportDatabase} className="w-full">
                        <Database className="w-4 h-4 mr-2" />
                        Exportar Backup
                      </Button>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Estatísticas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p><strong>Modelos cadastrados:</strong> {models.length}</p>
                        <p><strong>Notificações ativas:</strong> {notifications.filter(n => n.active).length}</p>
                        <p><strong>Total de registros:</strong> {JSON.parse(localStorage.getItem('miniescopo_rawdata') || '[]').length}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminConfig;
