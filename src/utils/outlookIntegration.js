
// Integração com Microsoft Outlook usando JavaScript puro
// Este arquivo contém funções específicas para abrir o Outlook

// Função para detectar se o Outlook está instalado
function isOutlookInstalled() {
  try {
    // Tentar criar objeto ActiveX do Outlook (Windows)
    if (typeof window.ActiveXObject !== 'undefined') {
      new window.ActiveXObject('Outlook.Application');
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

// Função para abrir Outlook com ActiveX (Windows)
function openOutlookActiveX(emailData) {
  try {
    const outlook = new window.ActiveXObject('Outlook.Application');
    const mailItem = outlook.CreateItem(0); // 0 = olMailItem
    
    mailItem.To = emailData.to;
    mailItem.CC = emailData.cc;
    mailItem.Subject = emailData.subject;
    mailItem.HTMLBody = emailData.body;
    
    // Exibir o email (não enviar automaticamente)
    mailItem.Display(true);
    
    return true;
  } catch (error) {
    console.error('Erro ao abrir Outlook via ActiveX:', error);
    return false;
  }
}

// Função para abrir Outlook via protocolo mailto
function openOutlookMailto(emailData) {
  try {
    const params = new URLSearchParams({
      subject: emailData.subject,
      cc: emailData.cc,
      body: emailData.body
    });
    
    const mailtoUrl = `mailto:${emailData.to}?${params.toString()}`;
    
    // Criar link temporário e clicar
    const link = document.createElement('a');
    link.href = mailtoUrl;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    return true;
  } catch (error) {
    console.error('Erro ao abrir Outlook via mailto:', error);
    return false;
  }
}

// Função para criar arquivo .msg (formato do Outlook)
function createOutlookFile(emailData) {
  try {
    // Criar conteúdo do arquivo .eml (compatível com Outlook)
    const emlContent = `To: ${emailData.to}
CC: ${emailData.cc}
Subject: ${emailData.subject}
MIME-Version: 1.0
Content-Type: text/html; charset=UTF-8

${emailData.body}`;

    const blob = new Blob([emlContent], { type: 'message/rfc822' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${emailData.subject.substring(0, 50)}.eml`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
    return true;
  } catch (error) {
    console.error('Erro ao criar arquivo de email:', error);
    return false;
  }
}

// Função principal para abrir o Outlook
function openOutlookEmail(emailData) {
  console.log('Tentando abrir Outlook com dados:', emailData);
  
  // Método 1: Tentar ActiveX primeiro (Windows com Outlook instalado)
  if (isOutlookInstalled()) {
    console.log('Outlook detectado, usando ActiveX...');
    if (openOutlookActiveX(emailData)) {
      return { success: true, method: 'ActiveX' };
    }
  }
  
  // Método 2: Usar protocolo mailto
  console.log('Tentando protocolo mailto...');
  if (openOutlookMailto(emailData)) {
    return { success: true, method: 'mailto' };
  }
  
  // Método 3: Criar arquivo .eml para download
  console.log('Criando arquivo .eml...');
  if (createOutlookFile(emailData)) {
    return { success: true, method: 'file' };
  }
  
  return { success: false, method: 'none' };
}

// Exportar para uso no React
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { openOutlookEmail, isOutlookInstalled };
}

// Disponibilizar globalmente
window.OutlookIntegration = { openOutlookEmail, isOutlookInstalled };
