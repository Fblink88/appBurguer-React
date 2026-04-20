import axios from "axios";

// Configuración de URLs según el ambiente
const API_URLS = {
  // En desarrollo local
  development: "http://localhost:8080/api",
  
  // Para la VM (descomentar cuando despliegues):
  // development: "http://161.153.219.128:8080/api",

  // En producción, apunta directamente a la VM del backend
  production: "http://161.153.219.128:8080/api"
};

// Detectar el ambiente actual
const isDevelopment = import.meta.env.DEV;
const baseURL = isDevelopment ? API_URLS.development : API_URLS.production;

console.log(`Ambiente: ${isDevelopment ? 'Desarrollo' : 'Producción'}`);
console.log(` API Base URL: ${baseURL}`);

// Crear instancia de Axios con configuración base
const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 30000,
  withCredentials: false
});

// Interceptor para agregar el token JWT
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    if (isDevelopment) {
      console.log(` ${config.method.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error) => {
    console.error(" Error en request:", error);
    return Promise.reject(error);
  }
);

// Interceptor para manejo de respuestas y errores
api.interceptors.response.use(
  (response) => {
    if (isDevelopment) {
      console.log(` ${response.status} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    if (error.response) {
      const { status, data } = error.response;

      switch (status) {
        case 401:
          console.error("No autorizado - Token inválido");
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
          if (!window.location.pathname.includes("/login")) {
            window.location.href = "/login";
          }
          break;

        case 403:
          console.error(" Acceso prohibido");
          alert("No tienes permisos para realizar esta acción");
          break;

        case 404:
          console.error(" Recurso no encontrado");
          break;

        case 500:
          console.error(" Error del servidor");
          alert("Error en el servidor. Por favor, intenta más tarde.");
          break;

        default:
          console.error(` Error ${status}:`, data);
      }
    } else if (error.request) {
      console.error(" No se pudo conectar con el servidor");
      alert("No se pudo conectar con el servidor. Verifica tu conexión.");
    } else {
      console.error(" Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;