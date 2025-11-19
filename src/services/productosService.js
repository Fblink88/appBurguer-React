import api from "../config/api";

/**
 * Servicio para gestión de Productos
 * Endpoints del microservicio de Catálogo
 * Ruta base: /api/productos
 */

// ===============================
// PRODUCTO - CRUD
// ===============================

/**
 * GET /api/productos - Obtener todos los productos
 * Requiere: token JWT válido
 * Roles: Todos
 * 
 * NOTA: Si este endpoint no funciona, prueba estas alternativas:
 * - /api/catalogo/productos
 * - /api/producto (singular)
 * - /api/productos/listar
 * - /api/productos/disponibles
 */
export const obtenerTodosProductos = async () => {
  try {
    // Endpoint público - no requiere autenticación
    const response = await api.get("/catalogo/productos");
    console.log('📦 Productos obtenidos del backend:', response.data);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error al obtener productos:", error);
    console.error("Status:", error.response?.status);
    console.error("URL intentada:", error.config?.url);
    throw error;
  }
};

/**
 * GET /api/productos/{id} - Obtener producto por ID
 * Requiere: token JWT válido
 * Roles: Todos
 */
export const obtenerProductoPorId = async (idProducto) => {
  try {
    const response = await api.get(`/productos/${idProducto}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener producto ${idProducto}:`, error);
    throw error;
  }
};

/**
 * GET /api/productos/categoria/{idCategoria} - Obtener productos por categoría
 * Requiere: token JWT válido
 * Roles: Todos
 */
export const obtenerProductosPorCategoria = async (idCategoria) => {
  try {
    const response = await api.get(`/productos/categoria/${idCategoria}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error(`Error al obtener productos de categoría ${idCategoria}:`, error);
    throw error;
  }
};

/**
 * GET /api/catalogo/productos - Obtener productos disponibles
 * Endpoint público según SecurityConfig (permitAll)
 * Retorna: Array de productos con campos en formato backend
 */
export const obtenerProductosDisponibles = async () => {
  try {
    const response = await api.get("/catalogo/productos");
    console.log('📦 Productos obtenidos del backend:', response.data);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error al obtener productos disponibles:", error);
    console.error("Status:", error.response?.status);
    throw error;
  }
};

/**
 * POST /api/productos - Crear un nuevo producto
 * Requiere: token JWT válido
 * Roles: ADMIN
 */
export const crearProducto = async (productoData) => {
  try {
    const response = await api.post("/productos", productoData);
    return response.data;
  } catch (error) {
    console.error("Error al crear producto:", error);
    throw error;
  }
};

/**
 * PUT /api/productos/{id} - Actualizar un producto
 * Requiere: token JWT válido
 * Roles: ADMIN
 */
export const actualizarProducto = async (idProducto, productoData) => {
  try {
    const response = await api.put(`/productos/${idProducto}`, productoData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar producto ${idProducto}:`, error);
    throw error;
  }
};

/**
 * DELETE /api/productos/{id} - Eliminar un producto
 * Requiere: token JWT válido
 * Roles: ADMIN
 */
export const eliminarProducto = async (idProducto) => {
  try {
    const response = await api.delete(`/productos/${idProducto}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar producto ${idProducto}:`, error);
    throw error;
  }
};
