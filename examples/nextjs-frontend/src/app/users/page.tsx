'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Alert, Badge, Button, Card, Modal } from '@/components/ui';
import DataTable, { Column } from '@/components/table/DataTable';
import SchemaForm from '@/components/form/SchemaForm';
import { createUserSchema } from '@/schemas/user.schema';
import { createUser, deleteUser, getToken, listUsers } from '@/lib/api';
import type { UsersPage as UsersPageData } from '@/lib/api';
import { formatDate } from '@/lib/utils';

const PAGE_SIZE = 10;

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [state, setState] = useState<UsersPageData | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const authed = !!getToken();

  const load = useCallback(async () => {
    if (!getToken()) return;
    setLoading(true);
    const res = await listUsers({ page, limit: PAGE_SIZE, search });
    if (res.status === 200) {
      setState(res.body as unknown as UsersPageData);
      setErr(null);
    } else {
      setErr(res.body?.message || `Failed to load (${res.status})`);
    }
    setLoading(false);
  }, [page, search]);

  useEffect(() => {
    load();
  }, [load]);

  if (!authed) {
    return (
      <Alert tone="warning" title="Login required">
        This page needs an access token.{' '}
        <Link className="underline" href="/login">
          Go to login
        </Link>
      </Alert>
    );
  }

  const columns: Column<Record<string, any>>[] = [
    {
      key: 'avatar',
      header: '',
      render: (u) =>
        u.avatar?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={u.avatar.url} alt="" className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-500">
            {u.name?.[0]?.toUpperCase() ?? '?'}
          </span>
        ),
    },
    { key: 'name', header: 'Name' },
    { key: 'email', header: 'Email' },
    { key: 'role', header: 'Role', render: (u) => <Badge tone="info">{u.role}</Badge> },
    {
      key: 'isActive',
      header: 'Status',
      render: (u) =>
        u.isActive ? <Badge tone="success">Active</Badge> : <Badge tone="danger">Blocked</Badge>,
    },
    {
      key: 'createdAt',
      header: 'Created',
      render: (u) => formatDate(u.createdAt),
    },
    {
      key: 'actions',
      header: '',
      render: (u) => (
        <Button
          size="sm"
          variant="danger"
          onClick={async () => {
            const res = await deleteUser(u._id);
            if (res.status === 200) load();
            else setErr(res.body?.message || 'Delete failed');
          }}
        >
          Delete
        </Button>
      ),
    },
  ];

  const onCreate = async (values: Record<string, any>) => {
    const { avatar, ...fields } = values;
    const res = await createUser(fields, avatar instanceof File ? avatar : null);
    if (res.status !== 201) {
      throw Object.assign(new Error(res.body?.message || 'Create failed'), {
        errors: res.body?.errors,
      });
    }
    setShowCreate(false);
    load();
  };

  return (
    <Card
      title="Users — DataTable"
      description="Server-side pagination + search, encrypted end to end."
    >
      {err && (
        <Alert tone="danger" className="mb-4">
          {err}
        </Alert>
      )}

      <DataTable
        columns={columns}
        data={state?.data ?? []}
        rowKey={(u) => u._id}
        loading={loading}
        searchable
        searchValue={search}
        onSearch={(q) => {
          setSearch(q);
          setPage(1);
        }}
        searchPlaceholder="Search name or email…"
        emptyMessage="No users found."
        headerAction={<Button onClick={() => setShowCreate(true)}>+ New user</Button>}
        pagination={
          state?.pagination
            ? { ...state.pagination, onPageChange: setPage }
            : undefined
        }
      />

      <Modal open={showCreate} onClose={() => setShowCreate(false)} title="Create user">
        <SchemaForm
          schema={createUserSchema}
          fields={[
            { name: 'name', label: 'Full name' },
            { name: 'email', label: 'Email', type: 'email' },
            { name: 'password', label: 'Password', type: 'password' },
            {
              name: 'role',
              label: 'Role',
              type: 'select',
              options: [
                { label: 'Admin', value: 'admin' },
                { label: 'Super admin', value: 'superadmin' },
              ],
            },
            { name: 'avatar', label: 'Avatar (optional)', type: 'file', accept: 'image/*' },
          ]}
          columns={2}
          onSubmit={onCreate}
          submitLabel="Create"
        />
      </Modal>
    </Card>
  );
}
