import api from "../config/api";

/**
 * Servicio para gestión de Clientes
 * Endpoints del microservicio de Usuarios/Clientes
 * Ruta base: /api/clientes
 */

// ===============================
// CLIENTE - CRUD
// ===============================

/**
 * POST /api/clientes - Registrar un nuevo cliente
 * Requiere: token JWT válido
 * Roles: Cualquier usuario autenticado
 */
export const registrarCliente = async (clienteData) => {
  try {
    const response = await api.post("/clientes", clienteData);
    return response.data;
  } catch (error) {
    console.error("Error al registrar cliente:", error);
    throw error;
  }
};

/**
 * GET /api/clientes - Listar todos los clientes
 * Requiere: token JWT válido
 * Roles: ADMIN, TRABAJADOR
 */
export const obtenerTodosClientes = async () => {
  try {
    const response = await api.get("/clientes");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    throw error;
  }
};

/**
 * GET /api/clientes/{id} - Obtener cliente por ID
 * Requiere: token JWT válido
 * Roles: Cualquier usuario autenticado
 */
export const obtenerClientePorId = async (idCliente) => {
  try {
    const response = await api.get(`/clientes/${idCliente}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener cliente ${idCliente}:`, error);
    throw error;
  }
};

/**
 * GET /api/clientes/usuario/{idUsuario} - Obtener cliente por Firebase UID
 * Requiere: token JWT válido
 * Roles: Cualquier usuario autenticado
 * 
 * @param {string} idUsuario - Firebase UID del usuario
 */
export const obtenerClientePorUid = async (firebaseUid) => {
  try {
    const response = await api.get(`/clientes/usuario/${firebaseUid}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener cliente por UID ${firebaseUid}:`, error);
    throw error;
  }
};

/**
 * GET /api/clientes/email/{email} - Obtener cliente por email
 * Requiere: token JWT válido
 * Roles: Cualquier usuario autenticado
 */
export const obtenerClientePorEmail = async (email) => {
  try {
    const response = await api.get(`/clientes/email/${email}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener cliente por email ${email}:`, error);
    throw error;
  }
};

/**
 * PUT /api/clientes/{id} - Actualizar cliente (nombre y teléfono)
 * Requiere: token JWT válido
 * Roles: ADMIN, TRABAJADOR
 * 
 * @param {number} id - ID del cliente
 * @param {string} nombreCliente - Nuevo nombre
 * @param {string} telefonoCliente - Nuevo teléfono (opcional, 9 dígitos)
 */
export const actualizarCliente = async (id, nombreCliente, telefonoCliente = null) => {
  try {
    const params = new URLSearchParams();
    params.append("nombreCliente", nombreCliente);
    if (telefonoCliente) {
      params.append("telefonoCliente", telefonoCliente);
    }
    const response = await api.put(`/clientes/${id}`, null, { params });
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar cliente ${id}:`, error);
    throw error;
  }
};

/**
 * PUT /api/clientes/perfil - Actualizar perfil del cliente autenticado
 * Requiere: token JWT válido
 * Roles: Cualquier usuario autenticado
 * 
 * El cliente solo puede modificar sus PROPIOS datos
 * El Firebase UID se extrae automáticamente del token JWT
 * 
 * @param {object} perfilData - Datos a actualizar (nombreCliente, email, telefonoCliente)
 */
export const actualizarPerfilCliente = async (perfilData) => {
  try {
    const response = await api.put("/clientes/perfil", perfilData);
    return response.data;
  } catch (error) {
    console.error("Error al actualizar perfil:", error);
    throw error;
  }
};

/**
 * PUT /api/clientes/{id}/email - Actualizar email de un cliente
 * Requiere: token JWT válido
 * Roles: ADMIN, TRABAJADOR
 * 
 * IMPORTANTE: Esto solo actualiza el email en la BD local
 * El email en Firebase debe actualizarse desde el frontend usando Firebase SDK
 * 
 * @param {number} id - ID del cliente
 * @param {object} emailData - { email: "nuevo@email.com" }
 */
export const actualizarEmailCliente = async (id, emailData) => {
  try {
    const response = await api.put(`/clientes/${id}/email`, emailData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar email del cliente ${id}:`, error);
    throw error;
  }
};

/**
 * DELETE /api/clientes/{id} - Eliminar cliente
 * Requiere: token JWT válido
 * Roles: ADMIN (solo)
 * 
 * ADVERTENCIA: Operación irreversible
 * Elimina el cliente y todas sus direcciones asociadas
 * 
 * @param {number} id - ID del cliente a eliminar
 */
export const eliminarCliente = async (id) => {
  try {
    const response = await api.delete(`/clientes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar cliente ${id}:`, error);
    throw error;
  }
};

// ===============================
// DIRECCIONES DEL CLIENTE
// ===============================

/**
 * POST /api/clientes/direcciones - Crear nueva dirección
 * Requiere: token JWT válido
 * Roles: Cualquier usuario autenticado
 * 
 * @param {object} direccionData - { idCliente, idCiudad, direccion, alias? }
 */
export const crearDireccion = async (direccionData) => {
  try {
    const response = await api.post("/clientes/direcciones", direccionData);
    return response.data;
  } catch (error) {
    console.error("Error al crear dirección:", error);
    throw error;
  }
};

/**
 * GET /api/clientes/{idCliente}/direcciones - Obtener direcciones de un cliente
 * Requiere: token JWT válido
 * Roles: Cualquier usuario autenticado
 * 
 * @param {number} idCliente - ID del cliente
 */
export const obtenerDireccionesPorCliente = async (idCliente) => {
  try {
    const response = await api.get(`/clientes/${idCliente}/direcciones`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error(`Error al obtener direcciones del cliente ${idCliente}:`, error);
    throw error;
  }
};

/**
 * PUT /api/clientes/direcciones/{idDireccion} - Actualizar dirección
 * Requiere: token JWT válido
 * Roles: Cualquier usuario autenticado
 * 
 * @param {number} idDireccion - ID de la dirección a actualizar
 * @param {object} direccionData - { idCiudad, direccion, alias? }
 */
export const actualizarDireccion = async (idDireccion, direccionData) => {
  try {
    const response = await api.put(`/clientes/direcciones/${idDireccion}`, direccionData);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar dirección ${idDireccion}:`, error);
    throw error;
  }
};

/**
 * DELETE /api/clientes/direcciones/{idDireccion} - Eliminar dirección
 * Requiere: token JWT válido
 * Roles: Cualquier usuario autenticado
 * 
 * @param {number} idDireccion - ID de la dirección a eliminar
 */
export const eliminarDireccion = async (idDireccion) => {
  try {
    const response = await api.delete(`/clientes/direcciones/${idDireccion}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar dirección ${idDireccion}:`, error);
    throw error;
  }
};
