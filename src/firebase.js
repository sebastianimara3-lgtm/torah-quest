import { initializeApp } from "firebase/app";
import { getRemoteConfig, fetchAndActivate, getValue } from "firebase/remote-config";

const firebaseConfig = {
  apiKey: "AIzaSyBMCdbEjqMzVN3uPINqUSuslSJYG6MTxPc",
  projectId: "torah-quest-72061",
  storageBucket: "torah-quest-72061.firebasestorage.app",
  appId: "1:1033099516386:android:9aa75d12ab107e610b01bb",
  messagingSenderId: "1033099516386",
};

const app = initializeApp(firebaseConfig);
const remoteConfig = getRemoteConfig(app);

// Actualiza cada 1 hora en producción
remoteConfig.settings.minimumFetchIntervalMillis = 3600000;

// Valores por defecto si Firebase no responde
remoteConfig.defaultConfig = {
  banner_activo: false,
  banner_texto: "",
  banner_imagen_url: "",
  banner_link: "",
  banner_color_fondo: "#1e1b4b",
  banner_color_texto: "#ffffff",
};

export async function cargarBanner() {
  try {
    await fetchAndActivate(remoteConfig);
    return {
      activo: getValue(remoteConfig, "banner_activo").asBoolean(),
      texto: getValue(remoteConfig, "banner_texto").asString(),
      imagenUrl: getValue(remoteConfig, "banner_imagen_url").asString(),
      link: getValue(remoteConfig, "banner_link").asString(),
      colorFondo: getValue(remoteConfig, "banner_color_fondo").asString(),
      colorTexto: getValue(remoteConfig, "banner_color_texto").asString(),
    };
  } catch (err) {
    console.warn("Firebase Remote Config no disponible:", err);
    return null;
  }
}
