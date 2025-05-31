
import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, RotateCcw, Send, Loader2, Sparkles } from 'lucide-react';

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
    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 mt-8 border-t border-gray-200">
      {showClear && (
        <Button
          type="button"
          onClick={onClear}
          variant="outline"
          disabled={loading}
          className="group relative overflow-hidden bg-white hover:bg-gray-50 text-gray-700 border-2 border-gray-300 hover:border-gray-400 px-8 py-4 h-14 font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl rounded-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-gray-100/50 to-gray-200/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <RotateCcw className="w-5 h-5 mr-3 relative z-10" />
          <span className="relative z-10">LIMPAR</span>
        </Button>
      )}
      
      {showSave && (
        <Button
          type="button"
          onClick={onSave}
          disabled={loading}
          className="group relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white border-0 px-8 py-4 h-14 font-bold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl rounded-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          {loading ? (
            <Loader2 className="w-5 h-5 mr-3 animate-spin relative z-10" />
          ) : (
            <Save className="w-5 h-5 mr-3 relative z-10" />
          )}
          <span className="relative z-10">SALVAR</span>
          <div className="absolute top-2 right-2 w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
        </Button>
      )}
      
      {showSend && (
        <Button
          type="button"
          onClick={onSend}
          disabled={loading}
          className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white border-0 px-8 py-4 h-14 font-bold transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl rounded-2xl"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          {loading ? (
            <Loader2 className="w-5 h-5 mr-3 animate-spin relative z-10" />
          ) : (
            <Send className="w-5 h-5 mr-3 relative z-10" />
          )}
          <span className="relative z-10">ENVIAR</span>
          <Sparkles className="absolute top-2 right-2 w-3 h-3 text-yellow-300 animate-pulse" />
        </Button>
      )}
    </div>
  );
};

export default ActionButtons;
