
// Serviço de Email para Sistema MiniEscopo V4.9
class EmailService {
    constructor() {
        this.config = this.loadConfig();
        this.templates = this.initializeTemplates();
    }

    // Carrega configurações salvas
    loadConfig() {
        const saved = localStorage.getItem('miniescopo_email_config');
        return saved ? JSON.parse(saved) : {
            remetente: '',
            destinatario: '',
            servidor: 'smtp.gmail.com',
            porta: 587,
            configurado: false
        };
    }

    // Salva configurações
    saveConfig(config) {
        this.config = { ...this.config, ...config };
        localStorage.setItem('miniescopo_email_config', JSON.stringify(this.config));
    }

    // Inicializa templates de email
    initializeTemplates() {
        return {
            service: {
                subject: 'Nova Solicitação de Serviço Técnico - {cliente}',
                title: 'SOLICITAÇÃO DE SERVIÇO TÉCNICO'
            },
            demonstracao: {
                subject: 'Nova Solicitação de Demonstração - {cliente}',
                title: 'SOLICITAÇÃO DE DEMONSTRAÇÃO'
            },
            aplicacao: {
                subject: 'Nova Solicitação de Aplicação - {cliente}',
                title: 'SOLICITAÇÃO DE APLICAÇÃO'
            },
            password: {
                subject: 'Nova Solicitação de Licença/Password - {cliente}',
                title: 'SOLICITAÇÃO DE LICENÇA/PASSWORD'
            },
            instalacao: {
                subject: 'Nova Solicitação de Instalação Demo - {cliente}',
                title: 'SOLICITAÇÃO DE INSTALAÇÃO DEMO'
            }
        };
    }

    // Envia email principal
    async sendFormEmail(formData, formType) {
        try {
            const template = this.templates[formType];
            if (!template) {
                throw new Error('Tipo de formulário não encontrado');
            }

            const subject = template.subject.replace('{cliente}', formData.razaoSocial || 'Cliente');
            const bodyHtml = this.generateHtmlEmail(formData, formType);
            const bodyText = this.generateTextEmail(formData, formType);

            // Cria link mailto melhorado
            const mailtoLink = this.createMailtoLink(subject, bodyText);
            
            // Abre cliente de email
            window.open(mailtoLink, '_blank');
            
            // Log da ação
            this.logEmailActivity(formData, formType, subject);
            
            return true;
        } catch (error) {
            console.error('Erro ao enviar email:', error);
            throw error;
        }
    }

    // Cria link mailto otimizado
    createMailtoLink(subject, body) {
        const destinatario = this.config.destinatario || '';
        const encodedSubject = encodeURIComponent(subject);
        const encodedBody = encodeURIComponent(body);
        
        return `mailto:${destinatario}?subject=${encodedSubject}&body=${encodedBody}`;
    }

    // Gera email em HTML
    generateHtmlEmail(formData, formType) {
        const template = this.templates[formType];
        const currentDate = new Date();
        
        return `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background-color: #f5f5f5; }
                    .container { max-width: 800px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    .header { background: linear-gradient(135deg, #2563eb, #1d4ed8); color: white; padding: 30px; text-align: center; }
                    .header h1 { margin: 0; font-size: 24px; }
                    .header p { margin: 10px 0 0 0; opacity: 0.9; }
                    .content { padding: 30px; }
                    .section { margin-bottom: 30px; }
                    .section-title { background: #f8fafc; border-left: 4px solid #2563eb; padding: 15px; margin-bottom: 20px; font-weight: bold; color: #1e293b; }
                    .field-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px; }
                    .field { margin-bottom: 15px; }
                    .field label { font-weight: bold; color: #374151; display: block; margin-bottom: 5px; }
                    .field value { color: #6b7280; }
                    .footer { background: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb; }
                    .highlight { background: #fef3c7; padding: 2px 6px; border-radius: 4px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>${template.title}</h1>
                        <p>Sistema MiniEscopo V4.9 - ${currentDate.toLocaleDateString('pt-BR')} às ${currentDate.toLocaleTimeString('pt-BR')}</p>
                    </div>
                    <div class="content">
                        ${this.generateClientSection(formData)}
                        ${this.generateAddressSection(formData)}
                        ${this.generateEquipmentSection(formData)}
                        ${this.generateSpecificSection(formData, formType)}
                    </div>
                    <div class="footer">
                        <p><strong>Sistema MiniEscopo V4.9</strong></p>
                        <p>Email gerado automaticamente em ${currentDate.toLocaleString('pt-BR')}</p>
                        <p>Usuário: <span class="highlight">${app.currentUser?.name || 'N/A'}</span> (${app.currentUser?.role || 'N/A'})</p>
                    </div>
                </div>
            </body>
            </html>
        `;
    }

