import React, { useState, useEffect } from 'react';
import { Wrench, Send, Save, AlertTriangle, Calendar, Trash2 } from 'lucide-react';
import { AttachmentButton } from '../AttachmentButton';
import { useCurrentUser } from '../../hooks/useCurrentUser';
import { FormButton } from '../ui/FormButton';
import { FormField, FormInput, FormTextarea, FormSelect } from '../ui/FormField';

interface FormData {
  id: string;
  type: string;
  data: any;
  createdAt: string;
}

interface AttachmentFile {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl: string;
}

interface ServiceFormProps {
  editingData?: FormData | null;
  onClearEdit?: () => void;
}

export const ServiceForm: React.FC<ServiceFormProps> = ({ editingData, onClearEdit }) => {
  const { getCurrentUserId } = useCurrentUser();
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [equipmentModels, setEquipmentModels] = useState<string[]>([]);
  const [formData, setFormData] = useState({
    razaoSocial: '',
    cpfCnpj: '',
    telefone1: '',
    telefone2: '',
    email: '',
    responsavel: '',
    cep: '',
    endereco: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    modelo: '',
    serial: '',
    motivo: '',
    descricao: '',
    usoEquipamento: '',
    modeloImpressora: '',
    modeloNobreak: '',
    dataPreferencial: '',
    urgente: false
  });

  // Configurar email config padrão quando o componente monta
  useEffect(() => {
    // Carregar modelos de equipamentos
    const savedModels = JSON.parse(localStorage.getItem('miniescopo_models') || '[]');
    const modelNames = savedModels.map((m: any) => m.name);
    setEquipmentModels(modelNames);

    const defaultConfig = {
      SERVICE: {
        toEmails: ['servico@samsung.com'],
        ccEmails: ['backoffice@samsung.com'],
        customMessage: 'Nova solicitação de serviço técnico:'
      }
    };
    
    const existingConfig = localStorage.getItem('miniescopo_email_config');
    if (!existingConfig) {
      localStorage.setItem('miniescopo_email_config', JSON.stringify(defaultConfig));
    }
  }, []);

  // Carregar dados para edição
  useEffect(() => {
    if (editingData && editingData.type === 'service') {
      setFormData(editingData.data);
      setAttachments(editingData.data.attachments || []);
    }
  }, [editingData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Iniciando envio de email...');
    console.log('Dados do formulário:', formData);
    
    try {
      // Verificar se o EmailService está disponível
      console.log('Verificando EmailService...', typeof window.EmailService);
      
      if (typeof window.EmailService === 'undefined') {
        console.error('EmailService não está disponível');
        // Aguardar um pouco e tentar novamente
        setTimeout(async () => {
          if (typeof window.EmailService !== 'undefined') {
            await window.EmailService.sendEmail(formData, 'SERVICE', formData.motivo);
            console.log('Email enviado com sucesso após aguardar');
            
            // Continuar com o resto do fluxo
            const savedForms = JSON.parse(localStorage.getItem('miniescopo_forms') || '[]');
            const newForm = {
              id: Date.now().toString(),
              type: 'service',
              data: { ...formData, attachments },
              createdAt: new Date().toISOString(),
              createdBy: getCurrentUserId()
            };
            savedForms.push(newForm);
            localStorage.setItem('miniescopo_forms', JSON.stringify(savedForms));
            
            alert('Solicitação de serviço enviada com sucesso!');
            
            if (onClearEdit) {
              onClearEdit();
            }
            
            setFormData({
              razaoSocial: '',
              cpfCnpj: '',
              telefone1: '',
              telefone2: '',
              email: '',
              responsavel: '',
              cep: '',
              endereco: '',
              numero: '',
              bairro: '',
              cidade: '',
              estado: '',
              modelo: '',
              serial: '',
              motivo: '',
              descricao: '',
              usoEquipamento: '',
              modeloImpressora: '',
              modeloNobreak: '',
              dataPreferencial: '',
              urgente: false
            });
          } else {
            alert('Serviço de email não está carregado. Recarregue a página e tente novamente.');
          }
        }, 1000);
        return;
      }

      // Verificar se está configurado - assumindo que tem configuração padrão
      console.log('Enviando email via EmailService...');
      
      // Enviar usando o EmailService
      await window.EmailService.sendEmail(formData, 'SERVICE', formData.motivo);
      console.log('Email enviado com sucesso');
      
      // Salvar no localStorage
      const savedForms = JSON.parse(localStorage.getItem('miniescopo_forms') || '[]');
      const newForm = {
        id: Date.now().toString(),
        type: 'service',
        data: { ...formData, attachments },
        createdAt: new Date().toISOString(),
        createdBy: getCurrentUserId()
      };
      savedForms.push(newForm);
      localStorage.setItem('miniescopo_forms', JSON.stringify(savedForms));
      
      console.log('Formulário salvo no localStorage');
      alert('Solicitação de serviço enviada com sucesso!');
      
      // Limpar formulário ou limpar edição
      if (onClearEdit) {
        onClearEdit();
      }
      
      setFormData({
        razaoSocial: '',
        cpfCnpj: '',
        telefone1: '',
        telefone2: '',
        email: '',
        responsavel: '',
        cep: '',
        endereco: '',
        numero: '',
        bairro: '',
        cidade: '',
        estado: '',
        modelo: '',
        serial: '',
        motivo: '',
        descricao: '',
        usoEquipamento: '',
        modeloImpressora: '',
        modeloNobreak: '',
        dataPreferencial: '',
        urgente: false
      });
      setAttachments([]);
      
    } catch (error) {
      console.error('Erro completo ao enviar email:', error);
      console.error('Stack trace:', error.stack);
      alert(`Erro ao enviar email: ${error.message}`);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const clearForm = () => {
    setFormData({
      razaoSocial: '', cpfCnpj: '', telefone1: '', telefone2: '', email: '', responsavel: '',
      cep: '', endereco: '', numero: '', bairro: '', cidade: '', estado: '',
      modelo: '', serial: '', motivo: '', descricao: '', usoEquipamento: '',
      modeloImpressora: '', modeloNobreak: '', dataPreferencial: '', urgente: false
    });
    setAttachments([]);
    if (onClearEdit) {
      onClearEdit();
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
          <div className="flex items-center space-x-3">
            <Wrench className="w-8 h-8 text-white" />
            <h2 className="text-2xl font-bold text-white">Solicitação de Serviço</h2>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8">
          {/* Dados do Cliente */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Dados do Cliente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome/Razão Social *
                </label>
                <input
                  type="text"
                  name="razaoSocial"
                  value={formData.razaoSocial}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CPF/CNPJ *
                </label>
                <input
                  type="text"
                  name="cpfCnpj"
                  value={formData.cpfCnpj}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone Principal *
                </label>
                <input
                  type="tel"
                  name="telefone1"
                  value={formData.telefone1}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone Secundário
                </label>
                <input
                  type="tel"
                  name="telefone2"
                  value={formData.telefone2}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Responsável
                </label>
                <input
                  type="text"
                  name="responsavel"
                  value={formData.responsavel}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Endereço</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
                <input
                  type="text"
                  name="cep"
                  value={formData.cep}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
                <input
                  type="text"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Número</label>
                <input
                  type="text"
                  name="numero"
                  value={formData.numero}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
                <input
                  type="text"
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                <input
                  type="text"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                <input
                  type="text"
                  name="estado"
                  value={formData.estado}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Dados do Equipamento */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Dados do Equipamento</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Modelo *</label>
                <select
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione o modelo</option>
                  {equipmentModels.map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                  <option value="OUTROS">OUTROS</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Número de Série *</label>
                <input
                  type="text"
                  name="serial"
                  value={formData.serial}
                  onChange={handleChange}
                  required
                  maxLength={15}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Máximo 15 caracteres"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Motivo da Solicitação *</label>
                <select
                  name="motivo"
                  value={formData.motivo}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione o motivo</option>
                  <option value="Manutenção Preventiva">Manutenção Preventiva</option>
                  <option value="Defeito no Equipamento">Defeito no Equipamento</option>
                  <option value="Instalação">Instalação</option>
                  <option value="Treinamento">Treinamento</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">Descrição Detalhada</label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Descreva detalhadamente o problema ou solicitação..."
                />
              </div>
            </div>
          </div>

          {/* Informações Específicas */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Informações Específicas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Uso do Equipamento</label>
                <input
                  type="text"
                  name="usoEquipamento"
                  value={formData.usoEquipamento}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: Uso industrial, laboratorial, etc."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Modelo da Impressora</label>
                <input
                  type="text"
                  name="modeloImpressora"
                  value={formData.modeloImpressora}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Modelo do Nobreak</label>
                <input
                  type="text"
                  name="modeloNobreak"
                  value={formData.modeloNobreak}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="w-4 h-4 inline mr-2" />
                  Data Preferencial
                </label>
                <input
                  type="date"
                  name="dataPreferencial"
                  value={formData.dataPreferencial}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <input
                type="checkbox"
                id="urgente"
                name="urgente"
                checked={formData.urgente}
                onChange={handleChange}
                className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
              />
              <label htmlFor="urgente" className="text-sm font-medium text-red-600 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-1" />
                Solicitação Urgente
              </label>
            </div>
          </div>

          {/* Anexos */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Anexos</h3>
            <AttachmentButton 
              onAttachmentsChange={setAttachments}
              maxFiles={5}
              maxSizePerFile={10}
            />
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            {editingData && onClearEdit && (
              <FormButton
                type="button"
                onClick={onClearEdit}
                variant="secondary"
              >
                Cancelar Edição
              </FormButton>
            )}
            
            <FormButton
              type="button"
              onClick={clearForm}
              variant="secondary"
              icon={Trash2}
            >
              Limpar Formulário
            </FormButton>
            
            <FormButton
              type="submit"
              variant="primary"
              icon={Send}
              size="lg"
            >
              {editingData ? 'Salvar Alterações' : 'Enviar Solicitação de Serviço'}
            </FormButton>
          </div>
        </form>
      </div>
    </div>
  );
};