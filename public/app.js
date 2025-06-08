
// Global state management
const AppState = {
    currentUser: null,
    currentTab: 'MENU',
    formData: {},
    isLoading: false
};

// Utility functions
const Utils = {
    showToast(message, type = 'success') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <strong>${type === 'success' ? 'Sucesso' : type === 'error' ? 'Erro' : 'Aviso'}</strong>
                <p>${message}</p>
            </div>
        `;
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 5000);
    },

    formatDate(date = new Date()) {
        return date.toLocaleDateString('pt-BR');
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
    }
};

// Authentication service
const AuthService = {
    defaultUsers: [
        {
            id: '1',
            username: 'admin',
            password: 'admin123',
            role: 'admin',
            name: 'Administrador',
            email: 'admin@sistema.com',
            active: true
        }
    ],

    getUsers() {
        return Utils.getFromStorage('miniescopo_users', this.defaultUsers);
    },

    login(username, password) {
        const users = this.getUsers();
        const user = users.find(u => 
            u.username === username && 
            u.password === password && 
            u.active
        );
        
        if (user) {
            AppState.currentUser = {
                username: user.username,
                role: user.role,
                name: user.name
            };
            Utils.saveToStorage('miniescopo_current_user', AppState.currentUser);
            return true;
        }
        return false;
    },

    logout() {
        AppState.currentUser = null;
        localStorage.removeItem('miniescopo_current_user');
        showLogin();
    },

    getCurrentUser() {
        if (!AppState.currentUser) {
            AppState.currentUser = Utils.getFromStorage('miniescopo_current_user');
        }
        return AppState.currentUser;
    },

    isAdmin() {
        const user = this.getCurrentUser();
        return user && user.role === 'admin';
    }
};

// Form service
const FormService = {
    saveForm(formType, data) {
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
    },

    getForms(formType = null) {
        const forms = Utils.getFromStorage('miniescopo_forms', []);
        return formType ? forms.filter(f => f.type === formType) : forms;
    },

    deleteForm(formId) {
        const forms = Utils.getFromStorage('miniescopo_forms', []);
        const updatedForms = forms.filter(f => f.id !== formId);
        Utils.saveToStorage('miniescopo_forms', updatedForms);
    }
};

// UI Components
const Components = {
    createFormField(type, name, label, required = false, options = null, value = '') {
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
    },

    createActionButtons(formType, motivo) {
        const container = document.createElement('div');
        container.className = 'action-buttons';
        
        // Save button
        const saveBtn = document.createElement('button');
        saveBtn.className = 'action-btn btn-save';
        saveBtn.innerHTML = '<i class="fas fa-save"></i> SALVAR';
        saveBtn.onclick = () => this.handleSave(formType);
        
        // Clear button
        const clearBtn = document.createElement('button');
        clearBtn.className = 'action-btn btn-clear';
        clearBtn.innerHTML = '<i class="fas fa-trash"></i> LIMPAR';
        clearBtn.onclick = () => this.handleClear();
        
        // Send email button
        const sendBtn = document.createElement('button');
        sendBtn.className = 'action-btn btn-send';
        sendBtn.innerHTML = '<i class="fas fa-envelope"></i> ENVIAR EMAIL';
        sendBtn.onclick = () => this.handleSendEmail(formType, motivo);
        
        container.appendChild(saveBtn);
        container.appendChild(clearBtn);
        container.appendChild(sendBtn);
        
        // Config button for admin
        if (AuthService.isAdmin()) {
            const configBtn = document.createElement('button');
            configBtn.className = 'action-btn btn-config';
            configBtn.innerHTML = '<i class="fas fa-cog"></i> CONFIG EMAIL';
            configBtn.onclick = () => showEmailConfig();
            container.appendChild(configBtn);
        }
        
        return container;
    },

    handleSave(formType) {
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
            FormService.saveForm(formType, data);
            Utils.showToast('Formulário salvo com sucesso!');
        } catch (error) {
            Utils.showToast('Erro ao salvar formulário', 'error');
        }
    },

    handleClear() {
        const form = document.querySelector('#content-area form');
        if (form) {
            form.reset();
            Utils.showToast('Formulário limpo');
        }
    },

    async handleSendEmail(formType, motivo) {
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
        
        // Validate required fields
        const errors = Utils.validateForm(data, ['nomeCliente', 'modelo', 'serial']);
        if (errors.length > 0) {
            Utils.showToast(errors[0], 'error');
            return;
        }
        
        if (!data.serial || data.serial.length !== 15) {
            Utils.showToast('Serial deve ter exatamente 15 caracteres', 'error');
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
            Utils.showToast('Erro ao abrir o Microsoft Outlook', 'error');
        }
    }
};

// Page renderers
const PageRenderers = {
    renderMenu() {
        return `
            <div class="menu-container">
                <div class="menu-card service-card" onclick="switchTab('SERVICE')">
                    <div class="menu-card-icon">
                        <i class="fas fa-tools"></i>
                    </div>
                    <h3>Serviço Técnico</h3>
                    <p>Solicitações de manutenção, reparo e suporte técnico especializado para equipamentos.</p>
                </div>
                
                <div class="menu-card demo-card" onclick="switchTab('DEMONSTRACAO')">
                    <div class="menu-card-icon">
                        <i class="fas fa-desktop"></i>
                    </div>
                    <h3>Demonstração</h3>
                    <p>Agendamento de demonstrações de produtos e apresentações técnicas para clientes.</p>
                </div>
                
                <div class="menu-card app-card" onclick="switchTab('APLICACAO')">
                    <div class="menu-card-icon">
                        <i class="fas fa-file-alt"></i>
                    </div>
                    <h3>Aplicação</h3>
                    <p>Solicitações de configuração e aplicação de software em equipamentos específicos.</p>
                </div>
                
                <div class="menu-card password-card" onclick="switchTab('PASSWORD')">
                    <div class="menu-card-icon">
                        <i class="fas fa-key"></i>
                    </div>
                    <h3>Senha/Licença</h3>
                    <p>Solicitações de passwords, licenças e ativação de funcionalidades premium.</p>
                </div>
                
                <div class="menu-card install-card" onclick="switchTab('INSTALACAO_DEMO')">
                    <div class="menu-card-icon">
                        <i class="fas fa-download"></i>
                    </div>
                    <h3>Instalação Demo</h3>
                    <p>Instalação de versões demonstrativas para avaliação e testes preliminares.</p>
                </div>
                
                ${AuthService.isAdmin() ? `
                <div class="menu-card data-card" onclick="switchTab('RAWDATA')">
                    <div class="menu-card-icon">
                        <i class="fas fa-database"></i>
                    </div>
                    <h3>Dados do Sistema</h3>
                    <p>Visualização e gerenciamento de dados administrativos e relatórios do sistema.</p>
                </div>
                ` : ''}
            </div>
        `;
    },

    renderServiceForm() {
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
        clientRow1.appendChild(Components.createFormField('text', 'nomeCliente', 'Nome/Razão Social', true));
        clientRow1.appendChild(Components.createFormField('text', 'cpfCnpj', 'CPF/CNPJ', true));
        
        const clientRow2 = document.createElement('div');
        clientRow2.className = 'form-row';
        clientRow2.appendChild(Components.createFormField('tel', 'telefone1', 'Telefone 1', true));
        clientRow2.appendChild(Components.createFormField('tel', 'telefone2', 'Telefone 2'));
        
        const clientRow3 = document.createElement('div');
        clientRow3.className = 'form-row';
        clientRow3.appendChild(Components.createFormField('email', 'email', 'E-mail'));
        clientRow3.appendChild(Components.createFormField('text', 'responsavel', 'Responsável'));
        
        const addressRow = document.createElement('div');
        addressRow.className = 'form-row';
        addressRow.appendChild(Components.createFormField('text', 'endereco', 'Endereço'));
        addressRow.appendChild(Components.createFormField('text', 'numero', 'Número'));
        addressRow.appendChild(Components.createFormField('text', 'bairro', 'Bairro'));
        
        const addressRow2 = document.createElement('div');
        addressRow2.className = 'form-row';
        addressRow2.appendChild(Components.createFormField('text', 'cidade', 'Cidade'));
        addressRow2.appendChild(Components.createFormField('text', 'estado', 'Estado'));
        addressRow2.appendChild(Components.createFormField('text', 'cep', 'CEP'));
        
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
        equipRow1.appendChild(Components.createFormField('text', 'modelo', 'Modelo', true));
        equipRow1.appendChild(Components.createFormField('text', 'serial', 'Serial', true));
        
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
        motivoRow.appendChild(Components.createFormField('select', 'motivo', 'Motivo da Solicitação', true, motivoOptions));
        
        const descRow = document.createElement('div');
        descRow.className = 'form-row';
        descRow.appendChild(Components.createFormField('textarea', 'descricaoTestes', 'Descrição/Observações'));
        
        equipSection.appendChild(equipRow1);
        equipSection.appendChild(motivoRow);
        equipSection.appendChild(descRow);
        
        form.appendChild(clientSection);
        form.appendChild(equipSection);
        
        content.appendChild(form);
        content.appendChild(Components.createActionButtons('SERVICE', ''));
        
        container.appendChild(header);
        container.appendChild(content);
        
        return container;
    },

    renderDemoForm() {
        const container = document.createElement('div');
        container.className = 'form-container';
        
        const header = document.createElement('div');
        header.className = 'form-header';
        header.innerHTML = '<i class="fas fa-desktop"></i><h2>DEMONSTRAÇÃO</h2>';
        
        const content = document.createElement('div');
        content.className = 'form-content';
        
        const form = document.createElement('form');
        
        // Similar structure to service form but with demo-specific fields
        // Implementation would be similar to renderServiceForm()
        
        content.appendChild(form);
        content.appendChild(Components.createActionButtons('DEMONSTRACAO', 'Demonstração'));
        
        container.appendChild(header);
        container.appendChild(content);
        
        return container;
    },

    // Additional form renderers would follow similar patterns...
    
    renderRawData() {
        if (!AuthService.isAdmin()) {
            return '<div class="error-message">Acesso negado. Apenas administradores podem visualizar esta página.</div>';
        }
        
        const forms = FormService.getForms();
        
        return `
            <div class="form-container">
                <div class="form-header">
                    <i class="fas fa-database"></i>
                    <h2>DADOS DO SISTEMA</h2>
                </div>
                <div class="form-content">
                    <h3>Formulários Salvos (${forms.length})</h3>
                    <div class="data-table">
                        ${forms.map(form => `
                            <div class="data-row">
                                <strong>ID:</strong> ${form.id}<br>
                                <strong>Tipo:</strong> ${form.type}<br>
                                <strong>Data:</strong> ${new Date(form.createdAt).toLocaleString('pt-BR')}<br>
                                <strong>Usuário:</strong> ${form.createdBy}<br>
                                <button onclick="FormService.deleteForm('${form.id}'); switchTab('RAWDATA')">Excluir</button>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }
};

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
    const user = AuthService.getCurrentUser();
    if (user) {
        document.getElementById('user-name').textContent = user.username;
        document.getElementById('current-date').textContent = Utils.formatDate();
        
        // Show admin features if user is admin
        if (user.role === 'admin') {
            document.getElementById('admin-config-btn').classList.remove('hidden');
            document.getElementById('rawdata-tab').classList.remove('hidden');
        }
    }
}

function switchTab(tabName) {
    AppState.currentTab = tabName;
    
    // Update navigation
    document.querySelectorAll('.nav-tab').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
    
    // Update content
    const contentArea = document.getElementById('content-area');
    
    switch (tabName) {
        case 'MENU':
            contentArea.innerHTML = PageRenderers.renderMenu();
            break;
        case 'SERVICE':
            contentArea.innerHTML = '';
            contentArea.appendChild(PageRenderers.renderServiceForm());
            break;
        case 'DEMONSTRACAO':
            contentArea.innerHTML = '';
            contentArea.appendChild(PageRenderers.renderDemoForm());
            break;
        case 'RAWDATA':
            contentArea.innerHTML = PageRenderers.renderRawData();
            break;
        default:
            contentArea.innerHTML = `<div class="form-container">
                <div class="form-header">
                    <h2>${tabName}</h2>
                </div>
                <div class="form-content">
                    <p>Página em desenvolvimento...</p>
                </div>
            </div>`;
    }
}

function showEmailConfig() {
    // Email configuration modal implementation
    const modal = document.getElementById('admin-modal');
    const modalBody = modal.querySelector('.modal-body');
    
    modalBody.innerHTML = `
        <div class="email-config">
            <h3>Configuração de Email</h3>
            <p>Configurações para integração com Microsoft Outlook...</p>
            <!-- Email config form would go here -->
        </div>
    `;
    
    modal.classList.remove('hidden');
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    // Show loading screen initially
    showLoading();
    
    // Simulate loading time
    setTimeout(() => {
        const user = AuthService.getCurrentUser();
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
        
        if (AuthService.login(username, password)) {
            Utils.showToast(`Bem-vindo ao sistema, ${AuthService.getCurrentUser().name}!`);
            showMainApp();
        } else {
            Utils.showToast('Usuário, senha incorretos ou usuário inativo', 'error');
        }
    });
    
    // Logout handler
    document.getElementById('logout-btn').addEventListener('click', function() {
        AuthService.logout();
    });
    
    // Navigation handlers
    document.addEventListener('click', function(e) {
        if (e.target.closest('.nav-tab')) {
            const tab = e.target.closest('.nav-tab').dataset.tab;
            switchTab(tab);
        }
        
        if (e.target.closest('.modal-close')) {
            document.getElementById('admin-modal').classList.add('hidden');
        }
        
        if (e.target.closest('#admin-config-btn')) {
            showEmailConfig();
        }
    });
    
    // Close modal on outside click
    document.getElementById('admin-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.add('hidden');
        }
    });
});

// Global functions for onclick handlers
window.switchTab = switchTab;
window.showEmailConfig = showEmailConfig;
window.FormService = FormService;
