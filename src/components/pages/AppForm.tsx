
import React, { useState } from 'react';
import { Save, Mail, RotateCcw, FileText, Settings, Code } from 'lucide-react';

export const AppForm: React.FC = () => {
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
    equipamento: '',
    serial: '',
    tipoAplicacao: '',
    sistemaOperacional: '',
    versaoAtual: '',
    versaoDesejada: '',
    prioridade: '',
    dataDesejada: '',
    horarioPreferencia: '',
    backup: '',
    configuracoes: '',
    modulos: '',
    personalizacoes: '',
    integracao: '',
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
      type: 'app',
      data: formData,
      createdAt: new Date().toISOString(),
      status: 'Em Análise'
    };
    forms.push(newForm);
    localStorage.setItem('miniescopo_forms', JSON.stringify(forms));
    alert('Solicitação de Aplicação salva com sucesso!');
  };

  const handleClear = () => {
    setFormData({
      nomeCliente: '', empresa: '', cpfCnpj: '', telefone1: '', telefone2: '', email: '', responsavel: '', cargo: '',
      endereco: '', numero: '', bairro: '', cidade: '', estado: '', cep: '',
      equipamento: '', serial: '', tipoAplicacao: '', sistemaOperacional: '', versaoAtual: '', versaoDesejada: '',
      prioridade: '', dataDesejada: '', horarioPreferencia: '', backup: '', configuracoes: '', modulos: '',
      personalizacoes: '', integracao: '', objetivos: '', observacoes: ''
    });
  };

  const handleEmail = () => {
    const subject = `Solicitação de Aplicação - ${formData.nomeCliente}`;
    const body = `
SOLICITAÇÃO DE APLICAÇÃO DE SOFTWARE

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

=== EQUIPAMENTO ===
Modelo: ${formData.equipamento}
Serial: ${formData.serial}
Sistema Operacional: ${formData.sistemaOperacional}

=== APLICAÇÃO SOLICITADA ===
Tipo de Aplicação: ${formData.tipoAplicacao}
Versão Atual: ${formData.versaoAtual}
Versão Desejada: ${formData.versaoDesejada}
Prioridade: ${formData.prioridade}

=== AGENDAMENTO ===
Data Desejada: ${formData.dataDesejada}
Horário Preferência: ${formData.horarioPreferencia}

=== CONFIGURAÇÕES ===
Backup Necessário: ${formData.backup}
Configurações Específicas: ${formData.configuracoes}
Módulos Adicionais: ${formData.modulos}
Personalizações: ${formData.personalizacoes}
Integração com Outros Sistemas: ${formData.integracao}

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
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6">
          <div className="flex items-center space-x-3">
            <FileText className="w-8 h-8 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">Aplicação de Software</h2>
              <p className="text-purple-100">Configuração e aplicação de sistemas</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="space-y-8">
            {/* Dados do Cliente */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2 flex items-center">
                <Settings className="w-5 h-5 mr-2" />
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefone Principal *</label>
                  <input
                    type="tel"
                    name="telefone1"
                    value={formData.telefone1}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Responsável Técnico</label>
                  <input
                    type="text"
                    name="responsavel"
                    value={formData.responsavel}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cargo/Função</label>
                  <input
                    type="text"
                    name="cargo"
                    value={formData.cargo}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Endereço da Instalação
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
                  <input
                    type="text"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Número</label>
                  <input
                    type="text"
                    name="numero"
                    value={formData.numero}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
                  <input
                    type="text"
                    name="cep"
                    value={formData.cep}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
                  <input
                    type="text"
                    name="bairro"
                    value={formData.bairro}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                  <input
                    type="text"
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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

            {/* Dados do Sistema */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2 flex items-center">
                <Code className="w-5 h-5 mr-2" />
                Dados do Sistema/Equipamento
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Equipamento *</label>
                  <select
                    name="equipamento"
                    value={formData.equipamento}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecione o equipamento...</option>
                    <option value="LABGEO PT1000">LABGEO PT1000</option>
                    <option value="LABGEO PT3000">LABGEO PT3000</option>
                    <option value="LABGEO PT1000 VET">LABGEO PT1000 VET</option>
                    <option value="LABGEO PT3000 VET">LABGEO PT3000 VET</option>
                    <option value="LABGEO MINI">LABGEO MINI</option>
                    <option value="LABGEO ULTRA">LABGEO ULTRA</option>
                    <option value="PC/Workstation">PC/Workstation</option>
                    <option value="Servidor">Servidor</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Número Serial</label>
                  <input
                    type="text"
                    name="serial"
                    value={formData.serial}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sistema Operacional *</label>
                  <select
                    name="sistemaOperacional"
                    value={formData.sistemaOperacional}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="Windows 10">Windows 10</option>
                    <option value="Windows 11">Windows 11</option>
                    <option value="Windows Server 2019">Windows Server 2019</option>
                    <option value="Windows Server 2022">Windows Server 2022</option>
                    <option value="Linux Ubuntu">Linux Ubuntu</option>
                    <option value="Linux CentOS">Linux CentOS</option>
                    <option value="MacOS">MacOS</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Versão Atual do Software</label>
                  <input
                    type="text"
                    name="versaoAtual"
                    value={formData.versaoAtual}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ex: v4.8.2"
                  />
                </div>
              </div>
            </div>

            {/* Dados da Aplicação */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Dados da Aplicação Solicitada
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Aplicação *</label>
                  <select
                    name="tipoAplicacao"
                    value={formData.tipoAplicacao}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="Instalação Nova">Instalação Nova</option>
                    <option value="Atualização de Versão">Atualização de Versão</option>
                    <option value="Configuração Personalizada">Configuração Personalizada</option>
                    <option value="Migração de Dados">Migração de Dados</option>
                    <option value="Integração com Sistema">Integração com Sistema</option>
                    <option value="Customização">Customização</option>
                    <option value="Outros">Outros</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Versão Desejada</label>
                  <input
                    type="text"
                    name="versaoDesejada"
                    value={formData.versaoDesejada}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Ex: v4.9.0 ou Mais recente"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prioridade *</label>
                  <select
                    name="prioridade"
                    value={formData.prioridade}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="Baixa">Baixa</option>
                    <option value="Normal">Normal</option>
                    <option value="Alta">Alta</option>
                    <option value="Urgente">Urgente</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Backup Necessário</label>
                  <select
                    name="backup"
                    value={formData.backup}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Selecione...</option>
                    <option value="Sim, completo">Sim, completo</option>
                    <option value="Sim, apenas dados">Sim, apenas dados</option>
                    <option value="Não necessário">Não necessário</option>
                    <option value="Cliente realizará">Cliente realizará</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data Desejada</label>
                  <input
                    type="date"
                    name="dataDesejada"
                    value={formData.dataDesejada}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Horário de Preferência</label>
                  <select
                    name="horarioPreferencia"
                    value={formData.horarioPreferencia}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="">Selecione...</option>
                    <option value="Manhã (08:00 - 12:00)">Manhã (08:00 - 12:00)</option>
                    <option value="Tarde (13:00 - 17:00)">Tarde (13:00 - 17:00)</option>
                    <option value="Comercial (08:00 - 18:00)">Comercial (08:00 - 18:00)</option>
                    <option value="Remoto">Remoto</option>
                    <option value="Indiferente">Indiferente</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Configurações Específicas */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Configurações e Personalizações
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Configurações Específicas</label>
                  <textarea
                    name="configuracoes"
                    value={formData.configuracoes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Descreva configurações específicas necessárias..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Módulos Adicionais</label>
                  <textarea
                    name="modulos"
                    value={formData.modulos}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Liste módulos ou funcionalidades adicionais necessárias..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Personalizações Solicitadas</label>
                  <textarea
                    name="personalizacoes"
                    value={formData.personalizacoes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Descreva personalizações específicas..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Integração com Outros Sistemas</label>
                  <textarea
                    name="integracao"
                    value={formData.integracao}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Descreva sistemas que precisam ser integrados..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Objetivos da Aplicação</label>
                  <textarea
                    name="objetivos"
                    value={formData.objetivos}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder="Quais são os objetivos principais desta aplicação?"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Observações Gerais</label>
                  <textarea
                    name="observacoes"
                    value={formData.observacoes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
            className="flex items-center space-x-2 bg-purple-500 text-white px-6 py-3 rounded-lg hover:bg-purple-600 transition-colors shadow-md"
          >
            <Save className="w-5 h-5" />
            <span>Salvar Solicitação</span>
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
