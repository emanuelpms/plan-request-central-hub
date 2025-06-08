
import { useState, useEffect } from 'react';

interface Model {
  id: string;
  name: string;
  category: 'HUMANO' | 'VETERINARIO' | 'GERAL';
  active: boolean;
}

export function useModels() {
  const [models, setModels] = useState<Model[]>([]);

  useEffect(() => {
    const loadModels = () => {
      const saved = localStorage.getItem('miniescopo_models');
      if (saved) {
        const allModels = JSON.parse(saved);
        setModels(allModels.filter((m: Model) => m.active));
      } else {
        // Modelos padrão se nenhum foi configurado
        const defaultModels = [
          { id: '1', name: 'LABGEO PT1000', category: 'HUMANO', active: true },
          { id: '2', name: 'LABGEO PT3000', category: 'HUMANO', active: true },
          { id: '3', name: 'LABGEO PT1000 VET', category: 'VETERINARIO', active: true },
          { id: '4', name: 'LABGEO PT3000 VET', category: 'VETERINARIO', active: true },
          { id: '5', name: 'OUTROS', category: 'GERAL', active: true }
        ];
        setModels(defaultModels);
      }
    };

    loadModels();

    // Listener para atualizar quando as configurações mudarem
    const handleStorageChange = () => {
      loadModels();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('modelsUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('modelsUpdated', handleStorageChange);
    };
  }, []);

  const getModelsByCategory = (category: 'HUMANO' | 'VETERINARIO' | 'GERAL') => {
    return models.filter(m => m.category === category);
  };

  const getAllModels = () => {
    return models;
  };

  return { models, getModelsByCategory, getAllModels };
}