    // Gera email em texto simples
    generateTextEmail(formData, formType) {
        const template = this.templates[formType];
        const currentDate = new Date();
        const separator = '═'.repeat(60);
        const subseparator = '─'.repeat(40);
        
        let email = `${separator}\n`;
        email += `SISTEMA MINIESCOPO V4.9 - ${template.title}\n`;
        email += `${separator}\n\n`;
        
        email += `📅 Data: ${currentDate.toLocaleDateString('pt-BR')} às ${currentDate.toLocaleTimeString('pt-BR')}\n`;
        email += `👤 Usuário: ${app.currentUser?.name || 'N/A'} (${app.currentUser?.role || 'N/A'})\n\n`;
        
        // Dados do Cliente
        email += `👥 DADOS DO CLIENTE\n${subseparator}\n`;
        email += `Nome/Razão Social: ${formData.razaoSocial || 'N/A'}\n`;
        email += `CPF/CNPJ: ${formData.cpfCnpj || 'N/A'}\n`;
        email += `Telefone Principal: ${formData.telefone1 || 'N/A'}\n`;
        email += `Telefone Secundário: ${formData.telefone2 || 'N/A'}\n`;
        email += `E-mail: ${formData.email || 'N/A'}\n`;
        email += `Responsável: ${formData.responsavel || 'N/A'}\n\n`;
        
        // Endereço
        email += `📍 ENDEREÇO\n${subseparator}\n`;
        email += `CEP: ${formData.cep || 'N/A'}\n`;
        email += `Endereço: ${formData.endereco || 'N/A'}\n`;
        email += `Número: ${formData.numero || 'N/A'}\n`;
        email += `Bairro: ${formData.bairro || 'N/A'}\n`;
        email += `Cidade: ${formData.cidade || 'N/A'}\n`;
        email += `Estado: ${formData.estado || 'N/A'}\n\n`;
        
        // Equipamento
        email += `⚙️ DADOS DO EQUIPAMENTO\n${subseparator}\n`;
        email += `Modelo: ${formData.modelo || 'N/A'}\n`;
        email += `Número de Série: ${formData.serial || 'N/A'}\n`;
        email += `Motivo: ${formData.motivo || 'N/A'}\n`;
        email += `Descrição: ${formData.descricao || 'N/A'}\n\n`;
        
        // Seção específica por tipo
        email += this.generateSpecificTextSection(formData, formType);
        
        email += `\n${separator}\n`;
        email += `Este email foi gerado automaticamente pelo Sistema MiniEscopo V4.9\n`;
        email += `Não responda diretamente a este email.\n`;
        email += `${separator}`;
        
        return email;
    }

