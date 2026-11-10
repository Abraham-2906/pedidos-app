<!-- src/views/LoginPage.vue -->
<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Iniciar Sesión</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <div class="login-wrapper">
        <h2>Bienvenido</h2>
        <p>Inicia sesión con tu cuenta institucional para acceder a las órdenes del backend.</p>

        <form @submit.prevent="handleLogin">
          <ion-list>
            <ion-item>
              <ion-input
                label="Correo electrónico"
                label-placement="floating"
                type="email"
                placeholder="usuario@ejemplo.com"
                v-model="email"
                required
              />
            </ion-item>

            <ion-item>
              <ion-input
                label="Contraseña"
                label-placement="floating"
                type="password"
                placeholder="Ingresa tu clave"
                v-model="password"
                required
              />
            </ion-item>
          </ion-list>

          <ion-button expand="block" type="submit" class="ion-margin-top" :disabled="cargando">
            {{ cargando ? 'Iniciando sesión...' : 'Entrar' }}
          </ion-button>
        </form>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { useAuth } from '@/composables/useAuth';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonList,
  IonPage,
  IonTitle,
  IonToolbar,
  loadingController,
  toastController,
  useIonRouter,
} from '@ionic/vue';
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const cargando = ref(false);

const { login } = useAuth();
const ionRouter = useIonRouter();

async function handleLogin(): Promise<void> {
  if (!email.value.trim() || !password.value.trim()) {
    return;
  }

  cargando.value = true;
  const loading = await loadingController.create({
    message: 'Verificando credenciales...',
  });
  await loading.present();

  try {
    await login(email.value, password.value);
    await loading.dismiss();

    const toast = await toastController.create({
      message: '¡Sesión iniciada con éxito!',
      duration: 2000,
      color: 'success',
      position: 'bottom',
    });
    await toast.present();

    // Redirige a la pestaña de órdenes reemplazando la raíz
    ionRouter.navigate('/tabs/tab4', 'root', 'replace');
  } catch (error: any) {
    await loading.dismiss();
    const toast = await toastController.create({
      message: error?.message || 'Error al autenticar contra el servidor.',
      duration: 3000,
      color: 'danger',
      position: 'bottom',
    });
    await toast.present();
  } finally {
    cargando.value = false;
  }
}
</script>

<style scoped>
.login-wrapper {
  max-width: 420px;
  margin: 3rem auto 0 auto;
}
</style>