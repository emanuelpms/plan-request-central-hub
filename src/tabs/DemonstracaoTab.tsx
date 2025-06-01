import React, { useState } from 'react';
import FormField from '../components/FormField';
import ActionButtons from '../components/ActionButtons';
import FileAttachments from '../components/FileAttachments';
import { useRawData } from '../hooks/useRawData';
import { useToast } from '@/hooks/use-toast';
import { FormData, FileAttachment } from '../types';
import { validateCPF, validateCNPJ } from '../utils/validation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Monitor, User, MapPin, Wrench } from 'lucide-react';

const DemonstracaoTab: React.FC = () => {
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
    justificativaDemo: '',
    descricaoEquipamento: '',
    cronogramaInicio: '',
    cronogramaFim: '',
    ativo: '',
    necessarioApplicationSamsung: '',
    usoHumanoVeterinario: '',
    attachments: []
  });

  const justificativaOptions = [
    'Demonstração Comercial',
    'Avaliação Técnica',
    'Teste de Funcionalidade',
    'Apresentação de Produto',
    'Treinamento',
    'Outros'
  ];

  const ativoOptions = [
    'ATIVO',
    'INATIVO'
  ];

  const applicationOptions = [
    'SIM',
    'NÃO'
  ];

  const usoOptions = [
    'HUMANO',
    'VETERINÁRIO'
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
      'justificativaDemo', 'descricaoEquipamento', 'cronogramaInicio', 'cronogramaFim',
      'ativo', 'necessarioApplicationSamsung', 'usoHumanoVeterinario'
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
    const dataToSave = { ...formData, attachments };
    addEntry(dataToSave, 'DEMONSTRACAO');
    toast({
      title: "Sucesso!",
      description: "Solicitação de demonstração salva com sucesso.",
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
      justificativaDemo: '',
      descricaoEquipamento: '',
      cronogramaInicio: '',
      cronogramaFim: '',
      ativo: '',
      necessarioApplicationSamsung: '',
      usoHumanoVeterinario: '',
      attachments: []
    });
    setAttachments([]);
  };

  const handleSend = () => {
    if (!validateForm()) return;
    const dataToSave = { ...formData, attachments };
    addEntry(dataToSave, 'DEMONSTRACAO');
    toast({
      title: "Enviado!",
      description: "Solicitação enviada com sucesso.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-emerald-600 to-green-600 border-0 shadow-xl text-white">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Monitor className="w-8 h-8" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">DEMONSTRAÇÃO</CardTitle>
                <p className="text-emerald-100">Agendamento de demonstrações comerciais</p>
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
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <User className="w-5 h-5" />
              <CardTitle className="text-lg">DADOS DO CLIENTE</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="NOME DO CLIENTE"
                value={formData.nomeCliente || ''}
                onChange={(value) => handleFieldChange('nomeCliente', value as string)}
                maxLength={100}
                autoFormat
              />

              <FormField
                label="RAZÃO SOCIAL"
                value={formData.razaoSocial || ''}
                onChange={(value) => handleFieldChange('razaoSocial', value as string)}
                maxLength={100}
                autoFormat
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="CPF/CNPJ"
                value={formData.cpfCnpj || ''}
                onChange={(value) => handleFieldChange('cpfCnpj', value as string)}
                type="cpf-cnpj"
                required
              />

              <FormField
                label="TELEFONE 1"
                value={formData.telefone1 || ''}
                onChange={(value) => handleFieldChange('telefone1', value as string)}
                type="phone"
                required
              />

              <FormField
                label="TELEFONE 2"
                value={formData.telefone2 || ''}
                onChange={(value) => handleFieldChange('telefone2', value as string)}
                type="phone"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="E-MAIL"
                value={formData.email || ''}
                onChange={(value) => handleFieldChange('email', value as string)}
                type="email"
                required
              />

              <FormField
                label="RESPONSÁVEL"
                value={formData.responsavel || ''}
                onChange={(value) => handleFieldChange('responsavel', value as string)}
                maxLength={100}
                autoFormat
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="SETOR DO RESPONSÁVEL"
                value={formData.setorResponsavel || ''}
                onChange={(value) => handleFieldChange('setorResponsavel', value as string)}
                maxLength={100}
                autoFormat
              />

              <FormField
                label="DATA DE NASCIMENTO"
                value={formData.dataNascimento || ''}
                onChange={(value) => handleFieldChange('dataNascimento', value as string)}
                type="date"
              />
            </div>
          </CardContent>
        </Card>

        {/* Address Section */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5" />
              <CardTitle className="text-lg">ENDEREÇO</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="md:col-span-2">
                <FormField
                  label="ENDEREÇO"
                  value={formData.endereco || ''}
                  onChange={(value) => handleFieldChange('endereco', value as string)}
                  maxLength={200}
                  autoFormat
                  required
                />
              </div>

              <FormField
                label="NÚMERO"
                value={formData.numero || ''}
                onChange={(value) => handleFieldChange('numero', value as string)}
                maxLength={20}
                autoFormat
                required
              />

              <FormField
                label="CEP"
                value={formData.cep || ''}
                onChange={(value) => handleFieldChange('cep', value as string)}
                type="cep"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="CIDADE"
                value={formData.cidade || ''}
                onChange={(value) => handleFieldChange('cidade', value as string)}
                maxLength={100}
                autoFormat
                required
              />

              <FormField
                label="ESTADO"
                value={formData.estado || ''}
                onChange={(value) => handleFieldChange('estado', value as string)}
                maxLength={2}
                autoFormat
                required
              />

              <FormField
                label="BAIRRO"
                value={formData.bairro || ''}
                onChange={(value) => handleFieldChange('bairro', value as string)}
                maxLength={100}
                autoFormat
                required
              />
            </div>

            <FormField
              label="OBSERVAÇÃO DO ENDEREÇO"
              value={formData.observacaoEndereco || ''}
              onChange={(value) => handleFieldChange('observacaoEndereco', value as string)}
              type="textarea"
              maxLength={300}
            />
          </CardContent>
        </Card>

        {/* Demo Section */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-emerald-600 to-green-700 text-white rounded-t-lg">
            <div className="flex items-center gap-3">
              <Wrench className="w-5 h-5" />
              <CardTitle className="text-lg">DADOS DA DEMONSTRAÇÃO</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <FormField
              label="JUSTIFICATIVA DA DEMONSTRAÇÃO"
              value={formData.justificativaDemo || ''}
              onChange={(value) => handleFieldChange('justificativaDemo', value as string)}
              type="select"
              options={justificativaOptions}
              required
            />

            <FormField
              label="DESCRIÇÃO DO EQUIPAMENTO"
              value={formData.descricaoEquipamento || ''}
              onChange={(value) => handleFieldChange('descricaoEquipamento', value as string)}
              type="textarea"
              maxLength={500}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                label="CRONOGRAMA INÍCIO"
                value={formData.cronogramaInicio || ''}
                onChange={(value) => handleFieldChange('cronogramaInicio', value as string)}
                type="date"
                required
              />

              <FormField
                label="CRONOGRAMA FIM"
                value={formData.cronogramaFim || ''}
                onChange={(value) => handleFieldChange('cronogramaFim', value as string)}
                type="date"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                label="ATIVO"
                value={formData.ativo || ''}
                onChange={(value) => handleFieldChange('ativo', value as string)}
                type="select"
                options={ativoOptions}
                required
              />

              <FormField
                label="NECESSÁRIO APPLICATION SAMSUNG"
                value={formData.necessarioApplicationSamsung || ''}
                onChange={(value) => handleFieldChange('necessarioApplicationSamsung', value as string)}
                type="select"
                options={applicationOptions}
                required
              />

              <FormField
                label="MODO DE USO DO EQUIPAMENTO"
                value={formData.usoHumanoVeterinario || ''}
                onChange={(value) => handleFieldChange('usoHumanoVeterinario', value as string)}
                type="select"
                options={usoOptions}
                required
              />
            </div>
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
              onSend={handleSend}
              formData={formData}
              formType="DEMONSTRACAO"
              motivo={formData.justificativaDemo || ''}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DemonstracaoTab;
