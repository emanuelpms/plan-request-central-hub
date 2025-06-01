
import { FormData, FormType } from '../types';

export interface EmailConfiguration {
  formType: FormType;
  toEmails: string[];
  ccEmails: string[];
  subject: string;
  customMessage: string;
}

export class EmailService {
  private getEmailConfig(): Record<FormType, EmailConfiguration> {
    const saved = localStorage.getItem('miniescopo_email_config');
    if (saved) {
      return JSON.parse(saved);
    }
    
    // Configurações padrão
    return {
      SERVICE: {
        formType: 'SERVICE',
        toEmails: ['servico@empresa.com'],
        ccEmails: ['gerencia@empresa.com'],
        subject: 'Solicitação de Serviço Técnico - {razaoSocial}',
        customMessage: 'Prezados,\n\nSegue em anexo solicitação de serviço técnico.\n\nAtenciosamente,'
      },
      DEMONSTRACAO: {
        formType: 'DEMONSTRACAO',
        toEmails: ['vendas@empresa.com'],
        ccEmails: ['gerencia@empresa.com'],
        subject: 'Solicitação de Demonstração - {razaoSocial}',
        customMessage: 'Prezados,\n\nSegue em anexo solicitação de demonstração.\n\nAtenciosamente,'
      },
      APLICACAO: {
        formType: 'APLICACAO',
        toEmails: ['aplicacao@empresa.com'],
        ccEmails: ['gerencia@empresa.com'],
        subject: 'Solicitação de Aplicação - {razaoSocial}',
        customMessage: 'Prezados,\n\nSegue em anexo solicitação de aplicação.\n\nAtenciosamente,'
      },
      PASSWORD: {
        formType: 'PASSWORD',
        toEmails: ['licencas@empresa.com'],
        ccEmails: ['gerencia@empresa.com'],
        subject: 'Solicitação de Licença - {razaoSocial}',
        customMessage: 'Prezados,\n\nSegue em anexo solicitação de licença.\n\nAtenciosamente,'
      },
      INSTALACAO_DEMO: {
        formType: 'INSTALACAO_DEMO',
        toEmails: ['instalacao@empresa.com'],
        ccEmails: ['gerencia@empresa.com'],
        subject: 'Solicitação de Instalação Demo - {razaoSocial}',
        customMessage: 'Prezados,\n\nSegue em anexo solicitação de instalação demo.\n\nAtenciosamente,'
      }
    };
  }

  private replaceVariables(text: string, formData: FormData): string {
    return text
      .replace(/{razaoSocial}/g, formData.razaoSocial || '')
      .replace(/{nomeCliente}/g, formData.nomeCliente || '')
      .replace(/{modelo}/g, formData.modelo || '')
      .replace(/{serial}/g, formData.serial || '')
      .replace(/{responsavel}/g, formData.responsavel || '')
      .replace(/{email}/g, formData.email || '');
  }

  private formatFormDataForEmail(formData: FormData, formType: FormType): string {
    const today = new Date().toLocaleDateString('pt-BR');
    
    let html = `
      <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 800px; margin: 0 auto; background: #f8f9fa;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px; font-weight: bold;">MINIESCOPO SISTEMA</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">Solicitação de ${this.getFormTypeLabel(formType)}</p>
        </div>
        
        <div style="background: white; padding: 30px; margin: 20px; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          <div style="border-left: 4px solid #667eea; padding-left: 20px; margin-bottom: 30px;">
            <h2 style="color: #2d3748; margin: 0 0 10px 0; font-size: 20px;">Dados do Cliente</h2>
            <p style="color: #718096; margin: 0; font-size: 14px;">Informações principais do solicitante</p>
          </div>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <tr style="background: #f7fafc;">
              <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold; color: #2d3748; width: 200px;">Razão Social:</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; color: #4a5568;">${formData.razaoSocial || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold; color: #2d3748;">Nome do Cliente:</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; color: #4a5568;">${formData.nomeCliente || 'N/A'}</td>
            </tr>
            <tr style="background: #f7fafc;">
              <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold; color: #2d3748;">CPF/CNPJ:</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; color: #4a5568;">${formData.cpfCnpj || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold; color: #2d3748;">Telefone 1:</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; color: #4a5568;">${formData.telefone1 || 'N/A'}</td>
            </tr>
            <tr style="background: #f7fafc;">
              <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold; color: #2d3748;">Telefone 2:</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; color: #4a5568;">${formData.telefone2 || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold; color: #2d3748;">Email:</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; color: #4a5568;">${formData.email || 'N/A'}</td>
            </tr>
            <tr style="background: #f7fafc;">
              <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold; color: #2d3748;">Responsável:</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; color: #4a5568;">${formData.responsavel || 'N/A'}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold; color: #2d3748;">Endereço:</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; color: #4a5568;">${this.formatAddress(formData)}</td>
            </tr>
          </table>
    `;

    // Adicionar dados específicos do equipamento
    html += this.getEquipmentSection(formData, formType);

    html += `
          <div style="background: #f7fafc; padding: 20px; border-radius: 8px; margin-top: 30px; border-left: 4px solid #48bb78;">
            <p style="margin: 0; color: #2d3748; font-size: 14px;"><strong>Data da Solicitação:</strong> ${today}</p>
            <p style="margin: 5px 0 0 0; color: #718096; font-size: 12px;">Gerado automaticamente pelo Sistema MiniEscopo</p>
          </div>
        </div>
        
        <div style="text-align: center; padding: 20px; color: #718096; font-size: 12px;">
          <p style="margin: 0;">© 2024 Sistema MiniEscopo - Gestão Empresarial</p>
        </div>
      </div>
    `;

    return html;
  }

