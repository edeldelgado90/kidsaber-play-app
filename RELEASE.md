# Plan de publicación — Android

## Estrategia de lanzamiento

1. **Closed Testing** → friends & family (ver nota sobre el requisito de 12 testers)
2. **Validar feedback** y estabilizar
3. **Lanzamiento público** en Google Play

> **Importante — requisito de acceso a producción:** las cuentas de desarrollador
> _personales_ creadas después de nov-2023 deben completar un **Closed Testing con
> ≥12 testers durante 14 días continuos** antes de poder solicitar acceso a
> producción. El **Internal Testing NO cuenta** para ese requisito. Si el plan es
> lanzar a friends & family primero, usa **Closed Testing** desde el principio para
> que ese tiempo cuente. Las cuentas de _organización_ (requieren D-U-N-S) están
> exentas. Verifica la política vigente en Play Console antes de elegir el track.

---

## Fase 0 — Backend

- [x] API desplegada en Cloud Run (europe-west1) con HTTPS
- [x] Verificación de ID tokens con **Firebase Admin SDK** funcionando. Comprobado:
      un GET sin token devuelve `401 {"error":"unauthorized"}` con
      `content-type: application/json`, es decir la respuesta la genera la
      aplicación, no el IAM de Cloud Run — el servicio es invocable
      públicamente y la app hace cumplir la auth
- [ ] **CORS — bloquea el despliegue web.** El preflight `OPTIONS` responde 204
      sin ninguna cabecera CORS, así que el navegador rechaza toda petición
      antes de enviarla. No es evitable: la app manda `Authorization: Bearer`,
      una cabecera no simple, y eso obliga al preflight en **todo** GET.

      Necesario en `kidsaber-api`:

      ```
      Access-Control-Allow-Origin: https://<dominio-del-deploy>
      Access-Control-Allow-Methods: GET, OPTIONS
      Access-Control-Allow-Headers: Authorization, Content-Type
      Vary: Origin
      ```

      El middleware de CORS debe ir **antes** del de auth. Si no, las respuestas
      401 salen sin cabeceras CORS y el navegador muestra un error de CORS opaco
      en lugar del 401 real.

> Nota: `EXPO_PUBLIC_API_URL` va sin barra final por convención, aunque
> `buildUrl` en `src/data/api/questionsApi.ts:56` recorta la barra, así que
> ambas formas producen la misma petición.

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
- [x] Backend verificando tokens con Admin SDK (ver Fase 0)
- [ ] **Web**: añadir el dominio del despliegue a Firebase Console →
      Authentication → Settings → **Authorized domains**. La auth anónima por
      web valida el origen; en nativo no, así que esto solo rompe en navegador.
      Hay que hacerlo después del primer deploy, cuando se conozca el subdominio
- [ ] _Opcional (hardening)_: activar **App Check** para evitar abuso del endpoint
      de auth anónima

---

## Fase 1b — Despliegue web (Cloudflare Pages)

Va primero porque no depende de Google Play ni del $25, y el tier gratuito de
Cloudflare Pages no tiene límite de ancho de banda.

- [x] `generateStaticParams` en las rutas dinámicas. `output: "static"` genera un
      HTML por ruta, y sin esto `games/[subject]` y `play/[subject]/[gameType]`
      no producían ninguno: la navegación interna funcionaba, pero recargar o
      entrar por URL directa daba 404. Enumeradas desde el dominio, 4 + 13 rutas
- [x] `.github/workflows/deploy-web.yml` — lint, typecheck, tests, export y deploy
- [x] `scripts/verify-web-bundle.mjs` — asserción posterior al build (ver aviso)
- [ ] Crear cuenta en Cloudflare y un proyecto de Pages llamado `kidsaber-play`
      (el nombre debe coincidir con `--project-name` del workflow)
- [ ] Crear un API token de Cloudflare con permiso _Cloudflare Pages: Edit_
- [ ] Añadir los secrets en GitHub: `CLOUDFLARE_API_TOKEN`,
      `CLOUDFLARE_ACCOUNT_ID` y las 5 `EXPO_PUBLIC_*`
- [ ] Arreglar CORS (Fase 0) — sin esto la web carga pero no obtiene preguntas
- [ ] Añadir el dominio a los Authorized domains de Firebase (Fase 1)

> **Aviso: la caché de Metro puede publicar una URL obsoleta.** La clave de caché
> de transformación no incluye el valor de las `EXPO_PUBLIC_*`, así que un export
> puede reutilizar un `env.ts` transformado con el valor anterior. Se verificó en
> la práctica: un export con la URL correcta en el entorno generó un bundle con la
> IP de LAN del `.env` previo. El fallo es mudo en build y fatal en runtime —
> `env.ts` lanza excepción con URL no https y `__DEV__` se pliega a `false` en
> producción, así que la página sale en blanco.
>
> Por eso `export:web` pasa `--clear` y el workflow ejecuta
> `scripts/verify-web-bundle.mjs`, que falla si el bundle no contiene la URL
> esperada o si contiene una dirección de red privada.
>
> A diferencia del build de EAS, aquí las `EXPO_PUBLIC_*` **sí** llegan desde
> GitHub Secrets, porque el export corre en el runner. Y ojo: en local el `.env`
> existe, así que las variables de shell ganan pero conviene no fiarse — usa
> siempre `npm run export:web`.

---

## Fase 2 — Expo / EAS (solo Android)

- [ ] Crear cuenta en [expo.dev](https://expo.dev)
- [ ] **Vincular el proyecto**: `npx eas-cli@latest login && npx eas-cli@latest init`
      → escribe `owner` y `extra.eas.projectId` en `app.json`. Sin esto,
      `eas build --non-interactive` **aborta**: no puede crear el proyecto sin prompt.
- [ ] Commitear el `app.json` resultante (el runner de CI lo necesita en el repo)
- [ ] Crear **robot access token**: expo.dev → Account settings → Access tokens
- [ ] Añadir en el **Dashboard de Expo** (entorno Production) las 5 vars:
      `EXPO_PUBLIC_API_URL` (la URL de Cloud Run de la Fase 0),
      `EXPO_PUBLIC_FIREBASE_API_KEY`, `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`,
      `EXPO_PUBLIC_FIREBASE_PROJECT_ID` y `EXPO_PUBLIC_FIREBASE_APP_ID`

> **Por qué en el dashboard de Expo y no en GitHub Secrets:** el build ocurre en los
> _workers cloud_ de EAS, no en el runner de GitHub. Las variables del runner **no se
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
