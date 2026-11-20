'use client';

import SecureApiClient from './SecureApiClient';

/**
 * Shared SecureApiClient singleton — lazily initialises on first use.
 * Base URL: NEXT_PUBLIC_API_URL or same-origin (dev proxy / reverse proxy).
 */
let client: SecureApiClient | null = null;
let initPromise: Promise<SecureApiClient> | null = null;

export const getApi = (): Promise<SecureApiClient> => {
  if (client) return Promise.resolve(client);
  if (!initPromise) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    initPromise = new SecureApiClient(baseUrl).init().then((c) => {
      client = c;
      return c;
    });
  }
  return initPromise;
};

// ---------------- token storage ----------------
const TOKEN_KEY = 'accessToken';

export const getToken = (): string | null =>
  typeof window === 'undefined' ? null : localStorage.getItem(TOKEN_KEY);

export const setToken = (token: string | null): void => {
  if (typeof window === 'undefined') return;
  token ? localStorage.setItem(TOKEN_KEY, token) : localStorage.removeItem(TOKEN_KEY);
};

// ---------------- API helpers ----------------
export interface ApiResult<T = any> {
  success?: boolean;
  message?: string;
  data?: T;
  statusCode?: number;
  errors?: Record<string, string>;
}

export interface LoginResponse {
  user: Record<string, any>;
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

export const login = (email: string, password: string) =>
  getApi().then((api) =>
    api.post<ApiResult<LoginResponse>>('/api/auth/login', { email, password })
  );

export interface UsersPage {
  data: Record<string, any>[];
  pagination: { page: number; limit: number; total: number; totalPages: number };
}

export const listUsers = (params: {
  page?: number;
  limit?: number;
  search?: string;
}) => {
  const qs = new URLSearchParams();
  if (params.page) qs.set('page', String(params.page));
  if (params.limit) qs.set('limit', String(params.limit));
  if (params.search) qs.set('search', params.search);
  return getApi().then((api) =>
    api.get<ApiResult & UsersPage>(`/api/users?${qs.toString()}`, {
      token: getToken() ?? undefined,
    })
  );
};

export const createUser = (
  fields: Record<string, unknown>,
  avatar?: File | null
) =>
  getApi().then((api) =>
    api.request<ApiResult>('/api/users', {
      method: 'POST',
      token: getToken() ?? undefined,
      fields,
      files: avatar ? { avatar } : undefined,
    })
  );

export const registerUser = (
  fields: Record<string, unknown>,
  avatar?: File | null
) =>
  getApi().then((api) =>
    api.request<ApiResult>('/api/auth/register', {
      method: 'POST',
      fields,
      files: avatar ? { avatar } : undefined,
    })
  );

export const deleteUser = (id: string) =>
  getApi().then((api) =>
    api.request<ApiResult>(`/api/users/${id}`, {
      method: 'DELETE',
      token: getToken() ?? undefined,
    })
  );
