
// Email Service for Microsoft Outlook Integration
window.EmailService = {
    // Get email configurations from localStorage
    getEmailConfig(formType) {
        const configs = JSON.parse(localStorage.getItem('miniescopo_email_config') || '{}');
        return configs[formType];
    },

    // Check if service is configured
    isConfigured() {
        const configs = JSON.parse(localStorage.getItem('miniescopo_email_config') || '{}');
        return Object.keys(configs).length > 0;
    },

    // Generate HTML email body with exact form layout
    generateEmailBody(formData, formType, motivo) {
        const cliente = formData.nomeCliente || formData.razaoSocial || 'Cliente';
        const cpfCnpj = formData.cpfCnpj || 'Não informado';
        const telefone1 = formData.telefone1 || 'Não informado';
        const telefone2 = formData.telefone2 || 'Não informado';
        const email = formData.email || 'Não informado';
        const responsavel = formData.responsavel || 'Não informado';
        const setorResponsavel = formData.setorResponsavel || '';
        const dataNascimento = formData.dataNascimento || '';
        const endereco = `${formData.endereco || ''}, ${formData.numero || ''}, ${formData.bairro || ''}, ${formData.cidade || ''} - ${formData.estado || ''}, CEP: ${formData.cep || ''}`.replace(/,\s*,/g, ',').replace(/^,\s*/, '').replace(/,\s*$/, '');

        // Colors based on form type
        const colors = this.getFormColors(formType);
        
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
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <style type="text/css">
        body { font-family: Arial, Helvetica, sans-serif !important; margin: 0 !important; padding: 20px !important; background-color: #f8fafc !important; }
        .container { max-width: 800px !important; margin: 0 auto !important; background: white !important; border-radius: 12px !important; overflow: hidden !important; box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important; }
        .header { background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary}) !important; color: white !important; padding: 30px !important; text-align: center !important; }
        .header h1 { margin: 0 !important; font-size: 28px !important; font-weight: bold !important; color: white !important; }
        .header p { margin: 5px 0 0 0 !important; opacity: 0.9 !important; font-size: 16px !important; color: white !important; }
        .section { margin: 20px !important; }
        .section-title { background: linear-gradient(135deg, ${colors.primary}, ${colors.secondary}) !important; color: white !important; padding: 15px !important; margin: 0 0 20px 0 !important; border-radius: 8px !important; font-weight: bold !important; font-size: 16px !important; }
        .field-row { display: block !important; margin-bottom: 15px !important; }
        .field { display: block !important; margin-bottom: 10px !important; }
        .field-label { font-weight: bold !important; color: #374151 !important; font-size: 13px !important; margin-bottom: 5px !important; display: block !important; }
        .field-value { background: ${colors.bg} !important; padding: 12px !important; border-radius: 6px !important; border: 1px solid #e5e7eb !important; font-size: 14px !important; display: block !important; }
        .full-width { width: 100% !important; }
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
    },

    getFormColors(formType) {
        switch (formType) {
            case 'SERVICE': return { primary: '#2563eb', secondary: '#1d4ed8', bg: '#eff6ff' };
            case 'DEMONSTRACAO': return { primary: '#059669', secondary: '#047857', bg: '#ecfdf5' };
            case 'APLICACAO': return { primary: '#7c3aed', secondary: '#6d28d9', bg: '#f3e8ff' };
            case 'PASSWORD': return { primary: '#ea580c', secondary: '#dc2626', bg: '#fff7ed' };
            case 'INSTALACAO_DEMO': return { primary: '#4f46e5', secondary: '#7c3aed', bg: '#eef2ff' };
            default: return { primary: '#6b7280', secondary: '#4b5563', bg: '#f9fafb' };
        }
    },

    // Main function to send email via Outlook
    async sendEmail(formData, formType, motivo) {
        try {
            // Get email configuration
            let config = this.getEmailConfig(formType);
            
            // Se não há configuração, usar padrão
            if (!config) {
                const defaultConfigs = {
                    'SERVICE': {
                        toEmails: ['servico@samsung.com'],
                        ccEmails: ['backoffice@samsung.com'],
                        customMessage: 'Nova solicitação de serviço técnico:'
                    },
                    'DEMONSTRACAO': {
                        toEmails: ['demo@samsung.com'],
                        ccEmails: ['vendas@samsung.com'],
                        customMessage: 'Nova solicitação de demonstração:'
                    },
                    'APLICACAO': {
                        toEmails: ['aplicacao@samsung.com'],
                        ccEmails: ['suporte@samsung.com'],
                        customMessage: 'Nova solicitação de aplicação:'
                    }
                };
                
                config = defaultConfigs[formType];
                if (!config) {
                    throw new Error('Tipo de formulário não reconhecido');
                }
            }

            // Generate email content
            const emailBody = this.generateEmailBody(formData, formType, motivo);
            
            // Generate subject
            const cliente = formData.nomeCliente || formData.razaoSocial || 'Cliente';
            const modelo = formData.modelo || 'Modelo';
            const serial = formData.serial || 'Serial';
            const subject = `${motivo} - ${cliente} - ${modelo} - ${serial}`;

            // Prepare recipients
            const toEmails = config.toEmails.join(';');
            const ccEmails = config.ccEmails.join(';');

            // Prepare final message
            const finalMessage = config.customMessage ? 
                `${config.customMessage}\n\n${emailBody}` : 
                emailBody;

            // Try multiple methods to open Outlook
            const success = await this.openOutlook(toEmails, ccEmails, subject, finalMessage);
            
            if (!success) {
                throw new Error('Não foi possível abrir o Microsoft Outlook');
            }

            console.log('Email aberto no Outlook com sucesso');

        } catch (error) {
            console.error('Erro ao enviar email:', error);
            throw error;
        }
    },

    // Tentar abrir Outlook usando vários métodos
    async openOutlook(toEmails, ccEmails, subject, body) {
        console.log('Tentando abrir Outlook...');
        console.log('Configuração:', { toEmails, ccEmails, subject });
        
        // Criar arquivo .eml primeiro (será baixado automaticamente)
        this.createEmailFile({ subject, body, toEmails, ccEmails }, 'EMAIL', subject);
        
        // Método 1: Tentar ActiveX (funciona apenas no Windows/IE com Outlook instalado)
        try {
            if (this.tryActiveXOutlook(toEmails, ccEmails, subject, body)) {
                console.log('Email aberto via ActiveX');
                return true;
            }
        } catch (e) {
            console.warn('ActiveX falhou:', e);
        }
        
        // Método 2: Tentar via link direto do Windows
        try {
            const outlookUrl = `outlook:?to=${encodeURIComponent(toEmails)}&cc=${encodeURIComponent(ccEmails)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            window.location.href = outlookUrl;
            console.log('Tentativa de abertura direta do Outlook');
            return true;
        } catch (e) {
            console.warn('Link direto do Outlook falhou:', e);
        }
        
        // Método 3: Fallback para mailto
        try {
            const plainTextBody = this.convertHtmlToPlainText(body);
            const mailtoLink = `mailto:${toEmails}?cc=${encodeURIComponent(ccEmails)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(plainTextBody)}`;
            window.open(mailtoLink, '_blank');
            console.log('Email aberto via mailto');
            return true;
        } catch (e) {
            console.warn('Mailto falhou:', e);
        }
        
        console.warn('Nenhum método de abertura do Outlook funcionou');
        return false;
    },

    tryActiveXOutlook(toEmails, ccEmails, subject, body) {
        try {
            if (typeof window.ActiveXObject !== 'undefined' || 'ActiveXObject' in window) {
                const outlook = new ActiveXObject('Outlook.Application');
                const mailItem = outlook.CreateItem(0); // 0 = olMailItem
                
                mailItem.To = toEmails;
                mailItem.CC = ccEmails;
                mailItem.Subject = subject;
                
                // Preservar assinatura existente do Outlook
                mailItem.Display(false); // Não mostrar ainda
                const currentSignature = mailItem.HTMLBody; // Capturar a assinatura atual
                
                // Combinar o corpo formatado com a assinatura
                if (currentSignature && currentSignature.trim()) {
                    mailItem.HTMLBody = body + '<br><br>' + currentSignature;
                } else {
                    mailItem.HTMLBody = body;
                }
                
                mailItem.Display(true); // Agora mostrar com tudo formatado
                return true;
            }
            return false;
        } catch (e) {
            console.warn('ActiveX method failed:', e);
            return false;
        }
    },

    tryMailtoAnchor(toEmails, ccEmails, subject, body) {
        try {
            // Para mailto, criar uma versão mais compatível mas ainda formatada
            const plainTextBody = this.convertHtmlToPlainText(body);
            
            const mailtoLink = `mailto:${toEmails}?` +
                `cc=${encodeURIComponent(ccEmails)}&` +
                `subject=${encodeURIComponent(subject)}&` +
                `body=${encodeURIComponent(plainTextBody)}`;
            
            const link = document.createElement('a');
            link.href = mailtoLink;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            return true;
        } catch (e) {
            console.warn('Anchor method failed:', e);
            return false;
        }
    },

    tryWindowLocation(toEmails, ccEmails, subject, body) {
        try {
            const mailtoLink = `mailto:${toEmails}?` +
                `cc=${encodeURIComponent(ccEmails)}&` +
                `subject=${encodeURIComponent(subject)}&` +
                `body=${encodeURIComponent(body)}`;
            
            window.location.href = mailtoLink;
            return true;
        } catch (e) {
            console.warn('Window location method failed:', e);
            return false;
        }
    },

    // Converter HTML para texto formatado (fallback para mailto)
    convertHtmlToPlainText(html) {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        // Remover scripts e styles
        const scripts = tempDiv.querySelectorAll('script, style');
        scripts.forEach(el => el.remove());
        
        // Converter quebras de linha
        const content = tempDiv.textContent || tempDiv.innerText || '';
        return content.replace(/\s+/g, ' ').trim();
    },

    // Create .eml file for download with proper Outlook formatting
    createEmailFile(emailData, formType, motivo) {
        try {
            let emailBody, subject, toEmails, ccEmails;
            
            // Se for dados diretos do email
            if (emailData.subject && emailData.body) {
                subject = emailData.subject;
                emailBody = emailData.body;
                toEmails = emailData.toEmails || '';
                ccEmails = emailData.ccEmails || '';
            } else {
                // Se for dados do formulário
                emailBody = this.generateEmailBody(emailData, formType, motivo);
                const cliente = emailData.nomeCliente || emailData.razaoSocial || 'Cliente';
                const modelo = emailData.modelo || 'Modelo';
                const serial = emailData.serial || 'Serial';
                subject = `${motivo} - ${cliente} - ${modelo} - ${serial}`;
                
                const config = this.getEmailConfig(formType);
                toEmails = config?.toEmails?.join(';') || '';
                ccEmails = config?.ccEmails?.join(';') || '';
            }

            // Create proper .eml file content with Outlook headers
            const emlContent = `To: ${toEmails}
Cc: ${ccEmails}
Subject: ${subject}
MIME-Version: 1.0
Content-Type: text/html; charset=UTF-8
Content-Transfer-Encoding: 8bit
X-Mailer: Mini Escopo System

${emailBody}`;

            const blob = new Blob([emlContent], { type: 'message/rfc822' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `Solicitacao_${Date.now()}.eml`;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            
            URL.revokeObjectURL(url);
            
            console.log('Arquivo .eml criado para download');
            alert('Arquivo de email (.eml) foi baixado! Abra o arquivo para enviar pelo Outlook.');
        } catch (error) {
            console.error('Erro ao criar arquivo de email:', error);
            throw error;
        }
    }
};

// Make EmailService available globally
window.EmailService = EmailService;
