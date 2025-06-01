
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Plus, Edit, Trash2, Save, X, Mail, Database, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface AdminConfigProps {
  onClose: () => void;
}

interface ModeloConfig {
  id: string;
  nome: string;
  categoria: string;
  ativo: boolean;
}

interface EmailConfig {
  formType: string;
  toEmails: string[];
  ccEmails: string[];
  subject: string;
  customMessage: string;
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
  const [activeSection, setActiveSection] = useState('modelos');
  const [modelos, setModelos] = useState<ModeloConfig[]>([]);
  const [emailConfigs, setEmailConfigs] = useState<Record<string, EmailConfig>>({});
  const [notifications, setNotifications] = useState<NotificationConfig[]>([]);
  const [editingItem, setEditingItem] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadConfigurations();
  }, []);

  const loadConfigurations = () => {
    // Carregar modelos
    const savedModelos = localStorage.getItem('miniescopo_modelos');
    if (savedModelos) {
      setModelos(JSON.parse(savedModelos));
    } else {
      // Modelos padrão
      const defaultModelos = [
        { id: '1', nome: 'LABGEO PT1000', categoria: 'Humano', ativo: true },
        { id: '2', nome: 'LABGEO PT3000', categoria: 'Humano', ativo: true },
        { id: '3', nome: 'LABGEO PT1000 VET', categoria: 'Veterinário', ativo: true },
        { id: '4', nome: 'LABGEO PT3000 VET', categoria: 'Veterinário', ativo: true },
        { id: '5', nome: 'OUTROS', categoria: 'Geral', ativo: true }
      ];
      setModelos(defaultModelos);
      localStorage.setItem('miniescopo_modelos', JSON.stringify(defaultModelos));
    }

    // Carregar configurações de email
    const savedEmailConfigs = localStorage.getItem('miniescopo_email_config');
    if (savedEmailConfigs) {
      setEmailConfigs(JSON.parse(savedEmailConfigs));
    }

    // Carregar notificações
    const savedNotifications = localStorage.getItem('miniescopo_notifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  };

  const saveModelos = (newModelos: ModeloConfig[]) => {
    setModelos(newModelos);
    localStorage.setItem('miniescopo_modelos', JSON.stringify(newModelos));
    toast({ title: "Sucesso", description: "Modelos atualizados com sucesso." });
  };

  const saveEmailConfigs = (newConfigs: Record<string, EmailConfig>) => {
    setEmailConfigs(newConfigs);
    localStorage.setItem('miniescopo_email_config', JSON.stringify(newConfigs));
    toast({ title: "Sucesso", description: "Configurações de email atualizadas." });
  };

  const saveNotifications = (newNotifications: NotificationConfig[]) => {
    setNotifications(newNotifications);
    localStorage.setItem('miniescopo_notifications', JSON.stringify(newNotifications));
    toast({ title: "Sucesso", description: "Notificações atualizadas." });
  };

  const addModelo = () => {
    const newModelo: ModeloConfig = {
      id: Date.now().toString(),
      nome: '',
      categoria: 'Geral',
      ativo: true
    };
    setEditingItem(newModelo);
  };

  const editModelo = (modelo: ModeloConfig) => {
    setEditingItem({ ...modelo });
  };

  const deleteModelo = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este modelo?')) {
      const newModelos = modelos.filter(m => m.id !== id);
      saveModelos(newModelos);
    }
  };

  const saveModelo = () => {
    if (!editingItem.nome.trim()) {
      toast({ title: "Erro", description: "Nome do modelo é obrigatório.", variant: "destructive" });
      return;
    }

    let newModelos;
    if (modelos.find(m => m.id === editingItem.id)) {
      newModelos = modelos.map(m => m.id === editingItem.id ? editingItem : m);
    } else {
      newModelos = [...modelos, editingItem];
    }
    
    saveModelos(newModelos);
    setEditingItem(null);
  };

  const addNotification = () => {
    const newNotification: NotificationConfig = {
      id: Date.now().toString(),
      title: '',
      message: '',
      type: 'info',
      active: true,
      createdAt: new Date().toISOString()
    };
    setEditingItem(newNotification);
  };

  const saveNotification = () => {
    if (!editingItem.title.trim() || !editingItem.message.trim()) {
      toast({ title: "Erro", description: "Título e mensagem são obrigatórios.", variant: "destructive" });
      return;
    }

    let newNotifications;
    if (notifications.find(n => n.id === editingItem.id)) {
      newNotifications = notifications.map(n => n.id === editingItem.id ? editingItem : n);
    } else {
      newNotifications = [...notifications, editingItem];
    }
    
    saveNotifications(newNotifications);
    setEditingItem(null);
  };

  const deleteNotification = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta notificação?')) {
      const newNotifications = notifications.filter(n => n.id !== id);
      saveNotifications(newNotifications);
    }
  };

  const openEmailConfig = () => {
    window.dispatchEvent(new Event('openEmailConfig'));
    onClose();
  };

  const sections = [
    { id: 'modelos', label: 'Modelos', icon: Database },
    { id: 'emails', label: 'Configurar Emails', icon: Mail },
    { id: 'notifications', label: 'Notificações', icon: Bell }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl bg-white max-h-[90vh] overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6" />
              <CardTitle className="text-xl">Painel Administrativo</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <div className="flex h-[calc(90vh-120px)]">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 border-r p-4">
            <div className="space-y-2">
              {sections.map((section) => {
                const IconComponent = section.icon;
                return (
                  <Button
                    key={section.id}
                    variant={activeSection === section.id ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveSection(section.id)}
                  >
                    <IconComponent className="w-4 h-4 mr-2" />
                    {section.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeSection === 'modelos' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Gerenciar Modelos</h3>
                  <Button onClick={addModelo}>
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Modelo
                  </Button>
                </div>

                <div className="grid gap-4">
                  {modelos.map((modelo) => (
                    <Card key={modelo.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium">{modelo.nome}</h4>
                            <p className="text-sm text-gray-600">Categoria: {modelo.categoria}</p>
                            <p className="text-sm text-gray-600">
                              Status: {modelo.ativo ? 'Ativo' : 'Inativo'}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => editModelo(modelo)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => deleteModelo(modelo.id)}
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
            )}

            {activeSection === 'emails' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Configurações de Email</h3>
                  <Button onClick={openEmailConfig}>
                    <Mail className="w-4 h-4 mr-2" />
                    Abrir Configurador
                  </Button>
                </div>
                <p className="text-gray-600">
                  Use o botão acima para configurar os emails para cada tipo de formulário.
                </p>
              </div>
            )}

            {activeSection === 'notifications' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Gerenciar Notificações</h3>
                  <Button onClick={addNotification}>
                    <Plus className="w-4 h-4 mr-2" />
                    Nova Notificação
                  </Button>
                </div>

                <div className="grid gap-4">
                  {notifications.map((notification) => (
                    <Card key={notification.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium">{notification.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                            <div className="flex items-center gap-4 mt-2">
                              <span className={`px-2 py-1 rounded text-xs ${
                                notification.type === 'info' ? 'bg-blue-100 text-blue-800' :
                                notification.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-green-100 text-green-800'
                              }`}>
                                {notification.type}
                              </span>
                              <span className="text-xs text-gray-500">
                                {notification.active ? 'Ativa' : 'Inativa'}
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setEditingItem({ ...notification })}
                            >
                              <Edit className="w-4 h-4" />
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
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal de Edição */}
        {editingItem && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl bg-white">
              <CardHeader>
                <CardTitle>
                  {activeSection === 'modelos' ? 'Editar Modelo' : 'Editar Notificação'}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {activeSection === 'modelos' ? (
                  <>
                    <div>
                      <Label>Nome do Modelo</Label>
                      <Input
                        value={editingItem.nome}
                        onChange={(e) => setEditingItem({...editingItem, nome: e.target.value})}
                        placeholder="Ex: LABGEO PT1000"
                      />
                    </div>
                    <div>
                      <Label>Categoria</Label>
                      <Select
                        value={editingItem.categoria}
                        onValueChange={(value) => setEditingItem({...editingItem, categoria: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Humano">Humano</SelectItem>
                          <SelectItem value="Veterinário">Veterinário</SelectItem>
                          <SelectItem value="Geral">Geral</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editingItem.ativo}
                        onChange={(e) => setEditingItem({...editingItem, ativo: e.target.checked})}
                      />
                      <Label>Ativo</Label>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <Label>Título</Label>
                      <Input
                        value={editingItem.title}
                        onChange={(e) => setEditingItem({...editingItem, title: e.target.value})}
                        placeholder="Título da notificação"
                      />
                    </div>
                    <div>
                      <Label>Mensagem</Label>
                      <Textarea
                        value={editingItem.message}
                        onChange={(e) => setEditingItem({...editingItem, message: e.target.value})}
                        placeholder="Conteúdo da notificação"
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label>Tipo</Label>
                      <Select
                        value={editingItem.type}
                        onValueChange={(value) => setEditingItem({...editingItem, type: value})}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="info">Informação</SelectItem>
                          <SelectItem value="warning">Aviso</SelectItem>
                          <SelectItem value="success">Sucesso</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editingItem.active}
                        onChange={(e) => setEditingItem({...editingItem, active: e.target.checked})}
                      />
                      <Label>Ativa</Label>
                    </div>
                  </>
                )}

                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={activeSection === 'modelos' ? saveModelo : saveNotification}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Salvar
                  </Button>
                  <Button variant="outline" onClick={() => setEditingItem(null)}>
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </Card>
    </div>
  );
};

export default AdminConfig;
