
import React, { useState, useEffect } from 'react';
import { Database, Trash2 } from 'lucide-react';

interface FormData {
  id: string;
  type: string;
  data: any;
  createdAt: string;
}

export const DataPage: React.FC = () => {
  const [forms, setForms] = useState<FormData[]>([]);

  useEffect(() => {
    const savedForms = JSON.parse(localStorage.getItem('miniescopo_forms') || '[]');
    setForms(savedForms);
  }, []);

  const deleteForm = (id: string) => {
    const updatedForms = forms.filter(form => form.id !== id);
    setForms(updatedForms);
    localStorage.setItem('miniescopo_forms', JSON.stringify(updatedForms));
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-gray-500 to-gray-600 p-6">
          <div className="flex items-center space-x-3">
            <Database className="w-8 h-8 text-white" />
            <h2 className="text-2xl font-bold text-white">Dados do Sistema</h2>
          </div>
        </div>

        <div className="p-8">
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-blue-900">{forms.length}</h3>
                <p className="text-blue-700">Formulários Salvos</p>
              </div>
              <Database className="w-12 h-12 text-blue-500" />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full table-auto">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {forms.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      Nenhum formulário encontrado
                    </td>
                  </tr>
                ) : (
                  forms.map((form) => (
                    <tr key={form.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {form.id.slice(-8)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                        {form.type}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {form.data.nomeCliente || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(form.createdAt).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <button
                          onClick={() => deleteForm(form.id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
