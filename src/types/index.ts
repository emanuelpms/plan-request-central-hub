
export interface FormData {
  id?: string;
  data?: string;
  motivo: string;
  nomeCliente: string;
  cpfCnpj: string;
  telefone1: string;
  telefone2?: string;
  email: string;
  responsavel: string;
  endereco: string;
  cep?: string;
  cidade?: string;
  estado?: string;
  bairro?: string;
  numero?: string;
  observacaoEndereco?: string;
  modelo?: string;
  serial?: string;
  justificativa?: string;
  descricaoTestes?: string;
  razaoSocial?: string;
  setorResponsavel?: string;
  modeloImpressora?: string;
  modeloNobreak?: string;
  documentacaoObrigatoria?: boolean;
  previsaoFaturamento?: string;
  usoHumanoVeterinario?: string;
}

export interface RawDataEntry extends FormData {
  id: string;
  createdAt: string;
  formType: 'SERVICE' | 'DEMONSTRACAO' | 'APLICACAO' | 'PASSWORD' | 'INSTALACAO_DEMO';
}

export type FormType = 'SERVICE' | 'DEMONSTRACAO' | 'APLICACAO' | 'PASSWORD' | 'INSTALACAO_DEMO';
