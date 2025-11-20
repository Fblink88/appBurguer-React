import api from "../config/api";

/**
 * Servicio para gestión de pagos con Mercado Pago
 * Endpoints del microservicio de Pagos
 */

// ===============================
// CREAR PREFERENCIA DE PAGO
// ===============================

/**
 * POST /api/pagos/crear-preferencia
 * Crea una preferencia de pago en Mercado Pago
 * Retorna: Objeto con idPago y urlPago (initPoint de MP)
 */
export const crearPreferenciaPago = async (datosPreferencia) => {
  try {
    console.log("Creando preferencia de pago:", datosPreferencia);
    
    const response = await api.post("/pagos/crear-preferencia", datosPreferencia);
    
    console.log(" Preferencia creada:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error al crear preferencia:", error);
    console.error("Response:", error.response?.data);
    throw error;
  }
};

// ===============================
// OBTENER PAGOS
// ===============================

/**
 * GET /api/pagos
 * Obtener todos los pagos (ADMIN/TRABAJADOR)
 */
export const obtenerTodosPagos = async () => {
  try {
    const response = await api.get("/pagos");
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("Error al obtener pagos:", error);
    throw error;
  }
};

/**
 * GET /api/pagos/{id}
 * Obtener pago por ID
 */
export const obtenerPagoPorId = async (idPago) => {
  try {
    const response = await api.get(`/pagos/${idPago}`);
    return response.data;
  } catch (error) {
    console.error(`Error al obtener pago ${idPago}:`, error);
    throw error;
  }
};

/**
 * 
 */
export const obtenerPagosPorPedido = async (idPedido) => {
  try {
    const response = await api.get(`/pagos/pedido/${idPedido}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error(`Error al obtener pagos del pedido ${idPedido}:`, error);
    throw error;
  }
};

// ===============================
// ACTUALIZAR ESTADO DE PAGO
// ===============================

/**
 * PUT /api/pagos/{id}/estado
 * Actualizar estado del pago
 * 
 * @param {number} idPago - ID del pago
 * @param {number} nuevoEstado - 1=Pendiente, 2=Aprobado, 3=Rechazado
 * @param {string} idPagoMpos - ID del pago de Mercado Pago (opcional)
 * @param {string} respuestaMp - Respuesta de MP (opcional)
 */
export const actualizarEstadoPago = async (idPago, nuevoEstado, idPagoMpos = null, respuestaMp = null) => {
  try {
    const params = new URLSearchParams();
    params.append('estado', nuevoEstado);
    
    if (idPagoMpos) params.append('idPagoMpos', idPagoMpos);
    if (respuestaMp) params.append('respuestaMp', respuestaMp);
    
    const response = await api.put(`/pagos/${idPago}/estado?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar estado del pago ${idPago}:`, error);
    throw error;
  }
};

// ===============================
// CANCELAR PAGO
// ===============================

/**
 * DELETE /api/pagos/{id}
 * Cancelar un pago (ADMIN)
 */
export const cancelarPago = async (idPago) => {
  try {
    const response = await api.delete(`/pagos/${idPago}`);
    return response.data;
  } catch (error) {
    console.error(`Error al cancelar pago ${idPago}:`, error);
    throw error;
  }
};