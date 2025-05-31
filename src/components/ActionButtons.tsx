
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Trash2, Send, Loader2 } from 'lucide-react';

interface ActionButtonsProps {
  onSave?: () => void;
  onClear?: () => void;
  onSend?: () => void;
  showSave?: boolean;
  showClear?: boolean;
  showSend?: boolean;
  loading?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onSave,
  onClear,
  onSend,
  showSave = true,
  showClear = true,
  showSend = true,
  loading = false
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
      {showClear && (
        <Button
          type="button"
          onClick={onClear}
          variant="outline"
          disabled={loading}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 border-2 border-gray-300 hover:border-gray-400 px-8 py-3 h-12 font-semibold transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          LIMPAR
        </Button>
      )}
      
      {showSave && (
        <Button
          type="button"
          onClick={onSave}
          disabled={loading}
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 px-8 py-3 h-12 font-semibold transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-xl"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          SALVAR
        </Button>
      )}
      
      {showSend && (
        <Button
          type="button"
          onClick={onSend}
          disabled={loading}
          className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white border-0 px-8 py-3 h-12 font-semibold transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-xl"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Send className="w-4 h-4 mr-2" />
          )}
          ENVIAR
        </Button>
      )}
    </div>
  );
};

export default ActionButtons;
