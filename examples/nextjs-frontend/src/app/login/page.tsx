'use client';

import { useState } from 'react';
import { Alert, Card } from '@/components/ui';
import SchemaForm, { FieldConfig } from '@/components/form/SchemaForm';
import { loginSchema, LoginValues } from '@/schemas/auth.schema';
import { getToken, login, setToken } from '@/lib/api';
import type { SecureResponse } from '@/lib/SecureApiClient';

const FIELDS: FieldConfig[] = [
  { name: 'email', label: 'Email', type: 'email', placeholder: 'you@example.com' },
  { name: 'password', label: 'Password', type: 'password', placeholder: '••••••••' },
];

export default function LoginPage() {
  const [result, setResult] = useState<SecureResponse | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const loggedIn = !!getToken();

  const onSubmit = async (v: LoginValues) => {
    const res = await login(v.email, v.password);
    setResult(res);
    if (res.status === 200 && res.body?.data?.accessToken) {
      setToken(res.body.data.accessToken);
      setErr(null);
    } else {
      setErr(res.body?.message || `Login failed (${res.status})`);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card
        title="Login — SchemaForm"
        description="This whole form is just: schema + 2 field configs. Try submitting empty to see zod validation."
      >
        {loggedIn && (
          <Alert tone="success" className="mb-4">
            Logged in — token stored.{' '}
            <button
              className="underline"
              onClick={() => {
                setToken(null);
                location.reload();
              }}
            >
              Log out
            </button>
          </Alert>
        )}
        {err && (
          <Alert tone="danger" className="mb-4">
            {err}
          </Alert>
        )}
        <SchemaForm schema={loginSchema} fields={FIELDS} onSubmit={onSubmit} submitLabel="Sign in" />
      </Card>

      <Card
        title="What a middleman sees"
        description="The literal request/response bytes — ciphertext only."
      >
        {result ? (
          <div className="space-y-3">
            <div>
              <p className="mb-1 text-xs font-semibold uppercase text-slate-400">Sent</p>
              <pre className="max-h-48 overflow-auto rounded-lg bg-slate-900 p-3 text-xs text-emerald-300">
                {JSON.stringify(result.wire.sent, null, 2)}
              </pre>
            </div>
            <div>
              <p className="mb-1 text-xs font-semibold uppercase text-slate-400">Received</p>
              <pre className="max-h-48 overflow-auto rounded-lg bg-slate-900 p-3 text-xs text-sky-300">
                {JSON.stringify(result.wire.received, null, 2)}
              </pre>
            </div>
            <details>
              <summary className="cursor-pointer text-xs text-slate-500">
                Decrypted response (client side)
              </summary>
              <pre className="mt-2 max-h-48 overflow-auto rounded-lg bg-slate-100 p-3 text-xs">
                {JSON.stringify(result.body, null, 2)}
              </pre>
            </details>
          </div>
        ) : (
          <p className="text-sm text-slate-400">Submit the form to inspect the wire traffic.</p>
        )}
      </Card>
    </div>
  );
}
