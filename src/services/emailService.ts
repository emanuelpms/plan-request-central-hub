
import { FormData, FormType } from '../types';

interface EmailTemplate {
  subject: string;
  htmlBody: string;
}

// Função para gerar o título do email
const generateEmailSubject = (formData: FormData, motivo: string): string => {
  const cliente = formData.nomeCliente || formData.razaoSocial || 'Cliente';
  const modelo = formData.modelo || 'Modelo não especificado';
  const serial = formData.serial || 'Serial não especificado';
  
  return `${motivo} - ${cliente} - ${modelo} - ${serial}`;
};

// Template base para emails
const generateEmailHTML = (formData: FormData, formType: FormType, motivo: string): string => {
  const cliente = formData.nomeCliente || formData.razaoSocial || '';
  const cpfCnpj = formData.cpfCnpj || '';
  const telefone1 = formData.telefone1 || '';
  const telefone2 = formData.telefone2 || '';
  const email = formData.email || '';
  const responsavel = formData.responsavel || '';
  const endereco = `${formData.endereco || ''}, ${formData.numero || ''}, ${formData.bairro || ''}, ${formData.cidade || ''}, ${formData.estado || ''}, CEP: ${formData.cep || ''}`;

  let equipmentSection = '';
  let specificSection = '';

  // Seção de equipamento comum
  if (formData.modelo || formData.serial) {
    equipmentSection = `
      <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">📋 Dados do Equipamento</h3>
        <div style="display: grid; gap: 10px;">
          ${formData.modelo ? `<p style="margin: 5px 0;"><strong>Modelo:</strong> ${formData.modelo}</p>` : ''}
          ${formData.serial ? `<p style="margin: 5px 0;"><strong>Serial:</strong> ${formData.serial}</p>` : ''}
          ${formData.modeloNobreak ? `<p style="margin: 5px 0;"><strong>Modelo Nobreak:</strong> ${formData.modeloNobreak}</p>` : ''}
          ${formData.modeloImpressora ? `<p style="margin: 5px 0;"><strong>Modelo Impressora:</strong> ${formData.modeloImpressora}</p>` : ''}
        </div>
      </div>
    `;
  }

  // Seções específicas por tipo de formulário
  switch (formType) {
    case 'SERVICE':
      specificSection = `
        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #059669; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">🔧 Dados do Serviço</h3>
          <div style="display: grid; gap: 10px;">
            <p style="margin: 5px 0;"><strong>Motivo da Solicitação:</strong> ${motivo}</p>
            ${formData.usoHumanoVeterinario ? `<p style="margin: 5px 0;"><strong>Modo de Uso:</strong> ${formData.usoHumanoVeterinario}</p>` : ''}
            ${formData.documentacaoObrigatoria ? `<p style="margin: 5px 0;"><strong>Documentação Obrigatória:</strong> ${formData.documentacaoObrigatoria ? 'Sim' : 'Não'}</p>` : ''}
            ${formData.descricaoTestes ? `<p style="margin: 5px 0;"><strong>Descrição/Testes:</strong> ${formData.descricaoTestes}</p>` : ''}
            ${formData.necessarioAplicacao ? `<p style="margin: 5px 0;"><strong>Necessário Aplicação:</strong> ${formData.necessarioAplicacao ? 'Sim' : 'Não'}</p>` : ''}
            ${formData.necessarioLicenca ? `<p style="margin: 5px 0;"><strong>Necessário Licença:</strong> ${formData.necessarioLicenca ? 'Sim' : 'Não'}</p>` : ''}
            ${formData.dataAplicacao ? `<p style="margin: 5px 0;"><strong>Data da Aplicação:</strong> ${formData.dataAplicacao}</p>` : ''}
          </div>
        </div>
      `;
      break;
    
    case 'APLICACAO':
      specificSection = `
        <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #d97706; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">⚡ Dados da Aplicação</h3>
          <div style="display: grid; gap: 10px;">
            <p style="margin: 5px 0;"><strong>Motivo da Solicitação:</strong> ${motivo}</p>
            ${formData.numeroBO ? `<p style="margin: 5px 0;"><strong>Número do BO:</strong> ${formData.numeroBO}</p>` : ''}
            ${formData.dataAplicacao ? `<p style="margin: 5px 0;"><strong>Data da Aplicação:</strong> ${formData.dataAplicacao}</p>` : ''}
            ${formData.descricaoTestes ? `<p style="margin: 5px 0;"><strong>Descrição:</strong> ${formData.descricaoTestes}</p>` : ''}
          </div>
        </div>
      `;
      break;
    
    case 'PASSWORD':
      specificSection = `
        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #dc2626; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">🔐 Dados da Licença</h3>
          <div style="display: grid; gap: 10px;">
            <p style="margin: 5px 0;"><strong>Motivo da Solicitação:</strong> ${motivo}</p>
            ${formData.previsaoFaturamento ? `<p style="margin: 5px 0;"><strong>Previsão de Faturamento:</strong> ${formData.previsaoFaturamento}</p>` : ''}
            ${formData.numeroBO ? `<p style="margin: 5px 0;"><strong>Número do BO:</strong> ${formData.numeroBO}</p>` : ''}
            ${formData.documentacaoObrigatoria ? `<p style="margin: 5px 0;"><strong>Documentação Obrigatória:</strong> ${formData.documentacaoObrigatoria ? 'Sim' : 'Não'}</p>` : ''}
            ${formData.descricaoTestes ? `<p style="margin: 5px 0;"><strong>Descrição:</strong> ${formData.descricaoTestes}</p>` : ''}
          </div>
        </div>
      `;
      break;
    
    case 'INSTALACAO_DEMO':
      specificSection = `
        <div style="background: #f3e8ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #7c3aed; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">📦 Dados da Instalação Demo</h3>
          <div style="display: grid; gap: 10px;">
            <p style="margin: 5px 0;"><strong>Motivo da Solicitação:</strong> ${motivo}</p>
            ${formData.usoHumanoVeterinario ? `<p style="margin: 5px 0;"><strong>Modo de Uso:</strong> ${formData.usoHumanoVeterinario}</p>` : ''}
            ${formData.descricaoTestes ? `<p style="margin: 5px 0;"><strong>Descrição/Testes:</strong> ${formData.descricaoTestes}</p>` : ''}
            ${formData.numeroBO ? `<p style="margin: 5px 0;"><strong>Número do BO:</strong> ${formData.numeroBO}</p>` : ''}
            ${formData.dataInicial ? `<p style="margin: 5px 0;"><strong>Data Início:</strong> ${formData.dataInicial}</p>` : ''}
            ${formData.dataFinal ? `<p style="margin: 5px 0;"><strong>Data Fim:</strong> ${formData.dataFinal}</p>` : ''}
            ${formData.responsavelInstalacao ? `<p style="margin: 5px 0;"><strong>Responsável Instalação:</strong> ${formData.responsavelInstalacao}</p>` : ''}
          </div>
        </div>
      `;
      break;
    
    case 'DEMONSTRACAO':
      specificSection = `
        <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="color: #059669; margin: 0 0 15px 0; font-size: 18px; font-weight: bold;">📺 Dados da Demonstração</h3>
          <div style="display: grid; gap: 10px;">
            ${formData.justificativaDemo ? `<p style="margin: 5px 0;"><strong>Justificativa:</strong> ${formData.justificativaDemo}</p>` : ''}
            ${formData.descricaoEquipamento ? `<p style="margin: 5px 0;"><strong>Descrição do Equipamento:</strong> ${formData.descricaoEquipamento}</p>` : ''}
            ${formData.cronogramaInicio ? `<p style="margin: 5px 0;"><strong>Data Início:</strong> ${formData.cronogramaInicio}</p>` : ''}
            ${formData.cronogramaFim ? `<p style="margin: 5px 0;"><strong>Data Fim:</strong> ${formData.cronogramaFim}</p>` : ''}
            ${formData.ativo ? `<p style="margin: 5px 0;"><strong>Ativo:</strong> ${formData.ativo}</p>` : ''}
            ${formData.necessarioApplicationSamsung ? `<p style="margin: 5px 0;"><strong>Necessário Application Samsung:</strong> ${formData.necessarioApplicationSamsung}</p>` : ''}
            ${formData.usoHumanoVeterinario ? `<p style="margin: 5px 0;"><strong>Modo de Uso:</strong> ${formData.usoHumanoVeterinario}</p>` : ''}
          </div>
        </div>
      `;
      break;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Solicitação - ${motivo}</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 20px; background: #ffffff;">
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #6366f1 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
        <h1 style="margin: 0; font-size: 28px; font-weight: bold;">Rep - SOLICITAÇÃO DEMO</h1>
        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Sistema de Gestão Empresarial</p>
        <div style="background: rgba(255,255,255,0.2); padding: 8px 16px; border-radius: 20px; display: inline-block; margin-top: 15px;">
          <span style="font-size: 14px; font-weight: bold;">${motivo}</span>
        </div>
      </div>

      <!-- Cliente Section -->
      <div style="background: #ffffff; padding: 25px; border-radius: 12px; margin-bottom: 20px; border: 1px solid #e5e7eb; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
        <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 22px; font-weight: bold; border-bottom: 2px solid #3b82f6; padding-bottom: 10px;">👤 Dados do Cliente</h2>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
          <p style="margin: 8px 0; background: #f9fafb; padding: 10px; border-radius: 6px;"><strong style="color: #374151;">Nome/Razão Social:</strong><br>${cliente}</p>
          <p style="margin: 8px 0; background: #f9fafb; padding: 10px; border-radius: 6px;"><strong style="color: #374151;">CPF/CNPJ:</strong><br>${cpfCnpj}</p>
          <p style="margin: 8px 0; background: #f9fafb; padding: 10px; border-radius: 6px;"><strong style="color: #374151;">Telefone 1:</strong><br>${telefone1}</p>
          <p style="margin: 8px 0; background: #f9fafb; padding: 10px; border-radius: 6px;"><strong style="color: #374151;">Telefone 2:</strong><br>${telefone2}</p>
          <p style="margin: 8px 0; background: #f9fafb; padding: 10px; border-radius: 6px;"><strong style="color: #374151;">E-mail:</strong><br>${email}</p>
          <p style="margin: 8px 0; background: #f9fafb; padding: 10px; border-radius: 6px;"><strong style="color: #374151;">Responsável:</strong><br>${responsavel}</p>
        </div>
        <p style="margin: 15px 0 0 0; background: #f9fafb; padding: 10px; border-radius: 6px;"><strong style="color: #374151;">Endereço:</strong><br>${endereco}</p>
      </div>

      ${equipmentSection}
      ${specificSection}

      <!-- Footer -->
      <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin-top: 30px; border: 1px solid #e5e7eb;">
        <p style="margin: 0; color: #6b7280; font-size: 14px;">
          <strong>Rep - Sistema de Gestão Empresarial</strong><br>
          Email gerado automaticamente em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}
        </p>
      </div>
    </body>
    </html>
  `;
};

export const sendEmailViaOutlook = async (formData: FormData, formType: FormType, motivo: string): Promise<void> => {
  // Recuperar configurações de email
  const emailConfig = localStorage.getItem('miniescopo_email_config');
  let config = null;
  
  if (emailConfig) {
    const configs = JSON.parse(emailConfig);
    config = configs[formType];
  }

  const subject = generateEmailSubject(formData, motivo);
  const htmlBody = generateEmailHTML(formData, formType, motivo);
  
  // Gerar lista de destinatários
  const toEmails = config?.toEmails?.join(';') || 'vendas@empresa.com';
  const ccEmails = config?.ccEmails?.join(';') || '';

  // Criar URL do Outlook
  const outlookUrl = `outlook:?to=${encodeURIComponent(toEmails)}&cc=${encodeURIComponent(ccEmails)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(htmlBody)}`;
  
  try {
    // Tentar abrir o Outlook
    window.location.href = outlookUrl;
    
    // Fallback: se não conseguir abrir o Outlook, mostrar modal com o conteúdo
    setTimeout(() => {
      const newWindow = window.open('', '_blank', 'width=800,height=600');
      if (newWindow) {
        newWindow.document.write(htmlBody);
        newWindow.document.close();
      }
    }, 1000);
    
  } catch (error) {
    console.error('Erro ao abrir Outlook:', error);
    
    // Fallback: abrir em nova janela
    const newWindow = window.open('', '_blank', 'width=800,height=600');
    if (newWindow) {
      newWindow.document.write(htmlBody);
      newWindow.document.close();
    }
  }
};

export default { sendEmailViaOutlook };
