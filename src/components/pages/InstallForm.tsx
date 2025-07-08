import React, { useState, useEffect } from 'react';
import { Download, Save, Send, Trash2, AlertCircle } from 'lucide-react';
import { AttachmentButton } from '../AttachmentButton';
import { 
  validateCPFOrCNPJ, 
  formatCPFOrCNPJ, 
  formatPhone, 
  formatCEP,
  validateEmail,
  validatePhone,
  validateCEP
} from '../../utils/validations';

interface FormData {
  id: string;
  type: string;
  data: any;
  createdAt: string;
}

interface InstallFormProps {
  editingData?: FormData | null;
  onClearEdit?: () => void;
}

interface FormErrors {
  [key: string]: string;
}

interface AttachmentFile {
  id: string;
  name: string;
  size: number;
  type: string;
  dataUrl: string;
}

export const InstallForm: React.FC<InstallFormProps> = ({ editingData, onClearEdit }) => {
  const [formData, setFormData] = useState({
    // Dados do Cliente
    nomeCliente: '',
    cpfCnpj: '',
    telefone1: '',
    telefone2: '',
    email: '',
    responsavel: '',
    // Endereço
    cep: '',
    endereco: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    // Equipamento
    modelo: '',
    numeroSerie: '',
    motivo: '',
    descricao: '',
    // Específicos da Instalação
    tipoInstalacao: '',
    dataInstalacao: '',
    horarioPreferencial: '',
    requisitos: '',
    observacoes: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [equipmentModels, setEquipmentModels] = useState<string[]>([]);
  const [attachments, setAttachments] = useState<AttachmentFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedModels = JSON.parse(localStorage.getItem('miniescopo_models') || '[]');
    const modelNames = savedModels.map((m: any) => m.name);
    setEquipmentModels(modelNames);

    if (editingData && editingData.type === 'install') {
      setFormData(editingData.data);
      if (onClearEdit) onClearEdit();
    }
  }, [editingData, onClearEdit]);

  const validateField = (name: string, value: any): string => {
    switch (name) {
      case 'nomeCliente':
        return !value?.trim() ? 'Nome/Razão Social é obrigatório' : '';
      case 'cpfCnpj':
        if (!value?.trim()) return 'CPF/CNPJ é obrigatório';
        if (!validateCPFOrCNPJ(value)) return 'CPF/CNPJ inválido';
        return '';
      case 'telefone1':
        if (!value?.trim()) return 'Telefone principal é obrigatório';
        if (!validatePhone(value)) return 'Telefone inválido';
        return '';
      case 'telefone2':
        if (value?.trim() && !validatePhone(value)) return 'Telefone inválido';
        return '';
      case 'email':
        if (value?.trim() && !validateEmail(value)) return 'Email inválido';
        return '';
      case 'cep':
        if (value?.trim() && !validateCEP(value)) return 'CEP inválido';
        return '';
      case 'modelo':
        return !value?.trim() ? 'Modelo é obrigatório' : '';
      case 'numeroSerie':
        return !value?.trim() ? 'Número de série é obrigatório' : '';
      case 'motivo':
        return !value?.trim() ? 'Motivo é obrigatório' : '';
      case 'tipoInstalacao':
        return !value?.trim() ? 'Tipo de instalação é obrigatório' : '';
      case 'dataInstalacao':
        if (value) {
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selectedDate < today) return 'Data não pode ser anterior a hoje';
        }
        return '';
      default:
        return '';
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key as keyof typeof formData]);
      if (error) newErrors[key] = error;
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cpfCnpj') {
      formattedValue = formatCPFOrCNPJ(value);
    } else if (name === 'telefone1' || name === 'telefone2') {
      formattedValue = formatPhone(value);
    } else if (name === 'cep') {
      formattedValue = formatCEP(value);
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    const error = validateField(name, formattedValue);
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  const buscarCEP = async (cep: string) => {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return;

    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
      const data = await response.json();
      
      if (!data.erro) {
        setFormData(prev => ({
          ...prev,
          endereco: data.logradouro || '',
          bairro: data.bairro || '',
          cidade: data.localidade || '',
          estado: data.uf || ''
        }));
      }
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
    }
  };

  const handleCepBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    buscarCEP(e.target.value);
  };

  const clearForm = () => {
    setFormData({
      nomeCliente: '',
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
      numeroSerie: '',
      motivo: '',
      descricao: '',
      tipoInstalacao: '',
      dataInstalacao: '',
      horarioPreferencial: '',
      requisitos: '',
      observacoes: ''
    });
    setErrors({});
    setAttachments([]);
  };

  const saveForm = () => {
    if (!validateForm()) {
      alert('Por favor, corrija os erros no formulário antes de salvar.');
      return;
    }

    const savedForms = JSON.parse(localStorage.getItem('miniescopo_forms') || '[]');
    const formRecord = {
      id: Date.now().toString(),
      type: 'install',
      data: { ...formData, attachments },
      createdAt: new Date().toISOString()
    };

    savedForms.push(formRecord);
    localStorage.setItem('miniescopo_forms', JSON.stringify(savedForms));
    
    alert('Formulário salvo com sucesso!');
  };

  const sendEmail = async () => {
    if (!validateForm()) {
      alert('Por favor, corrija os erros no formulário antes de enviar.');
      return;
    }

    setIsSubmitting(true);

    try {
      const emailConfigs = JSON.parse(localStorage.getItem('miniescopo_email_configs') || '[]');
      const installConfig = emailConfigs.find((config: any) => config.formType === 'install');
      
      const toEmails = installConfig?.toEmails?.join(';') || '';
      const ccEmails = installConfig?.ccEmails?.join(';') || '';
      
      const subject = `[MINIESCOPO] Solicitação de Instalação - ${formData.nomeCliente}`;
      const body = generateEmailBody();
      
      const mailtoUrl = `mailto:${toEmails}${ccEmails ? `?cc=${ccEmails}` : '?'}${ccEmails ? '&' : ''}subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      
      window.open(mailtoUrl);
      saveForm();
      
      alert('Email aberto no cliente padrão!');
    } catch (error) {
      alert('Erro ao enviar email');
    } finally {
      setIsSubmitting(false);
    }
  };

  const generateEmailBody = (): string => {
    return `
SOLICITAÇÃO DE INSTALAÇÃO

=== DADOS DO CLIENTE ===
Nome/Razão Social: ${formData.nomeCliente}
CPF/CNPJ: ${formData.cpfCnpj}
Telefone Principal: ${formData.telefone1}
${formData.telefone2 ? `Telefone Secundário: ${formData.telefone2}` : ''}
${formData.email ? `Email: ${formData.email}` : ''}
${formData.responsavel ? `Responsável: ${formData.responsavel}` : ''}

=== ENDEREÇO ===
${formData.cep ? `CEP: ${formData.cep}` : ''}
${formData.endereco ? `Endereço: ${formData.endereco}${formData.numero ? `, ${formData.numero}` : ''}` : ''}
${formData.bairro ? `Bairro: ${formData.bairro}` : ''}
${formData.cidade && formData.estado ? `Cidade: ${formData.cidade} - ${formData.estado}` : ''}

=== EQUIPAMENTO ===
Modelo: ${formData.modelo}
Número de Série: ${formData.numeroSerie}
Motivo: ${formData.motivo}
${formData.descricao ? `Descrição: ${formData.descricao}` : ''}

=== DETALHES DA INSTALAÇÃO ===
Tipo de Instalação: ${formData.tipoInstalacao}
${formData.dataInstalacao ? `Data Preferencial: ${new Date(formData.dataInstalacao).toLocaleDateString('pt-BR')}` : ''}
${formData.horarioPreferencial ? `Horário Preferencial: ${formData.horarioPreferencial}` : ''}
${formData.requisitos ? `Requisitos: ${formData.requisitos}` : ''}
${formData.observacoes ? `Observações: ${formData.observacoes}` : ''}

${attachments.length > 0 ? `=== ANEXOS ===
${attachments.map(att => `- ${att.name} (${(att.size / 1024 / 1024).toFixed(2)} MB)`).join('\n')}` : ''}

Data da solicitação: ${new Date().toLocaleString('pt-BR')}
    `;
  };

  const renderFieldError = (fieldName: string) => {
    if (errors[fieldName]) {
      return (
        <div className="flex items-center mt-1 text-red-600 text-sm">
          <AlertCircle className="w-4 h-4 mr-1" />
          {errors[fieldName]}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-6">
          <div className="flex items-center space-x-3">
            <Download className="w-8 h-8 text-white" />
            <h2 className="text-2xl font-bold text-white">Solicitação de Instalação</h2>
          </div>
        </div>

        <form className="p-8 space-y-8">
          {/* Dados do Cliente */}
          <div className="space-y-6">
            <div className="border-l-4 border-indigo-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados do Cliente</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nome/Razão Social *
                </label>
                <input
                  type="text"
                  name="nomeCliente"
                  value={formData.nomeCliente}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.nomeCliente ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Digite o nome ou razão social"
                />
                {renderFieldError('nomeCliente')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CPF/CNPJ *
                </label>
                <input
                  type="text"
                  name="cpfCnpj"
                  value={formData.cpfCnpj}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.cpfCnpj ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                  maxLength={18}
                />
                {renderFieldError('cpfCnpj')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone Principal *
                </label>
                <input
                  type="tel"
                  name="telefone1"
                  value={formData.telefone1}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.telefone1 ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                />
                {renderFieldError('telefone1')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Telefone Secundário
                </label>
                <input
                  type="tel"
                  name="telefone2"
                  value={formData.telefone2}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.telefone2 ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="(00) 00000-0000"
                  maxLength={15}
                />
                {renderFieldError('telefone2')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  E-mail
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="exemplo@email.com"
                />
                {renderFieldError('email')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Responsável
                </label>
                <input
                  type="text"
                  name="responsavel"
                  value={formData.responsavel}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Nome do responsável"
                />
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Endereço</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  CEP
                </label>
                <input
                  type="text"
                  name="cep"
                  value={formData.cep}
                  onChange={handleInputChange}
                  onBlur={handleCepBlur}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.cep ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="00000-000"
                  maxLength={9}
                />
                {renderFieldError('cep')}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Endereço
                </label>
                <input
                  type="text"
                  name="endereco"
                  value={formData.endereco}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Rua, Avenida, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número
                </label>
                <input
                  type="text"
                  name="numero"
                  value={formData.numero}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="123"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bairro
                </label>
                <input
                  type="text"
                  name="bairro"
                  value={formData.bairro}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Nome do bairro"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cidade
                </label>
                <input
                  type="text"
                  name="cidade"
                  value={formData.cidade}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Nome da cidade"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  name="estado"
                  value={formData.estado}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Selecione</option>
                  <option value="AC">Acre</option>
                  <option value="AL">Alagoas</option>
                  <option value="AP">Amapá</option>
                  <option value="AM">Amazonas</option>
                  <option value="BA">Bahia</option>
                  <option value="CE">Ceará</option>
                  <option value="DF">Distrito Federal</option>
                  <option value="ES">Espírito Santo</option>
                  <option value="GO">Goiás</option>
                  <option value="MA">Maranhão</option>
                  <option value="MT">Mato Grosso</option>
                  <option value="MS">Mato Grosso do Sul</option>
                  <option value="MG">Minas Gerais</option>
                  <option value="PA">Pará</option>
                  <option value="PB">Paraíba</option>
                  <option value="PR">Paraná</option>
                  <option value="PE">Pernambuco</option>
                  <option value="PI">Piauí</option>
                  <option value="RJ">Rio de Janeiro</option>
                  <option value="RN">Rio Grande do Norte</option>
                  <option value="RS">Rio Grande do Sul</option>
                  <option value="RO">Rondônia</option>
                  <option value="RR">Roraima</option>
                  <option value="SC">Santa Catarina</option>
                  <option value="SP">São Paulo</option>
                  <option value="SE">Sergipe</option>
                  <option value="TO">Tocantins</option>
                </select>
              </div>
            </div>
          </div>

          {/* Dados do Equipamento */}
          <div className="space-y-6">
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados do Equipamento</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Modelo *
                </label>
                <select
                  name="modelo"
                  value={formData.modelo}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.modelo ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione o modelo</option>
                  {equipmentModels.map(model => (
                    <option key={model} value={model}>{model}</option>
                  ))}
                  <option value="OUTROS">OUTROS</option>
                </select>
                {renderFieldError('modelo')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Número de Série *
                </label>
                <input
                  type="text"
                  name="numeroSerie"
                  value={formData.numeroSerie}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.numeroSerie ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Número de série do equipamento"
                />
                {renderFieldError('numeroSerie')}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Motivo da Solicitação *
                </label>
                <select
                  name="motivo"
                  value={formData.motivo}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.motivo ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione o motivo</option>
                  <option value="Instalação Inicial">Instalação Inicial</option>
                  <option value="Reinstalação">Reinstalação</option>
                  <option value="Mudança de Local">Mudança de Local</option>
                  <option value="Upgrade de Equipamento">Upgrade de Equipamento</option>
                  <option value="Outros">Outros</option>
                </select>
                {renderFieldError('motivo')}
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição Detalhada
                </label>
                <textarea
                  name="descricao"
                  value={formData.descricao}
                  onChange={handleInputChange}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Descreva detalhadamente o local e o que será instalado..."
                />
              </div>
            </div>
          </div>

          {/* Detalhes da Instalação */}
          <div className="space-y-6">
            <div className="border-l-4 border-cyan-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalhes da Instalação</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Instalação *
                </label>
                <select
                  name="tipoInstalacao"
                  value={formData.tipoInstalacao}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.tipoInstalacao ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione</option>
                  <option value="Instalação Básica">Instalação Básica</option>
                  <option value="Instalação Completa">Instalação Completa</option>
                  <option value="Reinstalação">Reinstalação</option>
                  <option value="Migração">Migração</option>
                  <option value="Atualização">Atualização</option>
                </select>
                {renderFieldError('tipoInstalacao')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data Preferencial
                </label>
                <input
                  type="date"
                  name="dataInstalacao"
                  value={formData.dataInstalacao}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors.dataInstalacao ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {renderFieldError('dataInstalacao')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Horário Preferencial
                </label>
                <select
                  name="horarioPreferencial"
                  value={formData.horarioPreferencial}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">Selecione</option>
                  <option value="Manhã (08:00 - 12:00)">Manhã (08:00 - 12:00)</option>
                  <option value="Tarde (13:00 - 17:00)">Tarde (13:00 - 17:00)</option>
                  <option value="Comercial (08:00 - 17:00)">Comercial (08:00 - 17:00)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Requisitos Especiais
                </label>
                <textarea
                  name="requisitos"
                  value={formData.requisitos}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Descreva requisitos especiais para a instalação..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observações
                </label>
                <textarea
                  name="observacoes"
                  value={formData.observacoes}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Informações adicionais sobre a instalação..."
                />
              </div>
            </div>
          </div>

          {/* Anexos */}
          <div className="space-y-6">
            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Anexos</h3>
            </div>
            
            <AttachmentButton 
              onAttachmentsChange={setAttachments}
              maxFiles={5}
              maxSizePerFile={10}
            />
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-wrap gap-4 pt-6 border-t">
            <button
              type="button"
              onClick={clearForm}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
              <span>Limpar</span>
            </button>

            <button
              type="button"
              onClick={saveForm}
              className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Save className="w-5 h-5" />
              <span>Salvar</span>
            </button>

            <button
              type="button"
              onClick={sendEmail}
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
              <span>{isSubmitting ? 'Enviando...' : 'Enviar Email'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
