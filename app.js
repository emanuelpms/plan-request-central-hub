
// Variáveis globais
let currentUser = null;
let currentTab = 'MENU';
let rawData = JSON.parse(localStorage.getItem('miniescopo_data') || '[]');
let notifications = JSON.parse(localStorage.getItem('miniescopo_notifications') || '[]');

// Configurações de usuários
const users = {
    admin: { password: 'admin123', role: 'admin', name: 'Administrador' },
    tecnico: { password: 'tec123', role: 'tecnico', name: 'Técnico' },
    vendas: { password: 'vendas123', role: 'vendas', name: 'Vendedor' }
};

// Inicialização da aplicação
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    showLoadingScreen();
    setTimeout(() => {
        hideLoadingScreen();
        showLoginForm();
    }, 3000);
}

function showLoadingScreen() {
    document.getElementById('loading-screen').classList.remove('hidden');
}

function hideLoadingScreen() {
    document.getElementById('loading-screen').classList.add('hidden');
}

function showLoginForm() {
    document.getElementById('login-container').classList.remove('hidden');
    setupLoginForm();
}

function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    loginForm.addEventListener('submit', handleLogin);
}

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (users[username] && users[username].password === password) {
        currentUser = {
            username: username,
            role: users[username].role,
            name: users[username].name
        };
        
        showToast('Login realizado com sucesso!', 'success');
        setTimeout(() => {
            showMainApp();
        }, 1000);
    } else {
        showToast('Usuário ou senha inválidos!', 'error');
    }
}

function showMainApp() {
    document.getElementById('login-container').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
    
    setupMainApp();
    loadMenuContent();
}

function setupMainApp() {
    // Configurar informações do usuário
    document.getElementById('user-name').textContent = currentUser.name;
    document.getElementById('user-role').textContent = currentUser.role.toUpperCase();
    
    // Mostrar botão de configuração apenas para admin
    if (currentUser.role === 'admin') {
        document.getElementById('admin-config-btn').classList.remove('hidden');
        document.getElementById('rawdata-tab').classList.remove('hidden');
    }
    
    // Configurar data atual
    updateCurrentDate();
    
    // Configurar notificações
    updateNotificationCount();
    
    // Configurar permissões de tabs
    setupTabPermissions();
}

function setupTabPermissions() {
    const tabs = document.querySelectorAll('.nav-tab');
    
    tabs.forEach(tab => {
        const tabType = tab.getAttribute('data-tab');
        
        // Configurar visibilidade baseada no papel do usuário
        switch (currentUser.role) {
            case 'admin':
                // Admin tem acesso a tudo
                break;
            case 'tecnico':
                // Técnico tem acesso limitado
                if (['DEMONSTRACAO', 'PASSWORD'].includes(tabType)) {
                    tab.style.opacity = '0.5';
                    tab.style.pointerEvents = 'none';
                }
                break;
            case 'vendas':
                // Vendedor tem acesso limitado
                if (['SERVICE', 'RAWDATA'].includes(tabType)) {
                    tab.style.opacity = '0.5';
                    tab.style.pointerEvents = 'none';
                }
                break;
        }
    });
}

function updateCurrentDate() {
    const now = new Date();
    const dateString = now.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
    document.getElementById('current-date').textContent = dateString;
}

function updateNotificationCount() {
    const activeNotifications = notifications.filter(n => n.active);
    const count = activeNotifications.length;
    document.querySelector('.notification-count').textContent = count;
    
    if (count > 0) {
        document.querySelector('.notification-count').style.display = 'flex';
    } else {
        document.querySelector('.notification-count').style.display = 'none';
    }
}

function switchTab(tabName) {
    // Verificar permissões
    if (!hasTabPermission(tabName)) {
        showToast('Você não tem permissão para acessar esta funcionalidade.', 'error');
        return;
    }
    
    currentTab = tabName;
    
    // Atualizar visual das tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Carregar conteúdo da tab
    loadTabContent(tabName);
}

function hasTabPermission(tabName) {
    switch (currentUser.role) {
        case 'admin':
            return true;
        case 'tecnico':
            return !['DEMONSTRACAO', 'PASSWORD'].includes(tabName);
        case 'vendas':
            return !['SERVICE', 'RAWDATA'].includes(tabName);
        default:
            return false;
    }
}

function loadTabContent(tabName) {
    const contentArea = document.getElementById('content-area');
    
    switch (tabName) {
        case 'MENU':
            loadMenuContent();
            break;
        case 'SERVICE':
            loadServiceContent();
            break;
        case 'DEMONSTRACAO':
            loadDemonstracaoContent();
            break;
        case 'APLICACAO':
            loadAplicacaoContent();
            break;
        case 'PASSWORD':
            loadPasswordContent();
            break;
        case 'INSTALACAO_DEMO':
            loadInstalacaoDemoContent();
            break;
        case 'RAWDATA':
            loadRawDataContent();
            break;
        default:
            loadMenuContent();
    }
}

function loadMenuContent() {
    const contentArea = document.getElementById('content-area');
    
    contentArea.innerHTML = `
        <div class="card">
            <div class="card-header">
                <h2 class="card-title">
                    <i class="fas fa-home"></i>
                    Painel Principal
                </h2>
                <p class="card-subtitle">Bem-vindo ao Sistema MiniEscopo V4.9</p>
            </div>
            
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-file-alt"></i>
                    </div>
                    <div class="stat-number">${rawData.length}</div>
                    <div class="stat-label">Total de Registros</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-tools"></i>
                    </div>
                    <div class="stat-number">${rawData.filter(r => r.formType === 'SERVICE').length}</div>
                    <div class="stat-label">Serviços</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-desktop"></i>
                    </div>
                    <div class="stat-number">${rawData.filter(r => r.formType === 'DEMONSTRACAO').length}</div>
                    <div class="stat-label">Demonstrações</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-key"></i>
                    </div>
                    <div class="stat-number">${rawData.filter(r => r.formType === 'PASSWORD').length}</div>
                    <div class="stat-label">Licenças</div>
                </div>
            </div>
            
            <div class="menu-grid">
                ${getMenuCards()}
            </div>
        </div>
    `;
}

