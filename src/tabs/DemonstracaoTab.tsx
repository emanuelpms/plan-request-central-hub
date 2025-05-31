
import React, { useState } from 'react';
import FormField from '../components/FormField';
import ActionButtons from '../components/ActionButtons';
import { useRawData } from '../hooks/useRawData';
import { useToast } from '@/hooks/use-toast';
import { FormData } from '../types';
import { validateCPF, validateCNPJ, formatCPF, formatCNPJ, formatPhone, formatCEP } from '../utils/validation';
import { useViaCEP } from '../hooks/useViaCEP';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Monitor, Copy, Plus, X } from 'lucide-react';

interface ClienteAdicional {
  id: string;
  numeroBO: string;
  nomeCliente: string;
  dataInicio: string;
  dataFim: string;
}

const DemonstracaoTab: React.FC = () => {
  const { addEntry } = useRawData();
  const { toast } = useToast();
  const { fetchAddress, loading } = useViaCEP();

  const [formData, setFormData] = useState<FormData>({
    // Dados para emissão NF
    nomeCliente: '',
    razaoSocial: '',
    cpfCnpj: '',
    telefone1: '',
    telefone2: '',
    responsavel: '',
    email: '',
    endereco: '',
    cep: '',
    cidade: '',
    estado: '',
    bairro: '',
    numero: '',
    observacaoEndereco: '',
    
    // Dados para entrega
    nomeClienteEntrega: '',
    razaoSocialEntrega: '',
    cpfCnpjEntrega: '',
    telefone1Entrega: '',
    telefone2Entrega: '',
    responsavelEntrega: '',
    emailEntrega: '',
    enderecoEntrega: '',
    cepEntrega: '',
    cidadeEntrega: '',
    estadoEntrega: '',
    bairroEntrega: '',
    numeroEntrega: '',
    observacaoEnderecoEntrega: '',
    
    // Dados do equipamento
    modelo: '',
    justificativaDemo: '',
    descricaoEquipamento: '',
    dataInicial: '',
    dataFinal: '',
    ativo: '',
    necessarioApplicationSamsung: '',
    usoHumanoVeterinario: '',
    
    // Cliente adicional principal
    numeroBO: '',
    nomeClienteAdicional: '',
    cronogramaInicio: '',
    cronogramaFim: ''
  });

  const [clientesAdicionais, setClientesAdicionais] = useState<ClienteAdicional[]>([]);

  const modeloOptions = [
    'LABGEO PT1000',
    'LABGEO PT3000',
    'LABGEO PT1000 VET',
    'LABGEO PT3000 VET',
    'OUTROS'
  ];

  const ativoOptions = [
    'Samsung',
    'Representante',
    'Cliente'
  ];

  const necessarioOptions = [
    'Sim',
    'Não'
  ];

  const usoOptions = [
    'HUMANO',
    'VETERINÁRIO'
  ];

  const handleFieldChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCpfCnpjChange = (field: 'cpfCnpj' | 'cpfCnpjEntrega', value: string) => {
    const numbers = value.replace(/\D/g, '');
    let formatted = value;
    
    if (numbers.length <= 11) {
      formatted = formatCPF(value);
    } else {
      formatted = formatCNPJ(value);
    }
    
    setFormData(prev => ({ ...prev, [field]: formatted }));
  };

  const handlePhoneChange = (field: 'telefone1' | 'telefone2' | 'telefone1Entrega' | 'telefone2Entrega', value: string) => {
    const formatted = formatPhone(value);
    setFormData(prev => ({ ...prev, [field]: formatted }));
  };

  const handleCepChange = async (field: 'cep' | 'cepEntrega', value: string) => {
    const formatted = formatCEP(value);
    setFormData(prev => ({ ...prev, [field]: formatted }));
    
    const cleanCEP = formatted.replace(/\D/g, '');
    if (cleanCEP.length === 8) {
      const addressData = await fetchAddress(cleanCEP);
      if (addressData) {
        if (field === 'cep') {
          setFormData(prev => ({
            ...prev,
            endereco: addressData.logradouro,
            bairro: addressData.bairro,
            cidade: addressData.localidade,
            estado: addressData.uf
          }));
        } else {
          setFormData(prev => ({
            ...prev,
            enderecoEntrega: addressData.logradouro,
            bairroEntrega: addressData.bairro,
            cidadeEntrega: addressData.localidade,
            estadoEntrega: addressData.uf
          }));
        }
      }
    }
  };

  const copyToEntrega = () => {
    setFormData(prev => ({
      ...prev,
      nomeClienteEntrega: prev.nomeCliente,
      razaoSocialEntrega: prev.razaoSocial,
      cpfCnpjEntrega: prev.cpfCnpj,
      telefone1Entrega: prev.telefone1,
      telefone2Entrega: prev.telefone2,
      responsavelEntrega: prev.responsavel,
      emailEntrega: prev.email,
      enderecoEntrega: prev.endereco,
      cepEntrega: prev.cep,
      cidadeEntrega: prev.cidade,
      estadoEntrega: prev.estado,
      bairroEntrega: prev.bairro,
      numeroEntrega: prev.numero,
      observacaoEnderecoEntrega: prev.observacaoEndereco
    }));
    
    toast({
      title: "Dados Copiados!",
      description: "Dados de emissão NF copiados para entrega.",
    });
  };

  const adicionarCliente = () => {
    if (!formData.numeroBO || !formData.nomeClienteAdicional || !formData.cronogramaInicio || !formData.cronogramaFim) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos do cliente adicional.",
        variant: "destructive"
      });
      return;
    }

    const novoCliente: ClienteAdicional = {
      id: Date.now().toString(),
      numeroBO: formData.numeroBO,
      nomeCliente: formData.nomeClienteAdicional,
      dataInicio: formData.cronogramaInicio,
      dataFim: formData.cronogramaFim
    };

    setClientesAdicionais(prev => [...prev, novoCliente]);
    
    // Limpar campos
    setFormData(prev => ({
      ...prev,
      numeroBO: '',
      nomeClienteAdicional: '',
      cronogramaInicio: '',
      cronogramaFim: ''
    }));

    toast({
      title: "Cliente Adicionado!",
      description: "Cliente adicional foi adicionado com sucesso.",
    });
  };

  const removerCliente = (id: string) => {
    setClientesAdicionais(prev => prev.filter(cliente => cliente.id !== id));
  };

  const validateForm = (): boolean => {
    const requiredFields = [
      'razaoSocial', 'cpfCnpj', 'telefone1', 'telefone2', 'responsavel', 'email',
      'endereco', 'cep', 'cidade', 'estado', 'bairro', 'numero',
      'razaoSocialEntrega', 'cpfCnpjEntrega', 'telefone1Entrega', 'telefone2Entrega', 'responsavelEntrega', 'emailEntrega',
      'enderecoEntrega', 'cepEntrega', 'cidadeEntrega', 'estadoEntrega', 'bairroEntrega', 'numeroEntrega',
      'modelo', 'justificativaDemo', 'descricaoEquipamento', 'dataInicial', 'dataFinal',
      'ativo', 'necessarioApplicationSamsung', 'usoHumanoVeterinario'
    ];

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

    // Validate CPF/CNPJ for both sections
    const numbers1 = formData.cpfCnpj.replace(/\D/g, '');
    if (numbers1.length === 11 && !validateCPF(formData.cpfCnpj)) {
      toast({
        title: "CPF Inválido",
        description: "Por favor, insira um CPF válido para emissão NF.",
        variant: "destructive"
      });
      return false;
    }
    if (numbers1.length === 14 && !validateCNPJ(formData.cpfCnpj)) {
      toast({
        title: "CNPJ Inválido",
        description: "Por favor, insira um CNPJ válido para emissão NF.",
        variant: "destructive"
      });
      return false;
    }

    const numbers2 = formData.cpfCnpjEntrega?.replace(/\D/g, '') || '';
    if (numbers2.length === 11 && !validateCPF(formData.cpfCnpjEntrega || '')) {
      toast({
        title: "CPF Inválido",
        description: "Por favor, insira um CPF válido para entrega.",
        variant: "destructive"
      });
      return false;
    }
    if (numbers2.length === 14 && !validateCNPJ(formData.cpfCnpjEntrega || '')) {
      toast({
        title: "CNPJ Inválido",
        description: "Por favor, insira um CNPJ válido para entrega.",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  const handleSave = () => {
    if (!validateForm()) return;
    const dataToSave = { ...formData, clientesAdicionais };
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
      responsavel: '',
      email: '',
      endereco: '',
      cep: '',
      cidade: '',
      estado: '',
      bairro: '',
      numero: '',
      observacaoEndereco: '',
      nomeClienteEntrega: '',
      razaoSocialEntrega: '',
      cpfCnpjEntrega: '',
      telefone1Entrega: '',
      telefone2Entrega: '',
      responsavelEntrega: '',
      emailEntrega: '',
      enderecoEntrega: '',
      cepEntrega: '',
      cidadeEntrega: '',
      estadoEntrega: '',
      bairroEntrega: '',
      numeroEntrega: '',
      observacaoEnderecoEntrega: '',
      modelo: '',
      justificativaDemo: '',
      descricaoEquipamento: '',
      dataInicial: '',
      dataFinal: '',
      ativo: '',
      necessarioApplicationSamsung: '',
      usoHumanoVeterinario: '',
      numeroBO: '',
      nomeClienteAdicional: '',
      cronogramaInicio: '',
      cronogramaFim: ''
    });
    setClientesAdicionais([]);
  };

  const handleSend = () => {
    if (!validateForm()) return;
    const dataToSave = { ...formData, clientesAdicionais };
    addEntry(dataToSave, 'DEMONSTRACAO');
    toast({
      title: "Enviado!",
      description: "Solicitação de demonstração enviada com sucesso.",
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

        {/* Client Data Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dados para Emissão NF */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">DADOS PARA EMISSÃO DA NF</CardTitle>
                <Button
                  onClick={copyToEntrega}
                  size="sm"
                  variant="secondary"
                  className="bg-white/20 hover:bg-white/30 text-white border-0"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copiar para Entrega
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <FormField
                label="NOME/RAZÃO SOCIAL"
                value={formData.razaoSocial || ''}
                onChange={(value) => {
                  handleFieldChange('razaoSocial', value as string);
                  handleFieldChange('nomeCliente', value as string);
                }}
                required
                maxLength={100}
                autoFormat
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="TELEFONE 1"
                  value={formData.telefone1}
                  onChange={(value) => handlePhoneChange('telefone1', value as string)}
                  type="tel"
                  placeholder="(00) 00000-0000"
                  required
                />

                <FormField
                  label="TELEFONE 2"
                  value={formData.telefone2 || ''}
                  onChange={(value) => handlePhoneChange('telefone2', value as string)}
                  type="tel"
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>

              <FormField
                label="CPF/CNPJ"
                value={formData.cpfCnpj}
                onChange={(value) => handleCpfCnpjChange('cpfCnpj', value as string)}
                placeholder="000.000.000-00 ou 00.000.000/0000-00"
                required
              />

              <FormField
                label="RESPONSÁVEL PARA CONTATO"
                value={formData.responsavel}
                onChange={(value) => handleFieldChange('responsavel', value as string)}
                required
                maxLength={80}
                autoFormat
              />

              <FormField
                label="E-MAIL"
                value={formData.email}
                onChange={(value) => handleFieldChange('email', value as string)}
                type="email"
                required
                maxLength={80}
              />

              {/* Endereço NF */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    label="CEP"
                    value={formData.cep || ''}
                    onChange={(value) => handleCepChange('cep', value as string)}
                    placeholder="00000-000"
                    loading={loading}
                    required
                  />
                  <FormField
                    label="CIDADE"
                    value={formData.cidade || ''}
                    onChange={(value) => handleFieldChange('cidade', value as string)}
                    maxLength={50}
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
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <FormField
                      label="ENDEREÇO"
                      value={formData.endereco}
                      onChange={(value) => handleFieldChange('endereco', value as string)}
                      maxLength={100}
                      autoFormat
                      required
                    />
                  </div>
                  <FormField
                    label="NÚMERO"
                    value={formData.numero || ''}
                    onChange={(value) => handleFieldChange('numero', value as string)}
                    maxLength={10}
                    required
                  />
                  <FormField
                    label="BAIRRO"
                    value={formData.bairro || ''}
                    onChange={(value) => handleFieldChange('bairro', value as string)}
                    maxLength={50}
                    autoFormat
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Dados para Entrega */}
          <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
              <CardTitle className="text-lg">DADOS PARA ENTREGA</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <FormField
                label="NOME/RAZÃO SOCIAL"
                value={formData.razaoSocialEntrega || ''}
                onChange={(value) => {
                  handleFieldChange('razaoSocialEntrega', value as string);
                  handleFieldChange('nomeClienteEntrega', value as string);
                }}
                required
                maxLength={100}
                autoFormat
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="TELEFONE 1"
                  value={formData.telefone1Entrega || ''}
                  onChange={(value) => handlePhoneChange('telefone1Entrega', value as string)}
                  type="tel"
                  placeholder="(00) 00000-0000"
                  required
                />

                <FormField
                  label="TELEFONE 2"
                  value={formData.telefone2Entrega || ''}
                  onChange={(value) => handlePhoneChange('telefone2Entrega', value as string)}
                  type="tel"
                  placeholder="(00) 00000-0000"
                  required
                />
              </div>

              <FormField
                label="CPF/CNPJ"
                value={formData.cpfCnpjEntrega || ''}
                onChange={(value) => handleCpfCnpjChange('cpfCnpjEntrega', value as string)}
                placeholder="000.000.000-00 ou 00.000.000/0000-00"
                required
              />

              <FormField
                label="RESPONSÁVEL PARA CONTATO"
                value={formData.responsavelEntrega || ''}
                onChange={(value) => handleFieldChange('responsavelEntrega', value as string)}
                required
                maxLength={80}
                autoFormat
              />

              <FormField
                label="E-MAIL"
                value={formData.emailEntrega || ''}
                onChange={(value) => handleFieldChange('emailEntrega', value as string)}
                type="email"
                required
                maxLength={80}
              />

              {/* Endereço Entrega */}
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    label="CEP"
                    value={formData.cepEntrega || ''}
                    onChange={(value) => handleCepChange('cepEntrega', value as string)}
                    placeholder="00000-000"
                    loading={loading}
                    required
                  />
                  <FormField
                    label="CIDADE"
                    value={formData.cidadeEntrega || ''}
                    onChange={(value) => handleFieldChange('cidadeEntrega', value as string)}
                    maxLength={50}
                    autoFormat
                    required
                  />
                  <FormField
                    label="ESTADO"
                    value={formData.estadoEntrega || ''}
                    onChange={(value) => handleFieldChange('estadoEntrega', value as string)}
                    maxLength={2}
                    autoFormat
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <FormField
                      label="ENDEREÇO"
                      value={formData.enderecoEntrega || ''}
                      onChange={(value) => handleFieldChange('enderecoEntrega', value as string)}
                      maxLength={100}
                      autoFormat
                      required
                    />
                  </div>
                  <FormField
                    label="NÚMERO"
                    value={formData.numeroEntrega || ''}
                    onChange={(value) => handleFieldChange('numeroEntrega', value as string)}
                    maxLength={10}
                    required
                  />
                  <FormField
                    label="BAIRRO"
                    value={formData.bairroEntrega || ''}
                    onChange={(value) => handleFieldChange('bairroEntrega', value as string)}
                    maxLength={50}
                    autoFormat
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Equipment Section */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-t-lg">
            <CardTitle className="text-lg">DADOS DO EQUIPAMENTO</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <FormField
              label="MODELO"
              value={formData.modelo || ''}
              onChange={(value) => handleFieldChange('modelo', value as string)}
              type="select"
              options={modeloOptions}
              required
            />

            <FormField
              label="JUSTIFICATIVA DA DEMO"
              value={formData.justificativaDemo || ''}
              onChange={(value) => handleFieldChange('justificativaDemo', value as string)}
              type="textarea"
              maxLength={500}
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
                label="DATA INÍCIO"
                value={formData.dataInicial || ''}
                onChange={(value) => handleFieldChange('dataInicial', value as string)}
                type="date"
                required
              />

              <FormField
                label="DATA FIM DA DEMO"
                value={formData.dataFinal || ''}
                onChange={(value) => handleFieldChange('dataFinal', value as string)}
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
                options={necessarioOptions}
                required
              />

              <FormField
                label="MODO DE USO"
                value={formData.usoHumanoVeterinario || ''}
                onChange={(value) => handleFieldChange('usoHumanoVeterinario', value as string)}
                type="select"
                options={usoOptions}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Additional Clients Section */}
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-t-lg">
            <CardTitle className="text-lg">CRONOGRAMA DE INSTALAÇÃO</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <FormField
                label="BO"
                value={formData.numeroBO || ''}
                onChange={(value) => handleFieldChange('numeroBO', value as string)}
                maxLength={50}
                autoFormat
              />

              <FormField
                label="NOME DO CLIENTE"
                value={formData.nomeClienteAdicional || ''}
                onChange={(value) => handleFieldChange('nomeClienteAdicional', value as string)}
                maxLength={100}
                autoFormat
              />

              <FormField
                label="DATA INÍCIO"
                value={formData.cronogramaInicio || ''}
                onChange={(value) => handleFieldChange('cronogramaInicio', value as string)}
                type="date"
              />

              <FormField
                label="DATA FIM"
                value={formData.cronogramaFim || ''}
                onChange={(value) => handleFieldChange('cronogramaFim', value as string)}
                type="date"
              />
            </div>

            <Button
              onClick={adicionarCliente}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Novo Cliente
            </Button>

            {/* Lista de clientes adicionais */}
            {clientesAdicionais.length > 0 && (
              <div className="space-y-3">
                <h3 className="font-bold text-gray-800">Clientes Adicionados:</h3>
                {clientesAdicionais.map((cliente) => (
                  <div key={cliente.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2 flex-1">
                      <span className="font-medium">BO: {cliente.numeroBO}</span>
                      <span>Cliente: {cliente.nomeCliente}</span>
                      <span>Início: {cliente.dataInicio}</span>
                      <span>Fim: {cliente.dataFim}</span>
                    </div>
                    <Button
                      onClick={() => removerCliente(cliente.id)}
                      variant="destructive"
                      size="sm"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

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
