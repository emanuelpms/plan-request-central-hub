
import { useState } from 'react';
import { CNPJResponse } from '../types';

export function useCNPJ() {
  const [loading, setLoading] = useState(false);
  
  const fetchCNPJData = async (cnpj: string): Promise<CNPJResponse | null> => {
    const cleanCNPJ = cnpj.replace(/\D/g, '');
    
    if (cleanCNPJ.length !== 14) {
      return null;
    }
    
    setLoading(true);
    try {
      // Usando API gratuita do ReceitaWS
      const response = await fetch(`https://www.receitaws.com.br/v1/cnpj/${cleanCNPJ}`);
      const data = await response.json();
      
      if (data.status === 'ERROR') {
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Erro ao buscar CNPJ:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  return { fetchCNPJData, loading };
}
