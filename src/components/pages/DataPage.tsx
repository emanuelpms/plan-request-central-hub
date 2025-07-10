
import React, { useState, useEffect } from 'react';
import { Database, Trash2, Edit3, Send, Eye } from 'lucide-react';

interface FormData {
  id: string;
  type: string;
  data: any;
  createdAt: string;
  createdBy?: string;
}

interface DataPageProps {
  onEditForm?: (formData: FormData) => void;
  userRole?: string;
  representativeId?: string;
}

export const DataPage: React.FC<DataPageProps> = ({ onEditForm, userRole, representativeId }) => {
  const [forms, setForms] = useState<FormData[]>([]);
  const [selectedForm, setSelectedForm] = useState<FormData | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const savedForms = JSON.parse(localStorage.getItem('miniescopo_forms') || '[]');
    
    // Filtrar formulários baseado no tipo de usuário
    let filteredForms = savedForms;
    if (userRole === 'representante' && representativeId) {
      filteredForms = savedForms.filter((form: FormData) => form.createdBy === representativeId);
    }
    
    setForms(filteredForms);
  }, [userRole, representativeId]);

  const deleteForm = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este formulário?')) {
      const updatedForms = forms.filter(form => form.id !== id);
      setForms(updatedForms);
      localStorage.setItem('miniescopo_forms', JSON.stringify(updatedForms));
    }
  };

  const viewForm = (form: FormData) => {
    setSelectedForm(form);
    setShowModal(true);
  };

  const editForm = (form: FormData) => {
    if (onEditForm) {
      onEditForm(form);
    }
    setShowModal(false);
  };

  const resendForm = async (form: FormData) => {
    try {
      const subject = `[MINIESCOPO] ${getFormTypeLabel(form.type)} - ${form.data.nomeCliente || form.data.razaoSocial}`;
      const body = generateEmailBody(form);
      const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.open(mailtoUrl);
      alert('Email aberto no cliente padrão!');
    } catch (error) {
      alert('Erro ao abrir email');
    }
  };

  const generateEmailBody = (form: FormData) => {
    const data = form.data;
    return `
SOLICITAÇÃO DE ${getFormTypeLabel(form.type).toUpperCase()}

=== DADOS DO CLIENTE ===
Nome/Razão Social: ${data.nomeCliente || data.razaoSocial || 'N/A'}
CPF/CNPJ: ${data.cpfCnpj || 'N/A'}
Telefone: ${data.telefone1 || 'N/A'}
Email: ${data.email || 'N/A'}
Responsável: ${data.responsavel || 'N/A'}

=== ENDEREÇO ===
CEP: ${data.cep || 'N/A'}
Endereço: ${data.endereco || 'N/A'}, ${data.numero || 'S/N'}
Bairro: ${data.bairro || 'N/A'}
Cidade: ${data.cidade || 'N/A'} - ${data.estado || 'N/A'}

=== EQUIPAMENTO ===
Modelo: ${data.modelo || 'N/A'}
Número de Série: ${data.numeroSerie || 'N/A'}
Motivo: ${data.motivo || 'N/A'}
Descrição: ${data.descricao || 'N/A'}

Data da solicitação: ${new Date(form.createdAt).toLocaleString('pt-BR')}
    `;
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
        <div className="bg-gradient-to-r from-gray-500 to-gray-600 p-6">
          <div className="flex items-center space-x-3">
            <Database className="w-8 h-8 text-white" />
            <h2 className="text-2xl font-bold text-white">Dados do Sistema</h2>
          </div>
        </div>

        <div className="p-8">
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-blue-900">{forms.length}</h3>
                <p className="text-blue-700">Formulários Salvos</p>
              </div>
              <Database className="w-12 h-12 text-blue-500" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {forms.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      Nenhum formulário encontrado
                    </td>
                  </tr>
                ) : (
                  forms.map((form) => (
                    <tr key={form.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {form.id.slice(-8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {getFormTypeLabel(form.type)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {form.data.nomeCliente || form.data.razaoSocial || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(form.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => viewForm(form)}
                            className="text-blue-600 hover:text-blue-900 transition-colors"
                            title="Visualizar"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => editForm(form)}
                            className="text-green-600 hover:text-green-900 transition-colors"
                            title="Editar"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => resendForm(form)}
                            className="text-purple-600 hover:text-purple-900 transition-colors"
                            title="Reenviar"
                          >
                            <Send className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteForm(form.id)}
                            className="text-red-600 hover:text-red-900 transition-colors"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal de Visualização */}
      {showModal && selectedForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {getFormTypeLabel(selectedForm.type)} - Detalhes
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <h4 className="font-medium text-gray-900">Cliente</h4>
                <p className="text-gray-600">{selectedForm.data.nomeCliente || selectedForm.data.razaoSocial}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">CPF/CNPJ</h4>
                <p className="text-gray-600">{selectedForm.data.cpfCnpj}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">Telefone</h4>
                <p className="text-gray-600">{selectedForm.data.telefone1}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">Modelo</h4>
                <p className="text-gray-600">{selectedForm.data.modelo}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">Número de Série</h4>
                <p className="text-gray-600">{selectedForm.data.numeroSerie}</p>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900">Data</h4>
                <p className="text-gray-600">{new Date(selectedForm.createdAt).toLocaleString('pt-BR')}</p>
              </div>
            </div>
            
            <div className="p-6 border-t flex justify-end space-x-3">
              <button
                onClick={() => editForm(selectedForm)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Editar
              </button>
              <button
                onClick={() => resendForm(selectedForm)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Reenviar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