    // Seções HTML específicas
    generateClientSection(formData) {
        return `
            <div class="section">
                <div class="section-title">👥 Dados do Cliente</div>
                <div class="field-grid">
                    <div class="field">
                        <label>Nome/Razão Social:</label>
                        <div class="value">${formData.razaoSocial || 'N/A'}</div>
                    </div>
                    <div class="field">
                        <label>CPF/CNPJ:</label>
                        <div class="value">${formData.cpfCnpj || 'N/A'}</div>
                    </div>
                    <div class="field">
                        <label>Telefone Principal:</label>
                        <div class="value">${formData.telefone1 || 'N/A'}</div>
                    </div>
                    <div class="field">
                        <label>Telefone Secundário:</label>
                        <div class="value">${formData.telefone2 || 'N/A'}</div>
                    </div>
                    <div class="field">
                        <label>E-mail:</label>
                        <div class="value">${formData.email || 'N/A'}</div>
                    </div>
                    <div class="field">
                        <label>Responsável:</label>
                        <div class="value">${formData.responsavel || 'N/A'}</div>
                    </div>
                </div>
            </div>
        `;
    }

    generateAddressSection(formData) {
        return `
            <div class="section">
                <div class="section-title">📍 Endereço</div>
                <div class="field-grid">
                    <div class="field">
                        <label>CEP:</label>
                        <div class="value">${formData.cep || 'N/A'}</div>
                    </div>
                    <div class="field">
                        <label>Endereço:</label>
                        <div class="value">${formData.endereco || 'N/A'}</div>
                    </div>
                    <div class="field">
                        <label>Número:</label>
                        <div class="value">${formData.numero || 'N/A'}</div>
                    </div>
                    <div class="field">
                        <label>Bairro:</label>
                        <div class="value">${formData.bairro || 'N/A'}</div>
                    </div>
                    <div class="field">
                        <label>Cidade:</label>
                        <div class="value">${formData.cidade || 'N/A'}</div>
                    </div>
                    <div class="field">
                        <label>Estado:</label>
                        <div class="value">${formData.estado || 'N/A'}</div>
                    </div>
                </div>
            </div>
        `;
    }

