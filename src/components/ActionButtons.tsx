
import React from 'react';
import { Button } from '@/components/ui/button';

interface ActionButtonsProps {
  onSave?: () => void;
  onClear?: () => void;
  onSend?: () => void;
  showSave?: boolean;
  showClear?: boolean;
  showSend?: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onSave,
  onClear,
  onSend,
  showSave = true,
  showClear = true,
  showSend = true
}) => {
  return (
    <div className="flex gap-4 justify-center mt-8">
      {showClear && (
        <Button
          type="button"
          onClick={onClear}
          variant="outline"
          className="bg-gray-600 text-white hover:bg-gray-700 px-8 py-2"
        >
          LIMPAR
        </Button>
      )}
      
      {showSave && (
        <Button
          type="button"
          onClick={onSave}
          className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-2"
        >
          SALVAR
        </Button>
      )}
      
      {showSend && (
        <Button
          type="button"
          onClick={onSend}
          className="bg-green-500 hover:bg-green-600 text-white px-8 py-2"
        >
          ENVIAR
        </Button>
      )}
    </div>
  );
};

export default ActionButtons;
