
import React from 'react';
import './App.css';

function App() {
  React.useEffect(() => {
    // Load the main application script
    const script = document.createElement('script');
    script.src = '/app.js';
    script.async = true;
    document.body.appendChild(script);

    // Load the email service script
    const emailScript = document.createElement('script');
    emailScript.src = '/emailService.js';
    emailScript.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup scripts on unmount
      document.body.removeChild(script);
      if (document.body.contains(emailScript)) {
        document.body.removeChild(emailScript);
      }
    };
  }, []);

  return (
    <div className="App">
      {/* Loading Screen */}
      <div id="loading-screen" className="loading-screen">
        <div className="loading-content">
          <div className="loading-logo">
            <i className="fas fa-cogs"></i>
            <div className="loading-pulse"></div>
          </div>
          <h2>Sistema MiniEscopo</h2>
          <p>Carregando sistema...</p>
          <div className="loading-bar">
            <div className="loading-progress"></div>
          </div>
        </div>
      </div>

      {/* Login Container */}
      <div id="login-container" className="login-container hidden">
        <div className="login-background">
          <div className="login-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
          </div>
        </div>
        
        <div className="login-card">
          <div className="login-header">
            <div className="login-logo">
              <i className="fas fa-shield-halved"></i>
            </div>
            <h1>Sistema MiniEscopo</h1>
            <p>Acesse sua conta para continuar</p>
          </div>
          
          <form id="login-form" className="login-form">
            <div className="form-group">
              <label htmlFor="username">Usuário</label>
              <div className="input-group">
                <i className="fas fa-user"></i>
                <input type="text" id="username" name="username" placeholder="Digite seu usuário" required />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Senha</label>
              <div className="input-group">
                <i className="fas fa-lock"></i>
                <input type="password" id="password" name="password" placeholder="Digite sua senha" required />
                <button type="button" className="password-toggle">
                  <i className="fas fa-eye"></i>
                </button>
              </div>
            </div>
            
            <button type="submit" className="login-btn">
              <span className="btn-text">Entrar no Sistema</span>
              <span className="btn-loading hidden">
                <i className="fas fa-spinner fa-spin"></i>
                Entrando...
              </span>
            </button>
            
            <div className="login-info">
              <h4><i className="fas fa-info-circle"></i> Usuários de Acesso</h4>
              <div className="user-credentials">
                <div className="credential-item">
                  <strong>Administrador:</strong> <code>admin / admin123</code>
                </div>
                <div className="credential-item">
                  <strong>Técnico:</strong> <code>tecnico / tec123</code>
                </div>
                <div className="credential-item">
                  <strong>Vendedor:</strong> <code>vendas / vendas123</code>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Main Application */}
      <div id="main-app" className="main-app hidden">
        {/* Header */}
        <header className="app-header">
          <div className="header-container">
            <div className="header-left">
              <div className="logo-section">
                <div className="logo">
                  <i className="fas fa-cogs"></i>
                  <span className="logo-pulse"></span>
                </div>
                <div className="brand-info">
                  <h1>MiniEscopo</h1>
                  <div className="brand-meta">
                    <span className="version">V4.9</span>
                    <span className="subtitle">Sistema de Gestão</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="header-right">
              <div className="header-info">
                <div className="date-time">
                  <i className="fas fa-calendar-alt"></i>
                  <span id="current-date-time"></span>
                </div>
                
                <div className="notifications">
                  <button className="notification-btn">
                    <i className="fas fa-bell"></i>
                    <span className="notification-badge" id="notification-count">0</span>
                  </button>
                </div>
                
                <div className="user-menu">
                  <div className="user-info">
                    <div className="user-avatar">
                      <i className="fas fa-user"></i>
                    </div>
                    <div className="user-details">
                      <span className="user-name" id="user-name">Usuário</span>
                      <span className="user-role" id="user-role">Cargo</span>
                    </div>
                    <i className="fas fa-chevron-down"></i>
                  </div>
                  
                  <div className="user-dropdown hidden" id="user-dropdown">
                    <a href="#"><i className="fas fa-user-circle"></i> Perfil</a>
                    <a href="#" id="settings-link"><i className="fas fa-cog"></i> Configurações</a>
                    <hr />
                    <a href="#" className="logout-link"><i className="fas fa-sign-out-alt"></i> Sair</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation */}
        <nav className="app-navigation">
          <div className="nav-container">
            <div className="nav-tabs" id="nav-tabs">
              <button className="nav-tab active" data-tab="dashboard">
                <i className="fas fa-home"></i>
                <span>Dashboard</span>
              </button>
              <button className="nav-tab" data-tab="service">
                <i className="fas fa-tools"></i>
                <span>Serviço</span>
              </button>
              <button className="nav-tab" data-tab="demonstracao">
                <i className="fas fa-desktop"></i>
                <span>Demonstração</span>
              </button>
              <button className="nav-tab" data-tab="aplicacao">
                <i className="fas fa-file-alt"></i>
                <span>Aplicação</span>
              </button>
              <button className="nav-tab" data-tab="password">
                <i className="fas fa-key"></i>
                <span>Licenças</span>
              </button>
              <button className="nav-tab" data-tab="instalacao">
                <i className="fas fa-download"></i>
                <span>Instalação</span>
              </button>
              <button className="nav-tab hidden" data-tab="admin" id="admin-tab">
                <i className="fas fa-database"></i>
                <span>Administração</span>
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="app-main">
          <div className="content-container">
            <div id="content-area" className="content-area">
              {/* Content will be loaded here */}
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="app-footer">
          <div className="footer-container">
            <div className="footer-info">
              <p>&copy; 2024 Sistema MiniEscopo V4.9 - Todos os direitos reservados</p>
              <p>Desenvolvido para gestão empresarial completa</p>
            </div>
            <div className="footer-links">
              <a href="#">Ajuda</a>
              <a href="#">Suporte</a>
              <a href="#">Sobre</a>
            </div>
          </div>
        </footer>
      </div>

      {/* Toast Container */}
      <div id="toast-container" className="toast-container"></div>

      {/* Modal Container */}
      <div id="modal-overlay" className="modal-overlay hidden">
        <div className="modal-container">
          <div className="modal-header">
            <h3 id="modal-title">Título</h3>
            <button className="modal-close">
              <i className="fas fa-times"></i>
            </button>
          </div>
          <div className="modal-body" id="modal-body">
            {/* Modal content */}
          </div>
          <div className="modal-footer" id="modal-footer">
            {/* Modal actions */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
