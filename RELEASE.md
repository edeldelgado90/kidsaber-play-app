# Plan de publicación — Android

## Estrategia de lanzamiento

1. **Internal Testing** → probar con friends & family (hasta 100 personas, acceso inmediato)
2. **Validar feedback** y estabilizar
3. **Lanzamiento público** en Google Play

---

## Checklist de publicación

### Firebase
- [x] Proyecto Firebase creado (`kidsaber-api`)
- [x] Anonymous Authentication activado
- [x] Credenciales en `.env` local
- [ ] Backend configurado con Firebase Admin SDK para verificar tokens

### GitHub Secrets
- [ ] `EXPO_PUBLIC_FIREBASE_API_KEY`
- [ ] `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
- [ ] `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
- [ ] `EXPO_PUBLIC_FIREBASE_APP_ID`
- [ ] `EXPO_TOKEN` (requiere cuenta en expo.dev)
- [ ] `GOOGLE_SERVICE_ACCOUNT_KEY` (requiere cuenta en Google Play Console)

### Expo (expo.dev)
- [ ] Crear cuenta en expo.dev
- [ ] Añadir las 4 vars `EXPO_PUBLIC_FIREBASE_*` en el Dashboard (entorno Production)
- [ ] Obtener `EXPO_TOKEN` y añadirlo a GitHub Secrets

### Google Play Console
- [ ] Crear cuenta ($25 pago único)
- [ ] Crear ficha de la app (nombre, descripción, categoría)
- [ ] Preparar assets de la tienda (icono 512×512, capturas de pantalla)
- [ ] Crear track de **Internal Testing** y añadir emails de testers
- [ ] Crear cuenta de servicio y descargar `google-service-account.json` para EAS Submit

### App
- [ ] Probar build de producción en dispositivo físico Android
- [ ] Revisar `app.json` (nombre, versión, bundle ID, íconos)
