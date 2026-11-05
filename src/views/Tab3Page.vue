<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Nuevo Post</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <form @submit.prevent="guardarPost">
        <ion-list>
          <!-- Selector de Usuario -->
          <ion-item>
            <ion-select
              label="Seleccionar Usuario"
              label-placement="floating"
              placeholder="Elige un autor"
              v-model="draft.userId"
              :class="{ 'ion-invalid ion-touched': errores.userId }"
              :error-text="errores.userId"
            >
              <ion-select-option v-for="user in usuarios" :key="user.id" :value="user.id">
                {{ user.name }} (ID: {{ user.id }})
              </ion-select-option>
            </ion-select>
          </ion-item>

          <!-- Título del Post -->
          <ion-item>
            <ion-input
              label="Título del Post"
              label-placement="floating"
              placeholder="Ingresa un título..."
              v-model="draft.title"
              :class="{ 'ion-invalid ion-touched': errores.title }"
              :error-text="errores.title"
            />
          </ion-item>

          <!-- Contenido del Post -->
          <ion-item>
            <ion-textarea
              label="Contenido"
              label-placement="floating"
              placeholder="Escribe el cuerpo del post..."
              :rows="5"
              v-model="draft.body"
              :class="{ 'ion-invalid ion-touched': errores.body }"
              :error-text="errores.body"
            />
          </ion-item>
        </ion-list>

        <div class="ion-padding-top">
          <ion-button expand="block" type="submit" :disabled="guardando">
            {{ guardando ? 'Guardando...' : 'Publicar Post' }}
          </ion-button>
        </div>
      </form>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonButton,
  loadingController,
  toastController,
  onIonViewWillEnter,
} from '@ionic/vue';
import { postsService, type User } from '@/services/postsService';
import { usePostDraft } from '@/composables/usePostDraft';

const { draft, clearDraft } = usePostDraft();
const usuarios = ref<User[]>([]);
const guardando = ref(false);

const errores = reactive({
  title: '',
  body: '',
  userId: '',
});

onIonViewWillEnter(async () => {
  if (usuarios.value.length === 0) {
    try {
      usuarios.value = await postsService.getUsers();
    } catch (e) {
      console.error('Error cargando usuarios:', e);
    }
  }
});

function validar(): boolean {
  errores.title = '';
  errores.body = '';
  errores.userId = '';
  let valido = true;

  if (!draft.userId) {
    errores.userId = 'Debes seleccionar un usuario';
    valido = false;
  }
  if (!draft.title.trim()) {
    errores.title = 'El título es obligatorio';
    valido = false;
  }
  if (!draft.body.trim()) {
    errores.body = 'El contenido no puede estar vacío';
    valido = false;
  }
  return valido;
}

async function guardarPost() {
  if (!validar()) return;

  guardando.value = true;
  const loading = await loadingController.create({
    message: 'Enviando post a la API...',
  });
  await loading.present();

  try {
    const respuesta = await postsService.create({
      title: draft.title,
      body: draft.body,
      userId: draft.userId!,
    });

    await loading.dismiss();

    const toast = await toastController.create({
      message: `¡Post creado con éxito! (ID asignado: ${respuesta.id})`,
      duration: 3000,
      color: 'success',
      position: 'bottom',
    });
    await toast.present();

    clearDraft();
  } catch (error) {
    console.error('Error al guardar:', error);
    await loading.dismiss();
    const toast = await toastController.create({
      message: 'Ocurrió un error al enviar el post.',
      duration: 3000,
      color: 'danger',
      position: 'bottom',
    });
    await toast.present();
  } finally {
    guardando.value = false;
  }
}
</script>