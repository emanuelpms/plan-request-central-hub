import React, { useState, useEffect } from 'react';
import { Key, Save, Send, Trash2, AlertCircle } from 'lucide-react';
import { useCurrentUser } from '../../hooks/useCurrentUser';
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

interface PasswordFormProps {
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

export const PasswordForm: React.FC<PasswordFormProps> = ({ editingData, onClearEdit }) => {
  const { getCurrentUserId } = useCurrentUser();
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
    // Específicos da Licença
    tipoLicenca: '',
    quantidadeLicencas: '',
    versaoSoftware: '',
    dataVencimento: '',
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

    if (editingData && editingData.type === 'password') {
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
      case 'tipoLicenca':
        return !value?.trim() ? 'Tipo de licença é obrigatório' : '';
      case 'quantidadeLicencas':
        if (!value?.trim()) return 'Quantidade é obrigatória';
        if (parseInt(value) <= 0) return 'Quantidade deve ser maior que zero';
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
      tipoLicenca: '',
      quantidadeLicencas: '',
      versaoSoftware: '',
      dataVencimento: '',
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
      type: 'password',
      data: { ...formData, attachments },
      createdAt: new Date().toISOString(),
      createdBy: getCurrentUserId()
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
      const passwordConfig = emailConfigs.find((config: any) => config.formType === 'password');
      
      const toEmails = passwordConfig?.toEmails?.join(';') || '';
      const ccEmails = passwordConfig?.ccEmails?.join(';') || '';
      
      const subject = `[MINIESCOPO] Solicitação de Licença - ${formData.nomeCliente}`;
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
    const currentDate = new Date().toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Solicitação de Licença - MiniEscopo</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f5f7fa;
            padding: 20px;
        }
        
        .email-container {
            max-width: 800px;
            margin: 0 auto;
            background: #ffffff;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #eab308 0%, #ca8a04 100%);
            color: white;
            padding: 30px;
            text-align: center;
            position: relative;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="20" cy="20" r="2" fill="rgba(255,255,255,0.1)"/><circle cx="80" cy="40" r="1.5" fill="rgba(255,255,255,0.1)"/><circle cx="40" cy="80" r="1" fill="rgba(255,255,255,0.1)"/></svg>');
            opacity: 0.3;
        }
        
        .header-content {
            position: relative;
            z-index: 1;
        }
        
        .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
            text-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        
        .header .subtitle {
            font-size: 16px;
            opacity: 0.9;
            font-weight: 300;
        }
        
        .date-info {
            background: rgba(255,255,255,0.1);
            padding: 15px 25px;
            margin: 20px -30px -30px -30px;
            text-align: center;
            font-size: 14px;
            border-top: 1px solid rgba(255,255,255,0.2);
        }
        
        .content {
            padding: 40px;
        }
        
        .section {
            margin-bottom: 35px;
        }
        
        .section-header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e5e7eb;
        }
        
        .section-icon {
            width: 24px;
            height: 24px;
            margin-right: 12px;
            color: #eab308;
        }
        
        .section-title {
            font-size: 20px;
            font-weight: 600;
            color: #1f2937;
        }
        
        .field-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .field {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            padding: 15px;
            transition: all 0.3s ease;
        }
        
        .field:hover {
            border-color: #eab308;
            box-shadow: 0 2px 8px rgba(234, 179, 8, 0.1);
        }
        
        .field-label {
            font-weight: 600;
            color: #374151;
            font-size: 14px;
            margin-bottom: 6px;
            display: block;
        }
        
        .field-value {
            color: #6b7280;
            font-size: 15px;
            word-break: break-word;
        }
        
