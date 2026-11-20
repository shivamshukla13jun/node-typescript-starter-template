import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Tone = 'neutral' | 'success' | 'danger' | 'warning' | 'info';

export interface BadgeProps {
  tone?: Tone;
  children: ReactNode;
  className?: string;
}

const tones: Record<Tone, string> = {
  neutral: 'bg-slate-100 text-slate-700',
  success: 'bg-emerald-100 text-emerald-800',
  danger: 'bg-red-100 text-red-800',
  warning: 'bg-amber-100 text-amber-800',
  info: 'bg-brand-100 text-brand-700',
};

const Badge = ({ tone = 'neutral', children, className }: BadgeProps) => (
  <span
    className={cn(
      'inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium',
      tones[tone],
      className
    )}
  >
    {children}
  </span>
);

export default Badge;