function getMenuCards() {
    const menuItems = [
        {
            tab: 'SERVICE',
            icon: 'fas fa-tools',
            title: 'Serviço Técnico',
            description: 'Solicitações de manutenção e suporte técnico',
            badge: 'Técnico',
            permission: ['admin', 'tecnico']
        },
        {
            tab: 'DEMONSTRACAO',
            icon: 'fas fa-desktop',
            title: 'Demonstração',
            description: 'Agendamento e controle de demonstrações',
            badge: 'Comercial',
            permission: ['admin', 'vendas']
        },
        {
            tab: 'APLICACAO',
            icon: 'fas fa-file-alt',
            title: 'Aplicação',
            description: 'Solicitações de aplicação técnica',
            badge: 'Técnico',
            permission: ['admin', 'tecnico', 'vendas']
        },
        {
            tab: 'PASSWORD',
            icon: 'fas fa-key',
            title: 'Password/Licença',
            description: 'Controle de licenças e credenciais',
            badge: 'Sistema',
            permission: ['admin', 'tecnico']
        },
        {
            tab: 'INSTALACAO_DEMO',
            icon: 'fas fa-download',
            title: 'Instalação Demo',
            description: 'Configuração de ambiente demonstrativo',
            badge: 'Instalação',
            permission: ['admin', 'tecnico', 'vendas']
        },
        {
            tab: 'RAWDATA',
            icon: 'fas fa-database',
            title: 'Dados do Sistema',
            description: 'Visualização e gestão de dados',
            badge: 'Admin',
            permission: ['admin']
        }
    ];
    
    return menuItems
        .filter(item => item.permission.includes(currentUser.role))
        .map(item => `
            <div class="menu-card" onclick="switchTab('${item.tab}')">
                <div class="menu-icon">
                    <i class="${item.icon}"></i>
                </div>
                <h3 class="menu-title">${item.title}</h3>
                <p class="menu-description">${item.description}</p>
                <span class="menu-badge">${item.badge}</span>
            </div>
        `).join('');
}

function loadServiceContent() {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = `
        <div class="card" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
            <div class="card-header" style="border-bottom-color: rgba(255,255,255,0.2);">
                <h2 class="card-title">
                    <i class="fas fa-tools"></i>
                    SERVIÇO TÉCNICO
                </h2>
                <p class="card-subtitle" style="color: rgba(255,255,255,0.9);">Solicitação de manutenção e suporte</p>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">
                    <i class="fas fa-user"></i>
                    Dados do Cliente
                </h3>
            </div>
            <form id="service-form">
                ${getClientDataFields()}
                ${getServiceEquipmentFields()}
                ${getFileUploadArea()}
                ${getActionButtons('service')}
            </form>
        </div>
    `;
    
    setupFormHandlers('service');
}

function loadDemonstracaoContent() {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = `
        <div class="card" style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white;">
            <div class="card-header" style="border-bottom-color: rgba(255,255,255,0.2);">
                <h2 class="card-title">
                    <i class="fas fa-desktop"></i>
                    DEMONSTRAÇÃO
                </h2>
                <p class="card-subtitle" style="color: rgba(255,255,255,0.9);">Agendamento de demonstrações comerciais</p>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">
                    <i class="fas fa-user"></i>
                    Dados do Cliente
                </h3>
            </div>
            <form id="demonstracao-form">
                ${getClientDataFields()}
                ${getDemonstracaoEquipmentFields()}
                ${getFileUploadArea()}
                ${getActionButtons('demonstracao')}
            </form>
        </div>
    `;
    
    setupFormHandlers('demonstracao');
}

function loadAplicacaoContent() {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = `
        <div class="card" style="background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%); color: white;">
            <div class="card-header" style="border-bottom-color: rgba(255,255,255,0.2);">
                <h2 class="card-title">
                    <i class="fas fa-file-alt"></i>
                    APLICAÇÃO
                </h2>
                <p class="card-subtitle" style="color: rgba(255,255,255,0.9);">Solicitação de aplicação técnica</p>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">
                    <i class="fas fa-user"></i>
                    Dados do Cliente
                </h3>
            </div>
            <form id="aplicacao-form">
                ${getClientDataFields()}
                ${getAplicacaoEquipmentFields()}
                ${getFileUploadArea()}
                ${getActionButtons('aplicacao')}
            </form>
        </div>
    `;
    
    setupFormHandlers('aplicacao');
}

function loadPasswordContent() {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = `
        <div class="card" style="background: linear-gradient(135deg, #ffc107 0%, #fd7e14 100%); color: white;">
            <div class="card-header" style="border-bottom-color: rgba(255,255,255,0.2);">
                <h2 class="card-title">
                    <i class="fas fa-key"></i>
                    PASSWORD/LICENÇA
                </h2>
                <p class="card-subtitle" style="color: rgba(255,255,255,0.9);">Controle de licenças e credenciais</p>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">
                    <i class="fas fa-user"></i>
                    Dados do Cliente
                </h3>
            </div>
            <form id="password-form">
                ${getClientDataFields()}
                ${getPasswordEquipmentFields()}
                ${getFileUploadArea()}
                ${getActionButtons('password')}
            </form>
        </div>
    `;
    
    setupFormHandlers('password');
}

function loadInstalacaoDemoContent() {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = `
        <div class="card" style="background: linear-gradient(135deg, #764ba2 0%, #667eea 100%); color: white;">
            <div class="card-header" style="border-bottom-color: rgba(255,255,255,0.2);">
                <h2 class="card-title">
                    <i class="fas fa-download"></i>
                    INSTALAÇÃO DEMO
                </h2>
                <p class="card-subtitle" style="color: rgba(255,255,255,0.9);">Configuração de ambiente demonstrativo</p>
            </div>
        </div>
        
        <div class="card">
            <div class="card-header">
                <h3 class="card-title">
                    <i class="fas fa-user"></i>
                    Dados do Cliente
                </h3>
            </div>
            <form id="instalacao-form">
                ${getClientDataFields()}
                ${getInstalacaoEquipmentFields()}
                ${getFileUploadArea()}
                ${getActionButtons('instalacao')}
            </form>
        </div>
    `;
    
    setupFormHandlers('instalacao');
}

