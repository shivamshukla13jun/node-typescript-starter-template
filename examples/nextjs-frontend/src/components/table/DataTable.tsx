'use client';

import { Key, ReactNode } from 'react';
import { cn, formatDate } from '@/lib/utils';
import { Button, Input, Spinner } from '@/components/ui';

export interface Column<T> {
  key: string;
  header: ReactNode;
  render?: (row: T, index: number) => ReactNode;
  className?: string;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  rowKey: (row: T) => Key;
  loading?: boolean;
  pagination?: PaginationState;
  searchable?: boolean;
  searchValue?: string;
  onSearch?: (q: string) => void;
  searchPlaceholder?: string;
  emptyMessage?: string;
  headerAction?: ReactNode;
  className?: string;
}

/**
 * DataTable — generic table with optional search input and pagination.
 * Server-driven: pass `pagination` and `onSearch`; the parent fetches data.
 */
const DataTable = <T,>({
  columns,
  data,
  rowKey,
  loading,
  pagination,
  searchable,
  searchValue,
  onSearch,
  searchPlaceholder = 'Search…',
  emptyMessage = 'No records found.',
  headerAction,
  className,
}: DataTableProps<T>) => (
  <div className={cn('space-y-3', className)}>
    {(searchable || headerAction) && (
      <div className="flex items-center justify-between gap-3">
        {searchable ? (
          <Input
            value={searchValue}
            onChange={(e) => onSearch?.(e.target.value)}
            placeholder={searchPlaceholder}
            className="max-w-xs"
          />
        ) : (
          <span />
        )}
        {headerAction}
      </div>
    )}

    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className={cn(
                  'px-4 py-3 text-left font-semibold text-slate-600',
                  c.className
                )}
              >
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-10 text-center">
                <Spinner className="mx-auto text-brand-600" />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-slate-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={rowKey(row)} className="hover:bg-slate-50">
                {columns.map((c) => (
                  <td key={c.key} className={cn('px-4 py-3 text-slate-700', c.className)}>
                    {c.render ? c.render(row, i) : String((row as any)[c.key] ?? '—')}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>

    {pagination && pagination.totalPages > 0 && (
      <div className="flex items-center justify-between text-sm text-slate-500">
        <span>
          Page {pagination.page} of {pagination.totalPages} · {pagination.total} total
        </span>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={pagination.page <= 1}
            onClick={() => pagination.onPageChange(pagination.page - 1)}
          >
            Previous
          </Button>
          <Button
            size="sm"
            variant="outline"
            disabled={pagination.page >= pagination.totalPages}
            onClick={() => pagination.onPageChange(pagination.page + 1)}
          >
            Next
          </Button>
        </div>
      </div>
    )}
  </div>
);

export default DataTable;
export { formatDate };
