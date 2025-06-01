
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Save, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { FormType } from '../types';

interface EmailConfiguration {
  formType: FormType;
  toEmails: string[];
  ccEmails: string[];
  subject: string;
  customMessage: string;
}

interface EmailConfigProps {
  onClose: () => void;
}

const EmailConfig: React.FC<EmailConfigProps> = ({ onClose }) => {
  const [selectedFormType, setSelectedFormType] = useState<FormType>('SERVICE');
  const [configurations, setConfigurations] = useState<Record<FormType, EmailConfiguration>>({
    SERVICE: {
      formType: 'SERVICE',
      toEmails: ['servico@empresa.com'],
      ccEmails: ['gerencia@empresa.com'],
      subject: 'Solicitação de Serviço Técnico - {razaoSocial}',
      customMessage: 'Prezados,\n\nSegue em anexo solicitação de serviço técnico.\n\nAtenciosamente,'
    },
    DEMONSTRACAO: {
      formType: 'DEMONSTRACAO',
      toEmails: ['vendas@empresa.com'],
      ccEmails: ['gerencia@empresa.com'],
      subject: 'Solicitação de Demonstração - {razaoSocial}',
      customMessage: 'Prezados,\n\nSegue em anexo solicitação de demonstração.\n\nAtenciosamente,'
    },
    APLICACAO: {
      formType: 'APLICACAO',
      toEmails: ['aplicacao@empresa.com'],
      ccEmails: ['gerencia@empresa.com'],
      subject: 'Solicitação de Aplicação - {razaoSocial}',
      customMessage: 'Prezados,\n\nSegue em anexo solicitação de aplicação.\n\nAtenciosamente,'
    },
    PASSWORD: {
      formType: 'PASSWORD',
      toEmails: ['licencas@empresa.com'],
      ccEmails: ['gerencia@empresa.com'],
      subject: 'Solicitação de Licença - {razaoSocial}',
      customMessage: 'Prezados,\n\nSegue em anexo solicitação de licença.\n\nAtenciosamente,'
    },
    INSTALACAO_DEMO: {
      formType: 'INSTALACAO_DEMO',
      toEmails: ['instalacao@empresa.com'],
      ccEmails: ['gerencia@empresa.com'],
      subject: 'Solicitação de Instalação Demo - {razaoSocial}',
      customMessage: 'Prezados,\n\nSegue em anexo solicitação de instalação demo.\n\nAtenciosamente,'
    }
  });

  const { toast } = useToast();

  useEffect(() => {
    const saved = localStorage.getItem('miniescopo_email_config');
    if (saved) {
      setConfigurations(JSON.parse(saved));
    }
  }, []);

  const currentConfig = configurations[selectedFormType];

  const updateConfiguration = (updates: Partial<EmailConfiguration>) => {
    const newConfigs = {
      ...configurations,
      [selectedFormType]: {
        ...currentConfig,
        ...updates
      }
    };
    setConfigurations(newConfigs);
  };

  const handleSave = () => {
    localStorage.setItem('miniescopo_email_config', JSON.stringify(configurations));
    toast({
      title: "Configurações salvas",
      description: "As configurações de email foram salvas com sucesso.",
    });
  };

  const formTypeLabels: Record<FormType, string> = {
    SERVICE: 'Serviço Técnico',
    DEMONSTRACAO: 'Demonstração',
    APLICACAO: 'Aplicação',
    PASSWORD: 'Password/Licença',
    INSTALACAO_DEMO: 'Instalação Demo'
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl bg-white max-h-[90vh] overflow-y-auto">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="w-6 h-6" />
              <CardTitle className="text-xl">Configuração de Emails</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              ✕
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          <div>
            <Label className="text-sm font-semibold mb-2 block">Tipo de Formulário</Label>
            <Select
              value={selectedFormType}
              onValueChange={(value) => setSelectedFormType(value as FormType)}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(formTypeLabels).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <Label className="text-sm font-semibold mb-2 block">Emails Para (separados por vírgula)</Label>
              <Textarea
                value={currentConfig.toEmails.join(', ')}
                onChange={(e) => updateConfiguration({
                  toEmails: e.target.value.split(',').map(email => email.trim()).filter(Boolean)
                })}
                className="min-h-[100px]"
                placeholder="email1@empresa.com, email2@empresa.com"
              />
            </div>

            <div>
              <Label className="text-sm font-semibold mb-2 block">Emails Cópia (separados por vírgula)</Label>
              <Textarea
                value={currentConfig.ccEmails.join(', ')}
                onChange={(e) => updateConfiguration({
                  ccEmails: e.target.value.split(',').map(email => email.trim()).filter(Boolean)
                })}
                className="min-h-[100px]"
                placeholder="gerencia@empresa.com, supervisor@empresa.com"
              />
            </div>
          </div>

          <div>
            <Label className="text-sm font-semibold mb-2 block">Assunto do Email</Label>
            <Input
              value={currentConfig.subject}
              onChange={(e) => updateConfiguration({ subject: e.target.value })}
              placeholder="Use {razaoSocial}, {nomeCliente}, etc. para substituições automáticas"
            />
            <p className="text-xs text-gray-500 mt-1">
              Variáveis disponíveis: {'{razaoSocial}'}, {'{nomeCliente}'}, {'{modelo}'}, {'{serial}'}
            </p>
          </div>

          <div>
            <Label className="text-sm font-semibold mb-2 block">Mensagem Personalizada</Label>
            <Textarea
              value={currentConfig.customMessage}
              onChange={(e) => updateConfiguration({ customMessage: e.target.value })}
              className="min-h-[120px]"
              placeholder="Mensagem que aparecerá no início do email"
            />
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <Button
              onClick={handleSave}
              className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800"
            >
              <Save className="w-4 h-4 mr-2" />
              Salvar Configurações
            </Button>
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailConfig;
