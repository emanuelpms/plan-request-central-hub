import { useState } from 'react';

interface CNPJResponse {
  status: string;
  nome?: string;
  fantasia?: string;
  telefone?: string;
  email?: string;
  logradouro?: string;
  numero?: string;
  bairro?: string;
  municipio?: string;
  uf?: string;
  cep?: string;
}

interface CompanyData {
  razaoSocial: string;
  nomeFantasia: string;
  telefone: string;
  email: string;
  endereco: string;
  numero: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export const useCNPJ = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCompanyData = async (cnpj: string): Promise<CompanyData | null> => {
    const cleanCnpj = cnpj.replace(/\D/g, '');
    
    if (cleanCnpj.length !== 14) {
      setError('CNPJ deve ter 14 dígitos');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      // Using a free CNPJ API service
      const response = await fetch(`https://www.receitaws.com.br/v1/cnpj/${cleanCnpj}`);
      const data: CNPJResponse = await response.json();

      if (data.status === 'ERROR') {
        setError('CNPJ não encontrado ou inválido');
        return null;
      }

      return {
        razaoSocial: data.nome || '',
        nomeFantasia: data.fantasia || '',
        telefone: data.telefone || '',
        email: data.email || '',
        endereco: data.logradouro || '',
        numero: data.numero || '',
        bairro: data.bairro || '',
        cidade: data.municipio || '',
        estado: data.uf || '',
        cep: data.cep || ''
      };
    } catch (err) {
      setError('Erro ao consultar CNPJ');
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    fetchCompanyData,
    loading,
    error
  };
};