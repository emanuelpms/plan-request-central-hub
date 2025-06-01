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
import { Settings, Wrench } from 'lucide-react';

const ServiceTab: React.FC = () => {
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
    modeloNobreak: '',
    modeloImpressora: '',
    documentacaoObrigatoria: false,
    usoHumanoVeterinario: '',
    descricaoTestes: '',
    necessarioAplicacao: false,
    necessarioLicenca: false,
    dataAplicacao: ''
  });

  const modeloOptions = [
    'LABGEO PT1000',
    'LABGEO PT3000',
    'LABGEO PT1000 VET',
    'LABGEO PT3000 VET',
    'OUTROS'
  ];

  const motivoOptions = [
    'Manutenção Preventiva',
    'Manutenção Corretiva',
    'Instalação',
    'Treinamento',
    'Configuração',
    'Atualização de Software',
    'Suporte Técnico',
    'Instalação Inicial'
  ];

  const usoOptions = [
    'HUMANO',
    'VETERINÁRIO'
  ];

  const handleFieldChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Auto-fill documentation based on motivo
      if (field === 'motivo') {
        if (value === 'Instalação Inicial') {
          newData.documentacaoObrigatoria = true;
        } else {
          newData.documentacaoObrigatoria = false;
          newData.necessarioAplicacao = false;
          newData.necessarioLicenca = false;
          newData.dataAplicacao = '';
        }
      }
      
      return newData;
    });
  };

  const validateForm = (): boolean => {
    const requiredFields = [
      'razaoSocial', 'cpfCnpj', 'telefone1', 'telefone2', 'email', 'responsavel',
      'endereco', 'cep', 'cidade', 'estado', 'bairro', 'numero',
      'modelo', 'serial', 'motivo', 'usoHumanoVeterinario', 'descricaoTestes'
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

    // Check Instalação Inicial requirements
    if (formData.motivo === 'Instalação Inicial') {
      if (!formData.modeloImpressora || !formData.modeloNobreak) {
        toast({
          title: "Erro de Validação",
          description: "Modelo da impressora e nobreak são obrigatórios para Instalação Inicial.",
          variant: "destructive"
        });
        return false;
      }
      
      if (formData.necessarioAplicacao && !formData.dataAplicacao) {
        toast({
          title: "Erro de Validação",
          description: "Data da aplicação é obrigatória quando necessário aplicação.",
          variant: "destructive"
        });
        return false;
      }
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
    addEntry(formData, 'SERVICE');
    toast({
      title: "Sucesso!",
      description: "Solicitação de serviço salva com sucesso.",
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
      modeloNobreak: '',
      modeloImpressora: '',
      documentacaoObrigatoria: false,
      usoHumanoVeterinario: '',
      descricaoTestes: '',
      necessarioAplicacao: false,
      necessarioLicenca: false,
      dataAplicacao: ''
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

        {/* Client Data Section */}
        <ClientDataSection 
          formData={formData}
          onFieldChange={handleFieldChange}
          showBirthDate={true}
          showSector={true}
        />

        {/* Equipment Section */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
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

            {formData.motivo === 'Instalação Inicial' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="MODELO NOBREAK"
                  value={formData.modeloNobreak || ''}
                  onChange={(value) => handleFieldChange('modeloNobreak', value as string)}
                  maxLength={50}
                  autoFormat
                  required
                />

                <FormField
                  label="MODELO DE IMPRESSORA"
                  value={formData.modeloImpressora || ''}
                  onChange={(value) => handleFieldChange('modeloImpressora', value as string)}
                  maxLength={50}
                  autoFormat
                  required
                />
              </div>
            )}

            <FormField
              label="DOCUMENTAÇÃO OBRIGATÓRIA"
              value={formData.documentacaoObrigatoria || false}
              onChange={(value) => handleFieldChange('documentacaoObrigatoria', value)}
              type="checkbox"
              placeholder="Documentação obrigatória conforme motivo selecionado"
            />

            <FormField
              label="MODO DE USO DO EQUIPAMENTO"
              value={formData.usoHumanoVeterinario || ''}
              onChange={(value) => handleFieldChange('usoHumanoVeterinario', value as string)}
              type="select"
              options={usoOptions}
              required
            />

            {formData.motivo === 'Instalação Inicial' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label=""
                    value={formData.necessarioAplicacao || false}
                    onChange={(value) => handleFieldChange('necessarioAplicacao', value)}
                    type="checkbox"
                    placeholder="Necessário aplicação"
                  />

                  <FormField
                    label=""
                    value={formData.necessarioLicenca || false}
                    onChange={(value) => handleFieldChange('necessarioLicenca', value)}
                    type="checkbox"
                    placeholder="Necessário licença"
                  />
                </div>

                {formData.necessarioAplicacao && (
                  <FormField
                    label="DATA DA APLICAÇÃO"
                    value={formData.dataAplicacao || ''}
                    onChange={(value) => handleFieldChange('dataAplicacao', value as string)}
                    type="date"
                    required
                  />
                )}
              </div>
            )}

            <FormField
              label="DESCRIÇÃO/TESTES"
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
              formType="SERVICE"
              motivo={formData.motivo || ''}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ServiceTab;
