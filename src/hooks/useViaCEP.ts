
import { useState } from 'react';
import { ViaCEPResponse } from '../types';

export function useViaCEP() {
  const [loading, setLoading] = useState(false);
  
  const fetchAddress = async (cep: string): Promise<ViaCEPResponse | null> => {
    const cleanCEP = cep.replace(/\D/g, '');
    
    if (cleanCEP.length !== 8) {
      return null;
    }
    
    setLoading(true);
    try {
      const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
      const data = await response.json();
      
      if (data.erro) {
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Erro ao buscar CEP:', error);
      return null;
    } finally {
      setLoading(false);
    }
  };
  
  return { fetchAddress, loading };
}
