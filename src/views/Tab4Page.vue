<!-- src/views/Tab4Page.vue -->
<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Órdenes del Backend</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="salir">
            <ion-icon slot="icon-only" :icon="logOutOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="refrescar($event)">
        <ion-refresher-content />
      </ion-refresher>

      <div v-if="cargando" class="ion-padding ion-text-center">
        <ion-spinner name="crescent" />
        <p>Cargando órdenes...</p>
      </div>

      <div v-else-if="errorMsg" class="ion-padding ion-text-center">
        <p class="ion-color-danger">{{ errorMsg }}</p>
        <ion-button fill="outline" @click="cargarOrdenes">Reintentar</ion-button>
      </div>

      <ion-list v-else-if="orders.length">
        <ion-item v-for="order in orders" :key="order.id">
          <ion-label>
            <h2>Orden #{{ order.id }}</h2>
            <p>{{ order.cliente || order.customer || 'Cliente general' }}</p>
          </ion-label>
          <ion-note slot="end" color="primary">
            ₡{{ Number(order.total || 0).toLocaleString() }}
          </ion-note>
        </ion-item>
      </ion-list>

      <p v-else class="ion-padding ion-text-center">No hay órdenes registradas.</p>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';
import { ordersService, type Order } from '@/services/ordersService';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonPage,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  IonTitle,
  IonToolbar,
  onIonViewWillEnter,
  useIonRouter,
  type RefresherCustomEvent,
} from '@ionic/vue';
import { logOutOutline } from 'ionicons/icons';
import { ref } from 'vue';

const orders = ref<Order[]>([]);
const cargando = ref(true);
const errorMsg = ref('');

const { cerrarSesion } = useAuth();
const ionRouter = useIonRouter();

async function cargarOrdenes(): Promise<void> {
  cargando.value = true;
  errorMsg.value = '';
  try {
    orders.value = await ordersService.getOrders();
  } catch (err: any) {
    errorMsg.value = err.message || 'No se pudieron cargar las órdenes.';
  } finally {
    cargando.value = false;
  }
}

onIonViewWillEnter(cargarOrdenes);

async function refrescar(ev: RefresherCustomEvent): Promise<void> {
  await cargarOrdenes();
  ev.target.complete();
}

async function salir(): Promise<void> {
  await cerrarSesion();
  ionRouter.navigate('/login', 'root', 'replace');
}
</script>