function loadRawDataContent() {
    const contentArea = document.getElementById('content-area');
    contentArea.innerHTML = `
        <div class="card" style="background: linear-gradient(135deg, #17a2b8 0%, #6f42c1 100%); color: white;">
            <div class="card-header" style="border-bottom-color: rgba(255,255,255,0.2);">
                <h2 class="card-title">
                    <i class="fas fa-database"></i>
                    DADOS DO SISTEMA
                </h2>
                <p class="card-subtitle" style="color: rgba(255,255,255,0.9);">Visualização e gestão de dados</p>
            </div>
        </div>
        
        <div class="search-filters">
            <div class="search-group">
                <input type="text" id="search-input" class="search-input" placeholder="Buscar por cliente, modelo ou serial...">
                <select id="filter-type" class="filter-select">
                    <option value="">Todos os tipos</option>
                    <option value="SERVICE">Serviço</option>
                    <option value="DEMONSTRACAO">Demonstração</option>
                    <option value="APLICACAO">Aplicação</option>
                    <option value="PASSWORD">Password/Licença</option>
                    <option value="INSTALACAO_DEMO">Instalação Demo</option>
                </select>
                <button type="button" class="btn btn-primary" onclick="exportData()">
                    <i class="fas fa-download"></i> Exportar
                </button>
            </div>
        </div>
        
        <div class="card">
            <div id="data-table-container">
                ${generateDataTable()}
            </div>
        </div>
    `;
    
    setupDataTableHandlers();
}

function getClientDataFields() {
    return `
        <div class="form-grid">
            <div class="form-field">
                <label>Nome/Razão Social *</label>
                <input type="text" name="razaoSocial" required maxlength="100">
            </div>
            <div class="form-field">
                <label>CPF/CNPJ *</label>
                <input type="text" name="cpfCnpj" required maxlength="18">
            </div>
            <div class="form-field">
                <label>Telefone 1 *</label>
                <input type="text" name="telefone1" required maxlength="15">
            </div>
            <div class="form-field">
                <label>Telefone 2 *</label>
                <input type="text" name="telefone2" required maxlength="15">
            </div>
            <div class="form-field">
                <label>E-mail *</label>
                <input type="email" name="email" required maxlength="100">
            </div>
            <div class="form-field">
                <label>Responsável *</label>
                <input type="text" name="responsavel" required maxlength="100">
            </div>
            <div class="form-field">
                <label>Setor do Responsável</label>
                <input type="text" name="setorResponsavel" maxlength="50">
            </div>
            <div class="form-field">
                <label>Data de Nascimento</label>
                <input type="date" name="dataNascimento">
            </div>
        </div>
        
        <div class="card-header">
            <h3 class="card-title">
                <i class="fas fa-map-marker-alt"></i>
                Endereço
            </h3>
        </div>
        
        <div class="form-grid">
            <div class="form-field">
                <label>CEP *</label>
                <input type="text" name="cep" required maxlength="9">
            </div>
            <div class="form-field">
                <label>Endereço *</label>
                <input type="text" name="endereco" required maxlength="200">
            </div>
            <div class="form-field">
                <label>Número *</label>
                <input type="text" name="numero" required maxlength="10">
            </div>
            <div class="form-field">
                <label>Bairro *</label>
                <input type="text" name="bairro" required maxlength="100">
            </div>
            <div class="form-field">
                <label>Cidade *</label>
                <input type="text" name="cidade" required maxlength="100">
            </div>
            <div class="form-field">
                <label>Estado *</label>
                <select name="estado" required>
                    <option value="">Selecione...</option>
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
            <div class="form-field" style="grid-column: 1 / -1;">
                <label>Observação do Endereço</label>
                <textarea name="observacaoEndereco" maxlength="200"></textarea>
            </div>
        </div>
    `;
}

function getServiceEquipmentFields() {
    return `
        <div class="card-header">
            <h3 class="card-title">
                <i class="fas fa-cog"></i>
                Dados do Equipamento
            </h3>
        </div>
        
        <div class="form-grid">
            <div class="form-field">
                <label>Modelo *</label>
                <select name="modelo" required>
                    <option value="">Selecione...</option>
                    <option value="LABGEO PT1000">LABGEO PT1000</option>
                    <option value="LABGEO PT3000">LABGEO PT3000</option>
                    <option value="LABGEO PT1000 VET">LABGEO PT1000 VET</option>
                    <option value="LABGEO PT3000 VET">LABGEO PT3000 VET</option>
                    <option value="OUTROS">OUTROS</option>
                </select>
            </div>
            <div class="form-field">
                <label>Serial *</label>
                <input type="text" name="serial" required maxlength="15">
            </div>
            <div class="form-field">
                <label>Motivo da Solicitação *</label>
                <select name="motivo" required>
                    <option value="">Selecione...</option>
                    <option value="Manutenção Preventiva">Manutenção Preventiva</option>
                    <option value="Manutenção Corretiva">Manutenção Corretiva</option>
                    <option value="Instalação">Instalação</option>
                    <option value="Treinamento">Treinamento</option>
                    <option value="Configuração">Configuração</option>
                    <option value="Atualização de Software">Atualização de Software</option>
                    <option value="Suporte Técnico">Suporte Técnico</option>
                    <option value="Instalação Inicial">Instalação Inicial</option>
                </select>
            </div>
            <div class="form-field">
                <label>Uso do Equipamento *</label>
                <select name="usoHumanoVeterinario" required>
                    <option value="">Selecione...</option>
                    <option value="HUMANO">HUMANO</option>
                    <option value="VETERINÁRIO">VETERINÁRIO</option>
                </select>
            </div>
            <div class="form-field" id="instalacao-fields" style="display: none;">
                <label>Modelo da Impressora</label>
                <input type="text" name="modeloImpressora" maxlength="50">
            </div>
            <div class="form-field" id="nobreak-field" style="display: none;">
                <label>Modelo do Nobreak</label>
                <input type="text" name="modeloNobreak" maxlength="50">
            </div>
            <div class="form-field" style="grid-column: 1 / -1;">
                <label>Descrição/Testes *</label>
                <textarea name="descricaoTestes" required maxlength="500"></textarea>
            </div>
        </div>
        
        <div id="instalacao-checkboxes" style="display: none;">
            <div class="checkbox-field">
                <input type="checkbox" name="documentacaoObrigatoria" id="doc-obrig">
                <label for="doc-obrig">Documentação Obrigatória</label>
            </div>
            <div class="checkbox-field">
                <input type="checkbox" name="necessarioAplicacao" id="nec-aplic">
                <label for="nec-aplic">Necessário Aplicação</label>
            </div>
            <div class="checkbox-field">
                <input type="checkbox" name="necessarioLicenca" id="nec-lic">
                <label for="nec-lic">Necessário Licença</label>
            </div>
            <div class="form-field" id="data-aplicacao-field" style="display: none;">
                <label>Data da Aplicação</label>
                <input type="date" name="dataAplicacao">
            </div>
        </div>
    `;
}

