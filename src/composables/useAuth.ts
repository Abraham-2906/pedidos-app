// src/composables/useAuth.ts
// src/composables/useAuth.ts
import { Preferences } from '@capacitor/preferences';
import { ref, computed, type ComputedRef } from 'vue';


// Interfaz para tipar el retorno del composable y satisfacer a ESLint
export interface UseAuthReturn {
  token: typeof token;
  estaAutenticado: ComputedRef<boolean>;
  login: (email: string, password: string) => Promise<void>;
  cargarToken: () => Promise<void>;
  cerrarSesion: () => Promise<void>;
}

// Token en memoria a nivel de módulo: compartido por toda la app
const token = ref<string | null>(null);

export function useAuth(): UseAuthReturn {
  const estaAutenticado = computed<boolean>(() => token.value !== null);

  async function login(email: string, password: string): Promise<void> {
    const baseUrl = import.meta.env.VITE_API_URL || 'https://ds4-demo-5w8lmtds.on-forge.com/api';

    // 1. Crear un FormData idéntico a tu captura de Postman
    const formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);
    formData.append('device_name', 'movil');

    // 2. Enviar la petición
    const res = await fetch(`${baseUrl}/sanctum/token`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        // ¡Importante! Al usar FormData, NO debemos poner el Content-Type manualmente.
        // El navegador lo asigna automáticamente.
      },
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Credenciales incorrectas');
    }

    const data = await res.json();
    token.value = data.token || data.access_token;

    if (token.value) {
      await Preferences.set({ key: 'auth_token', value: token.value });
    }
  }
  
  async function cargarToken(): Promise<void> {
    if (!token.value) {
      const { value } = await Preferences.get({ key: 'auth_token' });
      token.value = value;
    }
  }

  async function cerrarSesion(): Promise<void> {
    token.value = null;
    await Preferences.remove({ key: 'auth_token' });
  }

  return {
    token,
    estaAutenticado,
    login,
    cargarToken,
    cerrarSesion,
  };
}