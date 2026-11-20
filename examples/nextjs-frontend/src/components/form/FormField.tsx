import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface FormFieldProps {
  label?: string;
  htmlFor?: string;
  required?: boolean;
  error?: string;
  hint?: string;
  className?: string;
  children: ReactNode;
}

/** Label + control + error/hint wrapper used by SchemaForm. */
const FormField = ({
  label,
  htmlFor,
  required,
  error,
  hint,
  className,
  children,
}: FormFieldProps) => (
  <div className={cn('space-y-1.5', className)}>
    {label && (
      <label
        htmlFor={htmlFor}
        className="block text-sm font-medium text-slate-700"
      >
        {label}
        {required && <span className="ml-0.5 text-red-500">*</span>}
      </label>
    )}
    {children}
    {error ? (
      <p className="text-xs text-red-600" role="alert">
        {error}
      </p>
    ) : hint ? (
      <p className="text-xs text-slate-400">{hint}</p>
    ) : null}
  </div>
);

export default FormField;
