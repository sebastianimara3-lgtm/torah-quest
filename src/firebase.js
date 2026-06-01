// Lee el banner desde /public/banner.json
// Para cambiar el banner: editá ese archivo en GitHub y listo, sin reinstalar la app

export async function cargarBanner() {
  try {
    // Agrega un timestamp para evitar caché
    const url = `/banner.json?t=${Date.now()}`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    return {
      activo:      data.activo      ?? false,
      texto:       data.texto       ?? "",
      imagenUrl:   data.imagen_url  ?? "",
      link:        data.link        ?? "",
      colorFondo:  data.color_fondo ?? "#1e1b4b",
      colorTexto:  data.color_texto ?? "#ffffff",
    };
  } catch (err) {
    console.warn("No se pudo cargar el banner:", err);
    return null;
  }
}
