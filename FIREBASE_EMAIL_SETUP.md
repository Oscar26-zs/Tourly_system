# 📧 Configuración de Email Templates en Firebase

## 🎯 Personalizar el Email de Recuperación de Contraseña

Para que los emails de recuperación usen nuestros estilos personalizados de Tourly, sigue estos pasos:

### 1. **Acceder a Firebase Console**
- Ve a [Firebase Console](https://console.firebase.google.com/)
- Selecciona tu proyecto "tourly-6e2a8"
- Ve a **Authentication** → **Templates**

### 2. **Configurar Template de Password Reset**
- Busca la sección "**Password reset**" 
- Haz clic en **"Edit template"**
- Selecciona **"Customize action URL"**
- En **Action URL**, pega: `https://tu-dominio.com/reset-password`
  - Durante desarrollo: `http://localhost:5173/reset-password`
  - En producción: `https://tourly.com/reset-password` (reemplaza con tu dominio)

### 3. **Personalizar el HTML del Email**
- En la sección **Email body**, selecciona **HTML**
- Reemplaza todo el contenido con el HTML del archivo: `src/templates/password-reset-email.html`
- **Importante**: Mantén las variables de Firebase como `%LINK%` y `%EMAIL%`

### 4. **Configurar el Subject**
- En **Email subject**, escribe: 
  ```
  🔐 Recupera tu contraseña - Tourly
  ```

### 5. **Configurar el Sender**
- En **Sender name**, escribe: `Tourly`
- En **Sender email**, usa tu dominio verificado o deja el predeterminado

### 6. **Variables Disponibles en Firebase**
Puedes usar estas variables en tu template HTML:
- `%LINK%` - Enlace de reset que apunta a tu aplicación
- `%EMAIL%` - Email del usuario
- `%DISPLAY_NAME%` - Nombre del usuario (si está configurado)

## 🚀 Flujo Completo Implementado

### Páginas Creadas:
- ✅ `/forgot-password` - Formulario para solicitar reset
- ✅ `/password-reset-sent` - Confirmación de envío
- ✅ `/reset-password` - Página personalizada para crear nueva contraseña

### Servicios Implementados:
- ✅ `resetPassword.ts` - Envía email de recuperación
- ✅ `confirmPasswordReset.ts` - Maneja el reset code y actualiza contraseña

### Características:
- ✅ Diseño consistente con tu aplicación
- ✅ Manejo completo de errores
- ✅ Validaciones de seguridad
- ✅ Experiencia de usuario fluida
- ✅ Mensajes de éxito y confirmación

## 🔧 Configuración Adicional (Opcional)

### Dominio Personalizado para Emails
Para usar tu propio dominio en los emails:
1. Ve a **Authentication** → **Settings**
2. En **Authorized domains**, agrega tu dominio
3. Configura los registros DNS según las instrucciones de Firebase

### Configuración de SMTP (Firebase Auth no soporta SMTP custom directamente)
Si necesitas SMTP personalizado, considera usar:
- Sendgrid
- Mailgun  
- AWS SES

## 🧪 Testing

Para probar el flujo:
1. Ve a `/forgot-password`
2. Ingresa un email registrado
3. Revisa tu bandeja de entrada
4. Haz clic en el enlace del email
5. Crea una nueva contraseña en `/reset-password`
6. Inicia sesión con la nueva contraseña

## ⚠️ Notas Importantes

- El template HTML debe mantener las variables `%LINK%` de Firebase
- Los enlaces expiran en 1 hora por defecto (configurable en Firebase)
- Asegúrate de que tu dominio esté en la lista de dominios autorizados
- En desarrollo, usa `localhost:5173` en la configuración

## 🎨 Personalización del Email

El template incluye:
- ✅ Colores y estilos de Tourly (#228B22, #1E1E1E)
- ✅ Logo personalizado con SVG
- ✅ Instrucciones claras paso a paso
- ✅ Diseño responsive
- ✅ Notas de seguridad
- ✅ Branding consistente

¡El flujo completo de "Olvidé mi contraseña" está listo! 🎉