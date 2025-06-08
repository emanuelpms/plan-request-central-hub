
import { FormData, FormType } from '../types';

// Função para gerar o corpo do email em HTML puro
const generateEmailBody = (formData: FormData, formType: FormType, motivo: string): string => {
  // Definir variáveis dos dados do cliente
  const cliente = formData.nomeCliente || formData.razaoSocial || 'Cliente';
  const cpfCnpj = formData.cpfCnpj || 'Não informado';
  const telefone1 = formData.telefone1 || 'Não informado';
  const telefone2 = formData.telefone2 || 'Não informado';
  const email = formData.email || 'Não informado';
  const responsavel = formData.responsavel || 'Não informado';
  const setorResponsavel = formData.setorResponsavel || '';
  const dataNascimento = formData.dataNascimento || '';
  const endereco = `${formData.endereco || ''}, ${formData.numero || ''}, ${formData.bairro || ''}, ${formData.cidade || ''} - ${formData.estado || ''}, CEP: ${formData.cep || ''}`.replace(/,\s*,/g, ',').replace(/^,\s*/, '').replace(/,\s*$/, '');

  // Cores baseadas no tipo de formulário
  const getColors = (type: FormType) => {
    switch (type) {
      case 'SERVICE': return { primary: '#2563eb', secondary: '#1d4ed8', bg: '#eff6ff' };
      case 'DEMONSTRACAO': return { primary: '#059669', secondary: '#047857', bg: '#ecfdf5' };
      case 'APLICACAO': return { primary: '#7c3aed', secondary: '#6d28d9', bg: '#f3e8ff' };
      case 'PASSWORD': return { primary: '#ea580c', secondary: '#dc2626', bg: '#fff7ed' };
      case 'INSTALACAO_DEMO': return { primary: '#4f46e5', secondary: '#7c3aed', bg: '#eef2ff' };
      default: return { primary: '#6b7280', secondary: '#4b5563', bg: '#f9fafb' };
    }
  };

  const colors = getColors(formType);
  
  const formTypeLabels = {
    'SERVICE': 'SERVIÇO TÉCNICO',
    'DEMONSTRACAO': 'DEMONSTRAÇÃO',
    'APLICACAO': 'APLICAÇÃO',
    'PASSWORD': 'PASSWORD/LICENÇA',
    'INSTALACAO_DEMO': 'INSTALAÇÃO DEMO'
  };

  return `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f8fafc; }
        .container { max-width: 800px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary}); color: white; padding: 30px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: bold; }
        .header p { margin: 5px 0 0 0; opacity: 0.9; font-size: 16px; }
        .section { margin: 20px; }
        .section-title { background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary}); color: white; padding: 15px; margin: 0 0 20px 0; border-radius: 8px; font-weight: bold; font-size: 16px; }
        .field-row { display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 15px; }
        .field { flex: 1; min-width: 250px; }
        .field-label { font-weight: bold; color: #374151; font-size: 12px; margin-bottom: 5px; display: block; }
        .field-value { background: ${colors.bg}; padding: 12px; border-radius: 6px; border: 1px solid #e5e7eb; font-size: 14px; }
        .full-width { width: 100%; }
        .checkbox-field { display: flex; align-items: center; gap: 8px; }
        .checkbox { width: 16px; height: 16px; }
        .footer { background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #6b7280; }
        .badge { background: ${colors.primary}; color: white; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>${formTypeLabels[formType]}</h1>
            <p>Sistema MiniEscopo - Solicitação de ${motivo}</p>
            <span class="badge">ID: ${Date.now()}</span>
        </div>

        <div class="section">
            <div class="section-title">📋 DADOS DO CLIENTE</div>
            <div class="field-row">
                <div class="field">
                    <span class="field-label">NOME/RAZÃO SOCIAL</span>
                    <div class="field-value">${cliente}</div>
                </div>
                <div class="field">
                    <span class="field-label">CPF/CNPJ</span>
                    <div class="field-value">${cpfCnpj}</div>
                </div>
            </div>
            <div class="field-row">
                <div class="field">
                    <span class="field-label">TELEFONE 1</span>
                    <div class="field-value">${telefone1}</div>
                </div>
                <div class="field">
                    <span class="field-label">TELEFONE 2</span>
                    <div class="field-value">${telefone2}</div>
                </div>
            </div>
            <div class="field-row">
                <div class="field">
                    <span class="field-label">E-MAIL</span>
                    <div class="field-value">${email}</div>
                </div>
                <div class="field">
                    <span class="field-label">RESPONSÁVEL</span>
                    <div class="field-value">${responsavel}</div>
                </div>
            </div>
            ${setorResponsavel ? `
            <div class="field-row">
                <div class="field">
                    <span class="field-label">SETOR DO RESPONSÁVEL</span>
                    <div class="field-value">${setorResponsavel}</div>
                </div>
                ${dataNascimento ? `
                <div class="field">
                    <span class="field-label">DATA DE NASCIMENTO</span>
                    <div class="field-value">${dataNascimento}</div>
                </div>
                ` : ''}
            </div>
            ` : ''}
            <div class="field full-width">
                <span class="field-label">ENDEREÇO COMPLETO</span>
                <div class="field-value">${endereco}</div>
            </div>
        </div>

        <div class="section">
            <div class="section-title">🔧 DADOS DO EQUIPAMENTO</div>
            <div class="field-row">
                <div class="field">
                    <span class="field-label">MODELO</span>
                    <div class="field-value">${formData.modelo || 'Não informado'}</div>
                </div>
                <div class="field">
                    <span class="field-label">SERIAL</span>
                    <div class="field-value">${formData.serial || 'Não informado'}</div>
                </div>
            </div>
            <div class="field full-width">
                <span class="field-label">MOTIVO DA SOLICITAÇÃO</span>
                <div class="field-value">${motivo}</div>
            </div>
            ${formData.usoHumanoVeterinario ? `
            <div class="field">
                <span class="field-label">USO DO EQUIPAMENTO</span>
                <div class="field-value">${formData.usoHumanoVeterinario}</div>
            </div>
            ` : ''}
            ${formData.descricaoTestes ? `
            <div class="field full-width">
                <span class="field-label">DESCRIÇÃO/OBSERVAÇÕES</span>
                <div class="field-value">${formData.descricaoTestes}</div>
            </div>
            ` : ''}
        </div>

        ${formType === 'SERVICE' && formData.motivo === 'Instalação Inicial' ? `
        <div class="section">
            <div class="section-title">⚙️ INSTALAÇÃO INICIAL</div>
            <div class="field-row">
                <div class="field">
                    <span class="field-label">MODELO NOBREAK</span>
                    <div class="field-value">${formData.modeloNobreak || 'Não informado'}</div>
                </div>
                <div class="field">
                    <span class="field-label">MODELO IMPRESSORA</span>
                    <div class="field-value">${formData.modeloImpressora || 'Não informado'}</div>
                </div>
            </div>
            <div class="field-row">
                <div class="checkbox-field">
                    <input type="checkbox" class="checkbox" ${formData.necessarioAplicacao ? 'checked' : ''} disabled>
                    <span>Necessário aplicação</span>
                </div>
                <div class="checkbox-field">
                    <input type="checkbox" class="checkbox" ${formData.necessarioLicenca ? 'checked' : ''} disabled>
                    <span>Necessário licença</span>
                </div>
            </div>
            ${formData.dataAplicacao ? `
            <div class="field">
                <span class="field-label">DATA DA APLICAÇÃO</span>
                <div class="field-value">${formData.dataAplicacao}</div>
            </div>
            ` : ''}
        </div>
        ` : ''}

        ${formType === 'PASSWORD' ? `
        <div class="section">
            <div class="section-title">🔐 DADOS DA LICENÇA</div>
            <div class="field-row">
                <div class="field">
                    <span class="field-label">PREVISÃO DE FATURAMENTO</span>
                    <div class="field-value">${formData.previsaoFaturamento || 'Não informado'}</div>
                </div>
                <div class="field">
                    <span class="field-label">BO</span>
                    <div class="field-value">${formData.numeroBO || 'Não informado'}</div>
                </div>
            </div>
            <div class="checkbox-field">
                <input type="checkbox" class="checkbox" ${formData.documentacaoObrigatoria ? 'checked' : ''} disabled>
                <span>Documentação obrigatória conforme motivo selecionado</span>
            </div>
        </div>
        ` : ''}

        <div class="footer">
            <p><strong>Sistema MiniEscopo v4.9</strong></p>
            <p>Solicitação gerada automaticamente em ${new Date().toLocaleString('pt-BR')}</p>
        </div>
    </div>
</body>
</html>
  `;
};

