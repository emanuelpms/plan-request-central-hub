
import React, { useState, useEffect } from 'react';
import FormField from './FormField';
import { useViaCEP } from '../hooks/useViaCEP';
import { validateCPF, validateCNPJ, formatCPF, formatCNPJ, formatPhone, formatCEP } from '../utils/validation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Phone, Mail, MapPin } from 'lucide-react';
import { FormData } from '../types';

interface ClientDataSectionProps {
  formData: FormData;
  onFieldChange: (field: keyof FormData, value: string | boolean) => void;
  showBirthDate?: boolean;
  showSector?: boolean;
}

const ClientDataSection: React.FC<ClientDataSectionProps> = ({ 
  formData, 
  onFieldChange, 
  showBirthDate = true,
  showSector = true 
}) => {
  const { fetchAddress, loading } = useViaCEP();
  const [isCPF, setIsCPF] = useState(false);

  const handleCpfCnpjChange = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    let formatted = value;
    
    if (numbers.length <= 11) {
      formatted = formatCPF(value);
      setIsCPF(true);
    } else {
      formatted = formatCNPJ(value);
      setIsCPF(false);
    }
    
    onFieldChange('cpfCnpj', formatted);
  };

  const handlePhoneChange = (field: 'telefone1' | 'telefone2', value: string) => {
    const formatted = formatPhone(value);
    onFieldChange(field, formatted);
  };

  const handleCepChange = async (value: string) => {
    const formatted = formatCEP(value);
    onFieldChange('cep', formatted);
    
    const cleanCEP = formatted.replace(/\D/g, '');
    if (cleanCEP.length === 8) {
      const addressData = await fetchAddress(cleanCEP);
      if (addressData) {
        onFieldChange('endereco', addressData.logradouro);
        onFieldChange('bairro', addressData.bairro);
        onFieldChange('cidade', addressData.localidade);
        onFieldChange('estado', addressData.uf);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Client Information */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5" />
            <CardTitle className="text-lg">DADOS DO CLIENTE</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <FormField
            label="NOME/RAZÃO SOCIAL"
            value={formData.razaoSocial || formData.nomeCliente}
            onChange={(value) => {
              onFieldChange('razaoSocial', value as string);
              onFieldChange('nomeCliente', value as string);
            }}
            required
            maxLength={100}
            autoFormat
          />

          <FormField
            label="CPF/CNPJ"
            value={formData.cpfCnpj}
            onChange={handleCpfCnpjChange}
            placeholder="000.000.000-00 ou 00.000.000/0000-00"
            required
          />

          {showBirthDate && isCPF && (
            <FormField
              label="DATA DE NASCIMENTO"
              value={formData.dataNascimento || ''}
              onChange={(value) => onFieldChange('dataNascimento', value as string)}
              type="date"
              required
            />
          )}

          <FormField
            label="RESPONSÁVEL PARA CONTATO"
            value={formData.responsavel}
            onChange={(value) => onFieldChange('responsavel', value as string)}
            required
            maxLength={80}
            autoFormat
          />

          {showSector && (
            <FormField
              label="SETOR DO RESPONSÁVEL"
              value={formData.setorResponsavel || ''}
              onChange={(value) => onFieldChange('setorResponsavel', value as string)}
              maxLength={50}
              autoFormat
            />
          )}
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-green-600 to-green-700 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5" />
            <CardTitle className="text-lg">DADOS DE CONTATO</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
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

          <FormField
            label="E-MAIL"
            value={formData.email}
            onChange={(value) => onFieldChange('email', value as string)}
            type="email"
            required
            maxLength={80}
          />
        </CardContent>
      </Card>

      {/* Address Information */}
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg lg:col-span-2">
        <CardHeader className="bg-gradient-to-r from-indigo-600 to-indigo-700 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5" />
            <CardTitle className="text-lg">ENDEREÇO COMPLETO</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              label="CEP"
              value={formData.cep || ''}
              onChange={handleCepChange}
              placeholder="00000-000"
              loading={loading}
              required
            />
            <FormField
              label="CIDADE"
              value={formData.cidade || ''}
              onChange={(value) => onFieldChange('cidade', value as string)}
              maxLength={50}
              autoFormat
              required
            />
            <FormField
              label="ESTADO"
              value={formData.estado || ''}
              onChange={(value) => onFieldChange('estado', value as string)}
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
                onChange={(value) => onFieldChange('endereco', value as string)}
                maxLength={100}
                autoFormat
                required
              />
            </div>
            <FormField
              label="NÚMERO"
              value={formData.numero || ''}
              onChange={(value) => onFieldChange('numero', value as string)}
              maxLength={10}
              required
            />
            <FormField
              label="BAIRRO"
              value={formData.bairro || ''}
              onChange={(value) => onFieldChange('bairro', value as string)}
              maxLength={50}
              autoFormat
              required
            />
          </div>

          <FormField
            label="COMPLEMENTO DO ENDEREÇO"
            value={formData.observacaoEndereco || ''}
            onChange={(value) => onFieldChange('observacaoEndereco', value as string)}
            type="textarea"
            maxLength={200}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientDataSection;