function getDemonstracaoEquipmentFields() {
    return `
        <div class="card-header">
            <h3 class="card-title">
                <i class="fas fa-cog"></i>
                Dados do Equipamento
            </h3>
        </div>
        
        <div class="form-grid">
            <div class="form-field">
                <label>Modelo *</label>
                <select name="modelo" required>
                    <option value="">Selecione...</option>
                    <option value="LABGEO PT1000">LABGEO PT1000</option>
                    <option value="LABGEO PT3000">LABGEO PT3000</option>
                    <option value="LABGEO PT1000 VET">LABGEO PT1000 VET</option>
                    <option value="LABGEO PT3000 VET">LABGEO PT3000 VET</option>
                    <option value="OUTROS">OUTROS</option>
                </select>
            </div>
            <div class="form-field">
                <label>Serial *</label>
                <input type="text" name="serial" required maxlength="15">
            </div>
            <div class="form-field">
                <label>Motivo da Solicitação *</label>
                <select name="motivo" required>
                    <option value="">Selecione...</option>
                    <option value="Demonstração Comercial">Demonstração Comercial</option>
                    <option value="Teste de Funcionalidade">Teste de Funcionalidade</option>
                    <option value="Avaliação Técnica">Avaliação Técnica</option>
                    <option value="Treinamento">Treinamento</option>
                    <option value="Outros">Outros</option>
                </select>
            </div>
            <div class="form-field">
                <label>Cronograma Início *</label>
                <input type="date" name="cronogramaInicio" required>
            </div>
            <div class="form-field">
                <label>Cronograma Fim *</label>
                <input type="date" name="cronogramaFim" required>
            </div>
            <div class="form-field">
                <label>Uso do Equipamento *</label>
                <select name="usoHumanoVeterinario" required>
                    <option value="">Selecione...</option>
                    <option value="HUMANO">HUMANO</option>
                    <option value="VETERINÁRIO">VETERINÁRIO</option>
                </select>
            </div>
            <div class="form-field" style="grid-column: 1 / -1;">
                <label>Justificativa *</label>
                <textarea name="justificativaDemo" required maxlength="500"></textarea>
            </div>
            <div class="form-field" style="grid-column: 1 / -1;">
                <label>Descrição do Equipamento *</label>
                <textarea name="descricaoEquipamento" required maxlength="500"></textarea>
            </div>
        </div>
    `;
}

function getAplicacaoEquipmentFields() {
    return `
        <div class="card-header">
            <h3 class="card-title">
                <i class="fas fa-cog"></i>
                Dados do Equipamento
            </h3>
        </div>
        
        <div class="form-grid">
            <div class="form-field">
                <label>Modelo *</label>
                <select name="modelo" required>
                    <option value="">Selecione...</option>
                    <option value="LABGEO PT1000">LABGEO PT1000</option>
                    <option value="LABGEO PT3000">LABGEO PT3000</option>
                    <option value="LABGEO PT1000 VET">LABGEO PT1000 VET</option>
                    <option value="LABGEO PT3000 VET">LABGEO PT3000 VET</option>
                    <option value="OUTROS">OUTROS</option>
                </select>
            </div>
            <div class="form-field">
                <label>Serial *</label>
                <input type="text" name="serial" required maxlength="15">
            </div>
            <div class="form-field">
                <label>Motivo da Solicitação *</label>
                <select name="motivo" required>
                    <option value="">Selecione...</option>
                    <option value="Aplicação Inicial">Aplicação Inicial</option>
                    <option value="Aplicação Plus">Aplicação Plus</option>
                </select>
            </div>
            <div class="form-field" id="bo-field" style="display: none;">
                <label>BO *</label>
                <input type="text" name="numeroBO" maxlength="50">
            </div>
            <div class="form-field">
                <label>Data da Aplicação *</label>
                <input type="date" name="dataAplicacao" required>
            </div>
            <div class="form-field" style="grid-column: 1 / -1;">
                <label>Descrição *</label>
                <textarea name="descricaoTestes" required maxlength="500"></textarea>
            </div>
        </div>
    `;
}

