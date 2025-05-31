
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';
import { Loader2, MapPin } from 'lucide-react';

interface FormFieldProps {
  label: string;
  value: string | boolean;
  onChange: (value: string | boolean) => void;
  type?: 'text' | 'email' | 'tel' | 'textarea' | 'select' | 'checkbox' | 'cep' | 'cpf-cnpj';
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

  const handleInputChange = (inputValue: string) => {
    let formattedValue = inputValue;
    
    if (autoFormat) {
      formattedValue = inputValue.toUpperCase();
    }
    
    if (maxLength) {
      formattedValue = formattedValue.slice(0, maxLength);
    }
    
    onChange(formattedValue);
  };

  const renderField = () => {
    const baseInputClass = cn(
      "transition-all duration-200 border-2",
      focused ? "border-blue-500 shadow-lg ring-2 ring-blue-200" : "border-gray-300",
      "hover:border-blue-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-200",
      className
    );

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
              className={cn(baseInputClass, "min-h-[100px] resize-none")}
              maxLength={maxLength}
            />
            {maxLength && (
              <div className="absolute bottom-2 right-2 text-xs text-gray-400">
                {(value as string).length}/{maxLength}
              </div>
            )}
          </div>
        );
      
      case 'select':
        return (
          <Select value={value as string} onValueChange={onChange}>
            <SelectTrigger className={cn(baseInputClass, "h-12")}>
              <SelectValue placeholder={placeholder || "Selecione..."} />
            </SelectTrigger>
            <SelectContent className="bg-white border-2 border-gray-200 shadow-xl z-50 max-h-60">
              {options.map((option) => (
                <SelectItem 
                  key={option} 
                  value={option}
                  className="hover:bg-blue-50 cursor-pointer py-3 px-4 transition-colors"
                >
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
      
      case 'checkbox':
        return (
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border-2 border-gray-200 hover:border-blue-300 transition-colors">
            <Checkbox
              checked={value as boolean}
              onCheckedChange={(checked) => onChange(!!checked)}
              className="w-5 h-5"
            />
            <span className="text-sm font-medium text-gray-700">{placeholder}</span>
          </div>
        );

      case 'cep':
        return (
          <div className="relative">
            <Input
              type="text"
              value={value as string}
              onChange={(e) => handleInputChange(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder={placeholder}
              className={cn(baseInputClass, "h-12 pr-10")}
              maxLength={9}
            />
            {loading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              </div>
            )}
            {!loading && (
              <MapPin className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            )}
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
              maxLength={maxLength}
            />
            {loading && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-500" />
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <Label className={cn(
        "block text-sm font-bold text-white bg-gradient-to-r from-blue-800 to-blue-900 px-4 py-2 rounded-t-lg shadow-md",
        "border-b-2 border-blue-600",
        labelClassName
      )}>
        {label}
        {required && <span className="text-red-300 ml-1">*</span>}
      </Label>
      <div className="bg-white p-3 rounded-b-lg border-2 border-gray-200 shadow-sm">
        {renderField()}
      </div>
    </div>
  );
};

export default FormField;
