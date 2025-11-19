/**
 * Utilidad para mapear campos de la base de datos (MAYÚSCULAS_CON_GUION_BAJO) 
 * a formato JavaScript (camelCase)
 * 
 * El backend retorna los datos directamente desde Oracle sin mapear,
 * por lo que vienen en formato MAYÚSCULAS con guiones bajos.
 */

/**
 * Obtiene el valor de un campo probando múltiples variaciones de nombre
 * @param {Object} obj - Objeto que contiene los datos
 * @param {string} fieldName - Nombre base del campo (en camelCase)
 * @param {*} defaultValue - Valor por defecto si no se encuentra el campo
 * @returns {*} Valor del campo o valor por defecto
 */
export const getField = (obj, fieldName, defaultValue = null) => {
  if (!obj) return defaultValue;

  // Probar el nombre original (camelCase)
  if (obj[fieldName] !== undefined) return obj[fieldName];

  // Convertir a MAYÚSCULAS_CON_GUION_BAJO
  const upperSnakeCase = fieldName
    .replace(/([A-Z])/g, '_$1')
    .toUpperCase()
    .replace(/^_/, '');
  
  if (obj[upperSnakeCase] !== undefined) return obj[upperSnakeCase];

  // Probar snake_case minúsculas
  const lowerSnakeCase = fieldName
    .replace(/([A-Z])/g, '_$1')
    .toLowerCase()
    .replace(/^_/, '');
  
  if (obj[lowerSnakeCase] !== undefined) return obj[lowerSnakeCase];

  return defaultValue;
};

/**
 * Mapeo específico para clientes
 */
export const mapCliente = (cliente) => {
  if (!cliente) return null;
  
  return {
    id: getField(cliente, 'idCliente') || getField(cliente, 'id'),
    idCliente: getField(cliente, 'idCliente') || getField(cliente, 'id'),
    nombre: getField(cliente, 'nombreCliente') || getField(cliente, 'nombre'),
    telefono: getField(cliente, 'telefonoCliente') || getField(cliente, 'telefono'),
    email: getField(cliente, 'emailCliente') || getField(cliente, 'email'),
    // Mantener campos originales por si acaso
    ...cliente
  };
};

/**
 * Mapeo específico para pedidos
 */
export const mapPedido = (pedido) => {
  if (!pedido) return null;
  
  return {
    id: getField(pedido, 'idPedido') || getField(pedido, 'id'),
    idPedido: getField(pedido, 'idPedido') || getField(pedido, 'id'),
    idCliente: getField(pedido, 'idCliente'),
    idEstadoPedido: getField(pedido, 'idEstadoPedido'),
    idMetodoPago: getField(pedido, 'idMetodoPago'),
    idTipoEntrega: getField(pedido, 'idTipoEntrega'),
    idDireccionCliente: getField(pedido, 'idDireccionCliente'),
    montoSubtotal: getField(pedido, 'montoSubtotal', 0),
    montoEnvio: getField(pedido, 'montoEnvio', 0),
    montoTotal: getField(pedido, 'montoTotal', 0),
    fechaPedido: getField(pedido, 'fechaPedido'),
    notaCliente: getField(pedido, 'notaCliente'),
    estadoPedido: getField(pedido, 'estadoPedido'),
    metodoPago: getField(pedido, 'metodoPago'),
    tipoEntrega: getField(pedido, 'tipoEntrega'),
    detalles: pedido.detalles?.map(mapDetallePedido) || [],
    // Mantener campos originales
    ...pedido
  };
};

/**
 * Mapeo específico para detalle de pedido
 */
export const mapDetallePedido = (detalle) => {
  if (!detalle) return null;
  
  return {
    id: getField(detalle, 'idDetalle') || getField(detalle, 'id'),
    idDetalle: getField(detalle, 'idDetalle') || getField(detalle, 'id'),
    idPedido: getField(detalle, 'idPedido'),
    idProducto: getField(detalle, 'idProducto'),
    cantidad: getField(detalle, 'cantidad', 0),
    precioUnitario: getField(detalle, 'precioUnitario', 0),
    subtotalLinea: getField(detalle, 'subtotalLinea', 0),
    producto: detalle.producto ? mapProducto(detalle.producto) : null,
    // Mantener campos originales
    ...detalle
  };
};

/**
 * Mapeo específico para productos
 */
export const mapProducto = (producto) => {
  if (!producto) return null;
  
  return {
    id: getField(producto, 'idProducto') || getField(producto, 'id'),
    idProducto: getField(producto, 'idProducto') || getField(producto, 'id'),
    idCategoria: getField(producto, 'idCategoria'),
    nombre: getField(producto, 'nombreProducto') || getField(producto, 'nombre'),
    nombreProducto: getField(producto, 'nombreProducto') || getField(producto, 'nombre'),
    descripcion: getField(producto, 'descripcion'),
    precio: getField(producto, 'precioBase') || getField(producto, 'precio', 0),
    precioBase: getField(producto, 'precioBase') || getField(producto, 'precio', 0),
    precioProducto: getField(producto, 'precioBase') || getField(producto, 'precio', 0),
    imagenUrl: getField(producto, 'imagenUrl'),
    disponible: getField(producto, 'disponible', true),
    // Mantener campos originales
    ...producto
  };
};

/**
 * Mapeo específico para direcciones
 */
export const mapDireccion = (direccion) => {
  if (!direccion) return null;
  
  return {
    id: getField(direccion, 'idDireccion') || getField(direccion, 'id'),
    idDireccion: getField(direccion, 'idDireccion') || getField(direccion, 'id'),
    idCliente: getField(direccion, 'idCliente'),
    idCiudad: getField(direccion, 'idCiudad'),
    direccion: getField(direccion, 'direccion'),
    alias: getField(direccion, 'alias'),
    // Mantener campos originales
    ...direccion
  };
};

/**
 * Mapea un array de objetos usando la función de mapeo especificada
 */
export const mapArray = (array, mapFn) => {
  if (!Array.isArray(array)) return [];
  return array.map(mapFn);
};