function getPasswordEquipmentFields() {
    return `
        <div class="card-header">
            <h3 class="card-title">
                <i class="fas fa-cog"></i>
                Dados do Equipamento
            </h3>
        </div>
        
        <div class="form-grid">
            <div class="form-field">
                <label>Modelo *</label>
                <select name="modelo" required>
                    <option value="">Selecione...</option>
                    <option value="LABGEO PT1000">LABGEO PT1000</option>
                    <option value="LABGEO PT3000">LABGEO PT3000</option>
                    <option value="LABGEO PT1000 VET">LABGEO PT1000 VET</option>
                    <option value="LABGEO PT3000 VET">LABGEO PT3000 VET</option>
                    <option value="OUTROS">OUTROS</option>
                </select>
            </div>
            <div class="form-field">
                <label>Serial *</label>
                <input type="text" name="serial" required maxlength="50">
            </div>
            <div class="form-field">
                <label>Motivo da Solicitação *</label>
                <select name="motivo" required>
                    <option value="">Selecione...</option>
                    <option value="Licença Permanente">Licença Permanente</option>
                    <option value="Licença Temporária">Licença Temporária</option>
                    <option value="Licença Teste">Licença Teste</option>
                    <option value="Renovação de Licença">Renovação de Licença</option>
                    <option value="Transferência de Licença">Transferência de Licença</option>
                </select>
            </div>
            <div class="form-field">
                <label>Previsão de Faturamento *</label>
                <input type="date" name="previsaoFaturamento" required>
            </div>
            <div class="form-field">
                <label>BO *</label>
                <input type="text" name="numeroBO" required maxlength="50">
            </div>
            <div class="checkbox-field">
                <input type="checkbox" name="documentacaoObrigatoria" id="doc-obrig-pass">
                <label for="doc-obrig-pass">Documentação Obrigatória</label>
            </div>
            <div class="form-field" style="grid-column: 1 / -1;">
                <label>Descrição *</label>
                <textarea name="descricaoTestes" required maxlength="500"></textarea>
            </div>
        </div>
    `;
}

function getInstalacaoEquipmentFields() {
    return `
        <div class="card-header">
            <h3 class="card-title">
                <i class="fas fa-cog"></i>
                Dados do Equipamento
            </h3>
        </div>
        
        <div class="form-grid">
            <div class="form-field">
                <label>Modelo *</label>
                <select name="modelo" required>
                    <option value="">Selecione...</option>
                    <option value="LABGEO PT1000">LABGEO PT1000</option>
                    <option value="LABGEO PT3000">LABGEO PT3000</option>
                    <option value="LABGEO PT1000 VET">LABGEO PT1000 VET</option>
                    <option value="LABGEO PT3000 VET">LABGEO PT3000 VET</option>
                    <option value="OUTROS">OUTROS</option>
                </select>
            </div>
            <div class="form-field">
                <label>Serial *</label>
                <input type="text" name="serial" required maxlength="15">
            </div>
            <div class="form-field">
                <label>Motivo da Solicitação *</label>
                <select name="motivo" required>
                    <option value="">Selecione...</option>
                    <option value="Demonstração Técnica">Demonstração Técnica</option>
                    <option value="Teste de Funcionalidade">Teste de Funcionalidade</option>
                    <option value="Avaliação Comercial">Avaliação Comercial</option>
                    <option value="Treinamento">Treinamento</option>
                    <option value="Outros">Outros</option>
                </select>
            </div>
            <div class="form-field">
                <label>Modelo Nobreak *</label>
                <input type="text" name="modeloNobreak" required maxlength="50">
            </div>
            <div class="form-field">
                <label>Modelo de Impressora</label>
                <input type="text" name="modeloImpressora" maxlength="50">
            </div>
            <div class="form-field">
                <label>Uso do Equipamento *</label>
                <select name="usoHumanoVeterinario" required>
                    <option value="">Selecione...</option>
                    <option value="HUMANO">HUMANO</option>
                    <option value="VETERINÁRIO">VETERINÁRIO</option>
                </select>
            </div>
            <div class="form-field">
                <label>Data Início da Demonstração *</label>
                <input type="date" name="dataInicial" required>
            </div>
            <div class="form-field">
                <label>Data Fim da Demonstração *</label>
                <input type="date" name="dataFinal" required>
            </div>
            <div class="form-field">
                <label>Responsável pela Instalação *</label>
                <select name="responsavelInstalacao" required>
                    <option value="">Selecione...</option>
                    <option value="Samsung">Samsung</option>
                    <option value="Representante">Representante</option>
                </select>
            </div>
            <div class="form-field">
                <label>BO *</label>
                <input type="text" name="numeroBO" required maxlength="50">
            </div>
            <div class="form-field" style="grid-column: 1 / -1;">
                <label>Descrição/Testes *</label>
                <textarea name="descricaoTestes" required maxlength="500"></textarea>
            </div>
        </div>
    `;
}

function getFileUploadArea() {
    return `
        <div class="card-header">
            <h3 class="card-title">
                <i class="fas fa-paperclip"></i>
                Anexos
            </h3>
        </div>
        
        <div class="file-upload-area" onclick="document.getElementById('file-input').click()">
            <div class="file-upload-icon">
                <i class="fas fa-cloud-upload-alt"></i>
            </div>
            <h4>Clique para selecionar arquivos</h4>
            <p>ou arraste e solte arquivos aqui</p>
            <small>Formatos aceitos: PDF, DOC, DOCX, JPG, PNG (máx. 10MB cada)</small>
            <input type="file" id="file-input" multiple accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" style="display: none;">
        </div>
        
        <div id="file-list" class="file-list"></div>
    `;
}

function getActionButtons(formType) {
    return `
        <div class="btn-group">
            <button type="button" class="btn btn-success" onclick="saveForm('${formType}')">
                <i class="fas fa-save"></i>
                Salvar
            </button>
            <button type="button" class="btn btn-primary" onclick="sendForm('${formType}')">
                <i class="fas fa-paper-plane"></i>
                Enviar
            </button>
            <button type="button" class="btn btn-warning" onclick="generatePDF('${formType}')">
                <i class="fas fa-file-pdf"></i>
                Gerar PDF
            </button>
            <button type="button" class="btn btn-secondary" onclick="clearForm('${formType}')">
                <i class="fas fa-eraser"></i>
                Limpar
            </button>
        </div>
    `;
}

