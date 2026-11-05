<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Publicaciones</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-refresher slot="fixed" @ionRefresh="refrescar($event)">
        <ion-refresher-content />
      </ion-refresher>

      <div v-if="cargando" class="ion-padding ion-text-center">
        <ion-spinner name="crescent" />
        <p>Cargando posts...</p>
      </div>

      <ion-list v-else-if="posts.length">
        <ion-item v-for="post in posts" :key="post.id">
          <ion-label>
            <h2>{{ post.title }}</h2>
            <p>{{ post.body }}</p>
          </ion-label>
        </ion-item>
      </ion-list>

      <p v-else class="ion-padding ion-text-center">No hay publicaciones disponibles.</p>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonRefresher,
  IonRefresherContent,
  IonSpinner,
  onIonViewWillEnter,
  type RefresherCustomEvent,
} from '@ionic/vue';
import { postsService, type Post } from '@/services/postsService';

const posts = ref<Post[]>([]);
const cargando = ref(true);

async function cargarDatos() {
  try {
    posts.value = await postsService.getAll();
  } catch (err) {
    console.error(err);
  } finally {
    cargando.value = false;
  }
}

// onIonViewWillEnter garantiza recargar si venimos de otra pestaña
onIonViewWillEnter(cargarDatos);

async function refrescar(ev: RefresherCustomEvent) {
  await cargarDatos();
  ev.target.complete();
}
</script>
