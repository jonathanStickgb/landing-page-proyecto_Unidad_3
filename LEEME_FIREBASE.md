# Conectar MARIAB con Firebase (Firestore)

Archivos de este paquete (van en la **raíz** del repositorio):

| Archivo | Para qué sirve |
|---|---|
| `mariab-firestore.js` | Replica cada registro de la landing en Firestore y da el botón "☁ Admin Firebase" |
| `firestore.rules` | Reglas de seguridad (copia para documentar; se publican en la consola de Firebase) |

## Paso 1 · Publicar las reglas
1. https://console.firebase.google.com → proyecto **gen-lang-client-0670177882**.
2. **Firestore Database** → selecciona la base `ai-studio-javaaidayboyac20-f45643e8-…` → pestaña **Reglas**.
3. Borra lo que haya, pega el contenido de `firestore.rules` y pulsa **Publicar**.
4. En `firestore.rules`, función `isAdmin()`, deja solo los correos (cuentas Google) de los administradores.

## Paso 2 · Activar el inicio de sesión con Google
1. **Authentication** → *Sign-in method* → habilita **Google**.
2. **Authentication → Settings → Authorized domains** → agrega `jonathanstickgb.github.io`.

## Paso 3 · Subir a GitHub y enlazar
1. Sube `mariab-firestore.js` y `firestore.rules` a la raíz de `main`.
2. En `index.html`, justo antes de `</body>`, agrega:
   ```html
   <script type="module" src="./mariab-firestore.js"></script>
   ```

## Paso 4 · Probar
1. Abre la landing en ventana de incógnito, registra un asistente y pulsa *Guardar en MARIAB*.
2. En Firebase → Firestore → Datos debe aparecer la colección **attendees** con el registro.
3. En la landing pulsa **☁ Admin Firebase**, entra con un correo de `isAdmin()` y luego **☁ Sincronizar**: la tabla mostrará los registros de todos.

## Cómo funciona / límites
- El visitante solo puede **crear**; no puede leer los datos de otros (correos protegidos).
- Edición, check-in y eliminación llegan a Firestore solo si estás **con sesión de administrador**. Hazlas después de pulsar "☁ Admin Firebase".
- La contraseña "Acceso Administrador" de la página es solo visual (vive en el navegador). La seguridad real la dan las reglas de Firestore.
- Los 4 registros de ejemplo (ids 1–4) no se suben.
- Las reglas nuevas reemplazan las de AI Studio. Si usas esa app React (`src/`) con Firestore, deberás adaptarla.
