
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Save, Trash2, Send, Settings } from 'lucide-react';
import EmailConfig from './EmailConfig';
import { sendEmailViaOutlook } from '@/services/emailService';
import { FormData, FormType } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

interface ActionButtonsProps {
  onSave: () => void;
  onClear: () => void;
  onSend?: () => void;
  formData: FormData;
  formType: FormType;
  motivo?: string;
  showEmailConfig?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  onSave, 
  onClear, 
  onSend,
  formData,
  formType,
  motivo = '',
  showEmailConfig = true 
}) => {
  const [showConfig, setShowConfig] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSendEmail = async () => {
    try {
      // Validar dados obrigatórios
      if (!formData.razaoSocial && !formData.nomeCliente) {
        toast({
          title: "Erro",
          description: "Nome/Razão Social é obrigatório.",
          variant: "destructive"
        });
        return;
      }

      if (!formData.modelo) {
        toast({
          title: "Erro",
          description: "Modelo é obrigatório.",
          variant: "destructive"
        });
        return;
      }

      if (!formData.serial || formData.serial.length !== 15) {
        toast({
          title: "Erro",
          description: "Serial deve ter exatamente 15 caracteres.",
          variant: "destructive"
        });
        return;
      }

      if (!motivo) {
        toast({
          title: "Erro",
          description: "Motivo da solicitação é obrigatório.",
          variant: "destructive"
        });
        return;
      }

      await sendEmailViaOutlook(formData, formType, motivo);
      
      toast({
        title: "Sucesso",
        description: "Email sendo aberto no Microsoft Outlook...",
      });

      // Chamar onSend se fornecido
      if (onSend) {
        onSend();
      }
      
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      toast({
        title: "Erro",
        description: "Erro ao abrir o Microsoft Outlook. Verifique se está instalado.",
        variant: "destructive"
      });
    }
  };

  // Só admins podem configurar emails
  const canConfigureEmail = user?.role === 'admin';

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <Button
          type="button"
          onClick={onSave}
          className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <Save className="w-5 h-5 mr-2" />
          SALVAR
        </Button>

        <Button
          type="button"
          onClick={onClear}
          variant="outline"
          className="w-full sm:w-auto border-2 border-gray-400 hover:border-red-500 text-gray-700 hover:text-red-600 font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <Trash2 className="w-5 h-5 mr-2" />
          LIMPAR
        </Button>

        <Button
          type="button"
          onClick={handleSendEmail}
          className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <Send className="w-5 h-5 mr-2" />
          ENVIAR EMAIL
        </Button>

        {showEmailConfig && canConfigureEmail && (
          <Button
            type="button"
            onClick={() => setShowConfig(true)}
            variant="outline"
            className="w-full sm:w-auto border-2 border-blue-400 hover:border-blue-600 text-blue-600 hover:text-blue-700 font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <Settings className="w-5 h-5 mr-2" />
            CONFIG EMAIL
          </Button>
        )}
      </div>

      {showConfig && canConfigureEmail && (
        <EmailConfig onClose={() => setShowConfig(false)} />
      )}
    </>
  );
};

export default ActionButtons;
