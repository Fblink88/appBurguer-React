// src/config/images.js
// URLs centralizadas de imágenes estáticas alojadas en Firebase Storage
// Para imágenes dinámicas (productos subidos desde admin), se usan las URLs que devuelve el backend

const BUCKET = 'goldenburgers-60680.firebasestorage.app';
const BASE_URL = `https://firebasestorage.googleapis.com/v0/b/${BUCKET}/o/img%2F`;
const SUFFIX = '?alt=media';

// Helper para construir URLs (evita repetir el patrón)
const img = (filename) => `${BASE_URL}${filename}${SUFFIX}`;

export const IMAGES = {
  // Branding
  logo: img('Logo.JPG'),

  // Carruseles del home
  // Nota: Firebase tiene inconsistencia de mayúsculas (carrusel1/2 en minúscula, Carrusel3 en mayúscula)
  carrusel1: img('carrusel1.png'),
  carrusel2: img('carrusel2.png'),
  carrusel3: img('Carrusel3.png'),

  // Burgers destacadas del home
  golden: img('Golden.PNG'),
  baconBBQ: img('BaconBBQ.PNG'),
  clasica: img('Clasica.PNG'),
};