    generateEquipmentSection(formData) {
        return `
            <div class="section">
                <div class="section-title">⚙️ Dados do Equipamento</div>
                <div class="field-grid">
                    <div class="field">
                        <label>Modelo:</label>
                        <div class="value"><span class="highlight">${formData.modelo || 'N/A'}</span></div>
                    </div>
                    <div class="field">
                        <label>Número de Série:</label>
                        <div class="value"><span class="highlight">${formData.serial || 'N/A'}</span></div>
                    </div>
                    <div class="field">
                        <label>Motivo:</label>
                        <div class="value"><span class="highlight">${formData.motivo || 'N/A'}</span></div>
                    </div>
                </div>
                ${formData.descricao ? `
                    <div class="field">
                        <label>Descrição Detalhada:</label>
                        <div class="value">${formData.descricao}</div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    generateSpecificSection(formData, formType) {
        switch (formType) {
            case 'service':
                return this.generateServiceSpecificHtml(formData);
            case 'demonstracao':
                return this.generateDemoSpecificHtml(formData);
            case 'aplicacao':
                return this.generateAppSpecificHtml(formData);
            case 'password':
                return this.generatePasswordSpecificHtml(formData);
            case 'instalacao':
                return this.generateInstallSpecificHtml(formData);
            default:
                return '';
        }
    }

    generateServiceSpecificHtml(formData) {
        return `
            <div class="section">
                <div class="section-title">🔧 Informações Específicas do Serviço</div>
                <div class="field-grid">
                    ${formData.usoEquipamento ? `
                        <div class="field">
                            <label>Uso do Equipamento:</label>
                            <div class="value">${formData.usoEquipamento}</div>
                        </div>
                    ` : ''}
                    ${formData.modeloImpressora ? `
                        <div class="field">
                            <label>Modelo da Impressora:</label>
                            <div class="value">${formData.modeloImpressora}</div>
                        </div>
                    ` : ''}
                    ${formData.modeloNobreak ? `
                        <div class="field">
                            <label>Modelo do Nobreak:</label>
                            <div class="value">${formData.modeloNobreak}</div>
                        </div>
                    ` : ''}
                    ${formData.dataPreferencial ? `
                        <div class="field">
                            <label>Data Preferencial:</label>
                            <div class="value">${new Date(formData.dataPreferencial).toLocaleDateString('pt-BR')}</div>
                        </div>
                    ` : ''}
                </div>
                ${formData.urgente ? '<p style="color: #dc2626; font-weight: bold;">⚠️ SOLICITAÇÃO URGENTE</p>' : ''}
            </div>
        `;
    }

    generateDemoSpecificHtml(formData) {
        return `
            <div class="section">
                <div class="section-title">🖥️ Informações da Demonstração</div>
                <div class="field-grid">
                    ${formData.dataInicio ? `
                        <div class="field">
                            <label>Data de Início:</label>
                            <div class="value">${new Date(formData.dataInicio).toLocaleDateString('pt-BR')}</div>
                        </div>
                    ` : ''}
                    ${formData.dataFim ? `
                        <div class="field">
                            <label>Data de Término:</label>
                            <div class="value">${new Date(formData.dataFim).toLocaleDateString('pt-BR')}</div>
                        </div>
                    ` : ''}
                    ${formData.horarioPreferencial ? `
                        <div class="field">
                            <label>Horário Preferencial:</label>
                            <div class="value">${formData.horarioPreferencial}</div>
                        </div>
                    ` : ''}
                    ${formData.numeroParticipantes ? `
                        <div class="field">
                            <label>Número de Participantes:</label>
                            <div class="value">${formData.numeroParticipantes}</div>
                        </div>
                    ` : ''}
                </div>
                ${formData.justificativa ? `
                    <div class="field">
                        <label>Justificativa:</label>
                        <div class="value">${formData.justificativa}</div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    generateAppSpecificHtml(formData) {
        return `
            <div class="section">
                <div class="section-title">📄 Informações da Aplicação</div>
                <div class="field-grid">
                    ${formData.dataAplicacao ? `
                        <div class="field">
                            <label>Data da Aplicação:</label>
                            <div class="value">${new Date(formData.dataAplicacao).toLocaleDateString('pt-BR')}</div>
                        </div>
                    ` : ''}
                    ${formData.tipoAplicacao ? `
                        <div class="field">
                            <label>Tipo de Aplicação:</label>
                            <div class="value">${formData.tipoAplicacao}</div>
                        </div>
                    ` : ''}
                    ${formData.sistemaOperacional ? `
                        <div class="field">
                            <label>Sistema Operacional:</label>
                            <div class="value">${formData.sistemaOperacional}</div>
                        </div>
                    ` : ''}
                    ${formData.numeroBO ? `
                        <div class="field">
                            <label>Número do BO:</label>
                            <div class="value"><span class="highlight">${formData.numeroBO}</span></div>
                        </div>
                    ` : ''}
                </div>
                ${formData.requisitosEspeciais ? `
                    <div class="field">
                        <label>Requisitos Especiais:</label>
                        <div class="value">${formData.requisitosEspeciais}</div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    generatePasswordSpecificHtml(formData) {
        return `
            <div class="section">
                <div class="section-title">🔑 Informações da Licença/Password</div>
                <div class="field-grid">
                    ${formData.tipoSolicitacao ? `
                        <div class="field">
                            <label>Tipo de Solicitação:</label>
                            <div class="value"><span class="highlight">${formData.tipoSolicitacao}</span></div>
                        </div>
                    ` : ''}
                    ${formData.previsaoFaturamento ? `
                        <div class="field">
                            <label>Previsão de Faturamento:</label>
                            <div class="value">${new Date(formData.previsaoFaturamento).toLocaleDateString('pt-BR')}</div>
                        </div>
                    ` : ''}
                    ${formData.numeroBO ? `
                        <div class="field">
                            <label>Número do BO:</label>
                            <div class="value"><span class="highlight">${formData.numeroBO}</span></div>
                        </div>
                    ` : ''}
                    ${formData.valorOrcado ? `
                        <div class="field">
                            <label>Valor Orçado:</label>
                            <div class="value">R$ ${parseFloat(formData.valorOrcado).toLocaleString('pt-BR', {minimumFractionDigits: 2})}</div>
                        </div>
                    ` : ''}
                </div>
                ${formData.funcionalidades ? `
                    <div class="field">
                        <label>Funcionalidades Solicitadas:</label>
                        <div class="value">${formData.funcionalidades}</div>
                    </div>
                ` : ''}
                ${formData.licencaPermanente ? '<p style="color: #059669; font-weight: bold;">✅ LICENÇA PERMANENTE SOLICITADA</p>' : ''}
            </div>
        `;
    }

    generateInstallSpecificHtml(formData) {
        return `
            <div class="section">
                <div class="section-title">📥 Informações da Instalação Demo</div>
                <div class="field-grid">
                    ${formData.dataInicial ? `
                        <div class="field">
                            <label>Data Inicial:</label>
                            <div class="value">${new Date(formData.dataInicial).toLocaleDateString('pt-BR')}</div>
                        </div>
                    ` : ''}
                    ${formData.dataFinal ? `
                        <div class="field">
                            <label>Data Final:</label>
                            <div class="value">${new Date(formData.dataFinal).toLocaleDateString('pt-BR')}</div>
                        </div>
                    ` : ''}
                    ${formData.responsavelInstalacao ? `
                        <div class="field">
                            <label>Responsável:</label>
                            <div class="value">${formData.responsavelInstalacao}</div>
                        </div>
                    ` : ''}
                    ${formData.tempDemo ? `
                        <div class="field">
                            <label>Tempo de Demo:</label>
                            <div class="value">${formData.tempDemo} dias</div>
                        </div>
                    ` : ''}
                </div>
                ${formData.configuracoes ? `
                    <div class="field">
                        <label>Configurações Específicas:</label>
                        <div class="value">${formData.configuracoes}</div>
                    </div>
                ` : ''}
                ${formData.treinamentoIncluido ? '<p style="color: #059669; font-weight: bold;">📚 TREINAMENTO INCLUÍDO</p>' : ''}
            </div>
        `;
    }

    // Seções texto específicas
    generateSpecificTextSection(formData, formType) {
        switch (formType) {
            case 'service':
                return this.generateServiceSpecificText(formData);
            case 'demonstracao':
                return this.generateDemoSpecificText(formData);
            case 'aplicacao':
                return this.generateAppSpecificText(formData);
            case 'password':
                return this.generatePasswordSpecificText(formData);
            case 'instalacao':
                return this.generateInstallSpecificText(formData);
            default:
                return '';
        }
    }

    generateServiceSpecificText(formData) {
        const subseparator = '─'.repeat(40);
        let section = `🔧 INFORMAÇÕES ESPECÍFICAS DO SERVIÇO\n${subseparator}\n`;
        
        if (formData.usoEquipamento) section += `Uso do Equipamento: ${formData.usoEquipamento}\n`;
        if (formData.modeloImpressora) section += `Modelo da Impressora: ${formData.modeloImpressora}\n`;
        if (formData.modeloNobreak) section += `Modelo do Nobreak: ${formData.modeloNobreak}\n`;
        if (formData.dataPreferencial) section += `Data Preferencial: ${new Date(formData.dataPreferencial).toLocaleDateString('pt-BR')}\n`;
        if (formData.urgente) section += `⚠️ SOLICITAÇÃO URGENTE\n`;
        
        return section + '\n';
    }

    generateDemoSpecificText(formData) {
        const subseparator = '─'.repeat(40);
        let section = `🖥️ INFORMAÇÕES DA DEMONSTRAÇÃO\n${subseparator}\n`;
        
        if (formData.dataInicio) section += `Data de Início: ${new Date(formData.dataInicio).toLocaleDateString('pt-BR')}\n`;
        if (formData.dataFim) section += `Data de Término: ${new Date(formData.dataFim).toLocaleDateString('pt-BR')}\n`;
        if (formData.horarioPreferencial) section += `Horário Preferencial: ${formData.horarioPreferencial}\n`;
        if (formData.numeroParticipantes) section += `Número de Participantes: ${formData.numeroParticipantes}\n`;
        if (formData.justificativa) section += `Justificativa: ${formData.justificativa}\n`;
        
        return section + '\n';
    }

    generateAppSpecificText(formData) {
        const subseparator = '─'.repeat(40);
        let section = `📄 INFORMAÇÕES DA APLICAÇÃO\n${subseparator}\n`;
        
        if (formData.dataAplicacao) section += `Data da Aplicação: ${new Date(formData.dataAplicacao).toLocaleDateString('pt-BR')}\n`;
        if (formData.tipoAplicacao) section += `Tipo de Aplicação: ${formData.tipoAplicacao}\n`;
        if (formData.sistemaOperacional) section += `Sistema Operacional: ${formData.sistemaOperacional}\n`;
        if (formData.numeroBO) section += `Número do BO: ${formData.numeroBO}\n`;
        if (formData.requisitosEspeciais) section += `Requisitos Especiais: ${formData.requisitosEspeciais}\n`;
        
        return section + '\n';
    }

    generatePasswordSpecificText(formData) {
        const subseparator = '─'.repeat(40);
        let section = `🔑 INFORMAÇÕES DA LICENÇA/PASSWORD\n${subseparator}\n`;
        
        if (formData.tipoSolicitacao) section += `Tipo de Solicitação: ${formData.tipoSolicitacao}\n`;
        if (formData.previsaoFaturamento) section += `Previsão de Faturamento: ${new Date(formData.previsaoFaturamento).toLocaleDateString('pt-BR')}\n`;
        if (formData.numeroBO) section += `Número do BO: ${formData.numeroBO}\n`;
        if (formData.valorOrcado) section += `Valor Orçado: R$ ${parseFloat(formData.valorOrcado).toLocaleString('pt-BR', {minimumFractionDigits: 2})}\n`;
        if (formData.funcionalidades) section += `Funcionalidades: ${formData.funcionalidades}\n`;
        if (formData.licencaPermanente) section += `✅ LICENÇA PERMANENTE SOLICITADA\n`;
        
        return section + '\n';
    }

    generateInstallSpecificText(formData) {
        const subseparator = '─'.repeat(40);
        let section = `📥 INFORMAÇÕES DA INSTALAÇÃO DEMO\n${subseparator}\n`;
        
        if (formData.dataInicial) section += `Data Inicial: ${new Date(formData.dataInicial).toLocaleDateString('pt-BR')}\n`;
        if (formData.dataFinal) section += `Data Final: ${new Date(formData.dataFinal).toLocaleDateString('pt-BR')}\n`;
        if (formData.responsavelInstalacao) section += `Responsável: ${formData.responsavelInstalacao}\n`;
        if (formData.tempDemo) section += `Tempo de Demo: ${formData.tempDemo} dias\n`;
        if (formData.configuracoes) section += `Configurações: ${formData.configuracoes}\n`;
        if (formData.treinamentoIncluido) section += `📚 TREINAMENTO INCLUÍDO\n`;
        
        return section + '\n';
    }

    // Log de atividades
    logEmailActivity(formData, formType, subject) {
        const activity = {
            id: Date.now(),
            type: 'email_sent',
            formType: formType,
            cliente: formData.razaoSocial || 'N/A',
            subject: subject,
            timestamp: new Date().toISOString(),
            user: app.currentUser?.username || 'unknown'
        };

        const activities = JSON.parse(localStorage.getItem('miniescopo_email_activities') || '[]');
        activities.push(activity);
        
        // Mantém apenas os últimos 100 registros
        if (activities.length > 100) {
            activities.splice(0, activities.length - 100);
        }
        
        localStorage.setItem('miniescopo_email_activities', JSON.stringify(activities));
    }

    // Interface de configuração
    showConfig() {
        if (typeof app !== 'undefined') {
            app.showModal('Configurações de Email', this.renderConfigForm(), `
                <button class="btn btn-secondary" onclick="app.closeModal()">Cancelar</button>
                <button class="btn btn-primary" onclick="emailService.saveConfigFromForm()">Salvar</button>
            `);
        }
    }

    renderConfigForm() {
        return `
            <div class="email-config-form">
                <div class="form-field">
                    <label>Email Remetente (seu email):</label>
                    <input type="email" id="config-remetente" value="${this.config.remetente}" placeholder="seu@email.com">
                    <small>Este é o email que aparecerá como remetente</small>
                </div>
                
                <div class="form-field">
                    <label>Email Destinatário (para onde enviar):</label>
                    <input type="email" id="config-destinatario" value="${this.config.destinatario}" placeholder="destino@empresa.com">
                    <small>Este é o email que receberá as solicitações</small>
                </div>
                
                <div class="form-field">
                    <label>Servidor SMTP:</label>
                    <select id="config-servidor">
                        <option value="smtp.gmail.com" ${this.config.servidor === 'smtp.gmail.com' ? 'selected' : ''}>Gmail (smtp.gmail.com)</option>
                        <option value="smtp.outlook.com" ${this.config.servidor === 'smtp.outlook.com' ? 'selected' : ''}>Outlook (smtp.outlook.com)</option>
                        <option value="smtp.yahoo.com" ${this.config.servidor === 'smtp.yahoo.com' ? 'selected' : ''}>Yahoo (smtp.yahoo.com)</option>
                        <option value="outro">Outro</option>
                    </select>
                </div>
                
                <div class="form-field">
                    <label>Porta SMTP:</label>
                    <input type="number" id="config-porta" value="${this.config.porta}" placeholder="587">
                    <small>Porta padrão: 587 (Gmail/Outlook), 25 ou 465 para outros</small>
                </div>
                
                <div class="config-info">
                    <h4>ℹ️ Informações Importantes:</h4>
                    <ul>
                        <li>As configurações são salvas localmente no seu navegador</li>
                        <li>O sistema abrirá seu cliente de email padrão para envio</li>
                        <li>Para Gmail/Outlook, use seu email principal</li>
                        <li>Certifique-se de ter um cliente de email configurado</li>
                    </ul>
                </div>
            </div>
        `;
    }

    saveConfigFromForm() {
        const config = {
            remetente: document.getElementById('config-remetente').value,
            destinatario: document.getElementById('config-destinatario').value,
            servidor: document.getElementById('config-servidor').value,
            porta: parseInt(document.getElementById('config-porta').value) || 587,
            configurado: true
        };

        if (!config.remetente || !config.destinatario) {
            if (typeof app !== 'undefined') {
                app.showToast('Erro de validação', 'error', 'Por favor, preencha todos os campos obrigatórios.');
            }
            return;
        }

        this.saveConfig(config);
        
        if (typeof app !== 'undefined') {
            app.closeModal();
            app.showToast('Configurações salvas!', 'success', 'As configurações de email foram salvas com sucesso.');
        }
    }

    // Utilitários
    isConfigured() {
        return this.config.configurado && this.config.remetente && this.config.destinatario;
    }

    getActivities() {
        return JSON.parse(localStorage.getItem('miniescopo_email_activities') || '[]');
    }

    clearActivities() {
        localStorage.removeItem('miniescopo_email_activities');
    }
}

// Inicialização do serviço
const emailService = new EmailService();

// Export para uso global
window.emailService = emailService;
