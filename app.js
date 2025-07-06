
// Sistema MiniEscopo V4.9 - Aplicação Principal
class MiniEscopoApp {
    constructor() {
        this.currentUser = null;
        this.currentTab = 'dashboard';
        this.notifications = [];
        this.forms = this.loadForms();
        this.init();
    }

    // Inicialização da aplicação
    init() {
        this.setupEventListeners();
        this.showLoading();
        
        // Simula carregamento inicial
        setTimeout(() => {
            const savedUser = this.getSavedUser();
            if (savedUser && this.validateUser(savedUser)) {
                this.currentUser = savedUser;
                this.showMainApp();
            } else {
                this.showLogin();
            }
        }, 2500);
    }

    // Event listeners
    setupEventListeners() {
        // Login form
        document.getElementById('login-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleLogin();
        });

        // Clique fora do modal
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeModal();
            }
        });

        // Fecha dropdown ao clicar fora
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.user-menu')) {
                this.closeUserMenu();
            }
        });

        // Atualiza data/hora
        this.updateDateTime();
        setInterval(() => this.updateDateTime(), 1000);
    }

    // Autenticação
    handleLogin() {
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        const btn = document.querySelector('.login-btn');
        const btnText = btn.querySelector('.btn-text');
        const btnLoading = btn.querySelector('.btn-loading');

        // Mostra loading
        btnText.classList.add('hidden');
        btnLoading.classList.remove('hidden');
        btn.disabled = true;

        setTimeout(() => {
            const user = this.authenticateUser(username, password);
            
            if (user) {
                this.currentUser = user;
                this.saveUser(user);
                this.showToast('Login realizado com sucesso!', 'success', `Bem-vindo, ${user.name}!`);
                setTimeout(() => this.showMainApp(), 1000);
            } else {
                this.showToast('Credenciais inválidas', 'error', 'Verifique seu usuário e senha.');
                btnText.classList.remove('hidden');
                btnLoading.classList.add('hidden');
                btn.disabled = false;
            }
        }, 1500);
    }

    authenticateUser(username, password) {
        const users = {
            'admin': {
                password: 'admin123',
                name: 'Administrador',
                role: 'admin',
                permissions: ['all']
            },
            'tecnico': {
                password: 'tec123',
                name: 'Técnico Especializado',
                role: 'tecnico',
                permissions: ['service', 'demonstracao', 'admin']
            },
            'vendas': {
                password: 'vendas123',
                name: 'Consultor de Vendas',
                role: 'vendedor',
                permissions: ['demonstracao', 'aplicacao', 'password', 'instalacao']
            }
        };

        const user = users[username];
        if (user && user.password === password) {
            return {
                username,
                name: user.name,
                role: user.role,
                permissions: user.permissions
            };
        }
        return null;
    }

    // Interface principal
    showMainApp() {
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('login-container').classList.add('hidden');
        document.getElementById('main-app').classList.remove('hidden');

        this.updateUserInterface();
        this.updateNotificationCount();
        this.switchTab('dashboard');
    }

    updateUserInterface() {
        if (!this.currentUser) return;

        document.getElementById('user-name').textContent = this.currentUser.name;
        document.getElementById('user-role').textContent = this.currentUser.role;

        // Mostra tab admin se for admin
        if (this.hasPermission('all')) {
            document.getElementById('admin-tab').classList.remove('hidden');
        }

        // Mostra configurações se tiver permissão
        if (this.hasPermission('all') || this.hasPermission('admin')) {
            document.getElementById('settings-link').style.display = 'flex';
        }

        this.updateNavigation();
    }

    updateNavigation() {
        const tabs = document.querySelectorAll('.nav-tab');
        tabs.forEach(tab => {
            const tabName = tab.dataset.tab;
            if (tabName === 'dashboard' || this.hasPermission(tabName) || 
                (tabName === 'admin' && this.hasPermission('all'))) {
                tab.style.display = 'flex';
            } else {
                tab.style.display = 'none';
            }
        });
    }

    // Navegação entre tabs
    switchTab(tabName) {
        this.currentTab = tabName;

        // Atualiza navegação ativa
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        
        const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
        }

        // Carrega conteúdo da tab
        this.loadTabContent(tabName);
    }

    loadTabContent(tabName) {
        const contentArea = document.getElementById('content-area');
        
        switch (tabName) {
            case 'dashboard':
                contentArea.innerHTML = this.renderDashboard();
                break;
            case 'service':
                contentArea.innerHTML = this.renderServiceForm();
                this.setupFormHandlers('service');
                break;
            case 'demonstracao':
                contentArea.innerHTML = this.renderDemoForm();
                this.setupFormHandlers('demonstracao');
                break;
            case 'aplicacao':
                contentArea.innerHTML = this.renderAppForm();
                this.setupFormHandlers('aplicacao');
                break;
            case 'password':
                contentArea.innerHTML = this.renderPasswordForm();
                this.setupFormHandlers('password');
                break;
            case 'instalacao':
                contentArea.innerHTML = this.renderInstallForm();
                this.setupFormHandlers('instalacao');
                break;
            case 'admin':
                if (this.hasPermission('all')) {
                    contentArea.innerHTML = this.renderAdminPanel();
                    this.setupAdminHandlers();
                } else {
                    contentArea.innerHTML = this.renderAccessDenied();
                }
                break;
            default:
                contentArea.innerHTML = this.renderNotFound();
        }
    }

    // Renderização de conteúdo
    renderDashboard() {
        const stats = this.getSystemStats();
        return `
            <div class="dashboard">
                <div class="dashboard-header">
                    <h1>Dashboard</h1>
                    <p>Visão geral do sistema MiniEscopo</p>
                </div>
                
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-tools"></i>
                        </div>
                        <div class="stat-number">${stats.service}</div>
                        <div class="stat-label">Serviços</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-desktop"></i>
                        </div>
                        <div class="stat-number">${stats.demonstracao}</div>
                        <div class="stat-label">Demonstrações</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-file-alt"></i>
                        </div>
                        <div class="stat-number">${stats.aplicacao}</div>
                        <div class="stat-label">Aplicações</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-key"></i>
                        </div>
                        <div class="stat-number">${stats.password}</div>
                        <div class="stat-label">Licenças</div>
                    </div>
                </div>

                <div class="quick-actions">
                    <h2>Ações Rápidas</h2>
                    <div class="action-grid">
                        ${this.hasPermission('service') || this.hasPermission('all') ? `
                        <div class="action-card" onclick="app.switchTab('service')">
                            <i class="fas fa-tools"></i>
                            <h3>Novo Serviço</h3>
                            <p>Criar solicitação de serviço técnico</p>
                        </div>` : ''}
                        
                        ${this.hasPermission('demonstracao') || this.hasPermission('all') ? `
                        <div class="action-card" onclick="app.switchTab('demonstracao')">
                            <i class="fas fa-desktop"></i>
                            <h3>Nova Demonstração</h3>
                            <p>Agendar demonstração de produto</p>
                        </div>` : ''}
                        
                        ${this.hasPermission('aplicacao') || this.hasPermission('all') ? `
                        <div class="action-card" onclick="app.switchTab('aplicacao')">
                            <i class="fas fa-file-alt"></i>
                            <h3>Nova Aplicação</h3>
                            <p>Solicitar configuração de software</p>
                        </div>` : ''}
                        
                        ${this.hasPermission('password') || this.hasPermission('all') ? `
                        <div class="action-card" onclick="app.switchTab('password')">
                            <i class="fas fa-key"></i>
                            <h3>Nova Licença</h3>
                            <p>Solicitar password ou licença</p>
                        </div>` : ''}
                    </div>
                </div>

                <div class="recent-activity">
                    <h2>Atividade Recente</h2>
                    <div class="activity-list">
                        ${this.renderRecentActivity()}
                    </div>
                </div>
            </div>
        `;
    }

    renderServiceForm() {
        return `
            <div class="form-container">
                <div class="form-header">
                    <i class="fas fa-tools"></i>
                    <h2>Solicitação de Serviço Técnico</h2>
                </div>
                <div class="form-content">
                    <form id="service-form">
                        ${this.renderClientSection()}
                        ${this.renderEquipmentSection()}
                        ${this.renderServiceSpecificSection()}
                    </form>
                    ${this.renderFormActions('service')}
                </div>
            </div>
        `;
    }

    renderDemoForm() {
        return `
            <div class="form-container">
                <div class="form-header">
                    <i class="fas fa-desktop"></i>
                    <h2>Solicitação de Demonstração</h2>
                </div>
                <div class="form-content">
                    <form id="demonstracao-form">
                        ${this.renderClientSection()}
                        ${this.renderEquipmentSection()}
                        ${this.renderDemoSpecificSection()}
                    </form>
                    ${this.renderFormActions('demonstracao')}
                </div>
            </div>
        `;
    }

    renderAppForm() {
        return `
            <div class="form-container">
                <div class="form-header">
                    <i class="fas fa-file-alt"></i>
                    <h2>Solicitação de Aplicação</h2>
                </div>
                <div class="form-content">
                    <form id="aplicacao-form">
                        ${this.renderClientSection()}
                        ${this.renderEquipmentSection()}
                        ${this.renderAppSpecificSection()}
                    </form>
                    ${this.renderFormActions('aplicacao')}
                </div>
            </div>
        `;
    }

    renderPasswordForm() {
        return `
            <div class="form-container">
                <div class="form-header">
                    <i class="fas fa-key"></i>
                    <h2>Solicitação de Password/Licença</h2>
                </div>
                <div class="form-content">
                    <form id="password-form">
                        ${this.renderClientSection()}
                        ${this.renderEquipmentSection()}
                        ${this.renderPasswordSpecificSection()}
                    </form>
                    ${this.renderFormActions('password')}
                </div>
            </div>
        `;
    }

    renderInstallForm() {
        return `
            <div class="form-container">
                <div class="form-header">
                    <i class="fas fa-download"></i>
                    <h2>Solicitação de Instalação Demo</h2>
                </div>
                <div class="form-content">
                    <form id="instalacao-form">
                        ${this.renderClientSection()}
                        ${this.renderEquipmentSection()}
                        ${this.renderInstallSpecificSection()}
                    </form>
                    ${this.renderFormActions('instalacao')}
                </div>
            </div>
        `;
    }

    // Seções de formulário
    renderClientSection() {
        return `
            <div class="form-section">
                <div class="section-title">
                    <i class="fas fa-user"></i>
                    Dados do Cliente
                </div>
                <div class="form-grid">
                    <div class="form-field required">
                        <label>Nome/Razão Social</label>
                        <input type="text" name="razaoSocial" required>
                    </div>
                    <div class="form-field required">
                        <label>CPF/CNPJ</label>
                        <input type="text" name="cpfCnpj" required>
                    </div>
                    <div class="form-field required">
                        <label>Telefone Principal</label>
                        <input type="tel" name="telefone1" required>
                    </div>
                    <div class="form-field">
                        <label>Telefone Secundário</label>
                        <input type="tel" name="telefone2">
                    </div>
                    <div class="form-field">
                        <label>E-mail</label>
                        <input type="email" name="email">
                    </div>
                    <div class="form-field">
                        <label>Responsável</label>
                        <input type="text" name="responsavel">
                    </div>
                </div>
                
                <div class="section-title">
                    <i class="fas fa-map-marker-alt"></i>
                    Endereço
                </div>
                <div class="form-grid">
                    <div class="form-field">
                        <label>CEP</label>
                        <input type="text" name="cep" onblur="app.buscarCEP(this.value)">
                    </div>
                    <div class="form-field">
                        <label>Endereço</label>
                        <input type="text" name="endereco">
                    </div>
                    <div class="form-field">
                        <label>Número</label>
                        <input type="text" name="numero">
                    </div>
                    <div class="form-field">
                        <label>Bairro</label>
                        <input type="text" name="bairro">
                    </div>
                    <div class="form-field">
                        <label>Cidade</label>
                        <input type="text" name="cidade">
                    </div>
                    <div class="form-field">
                        <label>Estado</label>
                        <select name="estado">
                            <option value="">Selecione</option>
                            <option value="AC">Acre</option>
                            <option value="AL">Alagoas</option>
                            <option value="AP">Amapá</option>
                            <option value="AM">Amazonas</option>
                            <option value="BA">Bahia</option>
                            <option value="CE">Ceará</option>
                            <option value="DF">Distrito Federal</option>
                            <option value="ES">Espírito Santo</option>
                            <option value="GO">Goiás</option>
                            <option value="MA">Maranhão</option>
                            <option value="MT">Mato Grosso</option>
                            <option value="MS">Mato Grosso do Sul</option>
                            <option value="MG">Minas Gerais</option>
                            <option value="PA">Pará</option>
                            <option value="PB">Paraíba</option>
                            <option value="PR">Paraná</option>
                            <option value="PE">Pernambuco</option>
                            <option value="PI">Piauí</option>
                            <option value="RJ">Rio de Janeiro</option>
                            <option value="RN">Rio Grande do Norte</option>
                            <option value="RS">Rio Grande do Sul</option>
                            <option value="RO">Rondônia</option>
                            <option value="RR">Roraima</option>
                            <option value="SC">Santa Catarina</option>
                            <option value="SP">São Paulo</option>
                            <option value="SE">Sergipe</option>
                            <option value="TO">Tocantins</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
    }

    renderEquipmentSection() {
        return `
            <div class="form-section">
                <div class="section-title">
                    <i class="fas fa-cog"></i>
                    Dados do Equipamento
                </div>
                <div class="form-grid">
                    <div class="form-field required">
                        <label>Modelo</label>
                        <select name="modelo" required>
                            <option value="">Selecione o modelo</option>
                            <option value="LABGEO PT1000">LABGEO PT1000</option>
                            <option value="LABGEO PT3000">LABGEO PT3000</option>
                            <option value="LABGEO PT1000 VET">LABGEO PT1000 VET</option>
                            <option value="LABGEO PT3000 VET">LABGEO PT3000 VET</option>
                            <option value="LABGEO EASY">LABGEO EASY</option>
                            <option value="LABGEO MICRO">LABGEO MICRO</option>
                            <option value="OUTROS">OUTROS</option>
                        </select>
                    </div>
                    <div class="form-field required">
                        <label>Número de Série</label>
                        <input type="text" name="serial" required>
                    </div>
                    <div class="form-field required">
                        <label>Motivo da Solicitação</label>
                        <select name="motivo" required>
                            <option value="">Selecione o motivo</option>
                            <option value="Instalação Inicial">Instalação Inicial</option>
                            <option value="Manutenção Preventiva">Manutenção Preventiva</option>
                            <option value="Manutenção Corretiva">Manutenção Corretiva</option>
                            <option value="Atualização de Software">Atualização de Software</option>
                            <option value="Troca de Peças">Troca de Peças</option>
                            <option value="Calibração">Calibração</option>
                            <option value="Treinamento">Treinamento</option>
                            <option value="Outros">Outros</option>
                        </select>
                    </div>
                    <div class="form-field" style="grid-column: 1 / -1;">
                        <label>Descrição Detalhada</label>
                        <textarea name="descricao" rows="4" placeholder="Descreva detalhadamente o problema ou necessidade..."></textarea>
                    </div>
                </div>
            </div>
        `;
    }

    renderServiceSpecificSection() {
        return `
            <div class="form-section">
                <div class="section-title">
                    <i class="fas fa-tools"></i>
                    Informações Específicas do Serviço
                </div>
                <div class="form-grid">
                    <div class="form-field">
                        <label>Uso do Equipamento</label>
                        <select name="usoEquipamento">
                            <option value="">Selecione</option>
                            <option value="Humano">Uso Humano</option>
                            <option value="Veterinário">Uso Veterinário</option>
                            <option value="Ambos">Ambos</option>
                        </select>
                    </div>
                    <div class="form-field">
                        <label>Modelo da Impressora</label>
                        <input type="text" name="modeloImpressora" placeholder="Ex: HP LaserJet Pro">
                    </div>
                    <div class="form-field">
                        <label>Modelo do Nobreak</label>
                        <input type="text" name="modeloNobreak" placeholder="Ex: APC Back-UPS">
                    </div>
                    <div class="form-field">
                        <label>Data Preferencial</label>
                        <input type="date" name="dataPreferencial">
                    </div>
                </div>
                <div class="checkbox-field">
                    <input type="checkbox" name="urgente" id="urgente">
                    <label for="urgente">Solicitação Urgente</label>
                </div>
            </div>
        `;
    }

    renderDemoSpecificSection() {
        return `
            <div class="form-section">
                <div class="section-title">
                    <i class="fas fa-desktop"></i>
                    Informações da Demonstração
                </div>
                <div class="form-grid">
                    <div class="form-field">
                        <label>Data de Início</label>
                        <input type="date" name="dataInicio">
                    </div>
                    <div class="form-field">
                        <label>Data de Término</label>
                        <input type="date" name="dataFim">
                    </div>
                    <div class="form-field">
                        <label>Horário Preferencial</label>
                        <select name="horarioPreferencial">
                            <option value="">Selecione</option>
                            <option value="Manhã">Manhã (08:00 - 12:00)</option>
                            <option value="Tarde">Tarde (13:00 - 17:00)</option>
                            <option value="Integral">Período Integral</option>
                        </select>
                    </div>
                    <div class="form-field">
                        <label>Número de Participantes</label>
                        <input type="number" name="numeroParticipantes" min="1" max="20">
                    </div>
                </div>
                <div class="form-field">
                    <label>Justificativa da Demonstração</label>
                    <textarea name="justificativa" rows="4" placeholder="Explique o motivo da demonstração e expectativas..."></textarea>
                </div>
            </div>
        `;
    }

    renderAppSpecificSection() {
        return `
            <div class="form-section">
                <div class="section-title">
                    <i class="fas fa-file-alt"></i>
                    Informações da Aplicação
                </div>
                <div class="form-grid">
                    <div class="form-field">
                        <label>Data da Aplicação</label>
                        <input type="date" name="dataAplicacao">
                    </div>
                    <div class="form-field">
                        <label>Tipo de Aplicação</label>
                        <select name="tipoAplicacao">
                            <option value="">Selecione</option>
                            <option value="Instalação">Instalação de Software</option>
                            <option value="Configuração">Configuração de Sistema</option>
                            <option value="Atualização">Atualização de Versão</option>
                            <option value="Customização">Customização Específica</option>
                        </select>
                    </div>
                    <div class="form-field">
                        <label>Sistema Operacional</label>
                        <select name="sistemaOperacional">
                            <option value="">Selecione</option>
                            <option value="Windows 10">Windows 10</option>
                            <option value="Windows 11">Windows 11</option>
                            <option value="Windows Server">Windows Server</option>
                            <option value="Linux">Linux</option>
                            <option value="macOS">macOS</option>
                        </select>
                    </div>
                    <div class="form-field">
                        <label>Número do BO</label>
                        <input type="text" name="numeroBO" placeholder="Ex: BO-2024-001">
                    </div>
                </div>
                <div class="form-field">
                    <label>Requisitos Especiais</label>
                    <textarea name="requisitosEspeciais" rows="3" placeholder="Descreva requisitos específicos para a aplicação..."></textarea>
                </div>
            </div>
        `;
    }

    renderPasswordSpecificSection() {
        return `
            <div class="form-section">
                <div class="section-title">
                    <i class="fas fa-key"></i>
                    Informações da Licença/Password
                </div>
                <div class="form-grid">
                    <div class="form-field">
                        <label>Tipo de Solicitação</label>
                        <select name="tipoSolicitacao">
                            <option value="">Selecione</option>
                            <option value="Password Temporário">Password Temporário</option>
                            <option value="Licença Permanente">Licença Permanente</option>
                            <option value="Renovação">Renovação de Licença</option>
                            <option value="Upgrade">Upgrade de Funcionalidades</option>
                        </select>
                    </div>
                    <div class="form-field">
                        <label>Previsão de Faturamento</label>
                        <input type="date" name="previsaoFaturamento">
                    </div>
                    <div class="form-field">
                        <label>Número do BO</label>
                        <input type="text" name="numeroBO" placeholder="Ex: BO-2024-001">
                    </div>
                    <div class="form-field">
                        <label>Valor Orçado (R$)</label>
                        <input type="number" name="valorOrcado" step="0.01" min="0">
                    </div>
                </div>
                <div class="form-field">
                    <label>Funcionalidades Solicitadas</label>
                    <textarea name="funcionalidades" rows="3" placeholder="Liste as funcionalidades específicas necessárias..."></textarea>
                </div>
                <div class="checkbox-field">
                    <input type="checkbox" name="licencaPermanente" id="licencaPermanente">
                    <label for="licencaPermanente">Licença Permanente (não temporária)</label>
                </div>
            </div>
        `;
    }

    renderInstallSpecificSection() {
        return `
            <div class="form-section">
                <div class="section-title">
                    <i class="fas fa-download"></i>
                    Informações da Instalação Demo
                </div>
                <div class="form-grid">
                    <div class="form-field">
                        <label>Data Inicial Desejada</label>
                        <input type="date" name="dataInicial">
                    </div>
                    <div class="form-field">
                        <label>Data Final da Demo</label>
                        <input type="date" name="dataFinal">
                    </div>
                    <div class="form-field">
                        <label>Responsável pela Instalação</label>
                        <input type="text" name="responsavelInstalacao">
                    </div>
                    <div class="form-field">
                        <label>Tempo de Demo (dias)</label>
                        <select name="tempDemo">
                            <option value="">Selecione</option>
                            <option value="7">7 dias</option>
                            <option value="15">15 dias</option>
                            <option value="30">30 dias</option>
                            <option value="60">60 dias</option>
                            <option value="90">90 dias</option>
                        </select>
                    </div>
                </div>
                <div class="form-field">
                    <label>Configurações Específicas</label>
                    <textarea name="configuracoes" rows="3" placeholder="Descreva configurações específicas necessárias..."></textarea>
                </div>
                <div class="checkbox-field">
                    <input type="checkbox" name="treinamentoIncluido" id="treinamentoIncluido">
                    <label for="treinamentoIncluido">Incluir treinamento básico</label>
                </div>
            </div>
        `;
    }

    renderFormActions(formType) {
        return `
            <div class="btn-actions">
                <button type="button" class="btn btn-secondary" onclick="app.clearForm('${formType}')">
                    <i class="fas fa-eraser"></i>
                    Limpar Formulário
                </button>
                <button type="button" class="btn btn-success" onclick="app.saveForm('${formType}')">
                    <i class="fas fa-save"></i>
                    Salvar Dados
                </button>
                <button type="button" class="btn btn-primary" onclick="app.sendEmail('${formType}')">
                    <i class="fas fa-envelope"></i>
                    Enviar Email
                </button>
            </div>
        `;
    }

    // Handlers de formulário
    setupFormHandlers(formType) {
        const form = document.getElementById(`${formType}-form`);
        if (!form) return;

        // Máscara para telefones
        const phoneInputs = form.querySelectorAll('input[type="tel"]');
        phoneInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                this.formatPhone(e.target);
            });
        });

        // Máscara para CPF/CNPJ
        const cpfCnpjInput = form.querySelector('input[name="cpfCnpj"]');
        if (cpfCnpjInput) {
            cpfCnpjInput.addEventListener('input', (e) => {
                this.formatCpfCnpj(e.target);
            });
        }

        // Máscara para CEP
        const cepInput = form.querySelector('input[name="cep"]');
        if (cepInput) {
            cepInput.addEventListener('input', (e) => {
                this.formatCep(e.target);
            });
        }

        // Validação em tempo real
        const requiredFields = form.querySelectorAll('input[required], select[required]');
        requiredFields.forEach(field => {
            field.addEventListener('blur', () => {
                this.validateField(field);
            });
        });
    }

    // Utilitários de formulário
    formatPhone(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length <= 10) {
            value = value.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
        } else {
            value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        }
        input.value = value;
    }

    formatCpfCnpj(input) {
        let value = input.value.replace(/\D/g, '');
        if (value.length <= 11) {
            value = value.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
        } else {
            value = value.replace(/(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, '$1.$2.$3/$4-$5');
        }
        input.value = value;
    }

    formatCep(input) {
        let value = input.value.replace(/\D/g, '');
        value = value.replace(/(\d{5})(\d{3})/, '$1-$2');
        input.value = value;
    }

    async buscarCEP(cep) {
        const cleanCep = cep.replace(/\D/g, '');
        if (cleanCep.length !== 8) return;

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
            const data = await response.json();
            
            if (!data.erro) {
                const form = document.querySelector('form');
                form.querySelector('input[name="endereco"]').value = data.logradouro || '';
                form.querySelector('input[name="bairro"]').value = data.bairro || '';
                form.querySelector('input[name="cidade"]').value = data.localidade || '';
                form.querySelector('select[name="estado"]').value = data.uf || '';
            }
        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
        }
    }

    validateField(field) {
        const isValid = field.checkValidity();
        field.style.borderColor = isValid ? '' : 'var(--error-color)';
        return isValid;
    }

    // Ações de formulário
    clearForm(formType) {
        const form = document.getElementById(`${formType}-form`);
        if (form) {
            form.reset();
            this.showToast('Formulário limpo', 'info', 'Todos os campos foram limpos.');
        }
    }

    saveForm(formType) {
        const form = document.getElementById(`${formType}-form`);
        if (!form) return;

        const formData = new FormData(form);
        const data = {};

        // Converte FormData para objeto
        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        // Adiciona checkboxes
        const checkboxes = form.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
            data[cb.name] = cb.checked;
        });

        // Validação
        const requiredFields = ['razaoSocial', 'cpfCnpj', 'telefone1', 'modelo', 'serial', 'motivo'];
        const missingFields = requiredFields.filter(field => !data[field]);

        if (missingFields.length > 0) {
            this.showToast('Campos obrigatórios não preenchidos', 'error', 
                `Por favor, preencha: ${missingFields.join(', ')}`);
            return;
        }

        // Salva no localStorage
        const formRecord = {
            id: this.generateId(),
            type: formType,
            data: data,
            createdAt: new Date().toISOString(),
            createdBy: this.currentUser.username
        };

        this.forms.push(formRecord);
        this.saveForms();

        this.showToast('Formulário salvo com sucesso!', 'success', 
            'Os dados foram salvos e podem ser recuperados posteriormente.');
    }

    async sendEmail(formType) {
        const form = document.getElementById(`${formType}-form`);
        if (!form) return;

        const formData = new FormData(form);
        const data = {};

        for (let [key, value] of formData.entries()) {
            data[key] = value;
        }

        const checkboxes = form.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
            data[cb.name] = cb.checked;
        });

        // Validação
        const requiredFields = ['razaoSocial', 'cpfCnpj', 'telefone1', 'modelo', 'serial', 'motivo'];
        const missingFields = requiredFields.filter(field => !data[field]);

        if (missingFields.length > 0) {
            this.showToast('Campos obrigatórios não preenchidos', 'error', 
                `Por favor, preencha: ${missingFields.join(', ')}`);
            return;
        }

        try {
            // Usa o serviço de email
            await emailService.sendFormEmail(data, formType);
            this.showToast('Email enviado com sucesso!', 'success', 
                'O email foi aberto no seu cliente de email padrão.');
            
            // Salva automaticamente após enviar
            this.saveForm(formType);
        } catch (error) {
            this.showToast('Erro ao enviar email', 'error', error.message);
        }
    }

    // Painel administrativo
    renderAdminPanel() {
        if (!this.hasPermission('all')) {
            return this.renderAccessDenied();
        }

        const stats = this.getSystemStats();
        return `
            <div class="admin-panel">
                <div class="admin-header">
                    <h1>Painel Administrativo</h1>
                    <p>Gerenciamento completo do sistema</p>
                </div>
                
                <div class="stats-overview">
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-file-alt"></i></div>
                        <div class="stat-number">${this.forms.length}</div>
                        <div class="stat-label">Total de Formulários</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-users"></i></div>
                        <div class="stat-number">3</div>
                        <div class="stat-label">Usuários Ativos</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon"><i class="fas fa-calendar"></i></div>
                        <div class="stat-number">${new Date().getDate()}</div>
                        <div class="stat-label">Dia do Mês</div>
                    </div>
                </div>

                <div class="admin-tabs">
                    <button class="admin-tab-btn active" onclick="app.showAdminTab('forms')">
                        <i class="fas fa-file-alt"></i> Formulários
                    </button>
                    <button class="admin-tab-btn" onclick="app.showAdminTab('users')">
                        <i class="fas fa-users"></i> Usuários
                    </button>
                    <button class="admin-tab-btn" onclick="app.showAdminTab('settings')">
                        <i class="fas fa-cog"></i> Configurações
                    </button>
                </div>

                <div id="admin-content">
                    ${this.renderFormsTable()}
                </div>
            </div>
        `;
    }

    renderFormsTable() {
        if (this.forms.length === 0) {
            return `
                <div class="empty-state">
                    <i class="fas fa-inbox"></i>
                    <h3>Nenhum formulário encontrado</h3>
                    <p>Os formulários enviados aparecerão aqui.</p>
                </div>
            `;
        }

        const formsHtml = this.forms.map(form => `
            <tr>
                <td>${form.id}</td>
                <td><span class="badge badge-${form.type}">${this.getFormTypeLabel(form.type)}</span></td>
                <td>${form.data.razaoSocial || 'N/A'}</td>
                <td>${form.data.modelo || 'N/A'}</td>
                <td>${new Date(form.createdAt).toLocaleDateString('pt-BR')}</td>
                <td>${form.createdBy}</td>
                <td>
                    <button class="btn-sm btn-primary" onclick="app.viewForm('${form.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-sm btn-danger" onclick="app.deleteForm('${form.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');

        return `
            <div class="table-container">
                <table class="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Tipo</th>
                            <th>Cliente</th>
                            <th>Modelo</th>
                            <th>Data</th>
                            <th>Usuário</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${formsHtml}
                    </tbody>
                </table>
            </div>
        `;
    }

    setupAdminHandlers() {
        // Implementar handlers específicos do admin se necessário
    }

    showAdminTab(tabName) {
        // Atualiza botões ativos
        document.querySelectorAll('.admin-tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');

        const content = document.getElementById('admin-content');
        
        switch (tabName) {
            case 'forms':
                content.innerHTML = this.renderFormsTable();
                break;
            case 'users':
                content.innerHTML = this.renderUsersTable();
                break;
            case 'settings':
                content.innerHTML = this.renderSettingsPanel();
                break;
        }
    }

    renderUsersTable() {
        return `
            <div class="users-management">
                <h3>Gerenciamento de Usuários</h3>
                <div class="users-list">
                    <div class="user-card">
                        <div class="user-avatar"><i class="fas fa-user-shield"></i></div>
                        <div class="user-info">
                            <h4>Administrador</h4>
                            <p>admin - Acesso total ao sistema</p>
                            <span class="badge badge-admin">Admin</span>
                        </div>
                    </div>
                    <div class="user-card">
                        <div class="user-avatar"><i class="fas fa-user-cog"></i></div>
                        <div class="user-info">
                            <h4>Técnico Especializado</h4>
                            <p>tecnico - Serviços e demonstrações</p>
                            <span class="badge badge-tecnico">Técnico</span>
                        </div>
                    </div>
                    <div class="user-card">
                        <div class="user-avatar"><i class="fas fa-user-tie"></i></div>
                        <div class="user-info">
                            <h4>Consultor de Vendas</h4>
                            <p>vendas - Vendas e aplicações</p>
                            <span class="badge badge-vendedor">Vendedor</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderSettingsPanel() {
        return `
            <div class="settings-panel">
                <h3>Configurações do Sistema</h3>
                <div class="settings-grid">
                    <div class="setting-card">
                        <h4><i class="fas fa-envelope"></i> Configurações de Email</h4>
                        <p>Configure os parâmetros de envio de email</p>
                        <button class="btn btn-primary" onclick="app.showEmailSettings()">
                            Configurar
                        </button>
                    </div>
                    <div class="setting-card">
                        <h4><i class="fas fa-database"></i> Backup de Dados</h4>
                        <p>Faça backup dos dados do sistema</p>
                        <button class="btn btn-success" onclick="app.backupData()">
                            Fazer Backup
                        </button>
                    </div>
                    <div class="setting-card">
                        <h4><i class="fas fa-trash"></i> Limpar Dados</h4>
                        <p>Remove todos os formulários salvos</p>
                        <button class="btn btn-danger" onclick="app.clearAllData()">
                            Limpar Tudo
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // Utilitários
    getFormTypeLabel(type) {
        const labels = {
            'service': 'Serviço',
            'demonstracao': 'Demonstração',
            'aplicacao': 'Aplicação',
            'password': 'Licença',
            'instalacao': 'Instalação'
        };
        return labels[type] || type;
    }

    getSystemStats() {
        const stats = {
            service: 0,
            demonstracao: 0,
            aplicacao: 0,
            password: 0,
            instalacao: 0
        };

        this.forms.forEach(form => {
            if (stats.hasOwnProperty(form.type)) {
                stats[form.type]++;
            }
        });

        return stats;
    }

    renderRecentActivity() {
        const recentForms = this.forms
            .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            .slice(0, 5);

        if (recentForms.length === 0) {
            return '<p class="text-secondary">Nenhuma atividade recente</p>';
        }

        return recentForms.map(form => `
            <div class="activity-item">
                <div class="activity-icon">
                    <i class="fas fa-${this.getFormIcon(form.type)}"></i>
                </div>
                <div class="activity-details">
                    <h4>${this.getFormTypeLabel(form.type)} - ${form.data.razaoSocial || 'N/A'}</h4>
                    <p>${new Date(form.createdAt).toLocaleString('pt-BR')} por ${form.createdBy}</p>
                </div>
            </div>
        `).join('');
    }

    getFormIcon(type) {
        const icons = {
            'service': 'tools',
            'demonstracao': 'desktop',
            'aplicacao': 'file-alt',
            'password': 'key',
            'instalacao': 'download'
        };
        return icons[type] || 'file';
    }

    // Modais e utilitários
    showModal(title, content, actions = '') {
        document.getElementById('modal-title').textContent = title;
        document.getElementById('modal-body').innerHTML = content;
        document.getElementById('modal-footer').innerHTML = actions;
        document.getElementById('modal-overlay').classList.remove('hidden');
    }

    closeModal() {
        document.getElementById('modal-overlay').classList.add('hidden');
    }

    showToast(title, type = 'info', message = '') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };

        toast.innerHTML = `
            <div class="toast-header">
                <div class="toast-icon">
                    <i class="fas fa-${icons[type]}"></i>
                </div>
                <div class="toast-title">${title}</div>
            </div>
            ${message ? `<div class="toast-message">${message}</div>` : ''}
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.remove();
        }, 5000);
    }

    // Gerenciamento de dados
    loadForms() {
        return JSON.parse(localStorage.getItem('miniescopo_forms') || '[]');
    }

    saveForms() {
        localStorage.setItem('miniescopo_forms', JSON.stringify(this.forms));
    }

    saveUser(user) {
        localStorage.setItem('miniescopo_user', JSON.stringify(user));
    }

    getSavedUser() {
        return JSON.parse(localStorage.getItem('miniescopo_user') || 'null');
    }

    validateUser(user) {
        return user && user.username && user.name && user.role;
    }

    generateId() {
        return 'form_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    hasPermission(permission) {
        if (!this.currentUser) return false;
        return this.currentUser.permissions.includes('all') || 
               this.currentUser.permissions.includes(permission);
    }

    // Interface utilities
    updateDateTime() {
        const now = new Date();
        const dateTimeStr = now.toLocaleString('pt-BR', {
            weekday: 'short',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const element = document.getElementById('current-date-time');
        if (element) {
            element.textContent = dateTimeStr;
        }
    }

    updateNotificationCount() {
        const count = this.notifications.length;
        document.getElementById('notification-count').textContent = count;
    }

    // Screen transitions
    showLoading() {
        document.getElementById('loading-screen').classList.remove('hidden');
        document.getElementById('login-container').classList.add('hidden');
        document.getElementById('main-app').classList.add('hidden');
    }

    showLogin() {
        document.getElementById('loading-screen').classList.add('hidden');
        document.getElementById('login-container').classList.remove('hidden');
        document.getElementById('main-app').classList.add('hidden');
    }

    // User menu
    toggleUserMenu() {
        const dropdown = document.getElementById('user-dropdown');
        dropdown.classList.toggle('hidden');
    }

    closeUserMenu() {
        document.getElementById('user-dropdown').classList.add('hidden');
    }

    // Actions
    showProfile() {
        this.showModal('Perfil do Usuário', `
            <div class="profile-info">
                <div class="profile-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="profile-details">
                    <h3>${this.currentUser.name}</h3>
                    <p><strong>Usuário:</strong> ${this.currentUser.username}</p>
                    <p><strong>Cargo:</strong> ${this.currentUser.role}</p>
                    <p><strong>Permissões:</strong> ${this.currentUser.permissions.join(', ')}</p>
                </div>
            </div>
        `, `
            <button class="btn btn-primary" onclick="app.closeModal()">Fechar</button>
        `);
        this.closeUserMenu();
    }

    showSettings() {
        this.showModal('Configurações', `
            <div class="settings-content">
                <h4>Configurações de Email</h4>
                <p>Configure o serviço de email para envio automático de formulários.</p>
                <button class="btn btn-primary" onclick="emailService.showConfig()">
                    <i class="fas fa-envelope"></i> Configurar Email
                </button>
            </div>
        `, `
            <button class="btn btn-secondary" onclick="app.closeModal()">Fechar</button>
        `);
        this.closeUserMenu();
    }

    showNotifications() {
        this.showModal('Notificações', `
            <div class="notifications-content">
                ${this.notifications.length === 0 ? 
                    '<p class="text-center text-secondary">Nenhuma notificação</p>' : 
                    this.notifications.map(n => `
                        <div class="notification-item">
                            <i class="fas fa-${n.icon}"></i>
                            <div>
                                <h4>${n.title}</h4>
                                <p>${n.message}</p>
                                <small>${new Date(n.date).toLocaleString('pt-BR')}</small>
                            </div>
                        </div>
                    `).join('')
                }
            </div>
        `, `
            <button class="btn btn-primary" onclick="app.closeModal()">Fechar</button>
        `);
    }

    logout() {
        localStorage.removeItem('miniescopo_user');
        this.currentUser = null;
        this.showToast('Logout realizado', 'info', 'Você foi desconectado do sistema.');
        setTimeout(() => {
            this.showLogin();
        }, 1000);
    }

    // Placeholder functions
    showHelp() {
        this.showToast('Ajuda', 'info', 'Sistema de ajuda em desenvolvimento.');
    }

    showSupport() {
        this.showToast('Suporte', 'info', 'Entre em contato com o suporte técnico.');
    }

    showAbout() {
        this.showModal('Sobre o Sistema', `
            <div class="about-content">
                <div class="about-logo">
                    <i class="fas fa-cogs"></i>
                </div>
                <h3>Sistema MiniEscopo V4.9</h3>
                <p>Sistema completo de gestão empresarial para solicitações de serviços, demonstrações, aplicações e licenças.</p>
                <div class="about-features">
                    <h4>Funcionalidades:</h4>
                    <ul>
                        <li>Gestão de serviços técnicos</li>
                        <li>Agendamento de demonstrações</li>
                        <li>Solicitação de aplicações</li>
                        <li>Controle de licenças</li>
                        <li>Painel administrativo</li>
                        <li>Sistema de notificações</li>
                        <li>Envio automático de emails</li>
                    </ul>
                </div>
                <div class="about-info">
                    <p><strong>Versão:</strong> 4.9</p>
                    <p><strong>Desenvolvido em:</strong> ${new Date().getFullYear()}</p>
                </div>
            </div>
        `, `
            <button class="btn btn-primary" onclick="app.closeModal()">Fechar</button>
        `);
    }

    // Admin functions
    viewForm(formId) {
        const form = this.forms.find(f => f.id === formId);
        if (!form) return;

        this.showModal(`Visualizar ${this.getFormTypeLabel(form.type)}`, `
            <div class="form-view">
                <div class="form-view-section">
                    <h4>Dados do Cliente</h4>
                    <p><strong>Nome/Razão Social:</strong> ${form.data.razaoSocial || 'N/A'}</p>
                    <p><strong>CPF/CNPJ:</strong> ${form.data.cpfCnpj || 'N/A'}</p>
                    <p><strong>Telefone:</strong> ${form.data.telefone1 || 'N/A'}</p>
                    <p><strong>Email:</strong> ${form.data.email || 'N/A'}</p>
                </div>
                <div class="form-view-section">
                    <h4>Dados do Equipamento</h4>
                    <p><strong>Modelo:</strong> ${form.data.modelo || 'N/A'}</p>
                    <p><strong>Serial:</strong> ${form.data.serial || 'N/A'}</p>
                    <p><strong>Motivo:</strong> ${form.data.motivo || 'N/A'}</p>
                </div>
                <div class="form-view-section">
                    <h4>Informações Adicionais</h4>
                    <p><strong>Criado em:</strong> ${new Date(form.createdAt).toLocaleString('pt-BR')}</p>
                    <p><strong>Criado por:</strong> ${form.createdBy}</p>
                </div>
            </div>
        `, `
            <button class="btn btn-secondary" onclick="app.closeModal()">Fechar</button>
        `);
    }

    deleteForm(formId) {
        if (confirm('Tem certeza que deseja excluir este formulário?')) {
            this.forms = this.forms.filter(f => f.id !== formId);
            this.saveForms();
            this.showToast('Formulário excluído', 'success', 'O formulário foi removido permanentemente.');
            this.loadTabContent('admin'); // Recarrega a tabela
        }
    }

    backupData() {
        const data = {
            forms: this.forms,
            exportDate: new Date().toISOString(),
            version: '4.9'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], {
            type: 'application/json'
        });

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `miniescopo-backup-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showToast('Backup criado', 'success', 'Os dados foram exportados com sucesso.');
    }

    clearAllData() {
        if (confirm('ATENÇÃO: Esta ação irá apagar todos os dados salvos. Deseja continuar?')) {
            if (confirm('Tem certeza absoluta? Esta ação não pode ser desfeita.')) {
                this.forms = [];
                this.saveForms();
                this.showToast('Dados limpos', 'warning', 'Todos os formulários foram removidos.');
                this.loadTabContent('admin');
            }
        }
    }

    renderAccessDenied() {
        return `
            <div class="access-denied">
                <div class="access-denied-icon">
                    <i class="fas fa-lock"></i>
                </div>
                <h2>Acesso Negado</h2>
                <p>Você não tem permissão para acessar esta área.</p>
                <button class="btn btn-primary" onclick="app.switchTab('dashboard')">
                    Voltar ao Dashboard
                </button>
            </div>
        `;
    }

    renderNotFound() {
        return `
            <div class="not-found">
                <div class="not-found-icon">
                    <i class="fas fa-question-circle"></i>
                </div>
                <h2>Página não encontrada</h2>
                <p>A página solicitada não existe ou está em desenvolvimento.</p>
                <button class="btn btn-primary" onclick="app.switchTab('dashboard')">
                    Voltar ao Dashboard
                </button>
            </div>
        `;
    }
}

// Função global para alternar senha
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.querySelector('.password-toggle i');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.className = 'fas fa-eye-slash';
    } else {
        passwordInput.type = 'password';
        toggleBtn.className = 'fas fa-eye';
    }
}

// Inicialização da aplicação
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new MiniEscopoApp();
});
