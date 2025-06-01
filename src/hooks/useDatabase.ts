
import { useLocalStorage } from './useLocalStorage';
import { RawDataEntry, FormData, FormType } from '../types';

interface DatabaseEntry extends RawDataEntry {
  emailSentAt?: string;
  attachmentCount?: number;
}

export function useDatabase() {
  const [entries, setEntries] = useLocalStorage<DatabaseEntry[]>('miniescopo_database', []);
  const [lastExport, setLastExport] = useLocalStorage<string>('miniescopo_last_export', '');

  const saveEntry = (formData: FormData, formType: FormType) => {
    const newEntry: DatabaseEntry = {
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      formType,
      data: new Date().toLocaleDateString('pt-BR'),
      emailSentAt: new Date().toISOString(),
      attachmentCount: formData.attachments?.length || 0
    };

    setEntries(prev => [...prev, newEntry]);
    return newEntry;
  };

  const exportToEmail = () => {
    const exportData = entries.map(entry => ({
      id: entry.id,
      tipo: entry.formType,
      razaoSocial: entry.razaoSocial,
      data: entry.data,
      emailEnviado: entry.emailSentAt,
      anexos: entry.attachmentCount || 0
    }));

    const csvContent = [
      'ID,Tipo,Razão Social,Data,Email Enviado,Anexos',
      ...exportData.map(row => 
        `${row.id},"${row.razaoSocial}",${row.data},${row.emailEnviado},${row.anexos}`
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `miniescopo_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setLastExport(new Date().toISOString());
  };

  const checkWeeklyExport = () => {
    if (!lastExport) {
      setLastExport(new Date().toISOString());
      return;
    }

    const lastExportDate = new Date(lastExport);
    const now = new Date();
    const weekInMs = 7 * 24 * 60 * 60 * 1000;

    if (now.getTime() - lastExportDate.getTime() >= weekInMs) {
      exportToEmail();
    }
  };

  return {
    entries,
    saveEntry,
    exportToEmail,
    checkWeeklyExport,
    lastExport
  };
}
