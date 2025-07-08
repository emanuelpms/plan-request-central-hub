
declare global {
  interface Window {
    emailService: {
      sendFormEmail: (formData: any, formType: string) => Promise<boolean>;
      isConfigured: () => boolean;
      showConfig: () => void;
      saveConfig: (config: any) => void;
    };
  }
}

export {};
