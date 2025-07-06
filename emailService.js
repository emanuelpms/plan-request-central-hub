
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
        if (!this.config.enabled) {
            console.log('Email service not configured');
            return false;
        }
        
        try {
            // This would integrate with actual email service
            // For now, we'll simulate the email sending
            console.log('Sending email:', {
                from: this.config.from,
                to: this.config.to,
                subject: subject,
                body: body,
                attachments: attachments
            });
            
            // Simulate email sending delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            return true;
        } catch (error) {
            console.error('Failed to send email:', error);
            return false;
        }
    }
    
    generateEmailBody(formData, formType) {
        const typeLabels = {
            service: 'SERVIÇO TÉCNICO',
            demonstracao: 'DEMONSTRAÇÃO',
            aplicacao: 'APLICAÇÃO',
            password: 'PASSWORD/LICENÇA',
            instalacao: 'INSTALAÇÃO DEMO'
        };
        
        return `
            <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; }
                        .header { background: #667eea; color: white; padding: 20px; text-align: center; }
                        .content { padding: 20px; }
                        .section { margin: 20px 0; }
                        .field { margin: 10px 0; }
                        .label { font-weight: bold; color: #333; }
                        .value { color: #666; }
                    </style>
                </head>
                <body>
                    <div class="header">
                        <h1>Sistema MiniEscopo V4.9</h1>
                        <h2>Nova Solicitação: ${typeLabels[formType]}</h2>
                        <p>Data: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
                    </div>
                    
                    <div class="content">
                        <div class="section">
                            <h3>Dados do Cliente</h3>
                            <div class="field">
                                <span class="label">Nome/Razão Social:</span>
                                <span class="value">${formData.razaoSocial || ''}</span>
                            </div>
                            <div class="field">
                                <span class="label">CPF/CNPJ:</span>
                                <span class="value">${formData.cpfCnpj || ''}</span>
                            </div>
                            <div class="field">
                                <span class="label">Telefone 1:</span>
                                <span class="value">${formData.telefone1 || ''}</span>
                            </div>
                            <div class="field">
                                <span class="label">Telefone 2:</span>
                                <span class="value">${formData.telefone2 || ''}</span>
                            </div>
                            <div class="field">
                                <span class="label">E-mail:</span>
                                <span class="value">${formData.email || ''}</span>
                            </div>
                            <div class="field">
                                <span class="label">Responsável:</span>
                                <span class="value">${formData.responsavel || ''}</span>
                            </div>
                            ${formData.setorResponsavel ? `
                                <div class="field">
                                    <span class="label">Setor:</span>
                                    <span class="value">${formData.setorResponsavel}</span>
                                </div>
                            ` : ''}
                        </div>
                        
                        <div class="section">
                            <h3>Endereço</h3>
                            <div class="field">
                                <span class="label">CEP:</span>
                                <span class="value">${formData.cep || ''}</span>
                            </div>
                            <div class="field">
                                <span class="label">Endereço:</span>
                                <span class="value">${formData.endereco || ''}</span>
                            </div>
                            <div class="field">
                                <span class="label">Número:</span>
                                <span class="value">${formData.numero || ''}</span>
                            </div>
                            <div class="field">
                                <span class="label">Bairro:</span>
                                <span class="value">${formData.bairro || ''}</span>
                            </div>
                            <div class="field">
                                <span class="label">Cidade:</span>
                                <span class="value">${formData.cidade || ''}</span>
                            </div>
                            <div class="field">
                                <span class="label">Estado:</span>
                                <span class="value">${formData.estado || ''}</span>
                            </div>
                        </div>
                        
                        <div class="section">
                            <h3>Dados do Equipamento</h3>
                            <div class="field">
                                <span class="label">Modelo:</span>
                                <span class="value">${formData.modelo || ''}</span>
                            </div>
                            <div class="field">
                                <span class="label">Serial:</span>
                                <span class="value">${formData.serial || ''}</span>
                            </div>
                            <div class="field">
                                <span class="label">Motivo:</span>
                                <span class="value">${formData.motivo || ''}</span>
                            </div>
                            ${formData.descricaoTestes ? `
                                <div class="field">
                                    <span class="label">Descrição:</span>
                                    <span class="value">${formData.descricaoTestes}</span>
                                </div>
                            ` : ''}
                            ${this.getSpecificFields(formData, formType)}
                        </div>
                        
                        <div class="section">
                            <p><em>Este email foi gerado automaticamente pelo Sistema MiniEscopo V4.9</em></p>
                        </div>
                    </div>
                </body>
            </html>
        `;
    }
    
    getSpecificFields(formData, formType) {
        let fields = '';
        
        switch (formType) {
            case 'service':
                if (formData.usoHumanoVeterinario) {
                    fields += `
                        <div class="field">
                            <span class="label">Uso:</span>
                            <span class="value">${formData.usoHumanoVeterinario}</span>
                        </div>
                    `;
                }
                if (formData.modeloImpressora) {
                    fields += `
                        <div class="field">
                            <span class="label">Modelo Impressora:</span>
                            <span class="value">${formData.modeloImpressora}</span>
                        </div>
                    `;
                }
                if (formData.modeloNobreak) {
                    fields += `
                        <div class="field">
                            <span class="label">Modelo Nobreak:</span>
                            <span class="value">${formData.modeloNobreak}</span>
                        </div>
                    `;
                }
                break;
                
            case 'demonstracao':
                if (formData.cronogramaInicio) {
                    fields += `
                        <div class="field">
                            <span class="label">Data Início:</span>
                            <span class="value">${new Date(formData.cronogramaInicio).toLocaleDateString('pt-BR')}</span>
                        </div>
                    `;
                }
                if (formData.cronogramaFim) {
                    fields += `
                        <div class="field">
                            <span class="label">Data Fim:</span>
                            <span class="value">${new Date(formData.cronogramaFim).toLocaleDateString('pt-BR')}</span>
                        </div>
                    `;
                }
                if (formData.justificativaDemo) {
                    fields += `
                        <div class="field">
                            <span class="label">Justificativa:</span>
                            <span class="value">${formData.justificativaDemo}</span>
                        </div>
                    `;
                }
                break;
                
            case 'password':
                if (formData.previsaoFaturamento) {
                    fields += `
                        <div class="field">
                            <span class="label">Previsão Faturamento:</span>
                            <span class="value">${new Date(formData.previsaoFaturamento).toLocaleDateString('pt-BR')}</span>
                        </div>
                    `;
                }
                if (formData.numeroBO) {
                    fields += `
                        <div class="field">
                            <span class="label">BO:</span>
                            <span class="value">${formData.numeroBO}</span>
                        </div>
                    `;
                }
                break;
                
            case 'aplicacao':
                if (formData.dataAplicacao) {
                    fields += `
                        <div class="field">
                            <span class="label">Data Aplicação:</span>
                            <span class="value">${new Date(formData.dataAplicacao).toLocaleDateString('pt-BR')}</span>
                        </div>
                    `;
                }
                if (formData.numeroBO) {
                    fields += `
                        <div class="field">
                            <span class="label">BO:</span>
                            <span class="value">${formData.numeroBO}</span>
                        </div>
                    `;
                }
                break;
                
            case 'instalacao':
                if (formData.dataInicial) {
                    fields += `
                        <div class="field">
                            <span class="label">Data Inicial:</span>
                            <span class="value">${new Date(formData.dataInicial).toLocaleDateString('pt-BR')}</span>
                        </div>
                    `;
                }
                if (formData.dataFinal) {
                    fields += `
                        <div class="field">
                            <span class="label">Data Final:</span>
                            <span class="value">${new Date(formData.dataFinal).toLocaleDateString('pt-BR')}</span>
                        </div>
                    `;
                }
                if (formData.responsavelInstalacao) {
                    fields += `
                        <div class="field">
                            <span class="label">Responsável Instalação:</span>
                            <span class="value">${formData.responsavelInstalacao}</span>
                        </div>
                    `;
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
        document.getElementById('email-from').value = config.from || '';
        document.getElementById('email-to').value = config.to || '';
        document.getElementById('smtp-server').value = config.smtpServer || 'smtp.outlook.com';
        document.getElementById('smtp-port').value = config.smtpPort || 587;
        
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
            showToast('Configurações de email salvas com sucesso!', 'success');
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
    
    const success = await emailService.sendEmail(subject, body);
    
    if (success) {
        showToast('Email enviado com sucesso!', 'success');
    } else {
        showToast('Falha ao enviar email. Verifique as configurações.', 'error');
    }
    
    return success;
}

// Export for use in main app
window.sendFormEmail = sendFormEmail;
window.emailService = emailService;
