// src/router/index.ts
import { createRouter, createWebHistory } from '@ionic/vue-router';
import type { RouteRecordRaw } from 'vue-router';

import { useAuth } from '@/composables/useAuth';
import TabsPage from '@/views/TabsPage.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: '/tabs/tab1'
  },
  {
    path: '/login',
    component: () => import('@/views/LoginPage.vue')
  },
  {
    path: '/tabs/',
    component: TabsPage,
    children: [
      {
        path: '',
        redirect: '/tabs/tab1'
      },
      {
        path: 'tab1',
        component: () => import('@/views/Tab1Page.vue')
      },
      {
        path: 'tab2',
        component: () => import('@/views/Tab2Page.vue')
      },
      {
        path: 'tab3',
        component: () => import('@/views/Tab3Page.vue')
      },
      {
        path: 'tab4',
        component: () => import('@/views/Tab4Page.vue'),
        meta: { requiereSesion: true }
      }
    ]
  }
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

// Guardia global para proteger rutas con sesión requerida
router.beforeEach(async (to) => {
  const { cargarToken, estaAutenticado } = useAuth();
  
  // Cargamos el token desde el almacenamiento local si existe
  await cargarToken();

  // Si la ruta requiere sesión y no hay token, lo mandamos al login
  if (to.meta.requiereSesion && !estaAutenticado.value) {
    return '/login';
  }
});

export default router;