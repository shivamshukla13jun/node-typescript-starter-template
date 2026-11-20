import { SelectHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface SelectOption {
  label: string;
  value: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  invalid?: boolean;
  placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, className, invalid, placeholder, ...props }, ref) => (
    <select
      ref={ref}
      aria-invalid={invalid || undefined}
      className={cn(
        'block w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900',
        'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500',
        'disabled:cursor-not-allowed disabled:bg-slate-50',
        invalid ? 'border-red-400' : 'border-slate-300',
        className
      )}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  )
);
Select.displayName = 'Select';

export default Select;
