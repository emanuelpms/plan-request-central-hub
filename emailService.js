
// Email Service for MiniEscopo System
class EmailService {
    constructor() {
        this.config = this.loadConfig();
    }
    
    loadConfig() {
        const saved = localStorage.getItem('email_config');
        return saved ? JSON.parse(saved) : {
            from: '',
            to: '',
            smtpServer: 'smtp.outlook.com',
            smtpPort: 587,
            enabled: false
        };
    }
    
    saveConfig(config) {
        this.config = { ...this.config, ...config };
        localStorage.setItem('email_config', JSON.stringify(this.config));
    }
    
    async sendEmail(subject, body, attachments = []) {
        try {
            // Create mailto link with enhanced formatting
            const mailtoLink = this.createMailtoLink(subject, body);
            
            // Try to open default email client
            window.location.href = mailtoLink;
            
            return true;
        } catch (error) {
            console.error('Failed to open email client:', error);
            throw new Error('Não foi possível abrir o cliente de email padrão');
        }
    }
    
    createMailtoLink(subject, body) {
        const config = this.config;
        const to = config.to || '';
        
        const encodedSubject = encodeURIComponent(subject);
        const encodedBody = encodeURIComponent(body);
        
        return `mailto:${to}?subject=${encodedSubject}&body=${encodedBody}`;
    }
    
    generateEmailBody(formData, formType) {
        const typeLabels = {
            service: 'SERVIÇO TÉCNICO',
            demonstracao: 'DEMONSTRAÇÃO',
            aplicacao: 'APLICAÇÃO',
            password: 'PASSWORD/LICENÇA',
            instalacao: 'INSTALAÇÃO DEMO'
        };
        
        const currentDate = new Date();
        const dateStr = currentDate.toLocaleDateString('pt-BR');
        const timeStr = currentDate.toLocaleTimeString('pt-BR');
        
        let emailBody = `SISTEMA MINIESCOPO V4.9\n`;
        emailBody += `═══════════════════════════════════════════════════════════════\n\n`;
        emailBody += `NOVA SOLICITAÇÃO: ${typeLabels[formType]}\n`;
        emailBody += `Data: ${dateStr} às ${timeStr}\n\n`;
        
        emailBody += `DADOS DO CLIENTE\n`;
        emailBody += `─────────────────────────────────────────────────────────────\n`;
        emailBody += `Nome/Razão Social: ${formData.razaoSocial || 'N/A'}\n`;
        emailBody += `CPF/CNPJ: ${formData.cpfCnpj || 'N/A'}\n`;
        emailBody += `Telefone 1: ${formData.telefone1 || 'N/A'}\n`;
        emailBody += `Telefone 2: ${formData.telefone2 || 'N/A'}\n`;
        emailBody += `E-mail: ${formData.email || 'N/A'}\n`;
        emailBody += `Responsável: ${formData.responsavel || 'N/A'}\n`;
        
        if (formData.setorResponsavel) {
            emailBody += `Setor: ${formData.setorResponsavel}\n`;
        }
        
        emailBody += `\nENDEREÇO\n`;
        emailBody += `─────────────────────────────────────────────────────────────\n`;
        emailBody += `CEP: ${formData.cep || 'N/A'}\n`;
        emailBody += `Endereço: ${formData.endereco || 'N/A'}\n`;
        emailBody += `Número: ${formData.numero || 'N/A'}\n`;
        emailBody += `Bairro: ${formData.bairro || 'N/A'}\n`;
        emailBody += `Cidade: ${formData.cidade || 'N/A'}\n`;
        emailBody += `Estado: ${formData.estado || 'N/A'}\n`;
        
        emailBody += `\nDADOS DO EQUIPAMENTO\n`;
        emailBody += `─────────────────────────────────────────────────────────────\n`;
        emailBody += `Modelo: ${formData.modelo || 'N/A'}\n`;
        emailBody += `Serial: ${formData.serial || 'N/A'}\n`;
        emailBody += `Motivo: ${formData.motivo || 'N/A'}\n`;
        
        if (formData.descricaoTestes) {
            emailBody += `Descrição: ${formData.descricaoTestes}\n`;
        }
        
        // Add specific fields based on form type
        emailBody += this.getSpecificFieldsText(formData, formType);
        
        emailBody += `\n═══════════════════════════════════════════════════════════════\n`;
        emailBody += `Este email foi gerado automaticamente pelo Sistema MiniEscopo V4.9\n`;
        emailBody += `Usuário: ${getCurrentUser()?.name || 'N/A'} (${getCurrentUser()?.role || 'N/A'})\n`;
        
        return emailBody;
    }
    
