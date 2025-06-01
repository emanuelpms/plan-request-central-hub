
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useRawData } from '@/hooks/useRawData';
import { useDatabase } from '@/hooks/useDatabase';
import { RawDataEntry, FormType } from '../types';
import { Trash2, Edit, Search, Download, Eye, Save, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EditableEntry extends RawDataEntry {
  isEditing?: boolean;
}

const RawDataTab = () => {
  const { rawData, deleteEntry, updateEntry } = useRawData();
  const { exportToEmail } = useDatabase();
  const [entries, setEntries] = useState<EditableEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<FormType | 'ALL'>('ALL');
  const [editingEntry, setEditingEntry] = useState<EditableEntry | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    setEntries(rawData.map(entry => ({ ...entry, isEditing: false })));
  }, [rawData]);

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = !searchTerm || 
      entry.razaoSocial?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.nomeCliente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.modelo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      entry.serial?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'ALL' || entry.formType === filterType;
    
    return matchesSearch && matchesType;
  });

  const formTypeLabels: Record<FormType, string> = {
    SERVICE: 'Serviço',
    DEMONSTRACAO: 'Demonstração',
    APLICACAO: 'Aplicação',
    PASSWORD: 'Password/Licença',
    INSTALACAO_DEMO: 'Instalação Demo'
  };

  const handleEdit = (entry: RawDataEntry) => {
    setEditingEntry({ ...entry });
  };

  const handleSaveEdit = () => {
    if (!editingEntry) return;

    updateEntry(editingEntry.id, editingEntry);
    setEditingEntry(null);
    
    toast({
      title: "Sucesso",
      description: "Registro atualizado com sucesso."
    });
  };

  const handleCancelEdit = () => {
    setEditingEntry(null);
  };

  const handleDelete = (id: string) => {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
      deleteEntry(id);
      toast({
        title: "Sucesso",
        description: "Registro excluído com sucesso."
      });
    }
  };

  const updateEditingField = (field: string, value: any) => {
    if (!editingEntry) return;
    setEditingEntry({
      ...editingEntry,
      [field]: value
    });
  };

  return (
    <div className="max-w-7xl mx-auto p-8 space-y-8">
      <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">📊 Dados Consolidados</CardTitle>
          <p className="text-blue-100">Visualize e gerencie todos os dados do sistema</p>
        </CardHeader>
      </Card>

      {/* Filtros e Busca */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por cliente, modelo ou serial..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="md:w-48">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as FormType | 'ALL')}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="ALL">Todos os tipos</option>
                {Object.entries(formTypeLabels).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>
            <Button onClick={exportToEmail} className="bg-green-600 hover:bg-green-700">
              <Download className="w-4 h-4 mr-2" />
              Exportar
            </Button>
          </div>

          {/* Estatísticas */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{filteredEntries.length}</div>
              <div className="text-sm text-gray-600">Total de Registros</div>
            </div>
            {Object.entries(formTypeLabels).map(([key, label]) => {
              const count = filteredEntries.filter(e => e.formType === key).length;
              return (
                <div key={key} className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="text-2xl font-bold text-gray-700">{count}</div>
                  <div className="text-sm text-gray-600">{label}</div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Modal de Edição */}
      {editingEntry && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-4xl bg-white max-h-[90vh] overflow-y-auto">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
              <div className="flex items-center justify-between">
                <CardTitle>Editar Registro</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancelEdit}
                  className="text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Nome/Razão Social</label>
                  <Input
                    value={editingEntry.razaoSocial || ''}
                    onChange={(e) => updateEditingField('razaoSocial', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">CPF/CNPJ</label>
                  <Input
                    value={editingEntry.cpfCnpj || ''}
                    onChange={(e) => updateEditingField('cpfCnpj', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Telefone 1</label>
                  <Input
                    value={editingEntry.telefone1 || ''}
                    onChange={(e) => updateEditingField('telefone1', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">E-mail</label>
                  <Input
                    value={editingEntry.email || ''}
                    onChange={(e) => updateEditingField('email', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Modelo</label>
                  <Input
                    value={editingEntry.modelo || ''}
                    onChange={(e) => updateEditingField('modelo', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Serial</label>
                  <Input
                    value={editingEntry.serial || ''}
                    onChange={(e) => updateEditingField('serial', e.target.value)}
                    maxLength={15}
                  />
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <Button onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700">
                  <Save className="w-4 h-4 mr-2" />
                  Salvar
                </Button>
                <Button variant="outline" onClick={handleCancelEdit}>
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Lista de Dados */}
      <div className="grid gap-4">
        {filteredEntries.map((entry) => (
          <Card key={entry.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <span className="text-sm font-semibold text-gray-600">Cliente</span>
                    <p className="font-medium">{entry.razaoSocial || entry.nomeCliente || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-600">Tipo</span>
                    <p className="font-medium">{formTypeLabels[entry.formType]}</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-600">Modelo</span>
                    <p className="font-medium">{entry.modelo || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-semibold text-gray-600">Data</span>
                    <p className="font-medium">{new Date(entry.createdAt).toLocaleDateString('pt-BR')}</p>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(entry)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(entry.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredEntries.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-gray-500 text-lg">Nenhum registro encontrado</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default RawDataTab;