function setupFormHandlers(formType) {
    // Setup file upload
    setupFileUpload();
    
    // Setup form-specific handlers
    if (formType === 'service') {
        setupServiceFormHandlers();
    } else if (formType === 'aplicacao') {
        setupAplicacaoFormHandlers();
    } else if (formType === 'password') {
        setupPasswordFormHandlers();
    }
    
    // Setup CEP lookup
    setupCEPLookup();
}

function setupFileUpload() {
    const fileInput = document.getElementById('file-input');
    const fileList = document.getElementById('file-list');
    const uploadArea = document.querySelector('.file-upload-area');
    
    let selectedFiles = [];
    
    fileInput.addEventListener('change', function(e) {
        handleFiles(e.target.files);
    });
    
    // Drag and drop
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        uploadArea.classList.add('dragover');
    });
    
    uploadArea.addEventListener('dragleave', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
    });
    
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        uploadArea.classList.remove('dragover');
        handleFiles(e.dataTransfer.files);
    });
    
    function handleFiles(files) {
        for (let file of files) {
            if (file.size > 10 * 1024 * 1024) {
                showToast(`Arquivo ${file.name} é muito grande (máx. 10MB)`, 'error');
                continue;
            }
            
            if (!file.type.match(/(pdf|doc|docx|jpg|jpeg|png)/i)) {
                showToast(`Tipo de arquivo ${file.name} não permitido`, 'error');
                continue;
            }
            
            selectedFiles.push(file);
        }
        
        updateFileList();
    }
    
    function updateFileList() {
        fileList.innerHTML = selectedFiles.map((file, index) => `
            <div class="file-item">
                <div class="file-info">
                    <i class="fas fa-file"></i>
                    <span>${file.name}</span>
                    <span class="file-size">(${formatFileSize(file.size)})</span>
                </div>
                <button type="button" class="file-remove" onclick="removeFile(${index})">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `).join('');
    }
    
    window.removeFile = function(index) {
        selectedFiles.splice(index, 1);
        updateFileList();
    };
    
    // Store files globally for access from other functions
    window.getSelectedFiles = function() {
        return selectedFiles;
    };
}

function setupServiceFormHandlers() {
    const motivoSelect = document.querySelector('[name="motivo"]');
    const instalacaoFields = document.getElementById('instalacao-fields');
    const nobreakField = document.getElementById('nobreak-field');
    const instalacaoCheckboxes = document.getElementById('instalacao-checkboxes');
    const dataAplicacaoField = document.getElementById('data-aplicacao-field');
    const necessarioAplicacao = document.querySelector('[name="necessarioAplicacao"]');
    
    motivoSelect.addEventListener('change', function() {
        if (this.value === 'Instalação Inicial') {
            instalacaoFields.style.display = 'block';
            nobreakField.style.display = 'block';
            instalacaoCheckboxes.style.display = 'block';
            
            // Make fields required
            document.querySelector('[name="modeloImpressora"]').required = true;
            document.querySelector('[name="modeloNobreak"]').required = true;
            document.querySelector('[name="documentacaoObrigatoria"]').checked = true;
        } else {
            instalacaoFields.style.display = 'none';
            nobreakField.style.display = 'none';
            instalacaoCheckboxes.style.display = 'none';
            dataAplicacaoField.style.display = 'none';
            
            // Remove required
            document.querySelector('[name="modeloImpressora"]').required = false;
            document.querySelector('[name="modeloNobreak"]').required = false;
            document.querySelector('[name="documentacaoObrigatoria"]').checked = false;
            document.querySelector('[name="necessarioAplicacao"]').checked = false;
            document.querySelector('[name="necessarioLicenca"]').checked = false;
        }
    });
    
    if (necessarioAplicacao) {
        necessarioAplicacao.addEventListener('change', function() {
            if (this.checked) {
                dataAplicacaoField.style.display = 'block';
                document.querySelector('[name="dataAplicacao"]').required = true;
            } else {
                dataAplicacaoField.style.display = 'none';
                document.querySelector('[name="dataAplicacao"]').required = false;
            }
        });
    }
}

function setupAplicacaoFormHandlers() {
    const motivoSelect = document.querySelector('[name="motivo"]');
    const boField = document.getElementById('bo-field');
    
    motivoSelect.addEventListener('change', function() {
        if (this.value === 'Aplicação Inicial') {
            boField.style.display = 'block';
            document.querySelector('[name="numeroBO"]').required = true;
        } else {
            boField.style.display = 'none';
            document.querySelector('[name="numeroBO"]').required = false;
        }
    });
}

function setupPasswordFormHandlers() {
    const motivoSelect = document.querySelector('[name="motivo"]');
    const docObrigCheckbox = document.querySelector('[name="documentacaoObrigatoria"]');
    
    motivoSelect.addEventListener('change', function() {
        if (['Licença Permanente', 'Licença Temporária'].includes(this.value)) {
            docObrigCheckbox.checked = true;
        } else {
            docObrigCheckbox.checked = false;
        }
    });
}

function setupCEPLookup() {
    const cepInput = document.querySelector('[name="cep"]');
    
    cepInput.addEventListener('blur', function() {
        const cep = this.value.replace(/\D/g, '');
        
        if (cep.length === 8) {
            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(response => response.json())
                .then(data => {
                    if (!data.erro) {
                        document.querySelector('[name="endereco"]').value = data.logradouro || '';
                        document.querySelector('[name="bairro"]').value = data.bairro || '';
                        document.querySelector('[name="cidade"]').value = data.localidade || '';
                        document.querySelector('[name="estado"]').value = data.uf || '';
                    }
                })
                .catch(error => {
                    console.log('Erro ao buscar CEP:', error);
                });
        }
    });
}

