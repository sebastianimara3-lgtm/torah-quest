# Torá Quest — APK Build Guide

## Cómo obtener el APK (sin instalar nada)

### Paso 1 — Subir el proyecto a GitHub

1. Entrá a **github.com** → iniciá sesión (o creá una cuenta gratis)
2. Hacé clic en **"New repository"**
3. Nombre: `torah-quest` · Visibilidad: **Public** · Sin README
4. Hacé clic en **"Create repository"**

Luego subí los archivos. La forma más fácil sin Git instalado:

- En la página del repo vacío, hacé clic en **"uploading an existing file"**
- Arrastrá TODOS los archivos de esta carpeta (incluyendo `.github/workflows/`)
- Escribí un mensaje como `Initial commit` y hacé clic en **"Commit changes"**

> ⚠️ Importante: asegurate de subir también la carpeta `.github/workflows/build-apk.yml`

---

### Paso 2 — Esperar el build automático

1. En tu repo, hacé clic en la pestaña **"Actions"**
2. Vas a ver el workflow **"Build APK"** corriendo (tarda ~5-10 minutos)
3. Esperá que el círculo se ponga ✅ verde

---

### Paso 3 — Descargar el APK

1. Hacé clic en el workflow completado
2. Al final de la página, en la sección **"Artifacts"**, vas a ver `torah-quest-debug`
3. Hacé clic para descargar → se baja un ZIP
4. Descomprimí el ZIP → adentro está el archivo `app-debug.apk`

---

### Paso 4 — Instalar en Android

1. Pasá el APK al celular (por WhatsApp, email, o USB)
2. En Android, abrí el archivo APK
3. Si aparece "Fuentes desconocidas", habilitá la opción en Configuración
4. Instalá y listo 🎉

---

## Si el workflow falla

Entrá a Actions → hacé clic en el run fallido → expandí el step rojo para ver el error.

El error más común es que falta algún archivo. Verificá que `.github/workflows/build-apk.yml` esté subido.

También podés relanzar el build manualmente: **Actions → Build APK → Run workflow**
