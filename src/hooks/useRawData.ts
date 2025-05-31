
import { useLocalStorage } from './useLocalStorage';
import { RawDataEntry, FormData, FormType } from '../types';

export function useRawData() {
  const [rawData, setRawData] = useLocalStorage<RawDataEntry[]>('miniescopo_rawdata', []);

  const addEntry = (formData: FormData, formType: FormType) => {
    const newEntry: RawDataEntry = {
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      formType,
      data: new Date().toLocaleDateString('pt-BR')
    };

    setRawData(prev => [...prev, newEntry]);
    return newEntry;
  };

  const updateEntry = (id: string, updatedData: Partial<FormData>) => {
    setRawData(prev => 
      prev.map(entry => 
        entry.id === id ? { ...entry, ...updatedData } : entry
      )
    );
  };

  const deleteEntry = (id: string) => {
    setRawData(prev => prev.filter(entry => entry.id !== id));
  };

  const getEntriesByType = (formType: FormType) => {
    return rawData.filter(entry => entry.formType === formType);
  };

  const clearAllData = () => {
    setRawData([]);
  };

  return {
    rawData,
    addEntry,
    updateEntry,
    deleteEntry,
    getEntriesByType,
    clearAllData
  };
}
