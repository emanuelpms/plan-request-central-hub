import React from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  required = false,
  children,
  error,
  className = ''
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block text-sm font-semibold text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-sm text-red-600 mt-1">{error}</p>
      )}
    </div>
  );
};

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({ error, className = '', ...props }) => {
  return (
    <input
      {...props}
      className={`
        w-full px-4 py-3 border rounded-lg transition-all duration-200
        focus:ring-2 focus:ring-blue-500 focus:border-transparent
        ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'}
        ${className}
      `}
    />
  );
};

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const FormTextarea: React.FC<FormTextareaProps> = ({ error, className = '', ...props }) => {
  return (
    <textarea
      {...props}
      className={`
        w-full px-4 py-3 border rounded-lg transition-all duration-200
        focus:ring-2 focus:ring-blue-500 focus:border-transparent
        resize-vertical min-h-[100px]
        ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'}
        ${className}
      `}
    />
  );
};

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const FormSelect: React.FC<FormSelectProps> = ({ error, className = '', children, ...props }) => {
  return (
    <select
      {...props}
      className={`
        w-full px-4 py-3 border rounded-lg transition-all duration-200
        focus:ring-2 focus:ring-blue-500 focus:border-transparent
        bg-white
        ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'}
        ${className}
      `}
    >
      {children}
    </select>
  );
};