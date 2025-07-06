
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
    },

    formatCPF(value) {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    },

    formatCNPJ(value) {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1/$2')
            .replace(/(\d{4})(\d{1,2})/, '$1-$2')
            .replace(/(-\d{2})\d+?$/, '$1');
    },

    formatPhone(value) {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2')
            .replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3')
            .replace(/(-\d{4})\d+?$/, '$1');
    },

    formatCEP(value) {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{5})(\d)/, '$1-$2')
            .replace(/(-\d{3})\d+?$/, '$1');
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
function createFormField(type, name, label, required = false, options = null, value = '', placeholder = '') {
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
    if (placeholder) input.placeholder = placeholder;
    if (required) input.required = true;
    
    // Add formatting for specific fields
    if (name === 'cpfCnpj') {
        input.addEventListener('input', function(e) {
            const value = e.target.value;
            if (value.length <= 14) {
                e.target.value = Utils.formatCPF(value);
            } else {
                e.target.value = Utils.formatCNPJ(value);
            }
        });
    }
    
    if (name.includes('telefone')) {
        input.addEventListener('input', function(e) {
            e.target.value = Utils.formatPhone(e.target.value);
        });
    }
    
    if (name === 'cep') {
        input.addEventListener('input', function(e) {
            e.target.value = Utils.formatCEP(e.target.value);
        });
        input.addEventListener('blur', function(e) {
            if (e.target.value.length === 9) {
                fetchAddressByCEP(e.target.value);
            }
        });
    }
    
    group.appendChild(input);
    return group;
}

