
import React, { useState } from 'react';
import { Save, Mail, RotateCcw, Monitor, Calendar, Users } from 'lucide-react';

export const DemoForm: React.FC = () => {
  const [formData, setFormData] = useState({
    nomeCliente: '',
    empresa: '',
    cpfCnpj: '',
    telefone1: '',
    telefone2: '',
    email: '',
    responsavel: '',
    cargo: '',
    endereco: '',
    numero: '',
    bairro: '',
    cidade: '',
    estado: '',
    cep: '',
    equipamentoInteresse: '',
    finalidade: '',
    tipoDemo: '',
    dataDesejada: '',
    horarioPreferencia: '',
    duracaoEstimada: '',
    numeroParticipantes: '',
    localizacao: '',
    recursos: '',
    objetivos: '',
    observacoes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const forms = JSON.parse(localStorage.getItem('miniescopo_forms') || '[]');
    const newForm = {
      id: Date.now().toString(),
      type: 'demo',
      data: formData,
      createdAt: new Date().toISOString(),
      status: 'Agendado'
    };
    forms.push(newForm);
    localStorage.setItem('miniescopo_forms', JSON.stringify(forms));
    alert('Demonstração agendada com sucesso!');
  };

  const handleClear = () => {
    setFormData({
      nomeCliente: '', empresa: '', cpfCnpj: '', telefone1: '', telefone2: '', email: '', responsavel: '', cargo: '',
      endereco: '', numero: '', bairro: '', cidade: '', estado: '', cep: '',
      equipamentoInteresse: '', finalidade: '', tipoDemo: '', dataDesejada: '', horarioPreferencia: '',
      duracaoEstimada: '', numeroParticipantes: '', localizacao: '', recursos: '', objetivos: '', observacoes: ''
    });
  };

  const handleEmail = () => {
    const subject = `Agendamento de Demonstração - ${formData.nomeCliente}`;
    const body = `
AGENDAMENTO DE DEMONSTRAÇÃO

=== DADOS DO CLIENTE ===
Nome: ${formData.nomeCliente}
Empresa: ${formData.empresa}
CPF/CNPJ: ${formData.cpfCnpj}
Telefone Principal: ${formData.telefone1}
Telefone Alternativo: ${formData.telefone2}
Email: ${formData.email}
Responsável: ${formData.responsavel}
Cargo: ${formData.cargo}

=== ENDEREÇO ===
${formData.endereco}, ${formData.numero}
Bairro: ${formData.bairro}
Cidade: ${formData.cidade} - ${formData.estado}
CEP: ${formData.cep}

=== DEMONSTRAÇÃO SOLICITADA ===
Equipamento de Interesse: ${formData.equipamentoInteresse}
Finalidade: ${formData.finalidade}
Tipo de Demonstração: ${formData.tipoDemo}
Localização: ${formData.localizacao}

=== AGENDAMENTO ===
Data Desejada: ${formData.dataDesejada}
Horário Preferência: ${formData.horarioPreferencia}
Duração Estimada: ${formData.duracaoEstimada}
Número de Participantes: ${formData.numeroParticipantes}

=== RECURSOS NECESSÁRIOS ===
${formData.recursos}

=== OBJETIVOS ===
${formData.objetivos}

=== OBSERVAÇÕES ===
${formData.observacoes}

---
Sistema MiniEscopo V4.9
Data da Solicitação: ${new Date().toLocaleString('pt-BR')}
    `;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
          <div className="flex items-center space-x-3">
            <Monitor className="w-8 h-8 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">Demonstração de Produtos</h2>
              <p className="text-green-100">Agendamento de apresentações técnicas e demonstrações</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="space-y-8">
            {/* Dados do Cliente */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Dados do Cliente
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo *</label>
                  <input
                    type="text"
                    name="nomeCliente"
                    value={formData.nomeCliente}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Empresa/Instituição *</label>
                  <input
                    type="text"
                    name="empresa"
                    value={formData.empresa}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CPF/CNPJ</label>
                  <input
                    type="text"
                    name="cpfCnpj"
                    value={formData.cpfCnpj}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefone Principal *</label>
                  <input
                    type="tel"
                    name="telefone1"
                    value={formData.telefone1}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefone Alternativo</label>
                  <input
                    type="tel"
                    name="telefone2"
                    value={formData.telefone2}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Responsável pela Demonstração</label>
                  <input
                    type="text"
                    name="responsavel"
                    value={formData.responsavel}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cargo/Função</label>
                  <input
                    type="text"
                    name="cargo"
                    value={formData.cargo}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Endereço da Empresa
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
                  <input
                    type="text"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Número</label>
                  <input
                    type="text"
                    name="numero"
                    value={formData.numero}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
                  <input
                    type="text"
                    name="cep"
                    value={formData.cep}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
                  <input
                    type="text"
                    name="bairro"
                    value={formData.bairro}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                  <input
                    type="text"
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Selecione...</option>
                    <option value="SP">São Paulo</option>
                    <option value="RJ">Rio de Janeiro</option>
                    <option value="MG">Minas Gerais</option>
                    <option value="RS">Rio Grande do Sul</option>
                    <option value="PR">Paraná</option>
                    <option value="SC">Santa Catarina</option>
                    <option value="BA">Bahia</option>
                    <option value="GO">Goiás</option>
                    <option value="PE">Pernambuco</option>
                    <option value="CE">Ceará</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Dados da Demonstração */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2 flex items-center">
                <Monitor className="w-5 h-5 mr-2" />
                Dados da Demonstração
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Equipamento de Interesse *</label>
                  <select
                    name="equipamentoInteresse"
                    value={formData.equipamentoInteresse}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecione o equipamento...</option>
                    <option value="LABGEO PT1000">LABGEO PT1000</option>
                    <option value="LABGEO PT3000">LABGEO PT3000</option>
                    <option value="LABGEO PT1000 VET">LABGEO PT1000 VET</option>
                    <option value="LABGEO PT3000 VET">LABGEO PT3000 VET</option>
                    <option value="LABGEO MINI">LABGEO MINI</option>
                    <option value="LABGEO ULTRA">LABGEO ULTRA</option>
                    <option value="Linha Completa">Linha Completa de Produtos</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Finalidade *</label>
                  <select
                    name="finalidade"
                    value={formData.finalidade}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecione a finalidade...</option>
                    <option value="Avaliação para Compra">Avaliação para Compra</option>
                    <option value="Conhecimento do Produto">Conhecimento do Produto</option>
                    <option value="Comparação Técnica">Comparação Técnica</option>
                    <option value="Treinamento Técnico">Treinamento Técnico</option>
                    <option value="Apresentação Comercial">Apresentação Comercial</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Demonstração *</label>
                  <select
                    name="tipoDemo"
                    value={formData.tipoDemo}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecione o tipo...</option>
                    <option value="Presencial no Cliente">Presencial no Cliente</option>
                    <option value="Presencial na Empresa">Presencial na Empresa</option>
                    <option value="Online/Virtual">Online/Virtual</option>
                    <option value="Feira/Evento">Feira/Evento</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Localização</label>
                  <input
                    type="text"
                    name="localizacao"
                    value={formData.localizacao}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Local específico da demonstração"
                  />
                </div>
              </div>
            </div>

            {/* Agendamento */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2 flex items-center">
                <Calendar className="w-5 h-5 mr-2" />
                Agendamento
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data Desejada</label>
                  <input
                    type="date"
                    name="dataDesejada"
                    value={formData.dataDesejada}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Horário de Preferência</label>
                  <select
                    name="horarioPreferencia"
                    value={formData.horarioPreferencia}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Selecione...</option>
                    <option value="Manhã (08:00 - 12:00)">Manhã (08:00 - 12:00)</option>
                    <option value="Tarde (13:00 - 17:00)">Tarde (13:00 - 17:00)</option>
                    <option value="Comercial (08:00 - 18:00)">Comercial (08:00 - 18:00)</option>
                    <option value="Indiferente">Indiferente</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duração Estimada</label>
                  <select
                    name="duracaoEstimada"
                    value={formData.duracaoEstimada}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Selecione...</option>
                    <option value="30 minutos">30 minutos</option>
                    <option value="1 hora">1 hora</option>
                    <option value="1,5 horas">1,5 horas</option>
                    <option value="2 horas">2 horas</option>
                    <option value="Meio período">Meio período</option>
                    <option value="Período integral">Período integral</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Número de Participantes</label>
                  <input
                    type="number"
                    name="numeroParticipantes"
                    value={formData.numeroParticipantes}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    min="1"
                    max="50"
                  />
                </div>
              </div>
            </div>

            {/* Detalhes Adicionais */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Detalhes Adicionais
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Recursos Necessários</label>
                  <textarea
                    name="recursos"
                    value={formData.recursos}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Descreva recursos necessários (projetor, internet, energia elétrica, etc.)"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Objetivos da Demonstração</label>
                  <textarea
                    name="objetivos"
                    value={formData.objetivos}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Quais são os principais objetivos e expectativas com esta demonstração?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Observações Gerais</label>
                  <textarea
                    name="observacoes"
                    value={formData.observacoes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Informações adicionais relevantes..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-8 py-6 flex flex-wrap gap-4 justify-center">
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition-colors shadow-md"
          >
            <Save className="w-5 h-5" />
            <span>Agendar Demonstração</span>
          </button>
          <button
            onClick={handleClear}
            className="flex items-center space-x-2 bg-gray-500 text-white px-6 py-3 rounded-lg hover:bg-gray-600 transition-colors shadow-md"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Limpar Campos</span>
          </button>
          <button
            onClick={handleEmail}
            className="flex items-center space-x-2 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors shadow-md"
          >
            <Mail className="w-5 h-5" />
            <span>Enviar por Email</span>
          </button>
        </div>
      </div>
    </div>
  );
};
