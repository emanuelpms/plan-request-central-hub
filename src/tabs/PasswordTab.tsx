
import React, { useState } from 'react';
import FormField from '../components/FormField';
import ActionButtons from '../components/ActionButtons';
import { useRawData } from '../hooks/useRawData';
import { useToast } from '@/hooks/use-toast';
import { FormData } from '../types';
import { validateCPF, validateCNPJ, formatCPF, formatCNPJ, formatPhone } from '../utils/validation';

const PasswordTab: React.FC = () => {
  const { addEntry } = useRawData();
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    motivo: 'Senha',
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
    serial: ''
  });

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
    if (!formData.nomeCliente || !formData.cpfCnpj || !formData.telefone1 || !formData.email) {
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

    addEntry(formData, 'PASSWORD');
    toast({
      title: "Sucesso!",
      description: "Solicitação de senha salva com sucesso.",
    });
  };

  const handleClear = () => {
    setFormData({
      motivo: 'Senha',
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
      serial: ''
    });
    toast({
      title: "Formulário Limpo",
      description: "Todos os campos foram limpos.",
    });
  };

  const handleSend = () => {
    if (!validateForm()) return;
    
    addEntry(formData, 'PASSWORD');
    toast({
      title: "Enviado!",
      description: "Solicitação de senha enviada com sucesso.",
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <h2 className="text-2xl font-bold text-blue-800 mb-6">Rep - PASSWORD</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <FormField
              label="Nome do cliente"
              value={formData.nomeCliente}
              onChange={(value) => handleFieldChange('nomeCliente', value)}
              required
            />

            <FormField
              label="CPF/CNPJ"
              value={formData.cpfCnpj}
              onChange={handleCpfCnpjChange}
              placeholder="000.000.000-00 ou 00.000.000/0000-00"
              required
            />

            <FormField
              label="Telefones"
              value={formData.telefone1}
              onChange={(value) => handlePhoneChange('telefone1', value)}
              type="tel"
              placeholder="(00) 00000-0000"
              required
            />

            <FormField
              label="Telefone 2"
              value={formData.telefone2 || ''}
              onChange={(value) => handlePhoneChange('telefone2', value)}
              type="tel"
              placeholder="(00) 00000-0000"
            />

            <FormField
              label="E-mail"
              value={formData.email}
              onChange={(value) => handleFieldChange('email', value)}
              type="email"
              required
            />

            <FormField
              label="Responsável para contato"
              value={formData.responsavel}
              onChange={(value) => handleFieldChange('responsavel', value)}
              required
            />

            <FormField
              label="Endereço"
              value={formData.endereco}
              onChange={(value) => handleFieldChange('endereco', value)}
            />
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="CEP"
                value={formData.cep || ''}
                onChange={(value) => handleFieldChange('cep', value)}
              />
              <FormField
                label="Número"
                value={formData.numero || ''}
                onChange={(value) => handleFieldChange('numero', value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Cidade"
                value={formData.cidade || ''}
                onChange={(value) => handleFieldChange('cidade', value)}
              />
              <FormField
                label="Estado"
                value={formData.estado || ''}
                onChange={(value) => handleFieldChange('estado', value)}
              />
            </div>

            <FormField
              label="Bairro"
              value={formData.bairro || ''}
              onChange={(value) => handleFieldChange('bairro', value)}
            />

            <FormField
              label="Observação Endereço"
              value={formData.observacaoEndereco || ''}
              onChange={(value) => handleFieldChange('observacaoEndereco', value)}
              type="textarea"
            />

            <FormField
              label="Modelo"
              value={formData.modelo || ''}
              onChange={(value) => handleFieldChange('modelo', value)}
            />

            <FormField
              label="Serial"
              value={formData.serial || ''}
              onChange={(value) => handleFieldChange('serial', value)}
            />
          </div>
        </div>

        <ActionButtons
          onSave={handleSave}
          onClear={handleClear}
          onSend={handleSend}
        />
      </div>
    </div>
  );
};

export default PasswordTab;
