
import React, { useState } from 'react';
import { Save, Mail, RotateCcw, Wrench } from 'lucide-react';

export const ServiceForm: React.FC = () => {
  const [formData, setFormData] = useState({
    nomeCliente: '',
    cpfCnpj: '',
    telefone1: '',
    telefone2: '',
    email: '',
    responsavel: '',
    endereco: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    modelo: '',
    serial: '',
    motivo: '',
    descricao: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const forms = JSON.parse(localStorage.getItem('miniescopo_forms') || '[]');
    const newForm = {
      id: Date.now().toString(),
      type: 'service',
      data: formData,
      createdAt: new Date().toISOString()
    };
    forms.push(newForm);
    localStorage.setItem('miniescopo_forms', JSON.stringify(forms));
    alert('Formulário salvo com sucesso!');
  };

  const handleClear = () => {
    setFormData({
      nomeCliente: '', cpfCnpj: '', telefone1: '', telefone2: '', email: '', responsavel: '',
      endereco: '', numero: '', bairro: '', cidade: '', estado: '', cep: '',
      modelo: '', serial: '', motivo: '', descricao: ''
    });
  };

  const handleEmail = () => {
    const subject = `Solicitação de Serviço - ${formData.nomeCliente}`;
    const body = `Dados do Cliente:\nNome: ${formData.nomeCliente}\nCPF/CNPJ: ${formData.cpfCnpj}\n\nEquipamento:\nModelo: ${formData.modelo}\nSerial: ${formData.serial}\n\nMotivo: ${formData.motivo}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6">
          <div className="flex items-center space-x-3">
            <Wrench className="w-8 h-8 text-white" />
            <h2 className="text-2xl font-bold text-white">Serviço Técnico</h2>
          </div>
        </div>

        <div className="p-8">
          <div className="space-y-8">
            {/* Dados do Cliente */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                Dados do Cliente
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome/Razão Social *</label>
                  <input
                    type="text"
                    name="nomeCliente"
                    value={formData.nomeCliente}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CPF/CNPJ *</label>
                  <input
                    type="text"
                    name="cpfCnpj"
                    value={formData.cpfCnpj}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefone 1 *</label>
                  <input
                    type="tel"
                    name="telefone1"
                    value={formData.telefone1}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Dados do Equipamento */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Dados do Equipamento</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Modelo *</label>
                  <select
                    name="modelo"
                    value={formData.modelo}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="LABGEO PT1000">LABGEO PT1000</option>
                    <option value="LABGEO PT3000">LABGEO PT3000</option>
                    <option value="LABGEO PT1000 VET">LABGEO PT1000 VET</option>
                    <option value="LABGEO PT3000 VET">LABGEO PT3000 VET</option>
                    <option value="OUTROS">OUTROS</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Serial *</label>
                  <input
                    type="text"
                    name="serial"
                    value={formData.serial}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Motivo da Solicitação *</label>
                  <select
                    name="motivo"
                    value={formData.motivo}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="Instalação Inicial">Instalação Inicial</option>
                    <option value="Manutenção Preventiva">Manutenção Preventiva</option>
                    <option value="Manutenção Corretiva">Manutenção Corretiva</option>
                    <option value="Atualização de Software">Atualização de Software</option>
                    <option value="Troca de Peças">Troca de Peças</option>
                    <option value="Calibração">Calibração</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Descrição/Observações</label>
                  <textarea
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleChange}
                    rows={4}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-8 py-6 flex flex-wrap gap-4 justify-center">
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors"
          >
            <Save className="w-5 h-5" />
            <span>Salvar</span>
          </button>
          <button
            onClick={handleClear}
            className="flex items-center space-x-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Limpar</span>
          </button>
          <button
            onClick={handleEmail}
            className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors"
          >
            <Mail className="w-5 h-5" />
            <span>Enviar Email</span>
          </button>
        </div>
      </div>
    </div>
  );
};
