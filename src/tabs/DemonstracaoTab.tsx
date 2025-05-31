
import React, { useState, useEffect } from 'react';
import FormField from '../components/FormField';
import ActionButtons from '../components/ActionButtons';
import { useRawData } from '../hooks/useRawData';
import { useViaCEP } from '../hooks/useViaCEP';
import { useCNPJ } from '../hooks/useCNPJ';
import { useToast } from '@/hooks/use-toast';
import { FormData } from '../types';
import { 
  validateCPF, 
  validateCNPJ, 
  formatCPF, 
  formatCNPJ, 
  formatPhone, 
  formatCEP,
  formatUpperCase,
  validateEmail 
} from '../utils/validation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Monitor, MapPin, User, Building, Phone, Mail } from 'lucide-react';

const DemonstracaoTab: React.FC = () => {
  const { addEntry } = useRawData();
  const { fetchAddress, loading: cepLoading } = useViaCEP();
  const { fetchCNPJData, loading: cnpjLoading } = useCNPJ();
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    motivo: 'DEMONSTRAÇÃO',
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
    justificativa: '',
    modelo: '',
    previsaoFaturamento: '',
    dataInicial: '',
    dataFinal: '',
    ativo: true,
    primeiraAplicacao: false,
    noLocalizado: false
  });

  const handleFieldChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCpfCnpjChange = async (value: string) => {
    const numbers = value.replace(/\D/g, '');
    let formatted = value;
    
    if (numbers.length <= 11) {
      formatted = formatCPF(value);
    } else {
      formatted = formatCNPJ(value);
      
      // Se é CNPJ completo, buscar dados
      if (numbers.length === 14) {
        const cnpjData = await fetchCNPJData(formatted);
        if (cnpjData && cnpjData.nome) {
          setFormData(prev => ({
            ...prev,
            cpfCnpj: formatted,
            nomeCliente: formatUpperCase(cnpjData.nome || ''),
            endereco: formatUpperCase(cnpjData.logradouro || ''),
            numero: cnpjData.numero || '',
            bairro: formatUpperCase(cnpjData.bairro || ''),
            cidade: formatUpperCase(cnpjData.municipio || ''),
            estado: cnpjData.uf || '',
            cep: cnpjData.cep ? formatCEP(cnpjData.cep) : '',
            telefone1: cnpjData.telefone ? formatPhone(cnpjData.telefone) : '',
            email: cnpjData.email || ''
          }));
          toast({
            title: "CNPJ Encontrado!",
            description: "Dados da empresa foram preenchidos automaticamente.",
          });
          return;
        }
      }
    }
    
    setFormData(prev => ({ ...prev, cpfCnpj: formatted }));
  };

  const handleCEPChange = async (value: string) => {
    const formatted = formatCEP(value);
    setFormData(prev => ({ ...prev, cep: formatted }));
    
    const numbers = value.replace(/\D/g, '');
    if (numbers.length === 8) {
      const addressData = await fetchAddress(formatted);
      if (addressData) {
        setFormData(prev => ({
          ...prev,
          endereco: formatUpperCase(addressData.logradouro),
          bairro: formatUpperCase(addressData.bairro),
          cidade: formatUpperCase(addressData.localidade),
          estado: addressData.uf
        }));
        toast({
          title: "CEP Encontrado!",
          description: "Endereço preenchido automaticamente.",
        });
      }
    }
  };

  const handlePhoneChange = (field: 'telefone1' | 'telefone2', value: string) => {
    const formatted = formatPhone(value);
    setFormData(prev => ({ ...prev, [field]: formatted }));
  };

  const validateForm = (): boolean => {
    if (!formData.nomeCliente || !formData.cpfCnpj || !formData.telefone1 || !formData.email || !formData.justificativa) {
      toast({
        title: "Erro de Validação",
        description: "Por favor, preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return false;
    }

    if (!validateEmail(formData.email)) {
      toast({
        title: "Email Inválido",
        description: "Por favor, insira um email válido.",
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

    addEntry(formData, 'DEMONSTRACAO');
    toast({
      title: "Sucesso!",
      description: "Solicitação de demonstração salva com sucesso.",
    });
  };

  const handleClear = () => {
    setFormData({
      motivo: 'DEMONSTRAÇÃO',
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
      justificativa: '',
      modelo: '',
      previsaoFaturamento: '',
      dataInicial: '',
      dataFinal: '',
      ativo: true,
      primeiraAplicacao: false,
      noLocalizado: false
    });
    toast({
      title: "Formulário Limpo",
      description: "Todos os campos foram limpos.",
    });
  };

  const handleSend = () => {
    if (!validateForm()) return;
    
    addEntry(formData, 'DEMONSTRACAO');
    toast({
      title: "Enviado!",
      description: "Solicitação de demonstração enviada com sucesso.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-green-600 to-green-700 border-0 shadow-xl text-white">
          <CardHeader>
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 rounded-xl">
                <Monitor className="w-8 h-8" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold">DEMONSTRAÇÃO</CardTitle>
                <p className="text-green-100">Solicitação de demonstração comercial</p>
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
            {/* Client Data */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5" />
                  <CardTitle className="text-lg">DADOS DO CLIENTE</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <FormField
                  label="NOME DO CLIENTE / RAZÃO SOCIAL"
                  value={formData.nomeCliente}
                  onChange={(value) => handleFieldChange('nomeCliente', formatUpperCase(value as string))}
                  required
                  autoFormat
                  maxLength={100}
                />

                <FormField
                  label="CPF/CNPJ"
                  value={formData.cpfCnpj}
                  onChange={handleCpfCnpjChange}
                  placeholder="000.000.000-00 ou 00.000.000/0000-00"
                  required
                  loading={cnpjLoading}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>

                <FormField
                  label="RESPONSÁVEL PARA CONTATO"
                  value={formData.responsavel}
                  onChange={(value) => handleFieldChange('responsavel', formatUpperCase(value as string))}
                  required
                  autoFormat
                  maxLength={80}
                />

                <FormField
                  label="E-MAIL"
                  value={formData.email}
                  onChange={(value) => handleFieldChange('email', value)}
                  type="email"
                  required
                  maxLength={80}
                />
              </CardContent>
            </Card>

            {/* Address Data */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5" />
                  <CardTitle className="text-lg">ENDEREÇO</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    label="CEP"
                    value={formData.cep || ''}
                    onChange={handleCEPChange}
                    type="cep"
                    placeholder="00000-000"
                    loading={cepLoading}
                  />
                  <FormField
                    label="NÚMERO"
                    value={formData.numero || ''}
                    onChange={(value) => handleFieldChange('numero', value)}
                    maxLength={10}
                  />
                  <div className="md:col-span-1"></div>
                </div>

                <FormField
                  label="ENDEREÇO"
                  value={formData.endereco}
                  onChange={(value) => handleFieldChange('endereco', formatUpperCase(value as string))}
                  autoFormat
                  maxLength={100}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="BAIRRO"
                    value={formData.bairro || ''}
                    onChange={(value) => handleFieldChange('bairro', formatUpperCase(value as string))}
                    autoFormat
                    maxLength={50}
                  />
                  <FormField
                    label="CIDADE"
                    value={formData.cidade || ''}
                    onChange={(value) => handleFieldChange('cidade', formatUpperCase(value as string))}
                    autoFormat
                    maxLength={50}
                  />
                </div>

                <FormField
                  label="ESTADO"
                  value={formData.estado || ''}
                  onChange={(value) => handleFieldChange('estado', formatUpperCase(value as string))}
                  autoFormat
                  maxLength={2}
                />

                <FormField
                  label="OBSERVAÇÃO ENDEREÇO"
                  value={formData.observacaoEndereco || ''}
                  onChange={(value) => handleFieldChange('observacaoEndereco', formatUpperCase(value as string))}
                  type="textarea"
                  autoFormat
                  maxLength={200}
                />
              </CardContent>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Demo Details */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
                <div className="flex items-center gap-3">
                  <Building className="w-5 h-5" />
                  <CardTitle className="text-lg">DADOS PARA DEMONSTRAÇÃO</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <FormField
                  label="MODELO"
                  value={formData.modelo || ''}
                  onChange={(value) => handleFieldChange('modelo', formatUpperCase(value as string))}
                  autoFormat
                  maxLength={50}
                />

                <FormField
                  label="PREVISÃO DE FATURAMENTO"
                  value={formData.previsaoFaturamento || ''}
                  onChange={(value) => handleFieldChange('previsaoFaturamento', formatUpperCase(value as string))}
                  autoFormat
                  maxLength={50}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="DATA INICIAL DA DEMO"
                    value={formData.dataInicial || ''}
                    onChange={(value) => handleFieldChange('dataInicial', value)}
                    type="text"
                    placeholder="DD/MM/AAAA"
                  />

                  <FormField
                    label="DATA FINAL DA DEMO"
                    value={formData.dataFinal || ''}
                    onChange={(value) => handleFieldChange('dataFinal', value)}
                    type="text"
                    placeholder="DD/MM/AAAA"
                  />
                </div>

                <FormField
                  label="JUSTIFICATIVA DA DEMO"
                  value={formData.justificativa || ''}
                  onChange={(value) => handleFieldChange('justificativa', formatUpperCase(value as string))}
                  type="textarea"
                  required
                  autoFormat
                  maxLength={500}
                />
              </CardContent>
            </Card>

            {/* Status Options */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-t-lg">
                <CardTitle className="text-lg">OPÇÕES DE STATUS</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                <FormField
                  label=""
                  value={formData.ativo || false}
                  onChange={(value) => handleFieldChange('ativo', value)}
                  type="checkbox"
                  placeholder="ATIVO"
                />

                <FormField
                  label=""
                  value={formData.primeiraAplicacao || false}
                  onChange={(value) => handleFieldChange('primeiraAplicacao', value)}
                  type="checkbox"
                  placeholder="PRIMEIRA APLICAÇÃO"
                />

                <FormField
                  label=""
                  value={formData.noLocalizado || false}
                  onChange={(value) => handleFieldChange('noLocalizado', value)}
                  type="checkbox"
                  placeholder="NÃO LOCALIZADO"
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

export default DemonstracaoTab;
