import { FormData, FormType } from '../types';

// Função para gerar o título do email conforme solicitado: Motivo - Cliente - Modelo - Serial
const generateEmailSubject = (formData: FormData, motivo: string): string => {
  const cliente = formData.nomeCliente || formData.razaoSocial || 'Cliente';
  const modelo = formData.modelo || 'Modelo não especificado';
  const serial = formData.serial || 'Serial não especificado';
  
  return `${motivo} - ${cliente} - ${modelo} - ${serial}`;
};

// Template que replica exatamente o layout da tela com cores e design
const generateEmailHTML = (formData: FormData, formType: FormType, motivo: string): string => {
  // Cores e gradientes baseados no tipo de formulário
  const getThemeColors = (type: FormType) => {
    switch (type) {
      case 'SERVICE':
        return {
          headerGradient: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 50%, #1d4ed8 100%)',
          sectionGradient: 'linear-gradient(to right, #7c3aed, #8b5cf6)',
          accentColor: '#3b82f6'
        };
      case 'DEMONSTRACAO':
        return {
          headerGradient: 'linear-gradient(135deg, #059669 0%, #10b981 50%, #047857 100%)',
          sectionGradient: 'linear-gradient(to right, #10b981, #059669)',
          accentColor: '#10b981'
        };
      case 'APLICACAO':
        return {
          headerGradient: 'linear-gradient(135deg, #7c3aed 0%, #8b5cf6 50%, #6d28d9 100%)',
          sectionGradient: 'linear-gradient(to right, #6366f1, #6d28d9)',
          accentColor: '#8b5cf6'
        };
      case 'PASSWORD':
        return {
          headerGradient: 'linear-gradient(135deg, #ea580c 0%, #dc2626 50%, #b91c1c 100%)',
          sectionGradient: 'linear-gradient(to right, #dc2626, #b91c1c)',
          accentColor: '#dc2626'
        };
      case 'INSTALACAO_DEMO':
        return {
          headerGradient: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #7c3aed 100%)',
          sectionGradient: 'linear-gradient(to right, #8b5cf6, #7c3aed)',
          accentColor: '#8b5cf6'
        };
      default:
        return {
          headerGradient: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #6366f1 100%)',
          sectionGradient: 'linear-gradient(to right, #3b82f6, #6366f1)',
          accentColor: '#3b82f6'
        };
    }
  };

  const colors = getThemeColors(formType);

  const getFormTypeLabel = (type: FormType) => {
    switch (type) {
      case 'SERVICE': return 'SERVIÇO TÉCNICO';
      case 'DEMONSTRACAO': return 'DEMONSTRAÇÃO';
      case 'APLICACAO': return 'APLICAÇÃO';
      case 'PASSWORD': return 'PASSWORD/LICENÇA';
      case 'INSTALACAO_DEMO': return 'INSTALAÇÃO DEMO';
      default: return 'FORMULÁRIO';
    }
  };

  // Seção específica baseada no tipo de formulário
  let specificSection = '';
  
  switch (formType) {
    case 'SERVICE':
      specificSection = `
        <div style="background: rgba(255,255,255,0.9); backdrop-filter: blur(4px); border: 0; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border-radius: 12px; margin: 24px 0;">
          <div style="background: ${colors.sectionGradient}; color: white; border-radius: 12px 12px 0 0; padding: 16px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 18px;">🔧</span>
              <h3 style="margin: 0; font-size: 18px; font-weight: bold;">DADOS DO EQUIPAMENTO</h3>
            </div>
          </div>
          <div style="padding: 24px; space-y: 16px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
              ${formData.modelo ? `<div style="background: #f8fafc; padding: 12px; border-radius: 8px;"><strong style="color: #374151;">MODELO:</strong><br/>${formData.modelo}</div>` : ''}
              ${formData.serial ? `<div style="background: #f8fafc; padding: 12px; border-radius: 8px;"><strong style="color: #374151;">SERIAL:</strong><br/>${formData.serial}</div>` : ''}
            </div>
            ${formData.motivo ? `<div style="background: #f8fafc; padding: 12px; border-radius: 8px; margin-bottom: 16px;"><strong style="color: #374151;">MOTIVO DA SOLICITAÇÃO:</strong><br/>${formData.motivo}</div>` : ''}
            ${formData.modeloNobreak && formData.motivo === 'Instalação Inicial' ? `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;"><div style="background: #f8fafc; padding: 12px; border-radius: 8px;"><strong style="color: #374151;">MODELO NOBREAK:</strong><br/>${formData.modeloNobreak}</div><div style="background: #f8fafc; padding: 12px; border-radius: 8px;"><strong style="color: #374151;">MODELO DE IMPRESSORA:</strong><br/>${formData.modeloImpressora || ''}</div></div>` : ''}
            ${formData.documentacaoObrigatoria !== undefined ? `<div style="background: #f8fafc; padding: 12px; border-radius: 8px; margin-bottom: 16px;"><strong style="color: #374151;">DOCUMENTAÇÃO OBRIGATÓRIA:</strong><br/>${formData.documentacaoObrigatoria ? 'Sim' : 'Não'}</div>` : ''}
            ${formData.usoHumanoVeterinario ? `<div style="background: #f8fafc; padding: 12px; border-radius: 8px; margin-bottom: 16px;"><strong style="color: #374151;">MODO DE USO DO EQUIPAMENTO:</strong><br/>${formData.usoHumanoVeterinario}</div>` : ''}
            ${formData.necessarioAplicacao !== undefined && formData.motivo === 'Instalação Inicial' ? `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;"><div style="background: #f8fafc; padding: 12px; border-radius: 8px;"><strong style="color: #374151;">NECESSÁRIO APLICAÇÃO:</strong><br/>${formData.necessarioAplicacao ? 'Sim' : 'Não'}</div><div style="background: #f8fafc; padding: 12px; border-radius: 8px;"><strong style="color: #374151;">NECESSÁRIO LICENÇA:</strong><br/>${formData.necessarioLicenca ? 'Sim' : 'Não'}</div></div>` : ''}
            ${formData.dataAplicacao && formData.necessarioAplicacao ? `<div style="background: #f8fafc; padding: 12px; border-radius: 8px; margin-bottom: 16px;"><strong style="color: #374151;">DATA DA APLICAÇÃO:</strong><br/>${formData.dataAplicacao}</div>` : ''}
            ${formData.descricaoTestes ? `<div style="background: #f8fafc; padding: 12px; border-radius: 8px;"><strong style="color: #374151;">DESCRIÇÃO/TESTES:</strong><br/>${formData.descricaoTestes}</div>` : ''}
          </div>
        </div>
      `;
      break;

    case 'DEMONSTRACAO':
      specificSection = `
        <div style="background: rgba(255,255,255,0.9); backdrop-filter: blur(4px); border: 0; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border-radius: 12px; margin: 24px 0;">
          <div style="background: ${colors.sectionGradient}; color: white; border-radius: 12px 12px 0 0; padding: 16px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 18px;">🔧</span>
              <h3 style="margin: 0; font-size: 18px; font-weight: bold;">DADOS DA DEMONSTRAÇÃO</h3>
            </div>
          </div>
          <div style="padding: 24px; space-y: 16px;">
            ${formData.justificativaDemo ? `<div style="background: #f8fafc; padding: 12px; border-radius: 8px; margin-bottom: 16px;"><strong style="color: #374151;">JUSTIFICATIVA DA DEMONSTRAÇÃO:</strong><br/>${formData.justificativaDemo}</div>` : ''}
            ${formData.descricaoEquipamento ? `<div style="background: #f8fafc; padding: 12px; border-radius: 8px; margin-bottom: 16px;"><strong style="color: #374151;">DESCRIÇÃO DO EQUIPAMENTO:</strong><br/>${formData.descricaoEquipamento}</div>` : ''}
            ${formData.cronogramaInicio && formData.cronogramaFim ? `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;"><div style="background: #f8fafc; padding: 12px; border-radius: 8px;"><strong style="color: #374151;">CRONOGRAMA INÍCIO:</strong><br/>${formData.cronogramaInicio}</div><div style="background: #f8fafc; padding: 12px; border-radius: 8px;"><strong style="color: #374151;">CRONOGRAMA FIM:</strong><br/>${formData.cronogramaFim}</div></div>` : ''}
            ${formData.ativo || formData.necessarioApplicationSamsung || formData.usoHumanoVeterinario ? `<div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 16px;">${formData.ativo ? `<div style="background: #f8fafc; padding: 12px; border-radius: 8px;"><strong style="color: #374151;">ATIVO:</strong><br/>${formData.ativo}</div>` : ''}${formData.necessarioApplicationSamsung ? `<div style="background: #f8fafc; padding: 12px; border-radius: 8px;"><strong style="color: #374151;">NECESSÁRIO APPLICATION SAMSUNG:</strong><br/>${formData.necessarioApplicationSamsung}</div>` : ''}${formData.usoHumanoVeterinario ? `<div style="background: #f8fafc; padding: 12px; border-radius: 8px;"><strong style="color: #374151;">MODO DE USO DO EQUIPAMENTO:</strong><br/>${formData.usoHumanoVeterinario}</div>` : ''}</div>` : ''}
          </div>
        </div>
      `;
      break;

    case 'APLICACAO':
      specificSection = `
        <div style="background: rgba(255,255,255,0.9); backdrop-filter: blur(4px); border: 0; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border-radius: 12px; margin: 24px 0;">
          <div style="background: ${colors.sectionGradient}; color: white; border-radius: 12px 12px 0 0; padding: 16px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 18px;">🔧</span>
              <h3 style="margin: 0; font-size: 18px; font-weight: bold;">DADOS DO EQUIPAMENTO</h3>
            </div>
          </div>
          <div style="padding: 24px; space-y: 16px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
              ${formData.modelo ? `<div style="background: #f8fafc; padding: 12px; border-radius: 8px;"><strong style="color: #374151;">MODELO:</strong><br/>${formData.modelo}</div>` : ''}
              ${formData.serial ? `<div style="background: #f8fafc; padding: 12px; border-radius: 8px;"><strong style="color: #374151;">SERIAL:</strong><br/>${formData.serial}</div>` : ''}
            </div>
            ${formData.motivo ? `<div style="background: #f8fafc; padding: 12px; border-radius: 8px; margin-bottom: 16px;"><strong style="color: #374151;">MOTIVO DA SOLICITAÇÃO:</strong><br/>${formData.motivo}</div>` : ''}
            ${formData.numeroBO && formData.motivo === 'Aplicação Inicial' ? `<div style="background: #f8fafc; padding: 12px; border-radius: 8px; margin-bottom: 16px;"><strong style="color: #374151;">BO:</strong><br/>${formData.numeroBO}</div>` : ''}
            ${formData.dataAplicacao ? `<div style="background: #f8fafc; padding: 12px; border-radius: 8px; margin-bottom: 16px;"><strong style="color: #374151;">DATA DA APLICAÇÃO:</strong><br/>${formData.dataAplicacao}</div>` : ''}
            ${formData.descricaoTestes ? `<div style="background: #f8fafc; padding: 12px; border-radius: 8px;"><strong style="color: #374151;">DESCRIÇÃO:</strong><br/>${formData.descricaoTestes}</div>` : ''}
          </div>
        </div>
      `;
      break;

    case 'PASSWORD':
      specificSection = `
        <div style="background: rgba(255,255,255,0.9); backdrop-filter: blur(4px); border: 0; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border-radius: 12px; margin: 24px 0;">
          <div style="background: ${colors.sectionGradient}; color: white; border-radius: 12px 12px 0 0; padding: 16px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 18px;">🔧</span>
              <h3 style="margin: 0; font-size: 18px; font-weight: bold;">DADOS DO EQUIPAMENTO</h3>
            </div>
          </div>
          <div style="padding: 24px; space-y: 16px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
              ${formData.modelo ? `<div style="background: #f8fafc; padding: 12px; border-radius: 8px;"><strong style="color: #374151;">MODELO:</strong><br/>${formData.modelo}</div>` : ''}
              ${formData.serial ? `<div style="background: #f8fafc; padding: 12px; border-radius: 8px;"><strong style="color: #374151;">SERIAL:</strong><br/>${formData.serial}</div>` : ''}
            </div>
            ${formData.motivo ? `<div style="background: #f8fafc; padding: 12px; border-radius: 8px; margin-bottom: 16px;"><strong style="color: #374151;">MOTIVO DA SOLICITAÇÃO:</strong><br/>${formData.motivo}</div>` : ''}
            ${formData.previsaoFaturamento && formData.numeroBO ? `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;"><div style="background: #f8fafc; padding: 12px; border-radius: 8px;"><strong style="color: #374151;">PREVISÃO DE FATURAMENTO:</strong><br/>${formData.previsaoFaturamento}</div><div style="background: #f8fafc; padding: 12px; border-radius: 8px;"><strong style="color: #374151;">BO:</strong><br/>${formData.numeroBO}</div></div>` : ''}
            ${formData.documentacaoObrigatoria !== undefined ? `<div style="background: #f8fafc; padding: 12px; border-radius: 8px; margin-bottom: 16px;"><strong style="color: #374151;">DOCUMENTAÇÃO OBRIGATÓRIA:</strong><br/>${formData.documentacaoObrigatoria ? 'Sim' : 'Não'}</div>` : ''}
            ${formData.descricaoTestes ? `<div style="background: #f8fafc; padding: 12px; border-radius: 8px;"><strong style="color: #374151;">DESCRIÇÃO:</strong><br/>${formData.descricaoTestes}</div>` : ''}
          </div>
        </div>
      `;
      break;

    case 'INSTALACAO_DEMO':
      specificSection = `
        <div style="background: rgba(255,255,255,0.9); backdrop-filter: blur(4px); border: 0; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border-radius: 12px; margin: 24px 0;">
          <div style="background: ${colors.sectionGradient}; color: white; border-radius: 12px 12px 0 0; padding: 16px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 18px;">🔧</span>
              <h3 style="margin: 0; font-size: 18px; font-weight: bold;">DADOS DO EQUIPAMENTO</h3>
            </div>
          </div>
          <div style="padding: 24px; space-y: 16px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
              ${formData.modelo ? `<div style="background: #f8fafc; padding: 12px; border-radius: 8px;"><strong style="color: #374151;">MODELO:</strong><br/>${formData.modelo}</div>` : ''}
              ${formData.serial ? `<div style="background: #f8fafc; padding: 12px; border-radius: 8px;"><strong style="color: #374151;">SERIAL:</strong><br/>${formData.serial}</div>` : ''}
            </div>
            ${formData.motivo ? `<div style="background: #f8fafc; padding: 12px; border-radius: 8px; margin-bottom: 16px;"><strong style="color: #374151;">MOTIVO DA SOLICITAÇÃO:</strong><br/>${formData.motivo}</div>` : ''}
            ${formData.modeloNobreak && formData.modeloImpressora ? `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;"><div style="background: #f8fafc; padding: 12px; border-radius: 8px;"><strong style="color: #374151;">MODELO NOBREAK:</strong><br/>${formData.modeloNobreak}</div><div style="background: #f8fafc; padding: 12px; border-radius: 8px;"><strong style="color: #374151;">MODELO DE IMPRESSORA:</strong><br/>${formData.modeloImpressora}</div></div>` : ''}
            ${formData.usoHumanoVeterinario ? `<div style="background: #f8fafc; padding: 12px; border-radius: 8px; margin-bottom: 16px;"><strong style="color: #374151;">MODO DE USO DO EQUIPAMENTO:</strong><br/>${formData.usoHumanoVeterinario}</div>` : ''}
            ${formData.descricaoTestes ? `<div style="background: #f8fafc; padding: 12px; border-radius: 8px; margin-bottom: 16px;"><strong style="color: #374151;">DESCRIÇÃO/TESTES:</strong><br/>${formData.descricaoTestes}</div>` : ''}
            ${formData.numeroBO ? `<div style="background: #f8fafc; padding: 12px; border-radius: 8px; margin-bottom: 16px;"><strong style="color: #374151;">BO:</strong><br/>${formData.numeroBO}</div>` : ''}
            ${formData.dataInicial && formData.dataFinal ? `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;"><div style="background: #f8fafc; padding: 12px; border-radius: 8px;"><strong style="color: #374151;">DATA INÍCIO DA DEMONSTRAÇÃO:</strong><br/>${formData.dataInicial}</div><div style="background: #f8fafc; padding: 12px; border-radius: 8px;"><strong style="color: #374151;">DATA FIM DA DEMONSTRAÇÃO:</strong><br/>${formData.dataFinal}</div></div>` : ''}
            ${formData.responsavelInstalacao ? `<div style="background: #f8fafc; padding: 12px; border-radius: 8px;"><strong style="color: #374151;">RESPONSÁVEL PELA INSTALAÇÃO:</strong><br/>${formData.responsavelInstalacao}</div>` : ''}
          </div>
        </div>
      `;
      break;
  }

  // Lista de anexos se existirem
  let attachmentsSection = '';
  if (formData.attachments && formData.attachments.length > 0) {
    attachmentsSection = `
      <div style="background: rgba(255,255,255,0.9); backdrop-filter: blur(4px); border: 0; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border-radius: 12px; margin: 24px 0;">
        <div style="background: linear-gradient(to right, #059669, #10b981); color: white; border-radius: 12px 12px 0 0; padding: 16px;">
          <div style="display: flex; align-items: center; gap: 12px;">
            <span style="font-size: 18px;">📎</span>
            <h3 style="margin: 0; font-size: 18px; font-weight: bold;">ANEXOS</h3>
          </div>
        </div>
        <div style="padding: 24px;">
          <h4 style="color: #374151; margin: 0 0 15px 0; font-weight: 600;">Arquivos Anexados (${formData.attachments.length})</h4>
          ${formData.attachments.map((attachment, index) => `
            <div style="display: flex; align-items: center; justify-content: space-between; padding: 12px; background: #f9fafb; border-radius: 8px; border: 1px solid #e5e7eb; margin-bottom: 8px;">
              <div style="display: flex; align-items: center; gap: 12px;">
                <span style="color: #6b7280;">📄</span>
                <div>
                  <p style="font-weight: 500; color: #1f2937; margin: 0; font-size: 14px;">${attachment.name}</p>
                  <p style="color: #6b7280; margin: 0; font-size: 12px;">${(attachment.size / 1024).toFixed(2)} KB</p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${getFormTypeLabel(formType)} - ${motivo}</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%); min-height: 100vh;">
      <div style="max-width: 896px; margin: 0 auto; background: transparent;">
        
        <!-- Header exato da tela -->
        <div style="background: ${colors.headerGradient}; color: white; box-shadow: 0 10px 40px rgba(0,0,0,0.2); overflow: hidden; border-radius: 12px; margin-bottom: 24px; position: relative;">
          <!-- Background Pattern -->
          <div style="position: absolute; inset: 0; opacity: 0.2;">
            <div style="width: 100%; height: 100%; background-image: url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.1\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E');"></div>
          </div>
          
          <div style="position: relative; padding: 32px;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <div style="display: flex; align-items: center; gap: 24px;">
                <div style="display: flex; align-items: center; gap: 16px;">
                  <div style="position: relative;">
                    <div style="width: 48px; height: 48px; background: linear-gradient(135deg, rgba(59,130,246,0.8) 0%, rgba(37,99,235,0.9) 100%); border-radius: 12px; display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 30px rgba(59,130,246,0.3);">
                      <span style="color: white; font-size: 24px;">⚙️</span>
                    </div>
                    <div style="position: absolute; top: -4px; right: -4px; width: 20px; height: 20px; background: #fbbf24; border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                      <span style="color: #92400e; font-size: 10px;">✨</span>
                    </div>
                  </div>
                  
                  <div>
                    <h1 style="font-size: 32px; font-weight: bold; margin: 0; background: linear-gradient(to right, white, rgba(255,255,255,0.8)); -webkit-background-clip: text; background-clip: text; color: transparent;">
                      Rep - SOLICITAÇÃO DEMO
                    </h1>
                    <div style="display: flex; align-items: center; gap: 12px; margin-top: 4px;">
                      <div style="background: linear-gradient(to right, rgba(59,130,246,0.8), rgba(99,102,241,0.8)); padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: bold; box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                        V4.9
                      </div>
                      <span style="color: rgba(59,130,246,0.8); font-size: 12px; font-weight: 500;">Sistema de Gestão Empresarial</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div style="display: flex; align-items: center; gap: 16px;">
                <div style="display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.1); backdrop-filter: blur(16px); padding: 8px 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.2); box-shadow: 0 4px 15px rgba(0,0,0,0.1);">
                  <span style="font-size: 16px;">📅</span>
                  <span style="font-size: 12px; font-weight: 600;">${new Date().toLocaleDateString('pt-BR')}</span>
                </div>
              </div>
            </div>
            
            <div style="position: absolute; bottom: 0; left: 0; right: 0; height: 4px; background: linear-gradient(to right, #3b82f6, #6366f1, #8b5cf6);"></div>
          </div>
        </div>

        <!-- Card do Tipo de Formulário -->
        <div style="background: ${colors.headerGradient}; border: 0; box-shadow: 0 10px 40px rgba(0,0,0,0.2); color: white; border-radius: 12px; margin-bottom: 24px;">
          <div style="padding: 24px;">
            <div style="display: flex; align-items: center; gap: 16px;">
              <div style="padding: 12px; background: rgba(255,255,255,0.2); border-radius: 12px;">
                <span style="font-size: 32px;">
                  ${formType === 'SERVICE' ? '⚙️' : 
                    formType === 'DEMONSTRACAO' ? '🖥️' :
                    formType === 'APLICACAO' ? '📄' :
                    formType === 'PASSWORD' ? '🔑' : '📦'}
                </span>
              </div>
              <div>
                <h2 style="margin: 0; font-size: 32px; font-weight: bold;">${getFormTypeLabel(formType)}</h2>
                <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 16px;">
                  ${formType === 'SERVICE' ? 'Solicitação de serviço técnico especializado' :
                    formType === 'DEMONSTRACAO' ? 'Agendamento de demonstrações comerciais' :
                    formType === 'APLICACAO' ? 'Solicitação de aplicação técnica' :
                    formType === 'PASSWORD' ? 'Controle de licenças e credenciais' : 'Configuração de ambiente demonstrativo'}
                </p>
              </div>
              <div style="margin-left: auto;">
                <div style="background: rgba(255,255,255,0.2); color: white; border: 0; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: bold;">
                  ATIVO
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Seção de Dados do Cliente -->
        <div style="background: rgba(255,255,255,0.9); backdrop-filter: blur(4px); border: 0; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border-radius: 12px; margin-bottom: 24px;">
          <div style="background: linear-gradient(to right, #2563eb, #3b82f6); color: white; border-radius: 12px 12px 0 0; padding: 16px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 18px;">👤</span>
              <h3 style="margin: 0; font-size: 18px; font-weight: bold;">DADOS DO CLIENTE</h3>
            </div>
          </div>
          <div style="padding: 24px; space-y: 16px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
              ${formData.nomeCliente ? `<div style="background: #f8fafc; padding: 12px; border-radius: 8px;"><strong style="color: #374151;">NOME DO CLIENTE:</strong><br/>${formData.nomeCliente}</div>` : ''}
              <div style="background: #f8fafc; padding: 12px; border-radius: 8px;"><strong style="color: #374151;">RAZÃO SOCIAL:</strong><br/>${cliente}</div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; margin-bottom: 16px;">
              <div style="background: #f8fafc; padding: 12px; border-radius: 8px;"><strong style="color: #374151;">CPF/CNPJ:</strong><br/>${cpfCnpj}</div>
              <div style="background: #f8fafc; padding: 12px; border-radius: 8px;"><strong style="color: #374151;">TELEFONE 1:</strong><br/>${telefone1}</div>
              <div style="background: #f8fafc; padding: 12px; border-radius: 8px;"><strong style="color: #374151;">TELEFONE 2:</strong><br/>${telefone2}</div>
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
              <div style="background: #f8fafc; padding: 12px; border-radius: 8px;"><strong style="color: #374151;">E-MAIL:</strong><br/>${email}</div>
              <div style="background: #f8fafc; padding: 12px; border-radius: 8px;"><strong style="color: #374151;">RESPONSÁVEL:</strong><br/>${responsavel}</div>
            </div>
            ${setorResponsavel || dataNascimento ? `<div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">${setorResponsavel ? `<div style="background: #f8fafc; padding: 12px; border-radius: 8px;"><strong style="color: #374151;">SETOR DO RESPONSÁVEL:</strong><br/>${setorResponsavel}</div>` : ''}${dataNascimento ? `<div style="background: #f8fafc; padding: 12px; border-radius: 8px;"><strong style="color: #374151;">DATA DE NASCIMENTO:</strong><br/>${dataNascimento}</div>` : ''}</div>` : ''}
          </div>
        </div>

        <!-- Seção de Endereço -->
        <div style="background: rgba(255,255,255,0.9); backdrop-filter: blur(4px); border: 0; box-shadow: 0 4px 15px rgba(0,0,0,0.1); border-radius: 12px; margin-bottom: 24px;">
          <div style="background: linear-gradient(to right, #059669, #10b981); color: white; border-radius: 12px 12px 0 0; padding: 16px;">
            <div style="display: flex; align-items: center; gap: 12px;">
              <span style="font-size: 18px;">📍</span>
              <h3 style="margin: 0; font-size: 18px; font-weight: bold;">ENDEREÇO</h3>
            </div>
          </div>
          <div style="padding: 24px;">
            <div style="background: #f8fafc; padding: 12px; border-radius: 8px; margin-bottom: 16px;">
              <strong style="color: #374151;">ENDEREÇO COMPLETO:</strong><br/>${endereco}
            </div>
            ${formData.observacaoEndereco ? `<div style="background: #f8fafc; padding: 12px; border-radius: 8px;"><strong style="color: #374151;">OBSERVAÇÃO DO ENDEREÇO:</strong><br/>${formData.observacaoEndereco}</div>` : ''}
          </div>
        </div>

        ${specificSection}
        ${attachmentsSection}

        <!-- Footer -->
        <div style="background: #f3f4f6; padding: 24px; border-radius: 12px; text-align: center; margin-top: 32px; border: 1px solid #e5e7eb;">
          <p style="margin: 0; color: #6b7280; font-size: 14px;">
            <strong>Rep - Sistema de Gestão Empresarial</strong><br/>
            Email gerado automaticamente via Microsoft Outlook em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
};

export const sendEmailViaOutlook = async (formData: FormData, formType: FormType, motivo: string): Promise<void> => {
  console.log('Iniciando envio via Outlook exclusivo...');
  
  // Recuperar configurações de email do admin
  const emailConfig = localStorage.getItem('miniescopo_email_config');
  let config = null;
  
  if (emailConfig) {
    const configs = JSON.parse(emailConfig);
    config = configs[formType];
  }

  const subject = generateEmailSubject(formData, motivo);
  const htmlBody = generateEmailHTML(formData, formType, motivo);
  
  // Gerar lista de destinatários baseada na configuração do admin
  const toEmails = config?.toEmails?.join(';') || 'contato@empresa.com';
  const ccEmails = config?.ccEmails?.join(';') || '';

  console.log('Configuração de email:', {
    to: toEmails,
    cc: ccEmails,
    subject: subject
  });

  // Criar URL do Outlook (OBRIGATÓRIO uso do Outlook app)
  const outlookUrl = `outlook:?to=${encodeURIComponent(toEmails)}&cc=${encodeURIComponent(ccEmails)}&subject=${encodeURIComponent(subject)}&bodyformat=html&body=${encodeURIComponent(htmlBody)}`;
  
  try {
    console.log('Tentando abrir Microsoft Outlook...');
    
    // Abrir o Microsoft Outlook (OBRIGATÓRIO)
    window.location.href = outlookUrl;
    
    // Timeout para verificar se o Outlook abriu
    setTimeout(() => {
      const confirmOutlook = confirm(
        '🚀 SISTEMA CONFIGURADO PARA MICROSOFT OUTLOOK\n\n' +
        '✅ O Microsoft Outlook deveria ter aberto automaticamente.\n\n' +
        '❌ Se não abriu, clique em OK para ver uma prévia do email.\n\n' +
        '⚠️ IMPORTANTE: Este sistema usa EXCLUSIVAMENTE o Microsoft Outlook para envios.'
      );
      
      if (confirmOutlook) {
        // Mostrar preview do email em nova janela
        const previewWindow = window.open('', '_blank', 'width=1000,height=800,scrollbars=yes,resizable=yes');
        if (previewWindow) {
          previewWindow.document.write(htmlBody);
          previewWindow.document.close();
          previewWindow.document.title = `PREVIEW: ${subject}`;
          
          // Adicionar aviso na preview
          const warningDiv = previewWindow.document.createElement('div');
          warningDiv.style.cssText = 'position: fixed; top: 0; left: 0; right: 0; background: #dc2626; color: white; padding: 10px; text-align: center; font-weight: bold; z-index: 9999;';
          warningDiv.innerHTML = '⚠️ PREVIEW DO EMAIL - Para enviar, use o Microsoft Outlook instalado no computador';
          previewWindow.document.body.insertBefore(warningDiv, previewWindow.document.body.firstChild);
        }
      }
    }, 2000);
    
  } catch (error) {
    console.error('Erro ao abrir Microsoft Outlook:', error);
    
    alert(
      '❌ ERRO AO ABRIR MICROSOFT OUTLOOK\n\n' +
      '🔧 Certifique-se de que o Microsoft Outlook está:\n' +
      '• Instalado no computador\n' +
      '• Configurado com uma conta de email\n' +
      '• Definido como cliente de email padrão\n\n' +
      '📧 Este sistema foi configurado para usar EXCLUSIVAMENTE o Microsoft Outlook.'
    );
  }
};

export default { sendEmailViaOutlook };
