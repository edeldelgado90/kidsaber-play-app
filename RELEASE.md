# Plan de publicación — Android

## Estrategia de lanzamiento

1. **Closed Testing** → friends & family (ver nota sobre el requisito de 12 testers)
2. **Validar feedback** y estabilizar
3. **Lanzamiento público** en Google Play

> **Importante — requisito de acceso a producción:** las cuentas de desarrollador
> *personales* creadas después de nov-2023 deben completar un **Closed Testing con
> ≥12 testers durante 14 días continuos** antes de poder solicitar acceso a
> producción. El **Internal Testing NO cuenta** para ese requisito. Si el plan es
> lanzar a friends & family primero, usa **Closed Testing** desde el principio para
> que ese tiempo cuente. Las cuentas de *organización* (requieren D-U-N-S) están
> exentas. Verifica la política vigente en Play Console antes de elegir el track.

---

## Fase 0 — Bloqueante: desplegar el backend

La app no puede llegar a testers sin una API pública. Estado actual en `.env`:
`EXPO_PUBLIC_API_URL=http://192.168.1.133:8080` (IP de LAN, HTTP).

Dos problemas independientes:

- Los móviles de los testers **no pueden alcanzar tu red local**.
- `src/infrastructure/config/env.ts:17-19` **lanza una excepción al arrancar** si
  la URL no es `https://` y no es dev. Un build de producción con este valor
  **crashea en el arranque**, no falla silenciosamente.

- [ ] Desplegar la API de questions en un host público con HTTPS
- [ ] Configurar el backend con **Firebase Admin SDK** para verificar los ID tokens
      (`kidsaber-api` — repo del backend, no este)
- [ ] Anotar la URL final para usarla como `EXPO_PUBLIC_API_URL` en producción

---

## Fase 1 — Firebase

El cliente ya está implementado y correcto. **No necesitas `google-services.json`**:
el proyecto usa el **SDK JS de Firebase** (`firebase ^12.14.0`), no los módulos
nativos, así que no hay que tocar `app.json` ni añadir plugins nativos.

- [x] Proyecto Firebase creado (`kidsaber-api`)
- [x] Anonymous Authentication activado
- [x] Credenciales en `.env` local (las 4 vars presentes y con forma válida)
- [x] Cliente implementado — `src/infrastructure/firebase/firebaseApp.ts`,
      `src/data/services/FirebaseTokenService.ts`
- [x] `inMemoryPersistence` es una decisión deliberada y correcta: el UID anónimo
      no necesita sobrevivir reinicios porque perfiles y progreso viven en
      AsyncStorage
- [ ] Backend verificando tokens con Admin SDK (ver Fase 0)
- [ ] Si se publica la versión **web**: añadir el dominio a Firebase Console →
      Authentication → Settings → **Authorized domains**
- [ ] *Opcional (hardening)*: activar **App Check** para evitar abuso del endpoint
      de auth anónima

---

## Fase 2 — Expo / EAS

- [ ] Crear cuenta en [expo.dev](https://expo.dev)
- [ ] **Vincular el proyecto**: `npx eas-cli@latest login && npx eas-cli@latest init`
      → escribe `owner` y `extra.eas.projectId` en `app.json`. Sin esto,
      `eas build --non-interactive` **aborta**: no puede crear el proyecto sin prompt.
- [ ] Commitear el `app.json` resultante (el runner de CI lo necesita en el repo)
- [ ] Crear **robot access token**: expo.dev → Account settings → Access tokens
- [ ] Añadir las 5 vars de entorno en el **Dashboard de Expo** (entorno Production):
      - `EXPO_PUBLIC_API_URL` (la URL HTTPS de la Fase 0)
      - `EXPO_PUBLIC_FIREBASE_API_KEY`
      - `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
      - `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
      - `EXPO_PUBLIC_FIREBASE_APP_ID`

> **Por qué en el dashboard de Expo y no en GitHub Secrets:** el build ocurre en los
> *workers cloud* de EAS, no en el runner de GitHub. Las variables del runner **no se
> propagan** al build. Las `EXPO_PUBLIC_*` se inlinean en el bundle en tiempo de
> build, así que deben existir en el entorno de EAS. Definirlas como GitHub Secrets
> no tiene ningún efecto.

---

## Fase 3 — GitHub Secrets

Solo estos dos, y son los únicos que tienen sentido aquí (los consume el runner,
no el build):

- [ ] `EXPO_TOKEN` — el robot token de la Fase 2
- [ ] `GOOGLE_SERVICE_ACCOUNT_KEY` — el JSON completo de la Fase 4

`.github/workflows/deploy.yml` valida ambos en el primer paso y falla con un
mensaje explícito si falta alguno.

---

## Fase 4 — Google Play Console

- [ ] Crear cuenta ($25 pago único). Decidir **personal vs organización**
      (ver nota del requisito de 12 testers al inicio)
- [ ] Crear la app (nombre, descripción, categoría, política de privacidad)
- [ ] Rellenar el cuestionario de **Play Families / contenido dirigido a menores** —
      obligatorio para una app infantil (6-10 años), y condiciona la revisión
- [ ] Preparar assets de tienda (ver Fase 5)
- [ ] Crear track de **Closed Testing** y añadir los emails de los testers
- [ ] Crear cuenta de servicio (Google Cloud → IAM) con permisos en Play Console,
      descargar el JSON → contenido a `GOOGLE_SERVICE_ACCOUNT_KEY`
- [ ] **Primer AAB subido a mano.** EAS Submit no puede crear la ficha inicial;
      Play exige que la primera versión se suba manualmente desde la consola

---

## Fase 5 — Assets e iconos

Problema detectado: `app.json` usa `assets/brand/logo-full.png` (**437×427, no
cuadrado**) como `icon`, `adaptiveIcon.foregroundImage` y `splash.image`.

- El icono de Android debe ser **cuadrado**; uno no cuadrado se deforma o se rellena
- El `adaptiveIcon` se recorta con **máscara circular**: un logo con texto
  ("logo-full") pierde las palabras en los bordes. El foreground debe ser la marca
  sola, con ~25% de padding de seguridad
- Play exige un icono de tienda de **512×512** exacto

- [ ] Generar icono cuadrado 1024×1024 a partir de `logo-mark-KS.png` (hoy 280×280,
      demasiado pequeño para reescalar sin pérdida)
- [ ] Apuntar `icon` y `adaptiveIcon.foregroundImage` al nuevo asset
- [ ] Icono de tienda 512×512
- [ ] Capturas: mínimo 2, entre 320px y 3840px de lado
- [ ] Feature graphic 1024×500

---

## Fase 6 — Verificación previa al envío

- [ ] `npm run lint && npm run typecheck && npm test` en verde
- [ ] Build de preview en dispositivo físico:
      `npx eas-cli build --platform android --profile preview`
      (genera APK instalable, más rápido de validar que un AAB)
- [ ] Confirmar que la app arranca **apuntando a la API de producción** — es el
      caso que rompe el guard de HTTPS de `env.ts`
- [ ] Verificar que las preguntas cargan (valida la cadena completa: anonymous
      auth → ID token → Admin SDK → respuesta)
- [ ] Probar en modo oscuro y claro
- [ ] Revisar `app.json`: nombre, versión, `android.package` (`com.kidsaber.play`)
