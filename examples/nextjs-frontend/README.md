# Next.js Frontend Example

A production-style Next.js (App Router + TypeScript) frontend for the starter API.
Demonstrates the **reusable component library** you get when adopting this template
in a new project: schema-driven forms, multi-step forms, a generic data table,
UI primitives, full SEO setup, and the encrypted API client.

## Run

```bash
npm install
npm run dev        # http://localhost:3001  (API must run on :3000)
```

The dev server proxies `/api/*` and `/encryption/*` to `API_PROXY_TARGET`
(default `http://localhost:3000`), so requests stay same-origin — no CORS
needed. For other origins, set `NEXT_PUBLIC_API_URL` and add the origin to the
backend `CORS_ORIGIN`.

> WebCrypto requires `localhost`, `127.0.0.1`, or HTTPS. Opening the app via a
> LAN IP (`http://192.168.x.x:3001`) disables `crypto.subtle` and encryption
> won't initialise.

## What's reusable — copy into a new project

```
src/components/ui/        Button Input Select Textarea Checkbox Card Badge Alert Modal Spinner
src/components/form/      FormField  SchemaForm  MultiStepForm
src/components/table/     DataTable (server-driven: search + pagination)
src/lib/                  SecureApiClient  api helpers  cn/formatDate utils
src/schemas/              zod schemas mirroring the backend validators
src/app/                  SEO: layout metadata, robots.ts, sitemap.ts, manifest.ts
```

### SchemaForm — pass a zod schema, get a validated form

```tsx
import SchemaForm from '@/components/form/SchemaForm';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

<SchemaForm
  schema={loginSchema}
  fields={[
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'password', label: 'Password', type: 'password' },
  ]}
  onSubmit={async (values) => { /* values is z.infer<typeof loginSchema> */ }}
  submitLabel="Sign in"
/>
```

Omit `fields` entirely and they're **auto-generated from the schema shape**
(zod type → input type: `ZodEnum` → select, `ZodBoolean` → checkbox,
`ZodNumber` → number, `ZodDate` → date, `password`/`email` names → those types).

### MultiStepForm — one schema per step

```tsx
<MultiStepForm
  steps={[
    { title: 'Account',  schema: step1Schema, fields: [...] },
    { title: 'Security', schema: step2Schema, fields: [...] },
    { title: 'Avatar',   schema: step3Schema, fields: [{ name: 'avatar', type: 'file' }] },
  ]}
  onSubmit={(allValues) => { /* merged values from all steps */ }}
/>
```

Each step validates independently; going Back preserves values; the final
step submits everything merged.

### DataTable — server-driven table

```tsx
const columns: Column<User>[] = [
  { key: 'name',  header: 'Name' },
  { key: 'role',  header: 'Role', render: (u) => <Badge tone="info">{u.role}</Badge> },
];

<DataTable
  columns={columns}
  data={users}
  rowKey={(u) => u._id}
  loading={loading}
  searchable searchValue={q} onSearch={setQ}
  pagination={{ page, limit, total, totalPages, onPageChange: setPage }}
/>
```

### SecureApiClient — encrypted transport

```ts
import { getApi } from '@/lib/api';

const api = await getApi();                    // fetches public key, wraps AES session key
const res = await api.post('/api/auth/login', { email, password });
// multipart:  api.request(path, { method:'POST', fields: {...}, files: { avatar: file } })
```

### FieldConfig — the `fields` prop contract

```ts
interface FieldConfig {
  name: string;            // zod key
  label?: string;
  type?: string;           // html input type | 'select' | 'textarea' | 'checkbox' | 'file'
  placeholder?: string;
  options?: { label; value }[];   // select
  hint?: string;
  accept?: string;               // file
}
```

## Pages

| Route       | Demo                                               |
| ----------- | -------------------------------------------------- |
| `/`         | Component catalogue + links                        |
| `/login`    | SchemaForm + encrypted wire traffic viewer         |
| `/register` | MultiStepForm + encrypted multipart avatar upload  |
| `/users`    | DataTable + create-user modal (requires login)     |

## SEO included

- `metadata` in `layout.tsx` (title template, description, OpenGraph, Twitter card)
- `robots.ts` → `/robots.txt` (disallows `/api/`)
- `sitemap.ts` → `/sitemap.xml`
- `manifest.ts` → `/manifest.webmanifest`
- `NEXT_PUBLIC_SITE_URL` drives `metadataBase`, `og:url`, sitemap URLs
