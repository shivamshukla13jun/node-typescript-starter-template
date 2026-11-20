'use client';

import { useState } from 'react';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui';
import SchemaForm, { FieldConfig } from './SchemaForm';

export interface StepConfig {
  title: string;
  description?: string;
  schema: z.ZodTypeAny;
  fields?: FieldConfig[];
}

export interface MultiStepFormProps {
  steps: StepConfig[];
  /** Called once with merged values from all steps */
  onSubmit: (values: Record<string, unknown>) => void | Promise<void>;
  submitLabel?: string;
  className?: string;
  /** render a review panel on the last step, receiving all values */
  renderReview?: (values: Record<string, unknown>) => React.ReactNode;
}

/**
 * MultiStepForm — each step is validated by its own zod schema via SchemaForm.
 * Values accumulate across steps; going back preserves entered data.
 */
const MultiStepForm = ({
  steps,
  onSubmit,
  submitLabel = 'Submit',
  className,
  renderReview,
}: MultiStepFormProps) => {
  const [index, setIndex] = useState(0);
  const [values, setValues] = useState<Record<string, unknown>>({});
  const step = steps[index];
  const isLast = index === steps.length - 1;

  const advance = (stepValues: Record<string, unknown>) => {
    const merged = { ...values, ...stepValues };
    setValues(merged);
    if (isLast) return onSubmit(merged);
    setIndex(index + 1);
  };

  return (
    <div className={className}>
      {/* progress */}
      <ol className="mb-6 flex items-center">
        {steps.map((s, i) => (
          <li key={s.title} className={cn('flex items-center', i > 0 && 'flex-1')}>
            {i > 0 && (
              <div className={cn('mx-2 h-px flex-1', i <= index ? 'bg-brand-500' : 'bg-slate-200')} />
            )}
            <div className="flex items-center gap-2">
              <span
                className={cn(
                  'flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold',
                  i < index && 'bg-brand-600 text-white',
                  i === index && 'border-2 border-brand-600 text-brand-700',
                  i > index && 'border border-slate-300 text-slate-400'
                )}
              >
                {i + 1}
              </span>
              <span
                className={cn(
                  'text-sm',
                  i === index ? 'font-medium text-slate-900' : 'text-slate-400'
                )}
              >
                {s.title}
              </span>
            </div>
          </li>
        ))}
      </ol>

      {step.description && (
        <p className="mb-4 text-sm text-slate-500">{step.description}</p>
      )}

      <SchemaForm
        key={index /* remount per step so defaults reflect latest values */}
        schema={step.schema}
        fields={step.fields}
        defaultValues={values}
        onSubmit={advance}
        submitLabel={isLast ? submitLabel : 'Continue'}
      >
        {isLast && renderReview?.(values)}
        <div className="flex gap-2">
          {index > 0 && (
            <Button type="button" variant="outline" onClick={() => setIndex(index - 1)}>
              Back
            </Button>
          )}
        </div>
      </SchemaForm>
    </div>
  );
};

export default MultiStepForm;
