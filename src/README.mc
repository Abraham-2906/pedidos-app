# Laboratorio - App Móvil (Pedidos App)

Aplicación móvil híbrida desarrollada con Ionic Framework, Capacitor y Vue 3.

## Requisitos y Entorno
- **Node.js:** v24.19.0
- **Ionic Framework:** v7.2.1
- **Capacitor:** v8.6.0
- **Dispositivo de prueba:** Android (físico)

## Funcionalidades Implementadas
1. **Consumo de API:** Lectura de publicaciones (`GET`) y selección de autores desde JSONPlaceholder.
2. **Formulario de Publicación:** Validación reactiva de datos y envío (`POST`) con feedback visual (Loading y Toasts).
3. **Hardware nativo:** Integración del plugin de escáner de códigos (`@capacitor-mlkit/barcode-scanning`) con solicitud de permisos en tiempo de ejecución.
4. **Auto-llenado por QR:** Lectura de JSON estructurado desde un código QR que transfiere los datos al formulario de creación.

## Instrucciones de Instalación
1. Clonar el repositorio.
2. Instalar dependencias: `npm install`
3. Compilar el proyecto web: `npm run build`
4. Sincronizar con Capacitor: `npx cap sync android`
5. Ejecutar en dispositivo: `npx cap open android` y correr desde Android Studio.