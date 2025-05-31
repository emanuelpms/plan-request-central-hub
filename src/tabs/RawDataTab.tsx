
import React, { useState } from 'react';
import { useRawData } from '../hooks/useRawData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const RawDataTab: React.FC = () => {
  const { rawData, clearAllData } = useRawData();
  const { toast } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredData = rawData.filter(entry => {
    const matchesSearch = searchTerm === '' || 
      Object.values(entry).some(value => 
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesType = filterType === 'ALL' || entry.formType === filterType;
    
    return matchesSearch && matchesType;
  });

  const handleClearAll = () => {
    if (window.confirm('Tem certeza que deseja limpar todos os dados? Esta ação não pode ser desfeita.')) {
      clearAllData();
      toast({
        title: "Dados Limpos",
        description: "Todos os dados foram removidos com sucesso.",
      });
    }
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'SERVICE': 'bg-blue-100 text-blue-800',
      'DEMONSTRACAO': 'bg-green-100 text-green-800',
      'APLICACAO': 'bg-purple-100 text-purple-800',
      'PASSWORD': 'bg-orange-100 text-orange-800',
      'INSTALACAO_DEMO': 'bg-red-100 text-red-800'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  const exportToCSV = () => {
    if (filteredData.length === 0) {
      toast({
        title: "Erro",
        description: "Não há dados para exportar.",
        variant: "destructive"
      });
      return;
    }

    const headers = ['Data', 'Tipo', 'Nome/Razão Social', 'CPF/CNPJ', 'Telefone', 'Email', 'Responsável'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(entry => [
        entry.data || '',
        entry.formType,
        entry.nomeCliente || entry.razaoSocial || '',
        entry.cpfCnpj,
        entry.telefone1,
        entry.email,
        entry.responsavel
      ].map(field => `"${field}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `rawdata_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Exportado!",
      description: "Dados exportados com sucesso para CSV.",
    });
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-blue-800">RAWDATA - Dados Consolidados</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 mb-6">
            <Input
              placeholder="Buscar nos dados..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
            
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Filtrar por tipo" />
              </SelectTrigger>
              <SelectContent className="bg-white z-50">
                <SelectItem value="ALL">Todos os tipos</SelectItem>
                <SelectItem value="SERVICE">SERVICE</SelectItem>
                <SelectItem value="DEMONSTRACAO">DEMONSTRAÇÃO</SelectItem>
                <SelectItem value="APLICACAO">APLICAÇÃO</SelectItem>
                <SelectItem value="PASSWORD">PASSWORD</SelectItem>
                <SelectItem value="INSTALACAO_DEMO">INSTALAÇÃO DEMO</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={exportToCSV} variant="outline">
              Exportar CSV
            </Button>

            <Button onClick={handleClearAll} variant="destructive">
              Limpar Todos os Dados
            </Button>
          </div>

          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <p className="text-sm text-gray-600">
              Total de registros: <strong>{filteredData.length}</strong> de <strong>{rawData.length}</strong>
            </p>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Data</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Nome/Razão Social</TableHead>
                  <TableHead>CPF/CNPJ</TableHead>
                  <TableHead>Telefone</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Responsável</TableHead>
                  <TableHead>Cidade</TableHead>
                  <TableHead>Modelo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      Nenhum registro encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell>{entry.data || new Date(entry.createdAt).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        <Badge className={getTypeColor(entry.formType)}>
                          {entry.formType.replace('_', ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell>{entry.nomeCliente || entry.razaoSocial || '-'}</TableCell>
                      <TableCell>{entry.cpfCnpj}</TableCell>
                      <TableCell>{entry.telefone1}</TableCell>
                      <TableCell>{entry.email}</TableCell>
                      <TableCell>{entry.responsavel}</TableCell>
                      <TableCell>{entry.cidade || '-'}</TableCell>
                      <TableCell>{entry.modelo || '-'}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RawDataTab;