function createActionButtons(formType) {
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
    sendBtn.onclick = () => handleSendEmail(formType);
    
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

async function handleSendEmail(formType) {
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
    
    // Validate required fields based on form type
    let requiredFields = ['razaoSocial', 'modelo', 'serial', 'motivo'];
    
    const errors = Utils.validateForm(data, requiredFields);
    if (errors.length > 0) {
        Utils.showToast(errors[0], 'error');
        return;
    }
    
    try {
        await sendFormEmail(data, formType);
    } catch (error) {
        Utils.showToast('Erro ao processar email: ' + error.message, 'error');
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

// CEP API integration
async function fetchAddressByCEP(cep) {
    try {
        const cleanCEP = cep.replace(/\D/g, '');
        const response = await fetch(`https://viacep.com.br/ws/${cleanCEP}/json/`);
        const data = await response.json();
        
        if (!data.erro) {
            document.getElementById('endereco').value = data.logradouro || '';
            document.getElementById('bairro').value = data.bairro || '';
            document.getElementById('cidade').value = data.localidade || '';
            document.getElementById('estado').value = data.uf || '';
            Utils.showToast('Endereço preenchido automaticamente!');
        }
    } catch (error) {
        console.error('Erro ao buscar CEP:', error);
    }
}

// Page renderers
function renderMenu() {
    const user = getCurrentUser();
    
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
    clientRow1.appendChild(createFormField('text', 'razaoSocial', 'Nome/Razão Social', true, null, '', 'Digite o nome ou razão social'));
    clientRow1.appendChild(createFormField('text', 'cpfCnpj', 'CPF/CNPJ', true, null, '', 'Digite o CPF ou CNPJ'));
    
    const clientRow2 = document.createElement('div');
    clientRow2.className = 'form-row';
    clientRow2.appendChild(createFormField('tel', 'telefone1', 'Telefone 1', true, null, '', '(00) 00000-0000'));
    clientRow2.appendChild(createFormField('tel', 'telefone2', 'Telefone 2', false, null, '', '(00) 00000-0000'));
    
    const clientRow3 = document.createElement('div');
    clientRow3.className = 'form-row';
    clientRow3.appendChild(createFormField('email', 'email', 'E-mail', false, null, '', 'email@exemplo.com'));
    clientRow3.appendChild(createFormField('text', 'responsavel', 'Responsável', false, null, '', 'Nome do responsável'));
    clientRow3.appendChild(createFormField('text', 'setorResponsavel', 'Setor Responsável', false, null, '', 'Setor/Departamento'));
    
    const addressRow = document.createElement('div');
    addressRow.className = 'form-row';
    addressRow.appendChild(createFormField('text', 'cep', 'CEP', false, null, '', '00000-000'));
    addressRow.appendChild(createFormField('text', 'endereco', 'Endereço', false, null, '', 'Rua, Avenida, etc.'));
    addressRow.appendChild(createFormField('text', 'numero', 'Número', false, null, '', 'Nº'));
    
    const addressRow2 = document.createElement('div');
    addressRow2.className = 'form-row';
    addressRow2.appendChild(createFormField('text', 'bairro', 'Bairro', false, null, '', 'Nome do bairro'));
    addressRow2.appendChild(createFormField('text', 'cidade', 'Cidade', false, null, '', 'Nome da cidade'));
    addressRow2.appendChild(createFormField('text', 'estado', 'Estado', false, null, '', 'UF'));
    
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
    equipRow1.appendChild(createFormField('text', 'serial', 'Serial', true, null, '', 'Número de série'));
    
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
    
    // Additional fields for service
    const serviceRow = document.createElement('div');
    serviceRow.className = 'form-row';
    const usoOptions = ['Humano', 'Veterinário'];
    serviceRow.appendChild(createFormField('select', 'usoHumanoVeterinario', 'Uso Humano/Veterinário', false, usoOptions));
    serviceRow.appendChild(createFormField('text', 'modeloImpressora', 'Modelo da Impressora', false, null, '', 'Modelo da impressora'));
    serviceRow.appendChild(createFormField('text', 'modeloNobreak', 'Modelo do Nobreak', false, null, '', 'Modelo do nobreak'));
    
    const descRow = document.createElement('div');
    descRow.className = 'form-row';
    descRow.appendChild(createFormField('textarea', 'descricaoTestes', 'Descrição/Observações', false, null, '', 'Descreva o problema ou observações adicionais'));
    
    equipSection.appendChild(equipRow1);
    equipSection.appendChild(motivoRow);
    equipSection.appendChild(serviceRow);
    equipSection.appendChild(descRow);
    
    form.appendChild(clientSection);
    form.appendChild(equipSection);
    
    content.appendChild(form);
    content.appendChild(createActionButtons('service'));
    
    container.appendChild(header);
    container.appendChild(content);
    
    return container;
}

function renderDemonstracaoForm() {
    const container = document.createElement('div');
    container.className = 'form-container';
    
    const header = document.createElement('div');
    header.className = 'form-header';
    header.innerHTML = '<i class="fas fa-desktop"></i><h2>DEMONSTRAÇÃO</h2>';
    
    const content = document.createElement('div');
    content.className = 'form-content';
    
    const form = document.createElement('form');
    
    // Client data section
    const clientSection = document.createElement('div');
    clientSection.className = 'form-section';
    clientSection.innerHTML = '<div class="section-title"><i class="fas fa-user"></i> DADOS DO CLIENTE</div>';
    
    const clientRow1 = document.createElement('div');
    clientRow1.className = 'form-row';
    clientRow1.appendChild(createFormField('text', 'razaoSocial', 'Nome/Razão Social', true, null, '', 'Digite o nome ou razão social'));
    clientRow1.appendChild(createFormField('text', 'cpfCnpj', 'CPF/CNPJ', true, null, '', 'Digite o CPF ou CNPJ'));
    
    const clientRow2 = document.createElement('div');
    clientRow2.className = 'form-row';
    clientRow2.appendChild(createFormField('tel', 'telefone1', 'Telefone 1', true, null, '', '(00) 00000-0000'));
    clientRow2.appendChild(createFormField('tel', 'telefone2', 'Telefone 2', false, null, '', '(00) 00000-0000'));
    
    const clientRow3 = document.createElement('div');
    clientRow3.className = 'form-row';
    clientRow3.appendChild(createFormField('email', 'email', 'E-mail', false, null, '', 'email@exemplo.com'));
    clientRow3.appendChild(createFormField('text', 'responsavel', 'Responsável', false, null, '', 'Nome do responsável'));
    clientRow3.appendChild(createFormField('text', 'setorResponsavel', 'Setor Responsável', false, null, '', 'Setor/Departamento'));
    
    const addressRow = document.createElement('div');
    addressRow.className = 'form-row';
    addressRow.appendChild(createFormField('text', 'cep', 'CEP', false, null, '', '00000-000'));
    addressRow.appendChild(createFormField('text', 'endereco', 'Endereço', false, null, '', 'Rua, Avenida, etc.'));
    addressRow.appendChild(createFormField('text', 'numero', 'Número', false, null, '', 'Nº'));
    
    const addressRow2 = document.createElement('div');
    addressRow2.className = 'form-row';
    addressRow2.appendChild(createFormField('text', 'bairro', 'Bairro', false, null, '', 'Nome do bairro'));
    addressRow2.appendChild(createFormField('text', 'cidade', 'Cidade', false, null, '', 'Nome da cidade'));
    addressRow2.appendChild(createFormField('text', 'estado', 'Estado', false, null, '', 'UF'));
    
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
    equipRow1.appendChild(createFormField('text', 'serial', 'Serial', true, null, '', 'Número de série'));
    
    const motivoRow = document.createElement('div');
    motivoRow.className = 'form-row';
    const motivoOptions = [
        'Apresentação de Produto',
        'Teste de Funcionalidades',
        'Avaliação Técnica',
        'Comparação com Concorrência',
        'Treinamento',
        'Outros'
    ];
    motivoRow.appendChild(createFormField('select', 'motivo', 'Motivo da Demonstração', true, motivoOptions));
    
    // Demo specific fields
    const demoSection = document.createElement('div');
    demoSection.className = 'form-section';
    demoSection.innerHTML = '<div class="section-title"><i class="fas fa-calendar"></i> CRONOGRAMA DA DEMONSTRAÇÃO</div>';
    
    const demoRow1 = document.createElement('div');
    demoRow1.className = 'form-row';
    demoRow1.appendChild(createFormField('date', 'cronogramaInicio', 'Data de Início', true));
    demoRow1.appendChild(createFormField('date', 'cronogramaFim', 'Data de Fim', true));
    
    const demoRow2 = document.createElement('div');
    demoRow2.className = 'form-row';
    demoRow2.appendChild(createFormField('textarea', 'justificativaDemo', 'Justificativa da Demonstração', false, null, '', 'Descreva o objetivo e justificativa da demonstração'));
    
    const demoRow3 = document.createElement('div');
    demoRow3.className = 'form-row';
    demoRow3.appendChild(createFormField('textarea', 'descricaoTestes', 'Descrição dos Testes', false, null, '', 'Descreva os testes que serão realizados'));
    
    demoSection.appendChild(demoRow1);
    demoSection.appendChild(demoRow2);
    demoSection.appendChild(demoRow3);
    
    form.appendChild(clientSection);
    form.appendChild(equipSection);
    form.appendChild(demoSection);
    
    content.appendChild(form);
    content.appendChild(createActionButtons('demonstracao'));
    
    container.appendChild(header);
    container.appendChild(content);
    
    return container;
}

function renderAplicacaoForm() {
    const container = document.createElement('div');
    container.className = 'form-container';
    
    const header = document.createElement('div');
    header.className = 'form-header';
    header.innerHTML = '<i class="fas fa-file-alt"></i><h2>APLICAÇÃO</h2>';
    
    const content = document.createElement('div');
    content.className = 'form-content';
    
    const form = document.createElement('form');
    
    // Client data section
    const clientSection = document.createElement('div');
    clientSection.className = 'form-section';
    clientSection.innerHTML = '<div class="section-title"><i class="fas fa-user"></i> DADOS DO CLIENTE</div>';
    
    const clientRow1 = document.createElement('div');
    clientRow1.className = 'form-row';
    clientRow1.appendChild(createFormField('text', 'razaoSocial', 'Nome/Razão Social', true, null, '', 'Digite o nome ou razão social'));
    clientRow1.appendChild(createFormField('text', 'cpfCnpj', 'CPF/CNPJ', true, null, '', 'Digite o CPF ou CNPJ'));
    
    const clientRow2 = document.createElement('div');
    clientRow2.className = 'form-row';
    clientRow2.appendChild(createFormField('tel', 'telefone1', 'Telefone 1', true, null, '', '(00) 00000-0000'));
    clientRow2.appendChild(createFormField('tel', 'telefone2', 'Telefone 2', false, null, '', '(00) 00000-0000'));
    
    const clientRow3 = document.createElement('div');
    clientRow3.className = 'form-row';
    clientRow3.appendChild(createFormField('email', 'email', 'E-mail', false, null, '', 'email@exemplo.com'));
    clientRow3.appendChild(createFormField('text', 'responsavel', 'Responsável', false, null, '', 'Nome do responsável'));
    clientRow3.appendChild(createFormField('text', 'setorResponsavel', 'Setor Responsável', false, null, '', 'Setor/Departamento'));
    
    const addressRow = document.createElement('div');
    addressRow.className = 'form-row';
    addressRow.appendChild(createFormField('text', 'cep', 'CEP', false, null, '', '00000-000'));
    addressRow.appendChild(createFormField('text', 'endereco', 'Endereço', false, null, '', 'Rua, Avenida, etc.'));
    addressRow.appendChild(createFormField('text', 'numero', 'Número', false, null, '', 'Nº'));
    
    const addressRow2 = document.createElement('div');
    addressRow2.className = 'form-row';
    addressRow2.appendChild(createFormField('text', 'bairro', 'Bairro', false, null, '', 'Nome do bairro'));
    addressRow2.appendChild(createFormField('text', 'cidade', 'Cidade', false, null, '', 'Nome da cidade'));
    addressRow2.appendChild(createFormField('text', 'estado', 'Estado', false, null, '', 'UF'));
    
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
    equipRow1.appendChild(createFormField('text', 'serial', 'Serial', true, null, '', 'Número de série'));
    
    const motivoRow = document.createElement('div');
    motivoRow.className = 'form-row';
    const motivoOptions = [
        'Configuração Inicial',
        'Atualização de Software',
        'Instalação de Módulos',
        'Configuração de Parâmetros',
        'Integração com Sistema',
        'Outros'
    ];
    motivoRow.appendChild(createFormField('select', 'motivo', 'Motivo da Aplicação', true, motivoOptions));
    
    // Application specific fields
    const appSection = document.createElement('div');
    appSection.className = 'form-section';
    appSection.innerHTML = '<div class="section-title"><i class="fas fa-calendar-check"></i> DADOS DA APLICAÇÃO</div>';
    
    const appRow1 = document.createElement('div');
    appRow1.className = 'form-row';
    appRow1.appendChild(createFormField('date', 'dataAplicacao', 'Data da Aplicação', true));
    appRow1.appendChild(createFormField('text', 'numeroBO', 'Número do BO', false, null, '', 'Número da ordem de serviço'));
    
    const appRow2 = document.createElement('div');
    appRow2.className = 'form-row';
    appRow2.appendChild(createFormField('textarea', 'descricaoTestes', 'Descrição da Aplicação', false, null, '', 'Descreva detalhadamente a aplicação a ser realizada'));
    
    appSection.appendChild(appRow1);
    appSection.appendChild(appRow2);
    
    form.appendChild(clientSection);
    form.appendChild(equipSection);
    form.appendChild(appSection);
    
    content.appendChild(form);
    content.appendChild(createActionButtons('aplicacao'));
    
    container.appendChild(header);
    container.appendChild(content);
    
    return container;
}

function renderPasswordForm() {
    const container = document.createElement('div');
    container.className = 'form-container';
    
    const header = document.createElement('div');
    header.className = 'form-header';
    header.innerHTML = '<i class="fas fa-key"></i><h2>SENHA/LICENÇA</h2>';
    
    const content = document.createElement('div');
    content.className = 'form-content';
    
    const form = document.createElement('form');
    
    // Client data section
    const clientSection = document.createElement('div');
    clientSection.className = 'form-section';
    clientSection.innerHTML = '<div class="section-title"><i class="fas fa-user"></i> DADOS DO CLIENTE</div>';
    
    const clientRow1 = document.createElement('div');
    clientRow1.className = 'form-row';
    clientRow1.appendChild(createFormField('text', 'razaoSocial', 'Nome/Razão Social', true, null, '', 'Digite o nome ou razão social'));
    clientRow1.appendChild(createFormField('text', 'cpfCnpj', 'CPF/CNPJ', true, null, '', 'Digite o CPF ou CNPJ'));
    
    const clientRow2 = document.createElement('div');
    clientRow2.className = 'form-row';
    clientRow2.appendChild(createFormField('tel', 'telefone1', 'Telefone 1', true, null, '', '(00) 00000-0000'));
    clientRow2.appendChild(createFormField('tel', 'telefone2', 'Telefone 2', false, null, '', '(00) 00000-0000'));
    
    const clientRow3 = document.createElement('div');
    clientRow3.className = 'form-row';
    clientRow3.appendChild(createFormField('email', 'email', 'E-mail', false, null, '', 'email@exemplo.com'));
    clientRow3.appendChild(createFormField('text', 'responsavel', 'Responsável', false, null, '', 'Nome do responsável'));
    clientRow3.appendChild(createFormField('text', 'setorResponsavel', 'Setor Responsável', false, null, '', 'Setor/Departamento'));
    
    const addressRow = document.createElement('div');
    addressRow.className = 'form-row';
    addressRow.appendChild(createFormField('text', 'cep', 'CEP', false, null, '', '00000-000'));
    addressRow.appendChild(createFormField('text', 'endereco', 'Endereço', false, null, '', 'Rua, Avenida, etc.'));
    addressRow.appendChild(createFormField('text', 'numero', 'Número', false, null, '', 'Nº'));
    
    const addressRow2 = document.createElement('div');
    addressRow2.className = 'form-row';
    addressRow2.appendChild(createFormField('text', 'bairro', 'Bairro', false, null, '', 'Nome do bairro'));
    addressRow2.appendChild(createFormField('text', 'cidade', 'Cidade', false, null, '', 'Nome da cidade'));
    addressRow2.appendChild(createFormField('text', 'estado', 'Estado', false, null, '', 'UF'));
    
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
    equipRow1.appendChild(createFormField('text', 'serial', 'Serial', true, null, '', 'Número de série'));
    
    const motivoRow = document.createElement('div');
    motivoRow.className = 'form-row';
    const motivoOptions = [
        'Solicitação de Password',
        'Renovação de Licença',
        'Ativação de Funcionalidade',
        'Reset de Sistema',
        'Desbloqueio de Equipamento',
        'Outros'
    ];
    motivoRow.appendChild(createFormField('select', 'motivo', 'Motivo da Solicitação', true, motivoOptions));
    
    // Password specific fields
    const passSection = document.createElement('div');
    passSection.className = 'form-section';
    passSection.innerHTML = '<div class="section-title"><i class="fas fa-shield-alt"></i> DADOS DA LICENÇA</div>';
    
    const passRow1 = document.createElement('div');
    passRow1.className = 'form-row';
    passRow1.appendChild(createFormField('date', 'previsaoFaturamento', 'Previsão de Faturamento', false));
    passRow1.appendChild(createFormField('text', 'numeroBO', 'Número do BO', false, null, '', 'Número da ordem de serviço'));
    
    const passRow2 = document.createElement('div');
    passRow2.className = 'form-row';
    passRow2.appendChild(createFormField('textarea', 'descricaoTestes', 'Descrição/Justificativa', false, null, '', 'Descreva a necessidade da senha/licença'));
    
    passSection.appendChild(passRow1);
    passSection.appendChild(passRow2);
    
    form.appendChild(clientSection);
    form.appendChild(equipSection);
    form.appendChild(passSection);
    
    content.appendChild(form);
    content.appendChild(createActionButtons('password'));
    
    container.appendChild(header);
    container.appendChild(content);
    
    return container;
}

function renderInstalacaoForm() {
    const container = document.createElement('div');
    container.className = 'form-container';
    
    const header = document.createElement('div');
    header.className = 'form-header';
    header.innerHTML = '<i class="fas fa-download"></i><h2>INSTALAÇÃO DEMO</h2>';
    
    const content = document.createElement('div');
    content.className = 'form-content';
    
    const form = document.createElement('form');
    
    // Client data section
    const clientSection = document.createElement('div');
    clientSection.className = 'form-section';
    clientSection.innerHTML = '<div class="section-title"><i class="fas fa-user"></i> DADOS DO CLIENTE</div>';
    
    const clientRow1 = document.createElement('div');
    clientRow1.className = 'form-row';
    clientRow1.appendChild(createFormField('text', 'razaoSocial', 'Nome/Razão Social', true, null, '', 'Digite o nome ou razão social'));
    clientRow1.appendChild(createFormField('text', 'cpfCnpj', 'CPF/CNPJ', true, null, '', 'Digite o CPF ou CNPJ'));
    
    const clientRow2 = document.createElement('div');
    clientRow2.className = 'form-row';
    clientRow2.appendChild(createFormField('tel', 'telefone1', 'Telefone 1', true, null, '', '(00) 00000-0000'));
    clientRow2.appendChild(createFormField('tel', 'telefone2', 'Telefone 2', false, null, '', '(00) 00000-0000'));
    
    const clientRow3 = document.createElement('div');
    clientRow3.className = 'form-row';
    clientRow3.appendChild(createFormField('email', 'email', 'E-mail', false, null, '', 'email@exemplo.com'));
    clientRow3.appendChild(createFormField('text', 'responsavel', 'Responsável', false, null, '', 'Nome do responsável'));
    clientRow3.appendChild(createFormField('text', 'setorResponsavel', 'Setor Responsável', false, null, '', 'Setor/Departamento'));
    
    const addressRow = document.createElement('div');
    addressRow.className = 'form-row';
    addressRow.appendChild(createFormField('text', 'cep', 'CEP', false, null, '', '00000-000'));
    addressRow.appendChild(createFormField('text', 'endereco', 'Endereço', false, null, '', 'Rua, Avenida, etc.'));
    addressRow.appendChild(createFormField('text', 'numero', 'Número', false, null, '', 'Nº'));
    
    const addressRow2 = document.createElement('div');
    addressRow2.className = 'form-row';
    addressRow2.appendChild(createFormField('text', 'bairro', 'Bairro', false, null, '', 'Nome do bairro'));
    addressRow2.appendChild(createFormField('text', 'cidade', 'Cidade', false, null, '', 'Nome da cidade'));
    addressRow2.appendChild(createFormField('text', 'estado', 'Estado', false, null, '', 'UF'));
    
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
    equipRow1.appendChild(createFormField('text', 'serial', 'Serial', true, null, '', 'Número de série'));
    
    const motivoRow = document.createElement('div');
    motivoRow.className = 'form-row';
    const motivoOptions = [
        'Instalação para Teste',
        'Avaliação de Produto',
        'Período de Experimentação',
        'Comparação Técnica',
        'Treinamento',
        'Outros'
    ];
    motivoRow.appendChild(createFormField('select', 'motivo', 'Motivo da Instalação', true, motivoOptions));
    
    // Installation specific fields
    const installSection = document.createElement('div');
    installSection.className = 'form-section';
    installSection.innerHTML = '<div class="section-title"><i class="fas fa-calendar-alt"></i> CRONOGRAMA DE INSTALAÇÃO</div>';
    
    const installRow1 = document.createElement('div');
    installRow1.className = 'form-row';
    installRow1.appendChild(createFormField('date', 'dataInicial', 'Data Inicial', true));
    installRow1.appendChild(createFormField('date', 'dataFinal', 'Data Final', true));
    
    const installRow2 = document.createElement('div');
    installRow2.className = 'form-row';
    installRow2.appendChild(createFormField('text', 'responsavelInstalacao', 'Responsável pela Instalação', false, null, '', 'Nome do técnico responsável'));
    
    const installRow3 = document.createElement('div');
    installRow3.className = 'form-row';
    installRow3.appendChild(createFormField('textarea', 'descricaoTestes', 'Observações da Instalação', false, null, '', 'Descreva observações sobre a instalação'));
    
    installSection.appendChild(installRow1);
    installSection.appendChild(installRow2);
    installSection.appendChild(installRow3);
    
    form.appendChild(clientSection);
    form.appendChild(equipSection);
    form.appendChild(installSection);
    
    content.appendChild(form);
    content.appendChild(createActionButtons('instalacao'));
    
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
                <td>${form.type.toUpperCase()}</td>
                <td>${form.data.razaoSocial || 'N/A'}</td>
                <td>${form.data.modelo || 'N/A'}</td>
                <td>${form.data.serial || 'N/A'}</td>
                <td>${new Date(form.createdAt).toLocaleString('pt-BR')}</td>
                <td>${form.createdBy}</td>
                <td>
                    <button class="btn-delete" onclick="confirmDelete('${form.id}')">
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
                    <div class="stat-card">
                        <i class="fas fa-tools"></i>
                        <div>
                            <h3>${forms.filter(f => f.type === 'service').length}</h3>
                            <p>Serviços</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <i class="fas fa-desktop"></i>
                        <div>
                            <h3>${forms.filter(f => f.type === 'demonstracao').length}</h3>
                            <p>Demonstrações</p>
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
                                <th>Modelo</th>
                                <th>Serial</th>
                                <th>Data</th>
                                <th>Usuário</th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${tableContent || '<tr><td colspan="8">Nenhum formulário encontrado</td></tr>'}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
}

function confirmDelete(formId) {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
        deleteForm(formId);
        switchTab('RAWDATA');
        Utils.showToast('Registro excluído com sucesso!');
    }
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
        if (tabName === 'menu' || Utils.hasPermission(tabName) || (tabName === 'rawdata' && isAdmin()) || tabName === 'instalacao_demo') {
            tab.style.display = 'flex';
        } else {
            tab.style.display = 'none';
        }
    });
}

