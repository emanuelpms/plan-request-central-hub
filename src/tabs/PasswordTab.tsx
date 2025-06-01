import React, { useState } from 'react';
import ClientDataSection from '../components/ClientDataSection';
import FormField from '../components/FormField';
import ActionButtons from '../components/ActionButtons';
import { useRawData } from '../hooks/useRawData';
import { useToast } from '@/hooks/use-toast';
import { FormData } from '../types';
import { validateCPF, validateCNPJ } from '../utils/validation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Key, Wrench } from 'lucide-react';

const PasswordTab: React.FC = () => {
  const { addEntry } = useRawData();
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    nomeCliente: '',
    razaoSocial: '',
    cpfCnpj: '',
    telefone1: '',
    telefone2: '',
    email: '',
    responsavel: '',
    setorResponsavel: '',
    dataNascimento: '',
    endereco: '',
    cep: '',
    cidade: '',
    estado: '',
    bairro: '',
    numero: '',
    observacaoEndereco: '',
    modelo: '',
    serial: '',
    motivo: '',
    previsaoFaturamento: '',
    numeroBO: '',
    documentacaoObrigatoria: false,
    descricaoTestes: ''
  });

  const modeloOptions = [
    'LABGEO PT1000',
    'LABGEO PT3000',
    'LABGEO PT1000 VET',
    'LABGEO PT3000 VET',
    'OUTROS'
  ];

  const motivoOptions = [
    'Licença Permanente',
    'Licença Temporária',
    'Licença Teste',
    'Renovação de Licença',
    'Transferência de Licença'
  ];

  const handleFieldChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-fill documentation based on motivo
      if (field === 'motivo') {
        if (value === 'Licença Permanente' || value === 'Licença Temporária') {
          newData.documentacaoObrigatoria = true;
        } else {
          newData.documentacaoObrigatoria = false;
        }
      }
      
      return newData;
    });
  };

  const validateForm = (): boolean => {
    const requiredFields = [
      'razaoSocial', 'cpfCnpj', 'telefone1', 'telefone2', 'email', 'responsavel',
      'endereco', 'cep', 'cidade', 'estado', 'bairro', 'numero',
      'modelo', 'serial', 'motivo', 'previsaoFaturamento', 'numeroBO', 'descricaoTestes'
    ];

    // Check if CPF and birth date
    const isCPF = formData.cpfCnpj.replace(/\D/g, '').length === 11;
    if (isCPF && !formData.dataNascimento) {
      toast({
        title: "Erro de Validação",
        description: "Data de nascimento é obrigatória para CPF.",
        variant: "destructive"
      });
      return false;
    }

    for (const field of requiredFields) {
      if (!formData[field as keyof FormData]) {
        toast({
          title: "Erro de Validação",
          description: "Por favor, preencha todos os campos obrigatórios.",
          variant: "destructive"
        });
        return false;
      }
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
    addEntry(formData, 'PASSWORD');
    toast({
      title: "Sucesso!",
      description: "Solicitação de licença salva com sucesso.",
    });
  };

  const handleClear = () => {
    setFormData({
      nomeCliente: '',
      razaoSocial: '',
      cpfCnpj: '',
      telefone1: '',
      telefone2: '',
      email: '',
      responsavel: '',
      setorResponsavel: '',
      dataNascimento: '',
      endereco: '',
      cep: '',
      cidade: '',
      estado: '',
      bairro: '',
      numero: '',
      observacaoEndereco: '',
      modelo: '',
      serial: '',
      motivo: '',
      previsaoFaturamento: '',
      numeroBO: '',
      documentacaoObrigatoria: false,
      descricaoTestes: ''
    });
  };

  const handleSend = () => {
    if (!validateForm()) return;
    addEntry(formData, 'PASSWORD');
    toast({
      title: "Enviado!",
      description: "Solicitação de licença enviada com sucesso.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-orange-50 to-red-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-orange-600 to-red-600 border-0 shadow-xl text-white">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Key className="w-8 h-8" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">PASSWORD/LICENÇA</CardTitle>
                <p className="text-orange-100">Controle de licenças e credenciais</p>
              </div>
              <div className="ml-auto">
                <Badge variant="secondary" className="bg-white/20 text-white border-0">
                  ATIVO
                </Badge>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Client Data Section */}
        <ClientDataSection 
          formData={formData}
          onFieldChange={handleFieldChange}
          showBirthDate={true}
          showSector={true}
        />

        {/* Equipment Section */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-red-600 to-red-700 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <Wrench className="w-5 h-5" />
              <CardTitle className="text-lg">DADOS DO EQUIPAMENTO</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="MODELO"
                value={formData.modelo || ''}
                onChange={(value) => handleFieldChange('modelo', value as string)}
                type="select"
                options={modeloOptions}
                required
              />

              <FormField
                label="SERIAL"
                value={formData.serial || ''}
                onChange={(value) => handleFieldChange('serial', value as string)}
                maxLength={50}
                autoFormat
                required
              />
            </div>

            <FormField
              label="MOTIVO DA SOLICITAÇÃO"
              value={formData.motivo || ''}
              onChange={(value) => handleFieldChange('motivo', value as string)}
              type="select"
              options={motivoOptions}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="PREVISÃO DE FATURAMENTO"
                value={formData.previsaoFaturamento || ''}
                onChange={(value) => handleFieldChange('previsaoFaturamento', value as string)}
                type="date"
                required
              />

              <FormField
                label="BO"
                value={formData.numeroBO || ''}
                onChange={(value) => handleFieldChange('numeroBO', value as string)}
                maxLength={50}
                autoFormat
                required
              />
            </div>

            <FormField
              label="DOCUMENTAÇÃO OBRIGATÓRIA"
              value={formData.documentacaoObrigatoria || false}
              onChange={(value) => handleFieldChange('documentacaoObrigatoria', value)}
              type="checkbox"
              placeholder="Documentação obrigatória conforme motivo selecionado"
            />

            <FormField
              label="DESCRIÇÃO"
              value={formData.descricaoTestes || ''}
              onChange={(value) => handleFieldChange('descricaoTestes', value as string)}
              type="textarea"
              maxLength={500}
              required
            />
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <ActionButtons
              onSave={handleSave}
              onClear={handleClear}
              onSend={handleSend}
              formData={formData}
              formType="PASSWORD"
              motivo={formData.motivo || ''}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PasswordTab;
