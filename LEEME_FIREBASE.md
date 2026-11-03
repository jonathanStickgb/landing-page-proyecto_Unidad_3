# Conectar MARIAB con Firebase (Firestore)

Archivos de este paquete (van en la **raíz** del repositorio):

| Archivo | Para qué sirve |
|---|---|
| `mariab-firestore.js` | Replica cada registro de la landing en Firestore y da el botón "☁ Admin Firebase" |
| `index.html` | Tu index actual + una línea: `<script type="module" src="mariab-firestore.js">` |
| `script.js` | Tu script con `handleAdminButton`, `handleAdminLogin`, `handleEditSubmit` y el botón Editar (el index ya los llamaba pero no existían) |
| `firestore.rules` | Reglas de seguridad (copia para documentar; se publican en la consola de Firebase) |

# Paso 1 · Crear la base y publicar las reglas
1. https://console.firebase.google.com → proyecto **gen-lang-client-0670177882** → **Firestore** → **Crear base de datos**.
2. Edición **Standard**, ID de base `(default)`, ubicación `southamerica-east1` (São Paulo) o la más cercana (no se puede cambiar después).
3. Modo **producción** → Crear.
4. Pestaña **Reglas**: borra todo, pega el contenido de `firestore.rules` y pulsa **Publicar**.
5. En `firestore.rules`, función `isAdmin()`, deja solo los correos (cuentas Google) de los administradores.

## Paso 2 · Activar el inicio de sesión con Google
1. **Authentication** → *Sign-in method* → habilita **Google**.
2. **Authentication → Settings → Authorized domains** → agrega `jonathanstickgb.github.io`.

## Paso 3 · Subir a GitHub (raíz de `main`)
Sube estos archivos: `index.html`, `script.js` (con modo administrador), `mariab-firestore.js`, `firebase-config.js` y `firestore.rules`.

`firebase-config.js` ya trae los datos de la app web `landing-javaai`. Si el login da `auth/api-key-not-valid`, compara la `apiKey` carácter por carácter con la de Firebase (cuidado con l/I y 0/O).

⚠️ **No subas** el `script.js` ni el `styles.css` del zip `archivos_faltantes_github.zip`: son versiones viejas.

**Clave del modo administrador:** el `script.js` guarda solo el hash SHA-256 de la clave. Para cambiarla, abre la landing, pulsa `F12` → Console y ejecuta `hashAdminPassword('NuevaClave').then(console.log)`; pega el resultado en `ADMIN_PASSWORD_HASH`.

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
