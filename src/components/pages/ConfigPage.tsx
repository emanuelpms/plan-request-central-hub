
import React, { useState, useEffect } from 'react';
import { Settings, Plus, Edit3, Trash2, Save, X } from 'lucide-react';

interface EquipmentModel {
  id: string;
  name: string;
  category: string;
}

interface EmailConfig {
  id: string;
  formType: string;
  toEmails: string[];
  ccEmails: string[];
}

export const ConfigPage: React.FC = () => {
  const [models, setModels] = useState<EquipmentModel[]>([]);
  const [emailConfigs, setEmailConfigs] = useState<EmailConfig[]>([]);
  const [activeTab, setActiveTab] = useState<'models' | 'emails'>('models');
  const [showModelForm, setShowModelForm] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [editingModel, setEditingModel] = useState<EquipmentModel | null>(null);
  const [editingEmail, setEditingEmail] = useState<EmailConfig | null>(null);

  // Form states
  const [modelForm, setModelForm] = useState({ name: '', category: '' });
  const [emailForm, setEmailForm] = useState({ 
    formType: '', 
    toEmails: [''], 
    ccEmails: [''] 
  });

  useEffect(() => {
    loadConfigurations();
  }, []);

  const loadConfigurations = () => {
    const savedModels = JSON.parse(localStorage.getItem('miniescopo_models') || '[]');
    const savedEmails = JSON.parse(localStorage.getItem('miniescopo_email_configs') || '[]');
    
    if (savedModels.length === 0) {
      // Modelos Samsung padrão
      const defaultModels = [
        { id: '1', name: 'Samsung HS40', category: 'Geral' },
        { id: '2', name: 'Samsung HS50', category: 'Geral' },
        { id: '3', name: 'Samsung HS70', category: 'Cardiologia' },
        { id: '4', name: 'Samsung HS80', category: 'Cardiologia' },
        { id: '5', name: 'Samsung RS80', category: 'Premium' },
        { id: '6', name: 'Samsung RS85 Prestige', category: 'Premium' },
        { id: '7', name: 'Samsung WS80A', category: 'Portátil' },
        { id: '8', name: 'Samsung PT60A', category: 'Portátil' },
        { id: '9', name: 'Samsung V7', category: 'Veterinário' },
        { id: '10', name: 'Samsung V8', category: 'Veterinário' },
        { id: '11', name: 'Samsung MySono U6', category: 'Portátil' },
        { id: '12', name: 'Samsung MySono U5', category: 'Portátil' },
        { id: '13', name: 'Samsung HM70A', category: 'Portátil' },
        { id: '14', name: 'Samsung A30', category: 'Básico' },
        { id: '15', name: 'Samsung E-CUBE 15', category: 'Cardiologia' },
        { id: '16', name: 'Samsung UGEO H60', category: 'Geral' },
        { id: '17', name: 'Samsung UGEO WS80A', category: 'Obstétrico' },
        { id: '18', name: 'Samsung SonoAce X8', category: 'Geral' },
        { id: '19', name: 'Samsung SonoAce X6', category: 'Geral' },
        { id: '20', name: 'Samsung Accuvix A30', category: 'Básico' },
      ];
      setModels(defaultModels);
      localStorage.setItem('miniescopo_models', JSON.stringify(defaultModels));
    } else {
      setModels(savedModels);
    }

    if (savedEmails.length === 0) {
      // Configurações de email padrão
      const defaultEmails = [
        { id: '1', formType: 'service', toEmails: ['servico@empresa.com'], ccEmails: [] },
        { id: '2', formType: 'demo', toEmails: ['vendas@empresa.com'], ccEmails: [] },
        { id: '3', formType: 'app', toEmails: ['suporte@empresa.com'], ccEmails: [] },
        { id: '4', formType: 'password', toEmails: ['licencas@empresa.com'], ccEmails: [] },
        { id: '5', formType: 'install', toEmails: ['instalacao@empresa.com'], ccEmails: [] },
      ];
      setEmailConfigs(defaultEmails);
      localStorage.setItem('miniescopo_email_configs', JSON.stringify(defaultEmails));
    } else {
      setEmailConfigs(savedEmails);
    }
  };

  const saveModel = () => {
    if (!modelForm.name.trim()) return;

    const newModel: EquipmentModel = {
      id: editingModel ? editingModel.id : Date.now().toString(),
      name: modelForm.name.trim(),
      category: modelForm.category || 'Ambos'
    };

    let updatedModels;
    if (editingModel) {
      updatedModels = models.map(m => m.id === editingModel.id ? newModel : m);
    } else {
      updatedModels = [...models, newModel];
    }

    setModels(updatedModels);
    localStorage.setItem('miniescopo_models', JSON.stringify(updatedModels));
    
    setModelForm({ name: '', category: '' });
    setEditingModel(null);
    setShowModelForm(false);
  };

  const deleteModel = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este modelo?')) {
      const updatedModels = models.filter(m => m.id !== id);
      setModels(updatedModels);
      localStorage.setItem('miniescopo_models', JSON.stringify(updatedModels));
    }
  };

  const editModel = (model: EquipmentModel) => {
    setEditingModel(model);
    setModelForm({ name: model.name, category: model.category });
    setShowModelForm(true);
  };

  const saveEmailConfig = () => {
    if (!emailForm.formType) return;

    const newConfig: EmailConfig = {
      id: editingEmail ? editingEmail.id : Date.now().toString(),
      formType: emailForm.formType,
      toEmails: emailForm.toEmails.filter(email => email.trim()),
      ccEmails: emailForm.ccEmails.filter(email => email.trim())
    };

    let updatedConfigs;
    if (editingEmail) {
      updatedConfigs = emailConfigs.map(c => c.id === editingEmail.id ? newConfig : c);
    } else {
      updatedConfigs = [...emailConfigs, newConfig];
    }

    setEmailConfigs(updatedConfigs);
    localStorage.setItem('miniescopo_email_configs', JSON.stringify(updatedConfigs));
    
    setEmailForm({ formType: '', toEmails: [''], ccEmails: [''] });
    setEditingEmail(null);
    setShowEmailForm(false);
  };

  const deleteEmailConfig = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta configuração?')) {
      const updatedConfigs = emailConfigs.filter(c => c.id !== id);
      setEmailConfigs(updatedConfigs);
      localStorage.setItem('miniescopo_email_configs', JSON.stringify(updatedConfigs));
    }
  };

  const editEmailConfig = (config: EmailConfig) => {
    setEditingEmail(config);
    setEmailForm({
      formType: config.formType,
      toEmails: config.toEmails.length > 0 ? config.toEmails : [''],
      ccEmails: config.ccEmails.length > 0 ? config.ccEmails : ['']
    });
    setShowEmailForm(true);
  };

  const addEmailField = (type: 'to' | 'cc') => {
    if (type === 'to') {
      setEmailForm(prev => ({ ...prev, toEmails: [...prev.toEmails, ''] }));
    } else {
      setEmailForm(prev => ({ ...prev, ccEmails: [...prev.ccEmails, ''] }));
    }
  };

  const removeEmailField = (type: 'to' | 'cc', index: number) => {
    if (type === 'to') {
      setEmailForm(prev => ({ 
        ...prev, 
        toEmails: prev.toEmails.filter((_, i) => i !== index) 
      }));
    } else {
      setEmailForm(prev => ({ 
        ...prev, 
        ccEmails: prev.ccEmails.filter((_, i) => i !== index) 
      }));
    }
  };

  const updateEmailField = (type: 'to' | 'cc', index: number, value: string) => {
    if (type === 'to') {
      setEmailForm(prev => ({
        ...prev,
        toEmails: prev.toEmails.map((email, i) => i === index ? value : email)
      }));
    } else {
      setEmailForm(prev => ({
        ...prev,
        ccEmails: prev.ccEmails.map((email, i) => i === index ? value : email)
      }));
    }
  };

  const getFormTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      'service': 'Serviço',
      'demo': 'Demonstração',
      'app': 'Aplicação',
      'password': 'Licença',
      'install': 'Instalação'
    };
    return labels[type] || type;
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
          <div className="flex items-center space-x-3">
            <Settings className="w-8 h-8 text-white" />
            <h2 className="text-2xl font-bold text-white">Configurações do Sistema</h2>
          </div>
        </div>

        <div className="p-8">
          {/* Tabs */}
          <div className="flex space-x-1 mb-8 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('models')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === 'models'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Modelos de Equipamentos
            </button>
            <button
              onClick={() => setActiveTab('emails')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === 'emails'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              Configurações de Email
            </button>
          </div>

          {/* Models Tab */}
          {activeTab === 'models' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Modelos de Equipamentos</h3>
                <button
                  onClick={() => setShowModelForm(true)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Modelo</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Nome</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Categoria</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {models.map((model) => (
                      <tr key={model.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{model.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{model.category}</td>
                        <td className="px-4 py-3">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => editModel(model)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteModel(model.id)}
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Emails Tab */}
          {activeTab === 'emails' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-semibold">Configurações de Email</h3>
                <button
                  onClick={() => setShowEmailForm(true)}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Adicionar Configuração</span>
                </button>
              </div>

              <div className="space-y-4">
                {emailConfigs.map((config) => (
                  <div key={config.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {getFormTypeLabel(config.formType)}
                        </h4>
                        <div className="mt-2 space-y-1">
                          <div>
                            <span className="text-sm font-medium text-gray-600">Para: </span>
                            <span className="text-sm text-gray-800">
                              {config.toEmails.join(', ') || 'Nenhum'}
                            </span>
                          </div>
                          <div>
                            <span className="text-sm font-medium text-gray-600">Cópia: </span>
                            <span className="text-sm text-gray-800">
                              {config.ccEmails.join(', ') || 'Nenhum'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => editEmailConfig(config)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteEmailConfig(config.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Model Form Modal */}
      {showModelForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {editingModel ? 'Editar Modelo' : 'Adicionar Modelo'}
                </h3>
                <button
                  onClick={() => {
                    setShowModelForm(false);
                    setEditingModel(null);
                    setModelForm({ name: '', category: '' });
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome do Modelo *
                </label>
                <input
                  type="text"
                  value={modelForm.name}
                  onChange={(e) => setModelForm(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: LABGEO PT1000"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria
                </label>
                <select
                  value={modelForm.category}
                  onChange={(e) => setModelForm(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Básico">Básico</option>
                  <option value="Geral">Geral</option>
                  <option value="Cardiologia">Cardiologia</option>
                  <option value="Obstétrico">Obstétrico</option>
                  <option value="Veterinário">Veterinário</option>
                  <option value="Portátil">Portátil</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>
            </div>
            
            <div className="p-6 border-t flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowModelForm(false);
                  setEditingModel(null);
                  setModelForm({ name: '', category: '' });
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={saveModel}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Salvar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Form Modal */}
      {showEmailForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {editingEmail ? 'Editar Configuração' : 'Adicionar Configuração'}
                </h3>
                <button
                  onClick={() => {
                    setShowEmailForm(false);
                    setEditingEmail(null);
                    setEmailForm({ formType: '', toEmails: [''], ccEmails: [''] });
                  }}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Formulário *
                </label>
                <select
                  value={emailForm.formType}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, formType: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selecione</option>
                  <option value="service">Serviço</option>
                  <option value="demo">Demonstração</option>
                  <option value="app">Aplicação</option>
                  <option value="password">Licença</option>
                  <option value="install">Instalação</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emails Para
                </label>
                {emailForm.toEmails.map((email, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => updateEmailField('to', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="email@exemplo.com"
                    />
                    {emailForm.toEmails.length > 1 && (
                      <button
                        onClick={() => removeEmailField('to', index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addEmailField('to')}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + Adicionar email
                </button>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Emails Cópia
                </label>
                {emailForm.ccEmails.map((email, index) => (
                  <div key={index} className="flex space-x-2 mb-2">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => updateEmailField('cc', index, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="email@exemplo.com"
                    />
                    {emailForm.ccEmails.length > 1 && (
                      <button
                        onClick={() => removeEmailField('cc', index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => addEmailField('cc')}
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  + Adicionar email
                </button>
              </div>
            </div>
            
            <div className="p-6 border-t flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowEmailForm(false);
                  setEditingEmail(null);
                  setEmailForm({ formType: '', toEmails: [''], ccEmails: [''] });
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={saveEmailConfig}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Salvar</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