function switchTab(tabName) {
    AppState.currentTab = tabName;
    
    // Check permissions
    if (tabName !== 'MENU' && tabName !== 'INSTALACAO_DEMO' && !Utils.hasPermission(tabName.toLowerCase()) && !(tabName === 'RAWDATA' && isAdmin())) {
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
        case 'DEMONSTRACAO':
            contentArea.innerHTML = '';
            contentArea.appendChild(renderDemonstracaoForm());
            break;
        case 'APLICACAO':
            contentArea.innerHTML = '';
            contentArea.appendChild(renderAplicacaoForm());
            break;
        case 'PASSWORD':
            contentArea.innerHTML = '';
            contentArea.appendChild(renderPasswordForm());
            break;
        case 'INSTALACAO_DEMO':
            contentArea.innerHTML = '';
            contentArea.appendChild(renderInstalacaoForm());
            break;
        case 'RAWDATA':
            contentArea.innerHTML = renderRawData();
            break;
    }
}

function showAdminConfig() {
    document.getElementById('admin-modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('admin-modal').classList.add('hidden');
}

function showEmailConfig() {
    document.getElementById('email-modal').classList.remove('hidden');
}

function closeEmailModal() {
    document.getElementById('email-modal').classList.add('hidden');
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
    
    document.getElementById('email-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            this.classList.add('hidden');
        }
    });
});