        .field-value.highlight {
            color: #1f2937;
            font-weight: 500;
            background: linear-gradient(120deg, #fbbf24 0%, #f59e0b 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        
        .description-field {
            grid-column: 1 / -1;
            background: #fefce8;
            border: 1px solid #fde047;
        }
        
        .license-badge {
            display: inline-flex;
            align-items: center;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 8px 16px;
            border-radius: 20px;
            font-weight: 600;
            font-size: 14px;
            margin-top: 15px;
        }
        
        .license-badge::before {
            content: '🔑';
            margin-right: 8px;
        }
        
        .attachments-section {
            background: #fffbeb;
            border: 1px solid #fde68a;
            border-radius: 8px;
            padding: 20px;
            margin-top: 20px;
        }
        
        .attachment-item {
            display: flex;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid #fde68a;
        }
        
        .attachment-item:last-child {
            border-bottom: none;
        }
        
        .attachment-item::before {
            content: '📎';
            margin-right: 10px;
        }
        
        .footer {
            background: linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%);
            padding: 30px;
            text-align: center;
            border-top: 1px solid #d1d5db;
        }
        
        .footer-logo {
            font-size: 24px;
            font-weight: 700;
            color: #1f2937;
            margin-bottom: 8px;
        }
        
        .footer-text {
            color: #6b7280;
            font-size: 14px;
            margin-bottom: 5px;
        }
        
        .system-info {
            background: rgba(234, 179, 8, 0.1);
            border: 1px solid rgba(234, 179, 8, 0.2);
            border-radius: 6px;
            padding: 10px 15px;
            margin-top: 15px;
            font-size: 13px;
            color: #a16207;
        }
        
        @media (max-width: 600px) {
            body {
                padding: 10px;
            }
            
            .content {
                padding: 20px;
            }
            
            .field-grid {
                grid-template-columns: 1fr;
                gap: 15px;
            }
            
            .header {
                padding: 20px;
            }
            
            .header h1 {
                font-size: 24px;
            }
        }
        
        .no-value {
            color: #9ca3af;
            font-style: italic;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <div class="header-content">
                <h1>🔑 Solicitação de Licença</h1>
                <p class="subtitle">Sistema MiniEscopo - Gestão de Licenças</p>
            </div>
            <div class="date-info">
                📅 Solicitação enviada em ${currentDate} às ${new Date().toLocaleTimeString('pt-BR')}
            </div>
        </div>
        
        <div class="content">
            <!-- Dados do Cliente -->
            <div class="section">
                <div class="section-header">
                    <span class="section-icon">👥</span>
                    <h2 class="section-title">Dados do Cliente</h2>
                </div>
                <div class="field-grid">
                    <div class="field">
                        <span class="field-label">Nome/Razão Social</span>
                        <div class="field-value highlight">${formData.nomeCliente || '<span class="no-value">Não informado</span>'}</div>
                    </div>
                    <div class="field">
                        <span class="field-label">CPF/CNPJ</span>
                        <div class="field-value">${formData.cpfCnpj || '<span class="no-value">Não informado</span>'}</div>
                    </div>
                    <div class="field">
                        <span class="field-label">Telefone Principal</span>
                        <div class="field-value">${formData.telefone1 || '<span class="no-value">Não informado</span>'}</div>
                    </div>
                    <div class="field">
                        <span class="field-label">Telefone Secundário</span>
                        <div class="field-value">${formData.telefone2 || '<span class="no-value">Não informado</span>'}</div>
                    </div>
                    <div class="field">
                        <span class="field-label">E-mail</span>
                        <div class="field-value">${formData.email || '<span class="no-value">Não informado</span>'}</div>
                    </div>
                    <div class="field">
                        <span class="field-label">Responsável</span>
                        <div class="field-value">${formData.responsavel || '<span class="no-value">Não informado</span>'}</div>
                    </div>
                </div>
            </div>

            <!-- Endereço -->
            <div class="section">
                <div class="section-header">
                    <span class="section-icon">📍</span>
                    <h2 class="section-title">Endereço</h2>
                </div>
                <div class="field-grid">
                    <div class="field">
                        <span class="field-label">CEP</span>
                        <div class="field-value">${formData.cep || '<span class="no-value">Não informado</span>'}</div>
                    </div>
                    <div class="field">
                        <span class="field-label">Endereço</span>
                        <div class="field-value">${formData.endereco || '<span class="no-value">Não informado</span>'}</div>
                    </div>
                    <div class="field">
                        <span class="field-label">Número</span>
                        <div class="field-value">${formData.numero || '<span class="no-value">Não informado</span>'}</div>
                    </div>
                    <div class="field">
                        <span class="field-label">Bairro</span>
                        <div class="field-value">${formData.bairro || '<span class="no-value">Não informado</span>'}</div>
                    </div>
                    <div class="field">
                        <span class="field-label">Cidade</span>
                        <div class="field-value">${formData.cidade || '<span class="no-value">Não informado</span>'}</div>
                    </div>
                    <div class="field">
                        <span class="field-label">Estado</span>
                        <div class="field-value">${formData.estado || '<span class="no-value">Não informado</span>'}</div>
                    </div>
                </div>
            </div>

            <!-- Dados do Equipamento -->
            <div class="section">
                <div class="section-header">
                    <span class="section-icon">⚙️</span>
                    <h2 class="section-title">Dados do Equipamento</h2>
                </div>
                <div class="field-grid">
                    <div class="field">
                        <span class="field-label">Modelo</span>
                        <div class="field-value highlight">${formData.modelo || '<span class="no-value">Não informado</span>'}</div>
                    </div>
                    <div class="field">
                        <span class="field-label">Número de Série</span>
                        <div class="field-value highlight">${formData.numeroSerie || '<span class="no-value">Não informado</span>'}</div>
                    </div>
                    <div class="field">
                        <span class="field-label">Motivo da Solicitação</span>
                        <div class="field-value highlight">${formData.motivo || '<span class="no-value">Não informado</span>'}</div>
                    </div>
                    ${formData.descricao ? `
                    <div class="field description-field">
                        <span class="field-label">Descrição Detalhada</span>
                        <div class="field-value">${formData.descricao}</div>
                    </div>
                    ` : ''}
                </div>
            </div>

            <!-- Detalhes da Licença -->
            <div class="section">
                <div class="section-header">
                    <span class="section-icon">🔑</span>
                    <h2 class="section-title">Detalhes da Licença</h2>
                </div>
                <div class="field-grid">
                    <div class="field">
                        <span class="field-label">Tipo de Licença</span>
                        <div class="field-value highlight">${formData.tipoLicenca || '<span class="no-value">Não informado</span>'}</div>
                    </div>
                    <div class="field">
                        <span class="field-label">Quantidade de Licenças</span>
                        <div class="field-value highlight">${formData.quantidadeLicencas || '<span class="no-value">Não informado</span>'}</div>
                    </div>
                    ${formData.versaoSoftware ? `
                    <div class="field">
                        <span class="field-label">Versão do Software</span>
                        <div class="field-value">${formData.versaoSoftware}</div>
                    </div>
                    ` : ''}
                    ${formData.dataVencimento ? `
                    <div class="field">
                        <span class="field-label">Data de Vencimento</span>
                        <div class="field-value">${new Date(formData.dataVencimento).toLocaleDateString('pt-BR')}</div>
                    </div>
                    ` : ''}
                    ${formData.observacoes ? `
                    <div class="field description-field">
                        <span class="field-label">Observações</span>
                        <div class="field-value">${formData.observacoes}</div>
                    </div>
                    ` : ''}
                </div>
                
                <div class="license-badge">Nova Licença Solicitada</div>
            </div>

            ${attachments.length > 0 ? `
            <!-- Anexos -->
            <div class="section">
                <div class="section-header">
                    <span class="section-icon">📎</span>
                    <h2 class="section-title">Anexos</h2>
                </div>
                <div class="attachments-section">
                    ${attachments.map(att => `
                        <div class="attachment-item">
                            <span><strong>${att.name}</strong> (${(att.size / 1024 / 1024).toFixed(2)} MB)</span>
                        </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
        </div>
        
        <div class="footer">
            <div class="footer-logo">MiniEscopo</div>
            <div class="footer-text">Sistema de Gestão de Licenças</div>
            <div class="footer-text">Email gerado automaticamente</div>
            <div class="system-info">
                🔑 Este email foi enviado através do sistema MiniEscopo em ${new Date().toLocaleString('pt-BR')}
            </div>
        </div>
    </div>
</body>
</html>
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
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6">
          <div className="flex items-center space-x-3">
            <Key className="w-8 h-8 text-white" />
            <h2 className="text-2xl font-bold text-white">Solicitação de Licença</h2>
          </div>
        </div>

        <form className="p-8 space-y-8">
          {/* Dados do Cliente */}
          <div className="space-y-6">
            <div className="border-l-4 border-yellow-500 pl-4">
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Nome do responsável"
                />
              </div>
            </div>
          </div>

          {/* Endereço */}
          <div className="space-y-6">
            <div className="border-l-4 border-orange-500 pl-4">
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
            <div className="border-l-4 border-green-500 pl-4">
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                    errors.numeroSerie ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Número de série do equipamento"
                  maxLength={15}
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
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                    errors.motivo ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione o motivo</option>
                  <option value="Nova Licença">Nova Licença</option>
                  <option value="Renovação de Licença">Renovação de Licença</option>
                  <option value="Upgrade de Licença">Upgrade de Licença</option>
                  <option value="Outros">Outros</option>
                </select>
                {renderFieldError('motivo')}
              </div>
            </div>
          </div>

          {/* Detalhes da Licença */}
          <div className="space-y-6">
            <div className="border-l-4 border-orange-500 pl-4">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalhes da Licença</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Licença *
                </label>
                <select
                  name="tipoLicenca"
                  value={formData.tipoLicenca}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                    errors.tipoLicenca ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione</option>
                  <option value="Licença Permanente">Licença Permanente</option>
                  <option value="Licença Temporária">Licença Temporária</option>
                  <option value="Licença de Avaliação">Licença de Avaliação</option>
                  <option value="Renovação">Renovação</option>
                  <option value="Upgrade">Upgrade</option>
                </select>
                {renderFieldError('tipoLicenca')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantidade de Licenças *
                </label>
                <input
                  type="number"
                  name="quantidadeLicencas"
                  value={formData.quantidadeLicencas}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 ${
                    errors.quantidadeLicencas ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Ex: 1"
                  min="1"
                />
                {renderFieldError('quantidadeLicencas')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Versão do Software
                </label>
                <input
                  type="text"
                  name="versaoSoftware"
                  value={formData.versaoSoftware}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Ex: v2.1.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Data de Vencimento
                </label>
                <input
                  type="date"
                  name="dataVencimento"
                  value={formData.dataVencimento}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  placeholder="Informações adicionais sobre a licença..."
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
              className="flex items-center space-x-2 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <Save className="w-5 h-5" />
              <span>Salvar</span>
            </button>

            <button
              type="button"
              onClick={sendEmail}
              disabled={isSubmitting}
              className="flex items-center space-x-2 px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
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
