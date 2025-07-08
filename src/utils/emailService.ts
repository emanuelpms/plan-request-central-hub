
// Utilitário para garantir que o emailService está disponível
export const ensureEmailService = (): boolean => {
  if (typeof window !== 'undefined' && window.emailService) {
    return true;
  }
  
  // Tentar carregar o emailService se não estiver disponível
  const script = document.createElement('script');
  script.src = '/emailService.js';
  script.async = true;
  document.head.appendChild(script);
  
  return false;
};

export const sendEmail = async (formData: any, formType: string) => {
  if (!ensureEmailService()) {
    throw new Error('EmailService não está disponível');
  }
  
  if (!window.emailService.isConfigured()) {
    throw new Error('Configure o sistema de email antes de enviar');
  }
  
  return await window.emailService.sendFormEmail(formData, formType);
};
