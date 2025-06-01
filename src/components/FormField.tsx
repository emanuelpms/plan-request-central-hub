import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

interface FormFieldProps {
  label: string;
  value: string | boolean;
  onChange: (value: string | boolean) => void;
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'date' | 'cep' | 'cpf-cnpj';
  options?: string[];
  placeholder?: string;
  required?: boolean;
  className?: string;
  labelClassName?: string;
  loading?: boolean;
  maxLength?: number;
  autoFormat?: boolean;
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
  labelClassName,
  loading = false,
  maxLength,
  autoFormat = false
}) => {
  const [focused, setFocused] = useState(false);
  const [isValid, setIsValid] = useState(true);

  const handleInputChange = (inputValue: string) => {
    let formattedValue = inputValue;
    
    if (autoFormat && type !== 'email') {
      formattedValue = inputValue.toUpperCase();
    }
    
    // Validação especial para campo serial (15 caracteres exatos)
    if (label.toLowerCase().includes('serial')) {
      if (formattedValue.length > 15) {
        formattedValue = formattedValue.slice(0, 15);
      }
      setIsValid(formattedValue.length === 15 || formattedValue.length === 0);
    } else {
      if (maxLength) {
        formattedValue = formattedValue.slice(0, maxLength);
      }
      
      // Validação básica
      if (required && !formattedValue && type !== 'checkbox') {
        setIsValid(false);
      } else {
        setIsValid(true);
      }
    }
    
    onChange(formattedValue);
  };

  const getStatusIcon = () => {
    if (loading) return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
    
    // Validação especial para serial
    if (label.toLowerCase().includes('serial')) {
      const serialValue = value as string;
      if (serialValue && serialValue.length > 0) {
        if (serialValue.length === 15) {
          return <CheckCircle className="w-4 h-4 text-green-500" />;
        } else {
          return <AlertCircle className="w-4 h-4 text-red-500" />;
        }
      }
    } else {
      if (!isValid && (value as string)?.length > 0) return <AlertCircle className="w-4 h-4 text-red-500" />;
      if (isValid && (value as string)?.length > 0 && required) return <CheckCircle className="w-4 h-4 text-green-500" />;
    }
    
    return null;
  };

  const renderField = () => {
    const baseInputClass = cn(
      "w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ease-in-out",
      "bg-white/90 backdrop-blur-sm placeholder:text-gray-500",
      focused 
        ? "border-blue-500 shadow-xl shadow-blue-500/20 ring-4 ring-blue-500/10" 
        : "border-gray-300 hover:border-gray-400",
      !isValid && "border-red-400 shadow-red-500/20",
      "focus:outline-none text-gray-900 font-medium",
      className
    );

    const effectiveMaxLength = label.toLowerCase().includes('serial') ? 15 : maxLength;

    switch (type) {
      case 'textarea':
        return (
          <div className="relative">
            <Textarea
              value={value as string}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={placeholder}
              className={cn(baseInputClass, "min-h-[120px] resize-none leading-relaxed")}
              maxLength={effectiveMaxLength}
            />
            <div className="flex justify-between items-center mt-2">
              <div className="absolute top-3 right-3">
                {getStatusIcon()}
              </div>
              {effectiveMaxLength && (
                <div className="text-xs text-gray-500 ml-auto">
                  {(value as string).length}/{effectiveMaxLength}
                  {label.toLowerCase().includes('serial') && (
                    <span className="ml-2 text-red-500">
                      (Exatamente 15 caracteres)
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      
      case 'select':
        return (
          <Select value={value as string} onValueChange={onChange}>
            <SelectTrigger className={cn(baseInputClass, "h-12 text-left bg-white/90")}>
              <SelectValue placeholder={placeholder || "Selecione uma opção..."} />
            </SelectTrigger>
            <SelectContent className="bg-white/95 backdrop-blur-xl border-2 border-gray-200 shadow-2xl z-50 max-h-60 rounded-xl">
              {options.map((option) => (
                <SelectItem 
                  key={option} 
                  value={option}
                  className="hover:bg-blue-50 cursor-pointer py-3 px-4 transition-colors rounded-lg mx-1"
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center space-x-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border-2 border-blue-200 hover:border-blue-300 transition-all duration-300">
            <Checkbox
              checked={value as boolean}
              onCheckedChange={(checked) => onChange(!!checked)}
              className="w-5 h-5 rounded-md border-2 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
            />
            <span className="text-sm font-medium text-gray-700 select-none">{placeholder}</span>
          </div>
        );

      case 'date':
        return (
          <div className="relative">
            <Input
              type="date"
              value={value as string}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              className={cn(baseInputClass, "h-12")}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {getStatusIcon()}
            </div>
          </div>
        );

      default:
        return (
          <div className="relative">
            <Input
              type={type}
              value={value as string}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={placeholder}
              className={cn(baseInputClass, "h-12")}
              maxLength={effectiveMaxLength}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              {getStatusIcon()}
            </div>
            {label.toLowerCase().includes('serial') && (
              <div className="text-xs text-gray-500 mt-1">
                {(value as string).length}/15 caracteres
                {(value as string).length > 0 && (value as string).length !== 15 && (
                  <span className="text-red-500 ml-2">
                    (Deve ter exatamente 15 caracteres)
                  </span>
                )}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className={cn("group", className)}>
      <Label className={cn(
        "block text-sm font-bold mb-3 text-gray-800 transition-colors duration-200",
        focused && "text-blue-600",
        required && "after:content-['*'] after:ml-1 after:text-red-500",
        labelClassName
      )}>
        {label}
      </Label>
      <div className="relative">
        {renderField()}
      </div>
    </div>
  );
};

export default FormField;