  private formatAddress(formData: FormData): string {
    const parts = [
      formData.endereco,
      formData.numero,
      formData.bairro,
      formData.cidade,
      formData.estado,
      formData.cep
    ].filter(Boolean);
    
    return parts.join(', ') || 'N/A';
  }

  private getEquipmentSection(formData: FormData, formType: FormType): string {
    let html = `
      <div style="border-left: 4px solid #ed8936; padding-left: 20px; margin-bottom: 20px;">
        <h2 style="color: #2d3748; margin: 0 0 10px 0; font-size: 20px;">Dados do Equipamento</h2>
        <p style="color: #718096; margin: 0; font-size: 14px;">Informações técnicas da solicitação</p>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
        <tr style="background: #f7fafc;">
          <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold; color: #2d3748; width: 200px;">Modelo:</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0; color: #4a5568;">${formData.modelo || 'N/A'}</td>
        </tr>
        <tr>
          <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold; color: #2d3748;">Serial:</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0; color: #4a5568;">${formData.serial || 'N/A'}</td>
        </tr>
        <tr style="background: #f7fafc;">
          <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold; color: #2d3748;">Motivo:</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0; color: #4a5568;">${formData.motivo || 'N/A'}</td>
        </tr>
    `;

    // Adicionar campos específicos por tipo de formulário
    switch (formType) {
      case 'SERVICE':
        if (formData.modeloNobreak) {
          html += `
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold; color: #2d3748;">Modelo Nobreak:</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; color: #4a5568;">${formData.modeloNobreak}</td>
            </tr>
          `;
        }
        if (formData.modeloImpressora) {
          html += `
            <tr style="background: #f7fafc;">
              <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold; color: #2d3748;">Modelo Impressora:</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; color: #4a5568;">${formData.modeloImpressora}</td>
            </tr>
          `;
        }
        break;
      
      case 'PASSWORD':
        if (formData.previsaoFaturamento) {
          html += `
            <tr>
              <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold; color: #2d3748;">Previsão Faturamento:</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; color: #4a5568;">${new Date(formData.previsaoFaturamento).toLocaleDateString('pt-BR')}</td>
            </tr>
          `;
        }
        if (formData.numeroBO) {
          html += `
            <tr style="background: #f7fafc;">
              <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold; color: #2d3748;">BO:</td>
              <td style="padding: 12px; border: 1px solid #e2e8f0; color: #4a5568;">${formData.numeroBO}</td>
            </tr>
          `;
        }
        break;
    }

    if (formData.descricaoTestes) {
      html += `
        <tr>
          <td style="padding: 12px; border: 1px solid #e2e8f0; font-weight: bold; color: #2d3748; vertical-align: top;">Descrição:</td>
          <td style="padding: 12px; border: 1px solid #e2e8f0; color: #4a5568;">${formData.descricaoTestes.replace(/\n/g, '<br>')}</td>
        </tr>
      `;
    }

    html += '</table>';
    return html;
  }

  private getFormTypeLabel(formType: FormType): string {
    const labels: Record<FormType, string> = {
      SERVICE: 'Serviço Técnico',
      DEMONSTRACAO: 'Demonstração',
      APLICACAO: 'Aplicação',
      PASSWORD: 'Password/Licença',
      INSTALACAO_DEMO: 'Instalação Demo'
    };
    return labels[formType];
  }

  public sendEmail(formData: FormData, formType: FormType, attachments: File[] = []): void {
    const configs = this.getEmailConfig();
    const config = configs[formType];
    
    const subject = this.replaceVariables(config.subject, formData);
    const customMessage = this.replaceVariables(config.customMessage, formData);
    const emailBody = this.formatFormDataForEmail(formData, formType);
    
    const fullBody = `${customMessage}\n\n${emailBody}`;
    
    // Criar URL do Outlook
    const outlookUrl = this.createOutlookUrl({
      to: config.toEmails.join(';'),
      cc: config.ccEmails.join(';'),
      subject: subject,
      body: fullBody
    });
    
    // Abrir Outlook
    window.open(outlookUrl, '_blank');
  }

  private createOutlookUrl(params: {
    to: string;
    cc?: string;
    subject: string;
    body: string;
  }): string {
    const url = new URL('mailto:' + params.to);
    url.searchParams.set('subject', params.subject);
    url.searchParams.set('body', params.body);
    if (params.cc) {
      url.searchParams.set('cc', params.cc);
    }
    return url.toString();
  }
}

export const emailService = new EmailService();
