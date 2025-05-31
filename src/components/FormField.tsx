
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  value: string | boolean;
  onChange: (value: string | boolean) => void;
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox';
  options?: string[];
  placeholder?: string;
  required?: boolean;
  className?: string;
  labelClassName?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  label,
  value,
  onChange,
  type = 'text',
  options = [],
  placeholder,
  required = false,
  className,
  labelClassName
}) => {
  const renderField = () => {
    switch (type) {
      case 'textarea':
        return (
          <Textarea
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="min-h-[80px]"
          />
        );
      
      case 'select':
        return (
          <Select value={value as string} onValueChange={onChange}>
            <SelectTrigger>
              <SelectValue placeholder={placeholder || "Selecione..."} />
            </SelectTrigger>
            <SelectContent className="bg-white z-50">
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={value as boolean}
              onCheckedChange={(checked) => onChange(!!checked)}
            />
            <span className="text-sm">{placeholder}</span>
          </div>
        );
      
      default:
        return (
          <Input
            type={type}
            value={value as string}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
          />
        );
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label className={cn(
        "bg-blue-800 text-white px-3 py-1 text-sm font-medium block",
        labelClassName
      )}>
        {label}
        {required && <span className="text-red-300 ml-1">*</span>}
      </Label>
      {renderField()}
    </div>
  );
};

export default FormField;
