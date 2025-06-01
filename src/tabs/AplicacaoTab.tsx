import React, { useState } from 'react';
import ClientDataSection from '../components/ClientDataSection';
import FormField from '../components/FormField';
import ActionButtons from '../components/ActionButtons';
import FileAttachments from '../components/FileAttachments';
import { useRawData } from '../hooks/useRawData';
import { useToast } from '@/hooks/use-toast';
import { FormData, FileAttachment } from '../types';
import { validateCPF, validateCNPJ } from '../utils/validation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Wrench } from 'lucide-react';

const AplicacaoTab: React.FC = () => {
  const { addEntry } = useRawData();
  const { toast } = useToast();
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);

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
    numeroBO: '',
    dataAplicacao: '',
    descricaoTestes: '',
    attachments: []
  });

  const modeloOptions = [
    'LABGEO PT1000',
    'LABGEO PT3000',
    'LABGEO PT1000 VET',
    'LABGEO PT3000 VET',
    'OUTROS'
  ];

  const motivoOptions = [
    'Aplicação Inicial',
    'Aplicação Plus'
  ];

  const handleFieldChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAttachmentsChange = (newAttachments: FileAttachment[]) => {
    setAttachments(newAttachments);
    setFormData(prev => ({ ...prev, attachments: newAttachments }));
  };

  const validateForm = (): boolean => {
    const requiredFields = [
      'razaoSocial', 'cpfCnpj', 'telefone1', 'telefone2', 'email', 'responsavel',
      'endereco', 'cep', 'cidade', 'estado', 'bairro', 'numero',
      'modelo', 'serial', 'motivo', 'dataAplicacao', 'descricaoTestes'
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

    // BO is required only for Aplicação Inicial
    if (formData.motivo === 'Aplicação Inicial' && !formData.numeroBO) {
      toast({
        title: "Erro de Validação",
        description: "BO é obrigatório para Aplicação Inicial.",
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
    const dataToSave = { ...formData, attachments };
    addEntry(dataToSave, 'APLICACAO');
    toast({
      title: "Sucesso!",
      description: "Solicitação de aplicação salva com sucesso.",
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
      numeroBO: '',
      dataAplicacao: '',
      descricaoTestes: '',
      attachments: []
    });
    setAttachments([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-purple-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-purple-600 to-indigo-600 border-0 shadow-xl text-white">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <FileText className="w-8 h-8" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">APLICAÇÃO</CardTitle>
                <p className="text-purple-100">Solicitação de aplicação técnica</p>
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
          <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-t-lg">
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
                maxLength={15}
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

            {formData.motivo === 'Aplicação Inicial' && (
              <FormField
                label="BO"
                value={formData.numeroBO || ''}
                onChange={(value) => handleFieldChange('numeroBO', value as string)}
                maxLength={50}
                autoFormat
                required
              />
            )}

            <FormField
              label="DATA DA APLICAÇÃO"
              value={formData.dataAplicacao || ''}
              onChange={(value) => handleFieldChange('dataAplicacao', value as string)}
              type="date"
              required
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

        {/* File Attachments */}
        <FileAttachments
          attachments={attachments}
          onAttachmentsChange={handleAttachmentsChange}
        />

        {/* Action Buttons */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardContent className="p-6">
            <ActionButtons
              onSave={handleSave}
              onClear={handleClear}
              formData={formData}
              formType="APLICACAO"
              motivo={formData.motivo || ''}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AplicacaoTab;
