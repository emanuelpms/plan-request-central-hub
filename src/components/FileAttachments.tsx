
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Paperclip, Upload, X, FileText, Image, File } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FileAttachment {
  id: string;
  name: string;
  size: number;
  type: string;
  file: File;
}

interface FileAttachmentsProps {
  attachments: FileAttachment[];
  onAttachmentsChange: (attachments: FileAttachment[]) => void;
  maxFiles?: number;
  maxSizePerFile?: number; // em MB
}

const FileAttachments: React.FC<FileAttachmentsProps> = ({
  attachments,
  onAttachmentsChange,
  maxFiles = 10,
  maxSizePerFile = 10
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image;
    if (type.includes('pdf') || type.includes('document')) return FileText;
    return File;
  };

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const newAttachments: FileAttachment[] = [];
    const maxSizeBytes = maxSizePerFile * 1024 * 1024;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      if (attachments.length + newAttachments.length >= maxFiles) {
        toast({
          title: "Limite de arquivos atingido",
          description: `Máximo de ${maxFiles} arquivos permitidos.`,
          variant: "destructive"
        });
        break;
      }

      if (file.size > maxSizeBytes) {
        toast({
          title: "Arquivo muito grande",
          description: `${file.name} excede o limite de ${maxSizePerFile}MB.`,
          variant: "destructive"
        });
        continue;
      }

      newAttachments.push({
        id: Date.now().toString() + i,
        name: file.name,
        size: file.size,
        type: file.type,
        file: file
      });
    }

    if (newAttachments.length > 0) {
      onAttachmentsChange([...attachments, ...newAttachments]);
      toast({
        title: "Arquivos anexados",
        description: `${newAttachments.length} arquivo(s) adicionado(s) com sucesso.`,
      });
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeAttachment = (id: string) => {
    const updatedAttachments = attachments.filter(att => att.id !== id);
    onAttachmentsChange(updatedAttachments);
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-green-600 to-emerald-700 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <Paperclip className="w-5 h-5" />
          <CardTitle className="text-lg">ANEXOS</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-green-400 transition-colors">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileSelection}
            className="hidden"
            accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.jpg,.jpeg,.png,.gif"
          />
          <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 mb-2 font-medium">
            Clique para selecionar arquivos ou arraste e solte
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Máximo de {maxFiles} arquivos • {maxSizePerFile}MB por arquivo
          </p>
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800"
          >
            <Upload className="w-4 h-4 mr-2" />
            Selecionar Arquivos
          </Button>
        </div>

        {attachments.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold text-gray-700">Arquivos Anexados ({attachments.length})</h4>
            {attachments.map((attachment) => {
              const IconComponent = getFileIcon(attachment.type);
              return (
                <div
                  key={attachment.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{attachment.name}</p>
                      <p className="text-xs text-gray-500">{formatFileSize(attachment.size)}</p>
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeAttachment(attachment.id)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FileAttachments;
