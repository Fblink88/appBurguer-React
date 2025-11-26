import api from "../config/api";

/**
 * Servicio para gestión de pedidos
 * Endpoints del microservicio de Pedidos
 */

// Listar todos los pedidos
export const getPedidos = async () => {//se crea una funcion asincrona para obtener los pedidos
  try {//async espera a que termine la peticion
    const response = await api.get("/pedidos"); //esta linea hace la peticion al backend 
    return Array.isArray(response.data) ? response.data : [];// si es un array lo devuelve, si no un array vacio
  } catch (error) {
    console.error("Error al obtener pedidos:", error); 
    throw error;
  }
};

// Obtener pedido por ID
export const getPedidoPorId = async (id) => {
  try {
    const response = await api.get(`/pedidos/${id}`);
    return response.data;// response.data tiene el pedido y lo devuelve
  } catch (error) {
    console.error(`Error al obtener pedido ${id}:`, error);
    throw error;
  }
};

//listar pedidos por clientes
export const getPedidosPorCliente = async (clienteId) => {
  try {
    const response = await api.get(`/pedidos/cliente/${clienteId}`);
    return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
    console.error(`Error al obtener pedidos del cliente ${clienteId}:`, error);
    throw error;
  }
};



// Crear nuevo pedido
export const crearPedido = async (pedido) => {
  try {
    const response = await api.post("/pedidos/completo", pedido); // va a recibir el objeto pedido completo
    return response.data;
  } catch (error) {
    console.error("Error al crear pedido:", error);
    throw error;
  }
};

// Eliminar pedido
export const eliminarPedido = async (id) => {
  try {
    const response = await api.delete(`/pedidos/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error al eliminar pedido ${id}:`, error);
    throw error;
  }
};



// Actualizar estado de pedido sin realizar venta
export const actualizarEstadoPedido = async (idPedido, idEstado) => {
  try {
    const response = await api.put(`/pedidos/cambiar-estado/${idPedido}/estado/${idEstado}`);
   
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar estado del pedido ${idPedido}:`, error);
    throw error;
  }
};


//Actualizar pedido a pagado con la venta realizada mediante un token
export const actualizarPedidoAPagado = async (idPedido) => {
  try {
    // NOTA: El backend requiere X-Internal-Token pero causa error CORS
    // Intentando solo con Authorization: Bearer (ya incluido en api.js)
    const response = await api.put(`/pedidos/procesar/${idPedido}`);
    
    return response.data;
  } catch (error) {
    console.error(`Error al actualizar pedido a pagado ${idPedido}:`, error);
    console.error('Response:', error.response?.data);
    throw error;
  }
};

// Obtener pedidos por cliente
export const getPedidosCliente = async (clienteId) => {
  try {
    const response = await api.get(`/pedidos/cliente/${clienteId}`);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error(`Error al obtener pedidos del cliente ${clienteId}:`, error);
    throw error;
  }
};

//Obtener detalles de un pedido de un cliente
export const getDetallesPedido = async (idCliente) => {
  try {
    const response = await api.get(`/pedidos/detalles/cliente/${idCliente}`);    
    return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
    console.error(`Error al obtener detalles del pedido ${idCliente}:`, error);
    throw error;
  }
};

/**
 * Actualizar un pedido existente con los datos finales del checkout
 * PUT /api/pedidos/{idPedido}/actualizar
 * 
 * @param {number} idPedido - ID del pedido a actualizar
 * @param {Object} datosActualizacion - Datos a actualizar
 * @returns {Promise<Object>} Pedido actualizado
 */
export const actualizarPedido = async (idPedido, datosActualizacion) => {
  try {
    console.log(` Actualizando pedido ${idPedido}...`);
    console.log(' Datos de actualización:', datosActualizacion);

    // Si el backend tiene endpoint de actualización, usar PUT
    const response = await api.put(`/pedidos/${idPedido}/actualizar`, datosActualizacion);
    
    console.log(' Pedido actualizado:', response.data);
    return response.data;

  } catch (error) {
    console.error(' Error al actualizar pedido:', error);
    console.error('Respuesta:', error.response?.data);
    throw error;
  }
};