
declare global {
  interface Window {
    emailService: {
      sendFormEmail: (formData: any, formType: string) => Promise<boolean>;
      isConfigured: () => boolean;
      showConfig: () => void;
      saveConfig: (config: any) => void;
    };
    EmailService: {
      sendEmail: (formData: any, formType: string, motivo: string) => Promise<void>;
      getEmailConfig: (formType: string) => any;
      generateEmailBody: (formData: any, formType: string, motivo: string) => string;
      createEmailFile: (formData: any, formType: string, motivo: string) => void;
    };
  }
}

export {};
