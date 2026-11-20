'use client';

import { useState } from 'react';
import { Alert, Card } from '@/components/ui';
import MultiStepForm, { StepConfig } from '@/components/form/MultiStepForm';
import {
  registerStep1Schema,
  registerStep2Schema,
  registerStep3Schema,
} from '@/schemas/auth.schema';
import { registerUser } from '@/lib/api';
import type { ApiResult } from '@/lib/api';
import type { SecureResponse } from '@/lib/SecureApiClient';

const STEPS: StepConfig[] = [
  {
    title: 'Account',
    description: 'Basic details',
    schema: registerStep1Schema,
    fields: [
      { name: 'name', label: 'Full name', placeholder: 'Jane Doe' },
      { name: 'email', label: 'Email', type: 'email', placeholder: 'jane@example.com' },
    ],
  },
  {
    title: 'Security',
    description: 'Password & role',
    schema: registerStep2Schema,
    fields: [
      { name: 'password', label: 'Password', type: 'password' },
      { name: 'confirmPassword', label: 'Confirm password', type: 'password' },
      {
        name: 'role',
        label: 'Role',
        type: 'select',
        options: [
          { label: 'Admin', value: 'admin' },
          { label: 'Super admin', value: 'superadmin' },
        ],
      },
    ],
  },
  {
    title: 'Avatar',
    description: 'Optional profile picture — uploaded as encrypted multipart',
    schema: registerStep3Schema,
    fields: [{ name: 'avatar', label: 'Avatar', type: 'file', accept: 'image/*' }],
  },
];

export default function RegisterPage() {
  const [result, setResult] = useState<SecureResponse<ApiResult> | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (all: Record<string, unknown>) => {
    const { avatar, confirmPassword, ...fields } = all;
    const res = await registerUser(fields, avatar instanceof File ? avatar : null);
    setResult(res);
    setErr(res.status === 201 ? null : res.body?.message || `Failed (${res.status})`);
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card
        title="Register — MultiStepForm"
        description="Three steps, each with its own zod schema. Back/forward preserves values; the final step submits encrypted multipart."
      >
        {result?.status === 201 && (
          <Alert tone="success" className="mb-4">
            {result.body?.message || 'Registered!'} You can now log in.
          </Alert>
        )}
        {err && (
          <Alert tone="danger" className="mb-4">
            {err}
          </Alert>
        )}
        <MultiStepForm steps={STEPS} onSubmit={onSubmit} submitLabel="Create account" />
      </Card>

      <Card
        title="Encrypted multipart on the wire"
        description="Files go as raw binary inside FormData; every text field travels inside the AES-GCM envelope."
      >
        {result ? (
          <pre className="max-h-96 overflow-auto rounded-lg bg-slate-900 p-3 text-xs text-emerald-300">
            {JSON.stringify(result.wire, null, 2)}
          </pre>
        ) : (
          <p className="text-sm text-slate-400">
            Complete the steps to see the encrypted request.
          </p>
        )}
      </Card>
    </div>
  );
}
