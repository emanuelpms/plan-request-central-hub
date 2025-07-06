
import React, { useState } from 'react';
import { Save, Mail, RotateCcw, Download, HardDrive, Monitor } from 'lucide-react';

export const InstallForm: React.FC = () => {
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
    sistemaOperacional: '',
    tipoInstalacao: '',
    versaoDesejada: '',
    modulos: '',
    finalidade: '',
    prazoAvaliacao: '',
    especificacoesTecnicas: '',
    processador: '',
    memoria: '',
    espacoDisco: '',
    resolucao: '',
    internet: '',
    antivirus: '',
    firewall: '',
    backupNecessario: '',
    dataDesejada: '',
    horarioPreferencia: '',
    treinamento: '',
    suporte: '',
    observacoes: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    const forms = JSON.parse(localStorage.getItem('miniescopo_forms') || '[]');
    const newForm = {
      id: Date.now().toString(),
      type: 'install',
      data: formData,
      createdAt: new Date().toISOString(),
      status: 'Agendado'
    };
    forms.push(newForm);
    localStorage.setItem('miniescopo_forms', JSON.stringify(forms));
    alert('Instalação demonstrativa agendada com sucesso!');
  };

  const handleClear = () => {
    setFormData({
      nomeCliente: '', empresa: '', cpfCnpj: '', telefone1: '', telefone2: '', email: '', responsavel: '', cargo: '',
      endereco: '', numero: '', bairro: '', cidade: '', estado: '', cep: '',
      sistemaOperacional: '', tipoInstalacao: '', versaoDesejada: '', modulos: '', finalidade: '', prazoAvaliacao: '',
      especificacoesTecnicas: '', processador: '', memoria: '', espacoDisco: '', resolucao: '', internet: '',
      antivirus: '', firewall: '', backupNecessario: '', dataDesejada: '', horarioPreferencia: '',
      treinamento: '', suporte: '', observacoes: ''
    });
  };

  const handleEmail = () => {
    const subject = `Instalação Demonstrativa - ${formData.nomeCliente}`;
    const body = `
INSTALAÇÃO DEMONSTRATIVA

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

=== CONFIGURAÇÃO DO SISTEMA ===
Sistema Operacional: ${formData.sistemaOperacional}
Tipo de Instalação: ${formData.tipoInstalacao}
Versão Desejada: ${formData.versaoDesejada}
Módulos: ${formData.modulos}

=== ESPECIFICAÇÕES TÉCNICAS ===
Processador: ${formData.processador}
Memória RAM: ${formData.memoria}
Espaço em Disco: ${formData.espacoDisco}
Resolução: ${formData.resolucao}
Internet: ${formData.internet}
Antivírus: ${formData.antivirus}
Firewall: ${formData.firewall}

=== FINALIDADE E AVALIAÇÃO ===
Finalidade: ${formData.finalidade}
Prazo de Avaliação: ${formData.prazoAvaliacao}
Backup Necessário: ${formData.backupNecessario}

=== AGENDAMENTO ===
Data Desejada: ${formData.dataDesejada}
Horário Preferência: ${formData.horarioPreferencia}

=== SERVIÇOS ADICIONAIS ===
Treinamento: ${formData.treinamento}
Suporte: ${formData.suporte}

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
        <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 p-6">
          <div className="flex items-center space-x-3">
            <Download className="w-8 h-8 text-white" />
            <div>
              <h2 className="text-2xl font-bold text-white">Instalação Demonstrativa</h2>
              <p className="text-indigo-100">Instalação de versões demonstrativas para avaliação</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="space-y-8">
            {/* Dados do Cliente */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2 flex items-center">
                <Monitor className="w-5 h-5 mr-2" />
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Telefone Principal *</label>
                  <input
                    type="tel"
                    name="telefone1"
                    value={formData.telefone1}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cargo/Função</label>
                  <input
                    type="text"
                    name="cargo"
                    value={formData.cargo}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Endereço para Instalação
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Endereço</label>
                  <input
                    type="text"
                    name="endereco"
                    value={formData.endereco}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Número</label>
                  <input
                    type="text"
                    name="numero"
                    value={formData.numero}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">CEP</label>
                  <input
                    type="text"
                    name="cep"
                    value={formData.cep}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Bairro</label>
                  <input
                    type="text"
                    name="bairro"
                    value={formData.bairro}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Cidade</label>
                  <input
                    type="text"
                    name="cidade"
                    value={formData.cidade}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Estado</label>
                  <select
                    name="estado"
                    value={formData.estado}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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

            {/* Configuração do Sistema */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2 flex items-center">
                <HardDrive className="w-5 h-5 mr-2" />
                Configuração do Sistema
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sistema Operacional *</label>
                  <select
                    name="sistemaOperacional"
                    value={formData.sistemaOperacional}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
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
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Instalação *</label>
                  <select
                    name="tipoInstalacao"
                    value={formData.tipoInstalacao}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  >
                    <option value="">Selecione...</option>
                    <option value="Instalação Completa">Instalação Completa</option>
                    <option value="Instalação Básica">Instalação Básica</option>
                    <option value="Apenas Software">Apenas Software</option>
                    <option value="Com Banco de Dados">Com Banco de Dados</option>
                    <option value="Personalizada">Personalizada</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Versão Desejada</label>
                  <select
                    name="versaoDesejada"
                    value={formData.versaoDesejada}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Selecione...</option>
                    <option value="Versão Mais Recente">Versão Mais Recente</option>
                    <option value="MiniEscopo V4.9">MiniEscopo V4.9</option>
                    <option value="MiniEscopo V4.8">MiniEscopo V4.8</option>
                    <option value="Versão Específica">Versão Específica</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Prazo de Avaliação</label>
                  <select
                    name="prazoAvaliacao"
                    value={formData.prazoAvaliacao}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Selecione...</option>
                    <option value="15 dias">15 dias</option>
                    <option value="30 dias">30 dias</option>
                    <option value="45 dias">45 dias</option>
                    <option value="60 dias">60 dias</option>
                    <option value="90 dias">90 dias</option>
                    <option value="6 meses">6 meses</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Especificações Técnicas */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Especificações Técnicas do Computador
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Processador</label>
                  <input
                    type="text"
                    name="processador"
                    value={formData.processador}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Ex: Intel i5, AMD Ryzen 5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Memória RAM</label>
                  <select
                    name="memoria"
                    value={formData.memoria}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Selecione...</option>
                    <option value="4 GB">4 GB</option>
                    <option value="8 GB">8 GB</option>
                    <option value="16 GB">16 GB</option>
                    <option value="32 GB">32 GB</option>
                    <option value="64 GB ou mais">64 GB ou mais</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Espaço em Disco Disponível</label>
                  <select
                    name="espacoDisco"
                    value={formData.espacoDisco}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Selecione...</option>
                    <option value="Menos de 10 GB">Menos de 10 GB</option>
                    <option value="10-50 GB">10-50 GB</option>
                    <option value="50-100 GB">50-100 GB</option>
                    <option value="100-500 GB">100-500 GB</option>
                    <option value="Mais de 500 GB">Mais de 500 GB</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Resolução do Monitor</label>
                  <select
                    name="resolucao"
                    value={formData.resolucao}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Selecione...</option>
                    <option value="1366x768">1366x768</option>
                    <option value="1920x1080 (Full HD)">1920x1080 (Full HD)</option>
                    <option value="2560x1440 (2K)">2560x1440 (2K)</option>
                    <option value="3840x2160 (4K)">3840x2160 (4K)</option>
                    <option value="Outra">Outra</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Conexão com Internet</label>
                  <select
                    name="internet"
                    value={formData.internet}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Selecione...</option>
                    <option value="Banda Larga">Banda Larga</option>
                    <option value="Fibra Óptica">Fibra Óptica</option>
                    <option value="Wi-Fi">Wi-Fi</option>
                    <option value="Móvel/4G">Móvel/4G</option>
                    <option value="Sem Internet">Sem Internet</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Antivírus Instalado</label>
                  <input
                    type="text"
                    name="antivirus"
                    value={formData.antivirus}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Ex: Windows Defender, Norton, Kaspersky"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Firewall Ativo</label>
                  <select
                    name="firewall"
                    value={formData.firewall}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Selecione...</option>
                    <option value="Sim">Sim</option>
                    <option value="Não">Não</option>
                    <option value="Não sei">Não sei</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Backup Necessário Antes da Instalação</label>
                  <select
                    name="backupNecessario"
                    value={formData.backupNecessario}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Selecione...</option>
                    <option value="Sim, completo">Sim, completo</option>
                    <option value="Sim, apenas dados importantes">Sim, apenas dados importantes</option>
                    <option value="Não necessário">Não necessário</option>
                    <option value="Cliente fará o backup">Cliente fará o backup</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Agendamento e Serviços */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2">
                Agendamento e Serviços Adicionais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Data Desejada para Instalação</label>
                  <input
                    type="date"
                    name="dataDesejada"
                    value={formData.dataDesejada}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Horário de Preferência</label>
                  <select
                    name="horarioPreferencia"
                    value={formData.horarioPreferencia}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Selecione...</option>
                    <option value="Manhã (08:00 - 12:00)">Manhã (08:00 - 12:00)</option>
                    <option value="Tarde (13:00 - 17:00)">Tarde (13:00 - 17:00)</option>
                    <option value="Comercial (08:00 - 18:00)">Comercial (08:00 - 18:00)</option>
                    <option value="Remoto">Remoto</option>
                    <option value="Indiferente">Indiferente</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Treinamento Necessário</label>
                  <select
                    name="treinamento"
                    value={formData.treinamento}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Selecione...</option>
                    <option value="Sim, básico">Sim, básico</option>
                    <option value="Sim, avançado">Sim, avançado</option>
                    <option value="Apenas orientações">Apenas orientações</option>
                    <option value="Não necessário">Não necessário</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Suporte Pós-Instalação</label>
                  <select
                    name="suporte"
                    value={formData.suporte}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">Selecione...</option>
                    <option value="Suporte técnico por 30 dias">Suporte técnico por 30 dias</option>
                    <option value="Suporte técnico por 60 dias">Suporte técnico por 60 dias</option>
                    <option value="Apenas durante avaliação">Apenas durante avaliação</option>
                    <option value="Não necessário">Não necessário</option>
                  </select>
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
                  <label className="block text-sm font-medium text-gray-700 mb-2">Módulos/Funcionalidades Específicas</label>
                  <textarea
                    name="modulos"
                    value={formData.modulos}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Liste módulos ou funcionalidades específicas que deseja avaliar..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Finalidade da Avaliação</label>
                  <textarea
                    name="finalidade"
                    value={formData.finalidade}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Descreva qual será a finalidade de uso e avaliação do software..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Observações Gerais</label>
                  <textarea
                    name="observacoes"
                    value={formData.observacoes}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Informações adicionais, requisitos especiais ou dúvidas..."
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 px-8 py-6 flex flex-wrap gap-4 justify-center">
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition-colors shadow-md"
          >
            <Save className="w-5 h-5" />
            <span>Agendar Instalação</span>
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
