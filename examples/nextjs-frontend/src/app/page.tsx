import Link from 'next/link';
import type { Metadata } from 'next';
import { Card } from '@/components/ui';

export const metadata: Metadata = {
  title: 'Reusable Next.js Starter — Encrypted API, Schema Forms, DataTable',
};

const DEMOS = [
  {
    href: '/login',
    title: 'SchemaForm — Login',
    body: 'A form built by passing a zod schema + field configs. Validation is automatic; submit calls the API over the encrypted channel.',
    tag: 'form',
  },
  {
    href: '/register',
    title: 'MultiStepForm — Register',
    body: 'Three steps, each validated by its own schema. Values merge across steps; the last step uploads an avatar as encrypted multipart.',
    tag: 'form · upload',
  },
  {
    href: '/users',
    title: 'DataTable — Users',
    body: 'Server-driven table with search and pagination, plus a create-user modal — all over the encrypted client.',
    tag: 'table · auth',
  },
];

const COMPONENTS = [
  'Button', 'Input', 'Select', 'Textarea', 'Checkbox', 'Card', 'Badge',
  'Alert', 'Modal', 'Spinner', 'FormField', 'SchemaForm', 'MultiStepForm',
  'DataTable',
];

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="text-center">
        <h1 className="text-3xl font-bold text-slate-900">
          Reusable UI + End-to-End Encrypted API
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-slate-500">
          Drop-in component library for this starter: schema-driven forms,
          multi-step forms, a generic table, and a typed client that speaks
          RSA-OAEP + AES-256-GCM to the backend out of the box.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        {DEMOS.map((d) => (
          <Link key={d.href} href={d.href}>
            <Card
              title={d.title}
              description={d.body}
              className="h-full transition hover:border-brand-300 hover:shadow-md"
            >
              <span className="text-xs font-medium uppercase tracking-wide text-brand-600">
                {d.tag}
              </span>
            </Card>
          </Link>
        ))}
      </section>

      <Card title="Included reusable components">
        <div className="flex flex-wrap gap-2">
          {COMPONENTS.map((c) => (
            <code
              key={c}
              className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700"
            >
              {`<${c} />`}
            </code>
          ))}
        </div>
        <p className="mt-4 text-sm text-slate-500">
          Every component is typed, themeable via Tailwind, and independent of
          the API — copy <code>src/components</code> + <code>src/lib</code> into
          a new project and go.
        </p>
      </Card>
    </div>
  );
}
