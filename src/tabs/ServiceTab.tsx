
import React, { useState } from 'react';
import FormField from '../components/FormField';
import ActionButtons from '../components/ActionButtons';
import { useRawData } from '../hooks/useRawData';
import { useToast } from '@/hooks/use-toast';
import { FormData } from '../types';
import { validateCPF, validateCNPJ, formatCPF, formatCNPJ, formatPhone } from '../utils/validation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, User, Building, Phone, Mail, MapPin } from 'lucide-react';

const ServiceTab: React.FC = () => {
  const { addEntry } = useRawData();
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    motivo: '',
    nomeCliente: '',
    cpfCnpj: '',
    telefone1: '',
    telefone2: '',
    email: '',
    responsavel: '',
    endereco: '',
    cep: '',
    cidade: '',
    estado: '',
    bairro: '',
    numero: '',
    observacaoEndereco: '',
    modelo: '',
    serial: '',
    descricaoTestes: ''
  });

  const motivoOptions = [
    'Manutenção Preventiva',
    'Manutenção Corretiva',
    'Instalação',
    'Treinamento',
    'Configuração',
    'Atualização de Software',
    'Suporte Técnico'
  ];

  const handleFieldChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCpfCnpjChange = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    let formatted = value;
    
    if (numbers.length <= 11) {
      formatted = formatCPF(value);
    } else {
      formatted = formatCNPJ(value);
    }
    
    setFormData(prev => ({ ...prev, cpfCnpj: formatted }));
  };

  const handlePhoneChange = (field: 'telefone1' | 'telefone2', value: string) => {
    const formatted = formatPhone(value);
    setFormData(prev => ({ ...prev, [field]: formatted }));
  };

  const validateForm = (): boolean => {
    if (!formData.motivo || !formData.nomeCliente || !formData.cpfCnpj || !formData.telefone1 || !formData.email) {
      toast({
        title: "Erro de Validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return false;
    }

    const numbers = formData.cpfCnpj.replace(/\D/g, '');
    if (numbers.length === 11 && !validateCPF(formData.cpfCnpj)) {
      toast({
        title: "CPF Inválido",
        description: "Por favor, insira um CPF válido.",
        variant: "destructive"
      });
      return false;
    }

    if (numbers.length === 14 && !validateCNPJ(formData.cpfCnpj)) {
      toast({
        title: "CNPJ Inválido",
        description: "Por favor, insira um CNPJ válido.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;

    addEntry(formData, 'SERVICE');
    toast({
      title: "Sucesso!",
      description: "Solicitação de serviço salva com sucesso.",
    });
  };

  const handleClear = () => {
    setFormData({
      motivo: '',
      nomeCliente: '',
      cpfCnpj: '',
      telefone1: '',
      telefone2: '',
      email: '',
      responsavel: '',
      endereco: '',
      cep: '',
      cidade: '',
      estado: '',
      bairro: '',
      numero: '',
      observacaoEndereco: '',
      modelo: '',
      serial: '',
      descricaoTestes: ''
    });
    toast({
      title: "Formulário Limpo",
      description: "Todos os campos foram limpos.",
    });
  };

  const handleSend = () => {
    if (!validateForm()) return;
    
    addEntry(formData, 'SERVICE');
    toast({
      title: "Enviado!",
      description: "Solicitação enviada com sucesso.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-blue-600 to-blue-700 border-0 shadow-xl text-white">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Settings className="w-8 h-8" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">SERVIÇO TÉCNICO</CardTitle>
                <p className="text-blue-100">Solicitação de serviço técnico especializado</p>
              </div>
              <div className="ml-auto">
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  ATIVO
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column */}
          <div className="space-y-6">
            {/* Service Data */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <div className="flex items-center gap-3">
                  <Settings className="w-5 h-5" />
                  <CardTitle className="text-lg">DADOS DO SERVIÇO</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <FormField
                  label="MOTIVO"
                  value={formData.motivo}
                  onChange={(value) => handleFieldChange('motivo', value as string)}
                  type="select"
                  options={motivoOptions}
                  required
                />

                <FormField
                  label="MODELO"
                  value={formData.modelo || ''}
                  onChange={(value) => handleFieldChange('modelo', value as string)}
                  maxLength={50}
                />

                <FormField
                  label="SERIAL"
                  value={formData.serial || ''}
                  onChange={(value) => handleFieldChange('serial', value as string)}
                  maxLength={50}
                />

                <FormField
                  label="DESCRIÇÃO / TESTES"
                  value={formData.descricaoTestes || ''}
                  onChange={(value) => handleFieldChange('descricaoTestes', value as string)}
                  type="textarea"
                  maxLength={500}
                />
              </CardContent>
            </Card>

            {/* Client Data */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5" />
                  <CardTitle className="text-lg">DADOS DO CLIENTE</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <FormField
                  label="NOME DO CLIENTE"
                  value={formData.nomeCliente}
                  onChange={(value) => handleFieldChange('nomeCliente', value as string)}
                  required
                  maxLength={100}
                />

                <FormField
                  label="CPF/CNPJ"
                  value={formData.cpfCnpj}
                  onChange={handleCpfCnpjChange}
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                  required
                />

                <FormField
                  label="RESPONSÁVEL PARA CONTATO"
                  value={formData.responsavel}
                  onChange={(value) => handleFieldChange('responsavel', value as string)}
                  required
                  maxLength={80}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Contact Data */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5" />
                  <CardTitle className="text-lg">DADOS DE CONTATO</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <FormField
                  label="TELEFONE PRINCIPAL"
                  value={formData.telefone1}
                  onChange={(value) => handlePhoneChange('telefone1', value as string)}
                  type="tel"
                  placeholder="(00) 00000-0000"
                  required
                />

                <FormField
                  label="TELEFONE SECUNDÁRIO"
                  value={formData.telefone2 || ''}
                  onChange={(value) => handlePhoneChange('telefone2', value as string)}
                  type="tel"
                  placeholder="(00) 00000-0000"
                />

                <FormField
                  label="E-MAIL"
                  value={formData.email}
                  onChange={(value) => handleFieldChange('email', value as string)}
                  type="email"
                  required
                  maxLength={80}
                />
              </CardContent>
            </Card>

            {/* Address Data */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-t-lg">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5" />
                  <CardTitle className="text-lg">ENDEREÇO</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <FormField
                  label="ENDEREÇO"
                  value={formData.endereco}
                  onChange={(value) => handleFieldChange('endereco', value as string)}
                  maxLength={100}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="CEP"
                    value={formData.cep || ''}
                    onChange={(value) => handleFieldChange('cep', value as string)}
                  />
                  <FormField
                    label="NÚMERO"
                    value={formData.numero || ''}
                    onChange={(value) => handleFieldChange('numero', value as string)}
                    maxLength={10}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="CIDADE"
                    value={formData.cidade || ''}
                    onChange={(value) => handleFieldChange('cidade', value as string)}
                    maxLength={50}
                  />
                  <FormField
                    label="ESTADO"
                    value={formData.estado || ''}
                    onChange={(value) => handleFieldChange('estado', value as string)}
                    maxLength={2}
                  />
                </div>

                <FormField
                  label="BAIRRO"
                  value={formData.bairro || ''}
                  onChange={(value) => handleFieldChange('bairro', value as string)}
                  maxLength={50}
                />

                <FormField
                  label="OBSERVAÇÃO ENDEREÇO"
                  value={formData.observacaoEndereco || ''}
                  onChange={(value) => handleFieldChange('observacaoEndereco', value as string)}
                  type="textarea"
                  maxLength={200}
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Action Buttons */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <ActionButtons
              onSave={handleSave}
              onClear={handleClear}
              onSend={handleSend}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServiceTab;
