'use client';

import { useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { cn } from '@/lib/utils';
import { Button, Checkbox, Input, Select, SelectOption, Textarea } from '@/components/ui';
import FormField from './FormField';

/** Per-field config. Omit `type` to let it be inferred from the zod schema. */
export interface FieldConfig {
  name: string;
  label?: string;
  /** HTML input type, or 'select' | 'textarea' | 'checkbox' | 'file' */
  type?: string;
  placeholder?: string;
  options?: SelectOption[];
  hint?: string;
  accept?: string;
  className?: string;
}

export interface SchemaFormProps<S extends z.ZodTypeAny> {
  /** zod schema — validation AND (optionally) field generation source */
  schema: S;
  /** Field configs; if omitted they are derived from the schema shape */
  fields?: FieldConfig[];
  defaultValues?: Partial<z.infer<S>>;
  onSubmit: (values: z.infer<S>) => void | Promise<void>;
  submitLabel?: string;
  columns?: 1 | 2;
  className?: string;
  /** render extra content inside the form (e.g. custom buttons) */
  children?: React.ReactNode;
}

// ---------- zod introspection ----------

const unwrap = (t: z.ZodTypeAny): z.ZodTypeAny => {
  while (
    t instanceof z.ZodOptional ||
    t instanceof z.ZodNullable ||
    t instanceof z.ZodDefault
  ) {
    t = (t as any)._def.innerType ?? (t as any)._def.type;
  }
  return t;
};

const isOptional = (t: z.ZodTypeAny): boolean => {
  while (t instanceof z.ZodDefault) t = (t as any)._def.innerType;
  return t instanceof z.ZodOptional || t instanceof z.ZodNullable;
};

/** Derive field configs from a ZodObject's shape. */
export const fieldsFromSchema = (schema: z.ZodTypeAny): FieldConfig[] => {
  const shape = (schema as any).shape;
  if (!shape) return [];

  return Object.entries(shape as Record<string, z.ZodTypeAny>).map(([name, t]) => {
    const base = unwrap(t);
    const cfg: FieldConfig = { name, label: name[0].toUpperCase() + name.slice(1) };

    if (base instanceof z.ZodEnum) {
      cfg.type = 'select';
      cfg.options = (base._def.values as string[]).map((v) => ({
        label: v[0].toUpperCase() + v.slice(1),
        value: v,
      }));
    } else if (base instanceof z.ZodBoolean) {
      cfg.type = 'checkbox';
      cfg.label = undefined;
    } else if (base instanceof z.ZodNumber) {
      cfg.type = 'number';
    } else if (base instanceof z.ZodDate) {
      cfg.type = 'date';
    } else if (name.toLowerCase().includes('password')) {
      cfg.type = 'password';
    } else if (name.toLowerCase().includes('email')) {
      cfg.type = 'email';
    } else {
      cfg.type = 'text';
    }
    return cfg;
  });
};

const requiredBySchema = (schema: z.ZodTypeAny, name: string): boolean => {
  const field = (schema as any).shape?.[name];
  return field ? !isOptional(field) : false;
};

// ---------- component ----------

/**
 * SchemaForm — pass a zod schema, get a validated form.
 *
 * - Explicit `fields` for full control, or omit to auto-generate from the schema.
 * - Handles text/number/date/password/email/select/checkbox/file inputs.
 * - Validation errors are shown inline per field.
 */
const SchemaForm = <S extends z.ZodTypeAny>({
  schema,
  fields,
  defaultValues,
  onSubmit,
  submitLabel = 'Submit',
  columns = 1,
  className,
  children,
}: SchemaFormProps<S>) => {
  const [serverError, setServerError] = useState<string | null>(null);
  const resolvedFields = fields ?? fieldsFromSchema(schema);

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FieldValues>({
    resolver: zodResolver(schema as any),
    defaultValues: defaultValues as FieldValues,
  });

  const submit = handleSubmit(async (values) => {
    setServerError(null);
    try {
      await onSubmit(values as z.infer<S>);
    } catch (e: any) {
      // surface backend field errors under the matching inputs
      const fieldErrors = e?.errors ?? e?.data?.errors;
      if (fieldErrors && typeof fieldErrors === 'object') {
        for (const [k, v] of Object.entries(fieldErrors)) {
          setError(k, { type: 'server', message: String(v) });
        }
      } else {
        setServerError(e?.message || 'Submission failed');
      }
    }
  });

  const err = (name: string) => errors[name]?.message as string | undefined;

  return (
    <form onSubmit={submit} className={cn('space-y-4', className)} noValidate>
      <div
        className={cn(
          'grid gap-4',
          columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
        )}
      >
        {resolvedFields.map((f) => {
          const required = requiredBySchema(schema, f.name);
          const invalid = !!errors[f.name];
          const common = {
            id: f.name,
            invalid,
            'aria-describedby': err(f.name) ? `${f.name}-err` : undefined,
          };

          if (f.type === 'checkbox') {
            return (
              <FormField key={f.name} error={err(f.name)} className={f.className}>
                <Checkbox label={f.label ?? f.name} {...common} {...register(f.name)} />
              </FormField>
            );
          }

          return (
            <FormField
              key={f.name}
              label={f.label}
              htmlFor={f.name}
              required={required}
              error={err(f.name)}
              hint={f.hint}
              className={f.className}
            >
              {f.type === 'select' ? (
                <Select
                  options={f.options ?? []}
                  placeholder={f.placeholder}
                  {...common}
                  {...register(f.name)}
                />
              ) : f.type === 'textarea' ? (
                <Textarea placeholder={f.placeholder} {...common} {...register(f.name)} />
              ) : f.type === 'file' ? (
                <Input
                  type="file"
                  accept={f.accept}
                  {...common}
                  onChange={(e) => setValue(f.name, e.target.files?.[0], { shouldValidate: true })}
                />
              ) : (
                <Input
                  type={f.type ?? 'text'}
                  placeholder={f.placeholder}
                  {...common}
                  {...register(f.name, {
                    setValueAs: f.type === 'number' ? (v) => (v === '' ? undefined : Number(v)) : undefined,
                  })}
                />
              )}
            </FormField>
          );
        })}
      </div>

      {serverError && (
        <p className="text-sm text-red-600" role="alert">
          {serverError}
        </p>
      )}

      {children}

      <Button type="submit" loading={isSubmitting} className="w-full sm:w-auto">
        {submitLabel}
      </Button>
    </form>
  );
};

export default SchemaForm;
