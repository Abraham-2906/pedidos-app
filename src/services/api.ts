// src/services/api.ts
import { useAuth } from '@/composables/useAuth';
import router from '@/router';

// Clase personalizada para transportar el código HTTP y el detalle del error
export class ErrorApi extends Error {
  constructor(public status: number, public cuerpo: any) {
    super(`HTTP ${status}`);
  }
}

export async function api<T>(ruta: string, op: RequestInit = {}): Promise<T> {
  const { token, cerrarSesion } = useAuth();
  const baseUrl = import.meta.env.VITE_API_URL || 'https://ds4-demo-5w8lmtds.on-forge.com/api';

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(token.value ? { Authorization: `Bearer ${token.value}` } : {}),
  };

  if (typeof op.body === 'string') {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${baseUrl}${ruta}`, {
    ...op,
    headers: {
      ...headers,
      ...(op.headers as Record<string, string>),
    },
  });

  // Si el token venció o no está autorizado, se limpia la sesión y se va al login
  if (res.status === 401) {
    await cerrarSesion();
    router.replace('/login');
    throw new ErrorApi(401, { message: 'Sesión no autorizada o expirada' });
  }

  // Si la petición falla (códigos 4xx o 5xx)
  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({}));
    throw new ErrorApi(res.status, errorBody);
  }

  // Si la respuesta es 204 No Content (sin cuerpo)
  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}