// Função para abrir o Outlook com JavaScript puro
export const sendEmailViaOutlook = async (formData: FormData, formType: FormType, motivo: string): Promise<void> => {
  try {
    // Buscar configurações de email do localStorage
    const emailConfigs = JSON.parse(localStorage.getItem('miniescopo_email_config') || '{}');
    const config = emailConfigs[formType];

    if (!config) {
      throw new Error('Configuração de email não encontrada para este tipo de formulário');
    }

    // Gerar o corpo do email
    const emailBody = generateEmailBody(formData, formType, motivo);
    
    // Gerar o assunto do email
    const cliente = formData.nomeCliente || formData.razaoSocial || 'Cliente';
    const modelo = formData.modelo || 'Modelo';
    const serial = formData.serial || 'Serial';
    const subject = `${motivo} - ${cliente} - ${modelo} - ${serial}`;

    // Preparar destinatários
    const toEmails = config.toEmails.join(';');
    const ccEmails = config.ccEmails.join(';');

    // Montar a mensagem final
    const finalMessage = config.customMessage ? 
      `${config.customMessage}\n\n${emailBody}` : 
      emailBody;

    // Criar o link mailto com todos os parâmetros
    const mailtoLink = `mailto:${toEmails}?` +
      `cc=${encodeURIComponent(ccEmails)}&` +
      `subject=${encodeURIComponent(subject)}&` +
      `body=${encodeURIComponent(finalMessage)}`;

    // Tentar abrir o Outlook usando diferentes métodos
    const openOutlook = () => {
      // Método 1: Usar window.location
      try {
        window.location.href = mailtoLink;
        return true;
      } catch (e) {
        console.warn('Método 1 falhou:', e);
        return false;
      }
    };

    // Método 2: Criar elemento <a> e clicar
    const openWithAnchor = () => {
      try {
        const link = document.createElement('a');
        link.href = mailtoLink;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        return true;
      } catch (e) {
        console.warn('Método 2 falhou:', e);
        return false;
      }
    };

    // Método 3: Usar ActiveXObject para Windows (se disponível)
    const openWithActiveX = () => {
      try {
        if (typeof (window as any).ActiveXObject !== 'undefined') {
          const outlook = new (window as any).ActiveXObject('Outlook.Application');
          const mailItem = outlook.CreateItem(0); // 0 = olMailItem
          
          mailItem.To = toEmails;
          mailItem.CC = ccEmails;
          mailItem.Subject = subject;
          mailItem.HTMLBody = emailBody;
          
          mailItem.Display(true);
          return true;
        }
        return false;
      } catch (e) {
        console.warn('Método 3 falhou:', e);
        return false;
      }
    };

    // Tentar os métodos em ordem
    let success = false;
    
    // Para HTML emails, primeiro tentar ActiveX (Windows)
    if (navigator.platform.includes('Win')) {
      success = openWithActiveX();
    }
    
    if (!success) {
      success = openOutlook();
    }
    
    if (!success) {
      success = openWithAnchor();
    }

    if (!success) {
      throw new Error('Não foi possível abrir o Microsoft Outlook');
    }

    console.log('Email aberto no Outlook com sucesso');

  } catch (error) {
    console.error('Erro ao enviar email:', error);
    throw error;
  }
};

// Função alternativa para sistemas que não suportam ActiveX
export const createEmailFile = (formData: FormData, formType: FormType, motivo: string): void => {
  try {
    const emailBody = generateEmailBody(formData, formType, motivo);
    const cliente = formData.nomeCliente || formData.razaoSocial || 'Cliente';
    const modelo = formData.modelo || 'Modelo';
    const serial = formData.serial || 'Serial';
    const subject = `${motivo} - ${cliente} - ${modelo} - ${serial}`;

    // Criar arquivo .eml para download
    const emlContent = `Subject: ${subject}
MIME-Version: 1.0
Content-Type: text/html; charset=UTF-8

${emailBody}`;

    const blob = new Blob([emlContent], { type: 'message/rfc822' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${subject}.eml`;
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
    
    console.log('Arquivo .eml criado para download');
  } catch (error) {
    console.error('Erro ao criar arquivo de email:', error);
    throw error;
  }
};
