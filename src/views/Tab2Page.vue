<template>
  <ion-page>
    <ion-header :translucent="true">
      <ion-toolbar>
        <ion-title>Lector QR</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding ion-text-center">
      <div class="qr-container">
        <ion-icon :icon="qrCodeOutline" class="qr-icon" />
        <h2>Escanear Contenido</h2>
        <p>Apunta al código QR para rellenar automáticamente el formulario de creación.</p>

        <ion-button expand="block" @click="escanearQR" class="ion-margin-top">
          Iniciar Escáner
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonIcon,
  alertController,
  toastController,
  useIonRouter,
} from '@ionic/vue';
import { qrCodeOutline } from 'ionicons/icons';
import { BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { usePostDraft } from '@/composables/usePostDraft';

const ionRouter = useIonRouter();
const { setDraft } = usePostDraft();

async function escanearQR() {
  try {
    const isSupported = await BarcodeScanner.isSupported();
    if (!isSupported.supported) {
      mostrarAlerta('No compatible', 'El escáner no está disponible en este dispositivo.');
      return;
    }

    const { camera } = await BarcodeScanner.checkPermissions();
    if (camera !== 'granted') {
      const solicitud = await BarcodeScanner.requestPermissions();
      if (solicitud.camera !== 'granted') {
        mostrarAlerta('Permiso denegado', 'Se requiere acceso a la cámara para escanear.');
        return;
      }
    }

    const { barcodes } = await BarcodeScanner.scan();
    if (barcodes.length > 0) {
      const rawText = barcodes[0].displayValue || barcodes[0].rawValue || '';
      procesarCodigoQR(rawText);
    }
  } catch (error) {
    console.error('Error al escanear:', error);
  }
}

async function procesarCodigoQR(texto: string) {
  try {
    const datos = JSON.parse(texto);

    // Cargar en el estado compartido
    setDraft({
      title: datos.title || '',
      body: datos.body || '',
      userId: datos.userId ? Number(datos.userId) : null,
    });

    const toast = await toastController.create({
      message: '¡Datos del QR cargados en el formulario!',
      duration: 2000,
      color: 'success',
      position: 'top',
    });
    await toast.present();

    // Redirigir a Tab 3
    ionRouter.push('/tabs/tab3');
  } catch {
    mostrarAlerta(
      'Formato no válido',
      'El código QR no contiene una estructura JSON válida con title, body y userId.'
    );
  }
}

async function mostrarAlerta(titulo: string, mensaje: string) {
  const alert = await alertController.create({
    header: titulo,
    message: mensaje,
    buttons: ['OK'],
  });
  await alert.present();
}
</script>

<style scoped>
.qr-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 3rem;
}

.qr-icon {
  font-size: 90px;
  color: var(--ion-color-primary);
}
</style>