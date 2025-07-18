
// Sistema MiniEscopo - JavaScript Puro
const AppState = {
    currentUser: null,
    currentTab: 'MENU',
    formData: {},
    isLoading: false
};

// Configuração de usuários
const USERS = {
    admin: {
        password: 'admin123',
        role: 'admin',
        name: 'Administrador',
        permissions: ['all']
    },
    tecnico: {
        password: 'tec123',
        role: 'tecnico',
        name: 'Técnico',
        permissions: ['service', 'data', 'demonstracao']
    },
    vendas: {
        password: 'vendas123',
        role: 'vendedor',
        name: 'Vendedor',
        permissions: ['demonstracao', 'aplicacao', 'password']
    }
};

// Utility functions
const Utils = {
    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <div class="toast-icon">
                    <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                </div>
                <div class="toast-text">
                    <strong>${type === 'success' ? 'Sucesso' : type === 'error' ? 'Erro' : 'Aviso'}</strong>
                    <p>${message}</p>
                </div>
            </div>
        `;
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 5000);
    },

    formatDate(date = new Date()) {
        return date.toLocaleDateString('pt-BR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },

    saveToStorage(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
    },

    getFromStorage(key, defaultValue = null) {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    },

    generateId() {
        return Date.now().toString() + Math.random().toString(36).substr(2, 9);
    },

    validateForm(formData, requiredFields) {
        const errors = [];
        requiredFields.forEach(field => {
            if (!formData[field] || formData[field].toString().trim() === '') {
                errors.push(`Campo ${field} é obrigatório`);
            }
        });
        return errors;
    },

    hasPermission(permission) {
        if (!AppState.currentUser) return false;
        const user = USERS[AppState.currentUser.username];
        return user && (user.permissions.includes('all') || user.permissions.includes(permission));
    }
};

// Authentication functions
function login(username, password) {
    const user = USERS[username];
    if (user && user.password === password) {
        AppState.currentUser = {
            username: username,
            role: user.role,
            name: user.name
        };
        Utils.saveToStorage('miniescopo_current_user', AppState.currentUser);
        return true;
    }
    return false;
}

function logout() {
    AppState.currentUser = null;
    localStorage.removeItem('miniescopo_current_user');
    showLogin();
}

function getCurrentUser() {
    if (!AppState.currentUser) {
        AppState.currentUser = Utils.getFromStorage('miniescopo_current_user');
    }
    return AppState.currentUser;
}

function isAdmin() {
    const user = getCurrentUser();
    return user && user.role === 'admin';
}

// UI Components
function createFormField(type, name, label, required = false, options = null, value = '') {
    const group = document.createElement('div');
    group.className = 'form-group';
    
    const labelEl = document.createElement('label');
    labelEl.textContent = label + (required ? ' *' : '');
    labelEl.setAttribute('for', name);
    group.appendChild(labelEl);
    
    let input;
    
    switch (type) {
        case 'select':
            input = document.createElement('select');
            input.innerHTML = '<option value="">Selecione...</option>';
            if (options) {
                options.forEach(opt => {
                    const option = document.createElement('option');
                    option.value = opt.value || opt;
                    option.textContent = opt.label || opt;
                    input.appendChild(option);
                });
            }
            break;
        case 'textarea':
            input = document.createElement('textarea');
            input.rows = 4;
            break;
        case 'checkbox':
            const checkboxGroup = document.createElement('div');
            checkboxGroup.className = 'checkbox-group';
            input = document.createElement('input');
            input.type = 'checkbox';
            const checkLabel = document.createElement('label');
            checkLabel.textContent = label;
            checkboxGroup.appendChild(input);
            checkboxGroup.appendChild(checkLabel);
            group.appendChild(checkboxGroup);
            input.id = name;
            input.name = name;
            if (value) input.checked = value;
            return group;
        default:
            input = document.createElement('input');
            input.type = type;
            break;
    }
    
    input.id = name;
    input.name = name;
    if (value) input.value = value;
    if (required) input.required = true;
    
    group.appendChild(input);
    return group;
}

function createActionButtons(formType, motivo) {
    const container = document.createElement('div');
    container.className = 'action-buttons';
    
    // Save button
    const saveBtn = document.createElement('button');
    saveBtn.className = 'action-btn btn-save';
    saveBtn.innerHTML = '<i class="fas fa-save"></i> SALVAR';
    saveBtn.onclick = () => handleSave(formType);
    
    // Clear button
    const clearBtn = document.createElement('button');
    clearBtn.className = 'action-btn btn-clear';
    clearBtn.innerHTML = '<i class="fas fa-trash"></i> LIMPAR';
    clearBtn.onclick = () => handleClear();
    
    // Send email button
    const sendBtn = document.createElement('button');
    sendBtn.className = 'action-btn btn-send';
    sendBtn.innerHTML = '<i class="fas fa-envelope"></i> ENVIAR EMAIL';
    sendBtn.onclick = () => handleSendEmail(formType, motivo);
    
    container.appendChild(saveBtn);
    container.appendChild(clearBtn);
    container.appendChild(sendBtn);
    
    return container;
}

function handleSave(formType) {
    const form = document.querySelector('#content-area form');
    if (!form) return;
    
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Add checkbox values
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
        data[cb.name] = cb.checked;
    });
    
    try {
        saveForm(formType, data);
        Utils.showToast('Formulário salvo com sucesso!');
    } catch (error) {
        Utils.showToast('Erro ao salvar formulário', 'error');
    }
}

function handleClear() {
    const form = document.querySelector('#content-area form');
    if (form) {
        form.reset();
        Utils.showToast('Formulário limpo');
    }
}

async function handleSendEmail(formType, motivo) {
    const form = document.querySelector('#content-area form');
    if (!form) return;
    
    const formData = new FormData(form);
    const data = {};
    
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // Add checkbox values
    const checkboxes = form.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(cb => {
        data[cb.name] = cb.checked;
    });
    
    // Get motivo from select if not provided
    if (!motivo && data.motivo) {
        motivo = data.motivo;
    }
    
    // Validate required fields
    const errors = Utils.validateForm(data, ['nomeCliente', 'modelo', 'serial']);
    if (errors.length > 0) {
        Utils.showToast(errors[0], 'error');
        return;
    }
    
    if (!motivo) {
        Utils.showToast('Motivo da solicitação é obrigatório', 'error');
        return;
    }
    
    try {
        await EmailService.sendEmail(data, formType, motivo);
        Utils.showToast('Email sendo aberto no Microsoft Outlook...');
    } catch (error) {
        Utils.showToast('Erro ao abrir o Microsoft Outlook: ' + error.message, 'error');
    }
}

// Form service
function saveForm(formType, data) {
    const forms = Utils.getFromStorage('miniescopo_forms', []);
    const newForm = {
        id: Utils.generateId(),
        type: formType,
        data: data,
        createdAt: new Date().toISOString(),
        createdBy: AppState.currentUser?.username || 'unknown'
    };
    forms.push(newForm);
    Utils.saveToStorage('miniescopo_forms', forms);
    return newForm;
}

function getForms(formType = null) {
    const forms = Utils.getFromStorage('miniescopo_forms', []);
    return formType ? forms.filter(f => f.type === formType) : forms;
}

function deleteForm(formId) {
    const forms = Utils.getFromStorage('miniescopo_forms', []);
    const updatedForms = forms.filter(f => f.id !== formId);
    Utils.saveToStorage('miniescopo_forms', updatedForms);
}

// Page renderers
function renderMenu() {
    const user = getCurrentUser();
    const userRole = user ? user.role : '';
    
    let menuItems = '';
    
    if (Utils.hasPermission('service')) {
        menuItems += `
            <div class="menu-card service-card" onclick="switchTab('SERVICE')">
                <div class="menu-card-icon">
                    <i class="fas fa-tools"></i>
                </div>
                <h3>Serviço Técnico</h3>
                <p>Solicitações de manutenção, reparo e suporte técnico especializado.</p>
            </div>
        `;
    }
    
    if (Utils.hasPermission('demonstracao')) {
        menuItems += `
            <div class="menu-card demo-card" onclick="switchTab('DEMONSTRACAO')">
                <div class="menu-card-icon">
                    <i class="fas fa-desktop"></i>
                </div>
                <h3>Demonstração</h3>
                <p>Agendamento de demonstrações de produtos e apresentações técnicas.</p>
            </div>
        `;
    }
    
    if (Utils.hasPermission('aplicacao')) {
        menuItems += `
            <div class="menu-card app-card" onclick="switchTab('APLICACAO')">
                <div class="menu-card-icon">
                    <i class="fas fa-file-alt"></i>
                </div>
                <h3>Aplicação</h3>
                <p>Solicitações de configuração e aplicação de software.</p>
            </div>
        `;
    }
    
    if (Utils.hasPermission('password')) {
        menuItems += `
            <div class="menu-card password-card" onclick="switchTab('PASSWORD')">
                <div class="menu-card-icon">
                    <i class="fas fa-key"></i>
                </div>
                <h3>Senha/Licença</h3>
                <p>Solicitações de passwords, licenças e ativação de funcionalidades.</p>
            </div>
        `;
    }
    
    menuItems += `
        <div class="menu-card install-card" onclick="switchTab('INSTALACAO_DEMO')">
            <div class="menu-card-icon">
                <i class="fas fa-download"></i>
            </div>
            <h3>Instalação Demo</h3>
            <p>Instalação de versões demonstrativas para avaliação.</p>
        </div>
    `;
    
    if (isAdmin()) {
        menuItems += `
            <div class="menu-card data-card" onclick="switchTab('RAWDATA')">
                <div class="menu-card-icon">
                    <i class="fas fa-database"></i>
                </div>
                <h3>Dados do Sistema</h3>
                <p>Visualização e gerenciamento de dados administrativos.</p>
            </div>
        `;
    }
    
    return `
        <div class="welcome-section">
            <h2>Bem-vindo, ${user ? user.name : 'Usuário'}!</h2>
            <p>Selecione uma das opções abaixo para começar:</p>
        </div>
        <div class="menu-container">
            ${menuItems}
        </div>
    `;
}

function renderServiceForm() {
    const container = document.createElement('div');
    container.className = 'form-container';
    
    const header = document.createElement('div');
    header.className = 'form-header';
    header.innerHTML = '<i class="fas fa-tools"></i><h2>SERVIÇO TÉCNICO</h2>';
    
    const content = document.createElement('div');
    content.className = 'form-content';
    
    const form = document.createElement('form');
    
    // Client data section
    const clientSection = document.createElement('div');
    clientSection.className = 'form-section';
    clientSection.innerHTML = '<div class="section-title"><i class="fas fa-user"></i> DADOS DO CLIENTE</div>';
    
    const clientRow1 = document.createElement('div');
    clientRow1.className = 'form-row';
    clientRow1.appendChild(createFormField('text', 'nomeCliente', 'Nome/Razão Social', true));
    clientRow1.appendChild(createFormField('text', 'cpfCnpj', 'CPF/CNPJ', true));
    
    const clientRow2 = document.createElement('div');
    clientRow2.className = 'form-row';
    clientRow2.appendChild(createFormField('tel', 'telefone1', 'Telefone 1', true));
    clientRow2.appendChild(createFormField('tel', 'telefone2', 'Telefone 2'));
    
    const clientRow3 = document.createElement('div');
    clientRow3.className = 'form-row';
    clientRow3.appendChild(createFormField('email', 'email', 'E-mail'));
    clientRow3.appendChild(createFormField('text', 'responsavel', 'Responsável'));
    
    const addressRow = document.createElement('div');
    addressRow.className = 'form-row';
    addressRow.appendChild(createFormField('text', 'endereco', 'Endereço'));
    addressRow.appendChild(createFormField('text', 'numero', 'Número'));
    addressRow.appendChild(createFormField('text', 'bairro', 'Bairro'));
    
    const addressRow2 = document.createElement('div');
    addressRow2.className = 'form-row';
    addressRow2.appendChild(createFormField('text', 'cidade', 'Cidade'));
    addressRow2.appendChild(createFormField('text', 'estado', 'Estado'));
    addressRow2.appendChild(createFormField('text', 'cep', 'CEP'));
    
    clientSection.appendChild(clientRow1);
    clientSection.appendChild(clientRow2);
    clientSection.appendChild(clientRow3);
    clientSection.appendChild(addressRow);
    clientSection.appendChild(addressRow2);
    
    // Equipment section
    const equipSection = document.createElement('div');
    equipSection.className = 'form-section';
    equipSection.innerHTML = '<div class="section-title"><i class="fas fa-cog"></i> DADOS DO EQUIPAMENTO</div>';
    
    const equipRow1 = document.createElement('div');
    equipRow1.className = 'form-row';
    
    const modeloOptions = [
        'LABGEO PT1000',
        'LABGEO PT3000',
        'LABGEO PT1000 VET',
        'LABGEO PT3000 VET',
        'OUTROS'
    ];
    
    equipRow1.appendChild(createFormField('select', 'modelo', 'Modelo', true, modeloOptions));
    equipRow1.appendChild(createFormField('text', 'serial', 'Serial', true));
    
    const motivoRow = document.createElement('div');
    motivoRow.className = 'form-row';
    const motivoOptions = [
        'Instalação Inicial',
        'Manutenção Preventiva',
        'Manutenção Corretiva',
        'Atualização de Software',
        'Troca de Peças',
        'Calibração',
        'Outros'
    ];
    motivoRow.appendChild(createFormField('select', 'motivo', 'Motivo da Solicitação', true, motivoOptions));
    
    const descRow = document.createElement('div');
    descRow.className = 'form-row';
    descRow.appendChild(createFormField('textarea', 'descricaoTestes', 'Descrição/Observações'));
    
    equipSection.appendChild(equipRow1);
    equipSection.appendChild(motivoRow);
    equipSection.appendChild(descRow);
    
    form.appendChild(clientSection);
    form.appendChild(equipSection);
    
    content.appendChild(form);
    content.appendChild(createActionButtons('SERVICE', ''));
    
    container.appendChild(header);
    container.appendChild(content);
    
    return container;
}

function renderRawData() {
    if (!isAdmin()) {
        return '<div class="error-message">Acesso negado. Apenas administradores podem visualizar esta página.</div>';
    }
    
    const forms = getForms();
    
    let tableContent = '';
    forms.forEach(form => {
        tableContent += `
            <tr>
                <td>${form.id}</td>
                <td>${form.type}</td>
                <td>${form.data.nomeCliente || 'N/A'}</td>
                <td>${new Date(form.createdAt).toLocaleString('pt-BR')}</td>
                <td>${form.createdBy}</td>
                <td>
                    <button class="btn-delete" onclick="deleteForm('${form.id}'); switchTab('RAWDATA')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    });
    
    return `
        <div class="form-container">
            <div class="form-header">
                <i class="fas fa-database"></i>
                <h2>DADOS DO SISTEMA</h2>
            </div>
            <div class="form-content">
                <div class="data-stats">
                    <div class="stat-card">
                        <i class="fas fa-file-alt"></i>
                        <div>
                            <h3>${forms.length}</h3>
                            <p>Formulários Salvos</p>
                        </div>
                    </div>
                </div>
                <div class="data-table-container">
                    <table class="data-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tipo</th>
                                <th>Cliente</th>
                                <th>Data</th>
                                <th>Usuário</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableContent || '<tr><td colspan="6">Nenhum formulário encontrado</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

// Main application functions
function showLoading() {
    document.getElementById('loading-screen').classList.remove('hidden');
    document.getElementById('login-container').classList.add('hidden');
    document.getElementById('main-app').classList.add('hidden');
}

function showLogin() {
    document.getElementById('loading-screen').classList.add('hidden');
    document.getElementById('login-container').classList.remove('hidden');
    document.getElementById('main-app').classList.add('hidden');
}

function showMainApp() {
    document.getElementById('loading-screen').classList.add('hidden');
    document.getElementById('login-container').classList.add('hidden');
    document.getElementById('main-app').classList.remove('hidden');
    
    updateUserInterface();
    switchTab('MENU');
}

function updateUserInterface() {
    const user = getCurrentUser();
    if (user) {
        document.getElementById('user-name').textContent = user.name;
        document.getElementById('user-role').textContent = `(${user.role})`;
        document.getElementById('current-date').textContent = Utils.formatDate();
        
        // Show admin features if user is admin
        if (user.role === 'admin') {
            document.getElementById('admin-config-btn').classList.remove('hidden');
            document.getElementById('rawdata-tab').classList.remove('hidden');
        }
        
        // Update navigation based on permissions
        updateNavigation();
    }
}

function updateNavigation() {
    const tabs = document.querySelectorAll('.nav-tab');
    tabs.forEach(tab => {
        const tabName = tab.dataset.tab.toLowerCase();
        if (tabName === 'menu' || Utils.hasPermission(tabName) || (tabName === 'rawdata' && isAdmin())) {
            tab.style.display = 'flex';
        } else {
            tab.style.display = 'none';
        }
    });
}

function switchTab(tabName) {
    AppState.currentTab = tabName;
    
    // Check permissions
    if (tabName !== 'MENU' && !Utils.hasPermission(tabName.toLowerCase()) && !(tabName === 'RAWDATA' && isAdmin())) {
        Utils.showToast('Você não tem permissão para acessar esta seção', 'error');
        return;
    }
    
    // Update navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    const activeTab = document.querySelector(`[data-tab="${tabName}"]`);
    if (activeTab) {
        activeTab.classList.add('active');
    }
    
    // Update content
    const contentArea = document.getElementById('content-area');
    
    switch (tabName) {
        case 'MENU':
            contentArea.innerHTML = renderMenu();
            break;
        case 'SERVICE':
            contentArea.innerHTML = '';
            contentArea.appendChild(renderServiceForm());
            break;
        case 'RAWDATA':
            contentArea.innerHTML = renderRawData();
            break;
        default:
            contentArea.innerHTML = `
                <div class="form-container">
                    <div class="form-header">
                        <i class="fas fa-construction"></i>
                        <h2>${tabName}</h2>
                    </div>
                    <div class="form-content">
                        <div class="coming-soon">
                            <i class="fas fa-hammer"></i>
                            <h3>Em Desenvolvimento</h3>
                            <p>Esta seção está sendo desenvolvida e estará disponível em breve.</p>
                        </div>
                    </div>
                </div>
            `;
    }
}

function showAdminConfig() {
    document.getElementById('admin-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('admin-modal').classList.add('hidden');
}

function showEmailConfig() {
    Utils.showToast('Configuração de email em desenvolvimento', 'warning');
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Show loading screen initially
    showLoading();
    
    // Simulate loading time
    setTimeout(() => {
        const user = getCurrentUser();
        if (user) {
            showMainApp();
        } else {
            showLogin();
        }
    }, 2000);
    
    // Login form handler
    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (login(username, password)) {
            Utils.showToast(`Bem-vindo ao sistema, ${getCurrentUser().name}!`);
            showMainApp();
        } else {
            Utils.showToast('Usuário ou senha incorretos', 'error');
        }
    });
    
    // Close modal on outside click
    document.getElementById('admin-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.add('hidden');
        }
    });
});