    getSpecificFieldsText(formData, formType) {
        let fields = '';
        
        switch (formType) {
            case 'service':
                fields += `\nDADOS ESPECÍFICOS DO SERVIÇO\n`;
                fields += `─────────────────────────────────────────────────────────────\n`;
                
                if (formData.usoHumanoVeterinario) {
                    fields += `Uso: ${formData.usoHumanoVeterinario}\n`;
                }
                if (formData.modeloImpressora) {
                    fields += `Modelo Impressora: ${formData.modeloImpressora}\n`;
                }
                if (formData.modeloNobreak) {
                    fields += `Modelo Nobreak: ${formData.modeloNobreak}\n`;
                }
                break;
                
            case 'demonstracao':
                fields += `\nDADOS DA DEMONSTRAÇÃO\n`;
                fields += `─────────────────────────────────────────────────────────────\n`;
                
                if (formData.cronogramaInicio) {
                    fields += `Data Início: ${new Date(formData.cronogramaInicio).toLocaleDateString('pt-BR')}\n`;
                }
                if (formData.cronogramaFim) {
                    fields += `Data Fim: ${new Date(formData.cronogramaFim).toLocaleDateString('pt-BR')}\n`;
                }
                if (formData.justificativaDemo) {
                    fields += `Justificativa: ${formData.justificativaDemo}\n`;
                }
                break;
                
            case 'password':
                fields += `\nDADOS DA LICENÇA\n`;
                fields += `─────────────────────────────────────────────────────────────\n`;
                
                if (formData.previsaoFaturamento) {
                    fields += `Previsão Faturamento: ${new Date(formData.previsaoFaturamento).toLocaleDateString('pt-BR')}\n`;
                }
                if (formData.numeroBO) {
                    fields += `BO: ${formData.numeroBO}\n`;
                }
                break;
                
            case 'aplicacao':
                fields += `\nDADOS DA APLICAÇÃO\n`;
                fields += `─────────────────────────────────────────────────────────────\n`;
                
                if (formData.dataAplicacao) {
                    fields += `Data Aplicação: ${new Date(formData.dataAplicacao).toLocaleDateString('pt-BR')}\n`;
                }
                if (formData.numeroBO) {
                    fields += `BO: ${formData.numeroBO}\n`;
                }
                break;
                
            case 'instalacao':
                fields += `\nDADOS DA INSTALAÇÃO\n`;
                fields += `─────────────────────────────────────────────────────────────\n`;
                
                if (formData.dataInicial) {
                    fields += `Data Inicial: ${new Date(formData.dataInicial).toLocaleDateString('pt-BR')}\n`;
                }
                if (formData.dataFinal) {
                    fields += `Data Final: ${new Date(formData.dataFinal).toLocaleDateString('pt-BR')}\n`;
                }
                if (formData.responsavelInstalacao) {
                    fields += `Responsável Instalação: ${formData.responsavelInstalacao}\n`;
                }
                break;
        }
        
        return fields;
    }
}

// Initialize email service
const emailService = new EmailService();

// Setup email configuration form
document.addEventListener('DOMContentLoaded', function() {
    const emailForm = document.getElementById('email-config-form');
    
    if (emailForm) {
        // Load current config
        const config = emailService.config;
        
        // Wait for elements to be available
        setTimeout(() => {
            const emailFromField = document.getElementById('email-from');
            const emailToField = document.getElementById('email-to');
            const smtpServerField = document.getElementById('smtp-server');
            const smtpPortField = document.getElementById('smtp-port');
            
            if (emailFromField) emailFromField.value = config.from || '';
            if (emailToField) emailToField.value = config.to || '';
            if (smtpServerField) smtpServerField.value = config.smtpServer || 'smtp.outlook.com';
            if (smtpPortField) smtpPortField.value = config.smtpPort || 587;
        }, 100);
        
        emailForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const newConfig = {
                from: document.getElementById('email-from').value,
                to: document.getElementById('email-to').value,
                smtpServer: document.getElementById('smtp-server').value,
                smtpPort: parseInt(document.getElementById('smtp-port').value),
                enabled: true
            };
            
            emailService.saveConfig(newConfig);
            closeEmailModal();
            Utils.showToast('Configurações de email salvas com sucesso!', 'success');
        });
    }
});

// Function to send form via email
async function sendFormEmail(formData, formType) {
    const typeLabels = {
        service: 'Serviço Técnico',
        demonstracao: 'Demonstração',
        aplicacao: 'Aplicação',
        password: 'Password/Licença',
        instalacao: 'Instalação Demo'
    };
    
    const subject = `Nova Solicitação: ${typeLabels[formType]} - ${formData.razaoSocial}`;
    const body = emailService.generateEmailBody(formData, formType);
    
    try {
        const success = await emailService.sendEmail(subject, body);
        
        if (success) {
            Utils.showToast('Email sendo aberto no cliente padrão...', 'success');
        }
        
        return success;
    } catch (error) {
        Utils.showToast('Erro: ' + error.message, 'error');
        return false;
    }
}

// Export for use in main app
window.sendFormEmail = sendFormEmail;
window.emailService = emailService;
