
export interface FormData {
  id?: string;
  data?: string;
  motivo?: string;
  nomeCliente?: string;
  razaoSocial?: string;
  cpfCnpj?: string;
  telefone1?: string;
  telefone2?: string;
  email?: string;
  responsavel?: string;
  setorResponsavel?: string;
  dataNascimento?: string;
  endereco?: string;
  cep?: string;
  cidade?: string;
  estado?: string;
  bairro?: string;
  numero?: string;
  observacaoEndereco?: string;
  modelo?: string;
  modeloImpressora?: string;
  modeloNobreak?: string;
  serial?: string;
  justificativa?: string;
  descricaoTestes?: string;
  documentacaoObrigatoria?: boolean;
  previsaoFaturamento?: string;
  usoHumanoVeterinario?: string;
  dataInicial?: string;
  dataFinal?: string;
  ativo?: boolean | string;
  primeiraAplicacao?: boolean;
  noLocalizado?: boolean;
  necessarioAplicacao?: boolean;
  necessarioLicenca?: boolean;
  dataAplicacao?: string;
  numeroBO?: string;
  responsavelInstalacao?: string;
  
  // Demonstração specific fields
  nomeClienteEntrega?: string;
  razaoSocialEntrega?: string;
  cpfCnpjEntrega?: string;
  telefone1Entrega?: string;
  telefone2Entrega?: string;
  responsavelEntrega?: string;
  emailEntrega?: string;
  enderecoEntrega?: string;
  cepEntrega?: string;
  cidadeEntrega?: string;
  estadoEntrega?: string;
  bairroEntrega?: string;
  numeroEntrega?: string;
  observacaoEnderecoEntrega?: string;
  justificativaDemo?: string;
  descricaoEquipamento?: string;
  necessarioApplicationSamsung?: string;
  nomeClienteAdicional?: string;
  cronogramaInicio?: string;
  cronogramaFim?: string;
  clientesAdicionais?: any[];
}

export interface RawDataEntry extends FormData {
  id: string;
  createdAt: string;
  formType: 'SERVICE' | 'DEMONSTRACAO' | 'APLICACAO' | 'PASSWORD' | 'INSTALACAO_DEMO';
}

export type FormType = 'SERVICE' | 'DEMONSTRACAO' | 'APLICACAO' | 'PASSWORD' | 'INSTALACAO_DEMO';

export interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
  ibge: string;
  gia: string;
  ddd: string;
  siafi: string;
}

export interface CNPJResponse {
  status: string;
  nome?: string;
  fantasia?: string;
  logradouro?: string;
  numero?: string;
  municipio?: string;
  bairro?: string;
  uf?: string;
  cep?: string;
  telefone?: string;
  email?: string;
}
