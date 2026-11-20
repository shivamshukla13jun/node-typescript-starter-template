import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
  description?: string;
  headerAction?: ReactNode;
}

const Card = ({
  title,
  description,
  headerAction,
  className,
  children,
  ...props
}: CardProps) => (
  <section
    className={cn(
      'rounded-xl border border-slate-200 bg-white p-6 shadow-sm',
      className
    )}
    {...props}
  >
    {(title || headerAction) && (
      <header className="mb-4 flex items-start justify-between gap-4">
        <div>
          {title && <h2 className="text-base font-semibold text-slate-900">{title}</h2>}
          {description && <p className="mt-0.5 text-sm text-slate-500">{description}</p>}
        </div>
        {headerAction}
      </header>
    )}
    {children}
  </section>
);

export default Card;
