import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ label, className, ...props }, ref) => (
    <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-slate-700">
      <input
        ref={ref}
        type="checkbox"
        className={cn(
          'h-4 w-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500',
          className
        )}
        {...props}
      />
      {label}
    </label>
  )
);
Checkbox.displayName = 'Checkbox';

export default Checkbox;
