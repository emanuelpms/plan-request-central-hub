
export interface FormData {
  id?: string;
  data?: string;
  motivo: string;
  nomeCliente: string;
  razaoSocial?: string;
  cpfCnpj: string;
  telefone1: string;
  telefone2?: string;
  email: string;
  responsavel: string;
  setorResponsavel?: string;
  endereco: string;
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
  ativo?: boolean;
  primeiraAplicacao?: boolean;
  noLocalizado?: boolean;
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