function saveForm(formType) {
    const formData = getFormData(formType);
    
    if (!validateFormData(formData, formType)) {
        return;
    }
    
    // Add metadata
    const entry = {
        id: generateId(),
        ...formData,
        formType: formType.toUpperCase(),
        createdAt: new Date().toISOString(),
        attachments: window.getSelectedFiles ? window.getSelectedFiles().map(file => ({
            name: file.name,
            size: file.size,
            type: file.type
        })) : []
    };
    
    rawData.push(entry);
    localStorage.setItem('miniescopo_data', JSON.stringify(rawData));
    
    showToast('Dados salvos com sucesso!', 'success');
}

function sendForm(formType) {
    const formData = getFormData(formType);
    
    if (!validateFormData(formData, formType)) {
        return;
    }
    
    // Save first
    saveForm(formType);
    
    // Then send email
    sendEmailNotification(formData, formType);
    
    showToast('Formulário enviado com sucesso!', 'success');
}

function generatePDF(formType) {
    const formData = getFormData(formType);
    
    if (!validateFormData(formData, formType)) {
        return;
    }
    
    // Create PDF content
    const pdfContent = generatePDFContent(formData, formType);
    
    // Open in new window for printing
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
            <head>
                <title>Relatório ${formType.toUpperCase()}</title>
                <style>
                    body { font-family: Arial, sans-serif; margin: 20px; }
                    .header { background: #667eea; color: white; padding: 20px; text-align: center; }
                    .section { margin: 20px 0; }
                    .field { margin: 10px 0; }
                    .label { font-weight: bold; }
                    table { width: 100%; border-collapse: collapse; }
                    th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                    th { background-color: #f2f2f2; }
                </style>
            </head>
            <body>
                ${pdfContent}
                <script>window.print();</script>
            </body>
        </html>
    `);
    
    showToast('PDF gerado com sucesso!', 'success');
}

function clearForm(formType) {
    if (confirm('Tem certeza que deseja limpar todos os campos?')) {
        const form = document.getElementById(`${formType}-form`);
        form.reset();
        
        // Clear file list
        if (document.getElementById('file-list')) {
            document.getElementById('file-list').innerHTML = '';
        }
        
        showToast('Formulário limpo com sucesso!', 'success');
    }
}

function getFormData(formType) {
    const form = document.getElementById(`${formType}-form`);
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        if (form.querySelector(`[name="${key}"][type="checkbox"]`)) {
            data[key] = form.querySelector(`[name="${key}"]`).checked;
        } else {
            data[key] = value;
        }
    }
    
    return data;
}

function validateFormData(formData, formType) {
    const requiredFields = getRequiredFields(formType);
    
    for (let field of requiredFields) {
        if (!formData[field] || formData[field].toString().trim() === '') {
            showToast(`Campo obrigatório: ${field}`, 'error');
            return false;
        }
    }
    
    // Validate CPF/CNPJ
    const cpfCnpj = formData.cpfCnpj.replace(/\D/g, '');
    if (cpfCnpj.length === 11) {
        if (!formData.dataNascimento) {
            showToast('Data de nascimento é obrigatória para CPF', 'error');
            return false;
        }
    }
    
    // Specific validations per form type
    if (formType === 'aplicacao' && formData.motivo === 'Aplicação Inicial' && !formData.numeroBO) {
        showToast('BO é obrigatório para Aplicação Inicial', 'error');
        return false;
    }
    
    return true;
}

function getRequiredFields(formType) {
    const baseFields = [
        'razaoSocial', 'cpfCnpj', 'telefone1', 'telefone2', 'email', 'responsavel',
        'endereco', 'cep', 'cidade', 'estado', 'bairro', 'numero',
        'modelo', 'serial', 'motivo'
    ];
    
    switch (formType) {
        case 'service':
            return [...baseFields, 'usoHumanoVeterinario', 'descricaoTestes'];
        case 'demonstracao':
            return [...baseFields, 'cronogramaInicio', 'cronogramaFim', 'usoHumanoVeterinario', 'justificativaDemo', 'descricaoEquipamento'];
        case 'aplicacao':
            return [...baseFields, 'dataAplicacao', 'descricaoTestes'];
        case 'password':
            return [...baseFields, 'previsaoFaturamento', 'numeroBO', 'descricaoTestes'];
        case 'instalacao':
            return [...baseFields, 'modeloNobreak', 'usoHumanoVeterinario', 'dataInicial', 'dataFinal', 'responsavelInstalacao', 'numeroBO', 'descricaoTestes'];
        default:
            return baseFields;
    }
}

function generatePDFContent(formData, formType) {
    const typeLabels = {
        service: 'SERVIÇO TÉCNICO',
        demonstracao: 'DEMONSTRAÇÃO',
        aplicacao: 'APLICAÇÃO',
        password: 'PASSWORD/LICENÇA',
        instalacao: 'INSTALAÇÃO DEMO'
    };
    
    return `
        <div class="header">
            <h1>Sistema MiniEscopo V4.9</h1>
            <h2>${typeLabels[formType]}</h2>
            <p>Data: ${new Date().toLocaleDateString('pt-BR')}</p>
        </div>
        
        <div class="section">
            <h3>Dados do Cliente</h3>
            <div class="field"><span class="label">Nome/Razão Social:</span> ${formData.razaoSocial || ''}</div>
            <div class="field"><span class="label">CPF/CNPJ:</span> ${formData.cpfCnpj || ''}</div>
            <div class="field"><span class="label">Telefone 1:</span> ${formData.telefone1 || ''}</div>
            <div class="field"><span class="label">Telefone 2:</span> ${formData.telefone2 || ''}</div>
            <div class="field"><span class="label">E-mail:</span> ${formData.email || ''}</div>
            <div class="field"><span class="label">Responsável:</span> ${formData.responsavel || ''}</div>
            ${formData.setorResponsavel ? `<div class="field"><span class="label">Setor:</span> ${formData.setorResponsavel}</div>` : ''}
        </div>
        
        <div class="section">
            <h3>Endereço</h3>
            <div class="field"><span class="label">CEP:</span> ${formData.cep || ''}</div>
            <div class="field"><span class="label">Endereço:</span> ${formData.endereco || ''}</div>
            <div class="field"><span class="label">Número:</span> ${formData.numero || ''}</div>
            <div class="field"><span class="label">Bairro:</span> ${formData.bairro || ''}</div>
            <div class="field"><span class="label">Cidade:</span> ${formData.cidade || ''}</div>
            <div class="field"><span class="label">Estado:</span> ${formData.estado || ''}</div>
        </div>
        
        <div class="section">
            <h3>Dados do Equipamento</h3>
            <div class="field"><span class="label">Modelo:</span> ${formData.modelo || ''}</div>
            <div class="field"><span class="label">Serial:</span> ${formData.serial || ''}</div>
            <div class="field"><span class="label">Motivo:</span> ${formData.motivo || ''}</div>
            ${formData.descricaoTestes ? `<div class="field"><span class="label">Descrição:</span> ${formData.descricaoTestes}</div>` : ''}
        </div>
    `;
}

function setupDataTableHandlers() {
    const searchInput = document.getElementById('search-input');
    const filterType = document.getElementById('filter-type');
    
    searchInput.addEventListener('input', filterDataTable);
    filterType.addEventListener('change', filterDataTable);
}

function filterDataTable() {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filterValue = document.getElementById('filter-type').value;
    
    const filteredData = rawData.filter(entry => {
        const matchesSearch = !searchTerm || 
            (entry.razaoSocial && entry.razaoSocial.toLowerCase().includes(searchTerm)) ||
            (entry.modelo && entry.modelo.toLowerCase().includes(searchTerm)) ||
            (entry.serial && entry.serial.toLowerCase().includes(searchTerm));
        
        const matchesType = !filterValue || entry.formType === filterValue;
        
        return matchesSearch && matchesType;
    });
    
    document.getElementById('data-table-container').innerHTML = generateDataTable(filteredData);
}

function generateDataTable(data = rawData) {
    if (data.length === 0) {
        return '<p class="text-center">Nenhum registro encontrado.</p>';
    }
    
    const typeLabels = {
        SERVICE: 'Serviço',
        DEMONSTRACAO: 'Demonstração',
        APLICACAO: 'Aplicação',
        PASSWORD: 'Password/Licença',
        INSTALACAO_DEMO: 'Instalação Demo'
    };
    
    return `
        <table class="data-table">
            <thead>
                <tr>
                    <th>Data</th>
                    <th>Tipo</th>
                    <th>Cliente</th>
                    <th>Modelo</th>
                    <th>Serial</th>
                    <th>Ações</th>
                </tr>
            </thead>
            <tbody>
                ${data.map(entry => `
                    <tr>
                        <td>${new Date(entry.createdAt).toLocaleDateString('pt-BR')}</td>
                        <td>${typeLabels[entry.formType] || entry.formType}</td>
                        <td>${entry.razaoSocial || entry.nomeCliente || 'N/A'}</td>
                        <td>${entry.modelo || 'N/A'}</td>
                        <td>${entry.serial || 'N/A'}</td>
                        <td>
                            <button class="btn btn-secondary btn-sm" onclick="editEntry('${entry.id}')">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="deleteEntry('${entry.id}')">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

function editEntry(id) {
    const entry = rawData.find(e => e.id === id);
    if (!entry) return;
    
    // Implement edit functionality
    showToast('Funcionalidade de edição em desenvolvimento', 'warning');
}

function deleteEntry(id) {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
        rawData = rawData.filter(e => e.id !== id);
        localStorage.setItem('miniescopo_data', JSON.stringify(rawData));
        
        // Refresh table
        filterDataTable();
        
        showToast('Registro excluído com sucesso!', 'success');
    }
}

function exportData() {
    const csvContent = generateCSV(rawData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `miniescopo_dados_${new Date().toISOString().slice(0, 10)}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
    
    showToast('Dados exportados com sucesso!', 'success');
}

function generateCSV(data) {
    const headers = [
        'Data', 'Tipo', 'Cliente', 'CPF/CNPJ', 'Telefone', 'Email',
        'Modelo', 'Serial', 'Motivo', 'Descrição'
    ];
    
    const rows = data.map(entry => [
        new Date(entry.createdAt).toLocaleDateString('pt-BR'),
        entry.formType,
        entry.razaoSocial || entry.nomeCliente || '',
        entry.cpfCnpj || '',
        entry.telefone1 || '',
        entry.email || '',
        entry.modelo || '',
        entry.serial || '',
        entry.motivo || '',
        entry.descricaoTestes || ''
    ].map(field => `"${field}"`).join(','));
    
    return [headers.join(','), ...rows].join('\n');
}

function sendEmailNotification(formData, formType) {
    // This would integrate with email service
    console.log('Sending email notification:', { formData, formType });
    
    // Add notification
    const notification = {
        id: generateId(),
        title: `Nova solicitação de ${formType}`,
        message: `Cliente: ${formData.razaoSocial}`,
        type: formType,
        active: true,
        createdAt: new Date().toISOString()
    };
    
    notifications.push(notification);
    localStorage.setItem('miniescopo_notifications', JSON.stringify(notifications));
    updateNotificationCount();
}

function showAdminConfig() {
    document.getElementById('admin-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('admin-modal').classList.add('hidden');
}

function showEmailConfig() {
    closeModal();
    document.getElementById('email-modal').classList.remove('hidden');
}

function closeEmailModal() {
    document.getElementById('email-modal').classList.add('hidden');
}

function logout() {
    if (confirm('Tem certeza que deseja sair do sistema?')) {
        currentUser = null;
        document.getElementById('main-app').classList.add('hidden');
        document.getElementById('login-container').classList.remove('hidden');
        
        // Reset form
        document.getElementById('login-form').reset();
        
        showToast('Logout realizado com sucesso!', 'success');
    }
}

// Utility functions
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-title">${type === 'success' ? 'Sucesso!' : type === 'error' ? 'Erro!' : 'Aviso!'}</div>
        <div class="toast-message">${message}</div>
    `;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        toast.remove();
    }, 5000);
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
