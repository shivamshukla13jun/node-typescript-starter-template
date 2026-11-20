import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Tone = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps {
  tone?: Tone;
  title?: string;
  children?: ReactNode;
  className?: string;
}

const tones: Record<Tone, string> = {
  info: 'border-brand-200 bg-brand-50 text-brand-800',
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  warning: 'border-amber-200 bg-amber-50 text-amber-800',
  danger: 'border-red-200 bg-red-50 text-red-800',
};

const Alert = ({ tone = 'info', title, children, className }: AlertProps) => (
  <div
    role="alert"
    className={cn('rounded-lg border px-4 py-3 text-sm', tones[tone], className)}
  >
    {title && <p className="mb-1 font-semibold">{title}</p>}
    {children}
  </div>
);

export default Alert;
