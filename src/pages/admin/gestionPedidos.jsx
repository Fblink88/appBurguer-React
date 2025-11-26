// src/pages/admin/GestionPedidos.jsx

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import '../../styles/gestionPedidos.css';
import * as pedidosService from '../../services/pedidosService';
import * as usuariosService from '../../services/usuariosService';
import * as productosService from '../../services/productosService';
import * as ventaService from '../../services/ventaService';
import * as boletaService from '../../services/boletaService';

function GestionPedidos() {
  // Estados del formulario
  const [idCliente, setIdCliente] = useState('');
  const [idProducto, setIdProducto] = useState('');
  const [cantidad, setCantidad] = useState('1');
  const [idEstadoPedido, setIdEstadoPedido] = useState('1');
  const [idMetodoPago, setIdMetodoPago] = useState('');
  const [idTipoEntrega, setIdTipoEntrega] = useState('');
  const [idDireccion, setIdDireccion] = useState('');
  const [montoEnvio, setMontoEnvio] = useState('0');
  const [notaCliente, setNotaCliente] = useState('');
  
  // Estado para carrito temporal de productos
  const [productosCarrito, setProductosCarrito] = useState([]);

  // Estados para datos
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [metodosPago, setMetodosPago] = useState([]);
  const [tiposEntrega, setTiposEntrega] = useState([]);
  const [direccionesCliente, setDireccionesCliente] = useState([]);

  // Estados de carga
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Estado para búsqueda de pedidos por cliente
  const [busquedaCliente, setBusquedaCliente] = useState('');
  const [pedidosFiltrados, setPedidosFiltrados] = useState([]);

  // Filtrar pedidos automáticamente cuando cambia la búsqueda
  useEffect(() => {
    if (!busquedaCliente.trim()) {
      setPedidosFiltrados([]);
      return;
    }
    handleBuscarPorCliente();
  }, [busquedaCliente, clientes, pedidos]);

  // Cargar datos al montar
  useEffect(() => {
    inicializarDatos();
  }, []);

  // Monitorear cambios en clientes
  useEffect(() => {
    console.log(' Estado de clientes actualizado. Total:', clientes.length);
    if (clientes.length > 0) {
      console.log(' Lista de clientes disponibles:', clientes.map(c => ({ 
        id: c.idCliente , 
        nombre:c.nombreCliente ,
        todosLosCampos: c
      })));
    }
  }, [clientes]);

  // Cargar direcciones cuando cambia el cliente
  useEffect(() => {
    if (idCliente) {
      cargarDireccionesCliente(idCliente);
    } else {
      setDireccionesCliente([]);
      setIdDireccion('');
    }
  }, [idCliente]);

  // Helper: Obtener nombre del cliente por ID
  const getNombreCliente = (idCliente) => {
    if (!idCliente || !clientes.length) return 'N/A';
    const cliente = clientes.find(c => (c.idCliente) === idCliente);
    return cliente?.nombreCliente || 'N/A';
  };

  // Helper: Obtener nombre del método de pago por ID
  const getNombreMetodoPago = (idMetodoPago) => {
    if (!idMetodoPago) return '-';
    
    // Mapeo según la BD: ID_METODO_PAGO (1=Webpay, 2=Efectivo, 3=Mercado Pago)
    const mapeoMetodosPago = {
      1: 'Webpay',
      2: 'Efectivo',
      3: 'Mercado Pago'
    };
    
    return mapeoMetodosPago[idMetodoPago] || `Método ${idMetodoPago}`;
  };

  // Helper: Obtener nombre del tipo de entrega por ID
  const getNombreTipoEntrega = (idTipoEntrega) => {
    if (!idTipoEntrega) return '-';
    
    // Mapeo según la BD: ID_TIPO_ENTREGA (1=Delivery, 2=Retiro en Local)
    const mapeoTiposEntrega = {
      1: 'Delivery',
      2: 'Retiro en Local'
    };
    
    return mapeoTiposEntrega[idTipoEntrega] || `Tipo ${idTipoEntrega}`;
  };

  // Helper: Obtener nombre del estado por ID
  const getNombreEstadoPedido = (idEstadoPedido) => {
    if (!idEstadoPedido) return 'Pendiente';
    
    // Mapeo según la BD: ID_ESTADO_PEDIDO
    const mapeoEstados = {
      1: 'Pendiente de Pago',
      2: 'Pagado',
      7: 'Cancelado'
    };
    
    return mapeoEstados[idEstadoPedido] || `Estado ${idEstadoPedido}`;
  };

  // Inicializar todos los datos
  const inicializarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Cargando datos iniciales...');
      
      // Verificar token
      const token = localStorage.getItem('authToken');
      const user = localStorage.getItem('user');
      console.log('Token disponible:', !!token);
      console.log('Token (primeros 50 chars):', token?.substring(0, 50) + '...');
      console.log('Usuario:', user);
      
      // Primero hacer un test simple para verificar que el backend responde
      try {
        console.log('Test: Enviando petición a /pedidos (plural)...');
        const testResponse = await fetch('http://161.153.219.128:8080/api/pedidos', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        console.log('Test response status:', testResponse.status);
        if (!testResponse.ok) {
          const errorData = await testResponse.text();
          console.log('Test response error:', errorData);
        } else {
          const data = await testResponse.json();
          console.log('Test response OK - Items:', data.length);
        }
      } catch (testErr) {
        console.error('Error en test fetch:', testErr);
      }
      
      // Cargar pedidos
      try {
        console.log('Llamando a getPedidos()...');
        const pedidosData = await pedidosService.getPedidos();
        const pedidosOrdenados = Array.isArray(pedidosData) 
          ? pedidosData.sort((a, b) => b.idPedido - a.idPedido)
          : [];
        setPedidos(pedidosOrdenados);
        console.log('Pedidos cargados correctamente:', pedidosData.length, 'items');
      } catch (err) {
        console.warn('Error cargando pedidos:', err);
        console.warn('Status:', err.response?.status);
        console.warn('Data:', err.response?.data);
        console.warn('Mensaje:', err.response?.data?.message || err.message);
        setPedidos([]);
        setError(`Error al cargar pedidos: ${err.response?.status || 'desconocido'} - ${err.response?.data?.message || err.message}`)
      }
      
      // Cargar clientes
      try {
        console.log('Llamando a obtenerTodosClientes()...');
        const clientesData = await usuariosService.obtenerTodosClientes(); //esta es la variable que contiene los datos de los clientes desde el backend
        setClientes(Array.isArray(clientesData) ? clientesData : []);
        console.log('Clientes cargados:', clientesData.length, 'clientes');
        console.log(' Detalle clientes:', clientesData);
      } catch (err) {
        console.warn('Error cargando clientes:', err);
        console.warn('Status:', err.response?.status);
        console.warn('Mensaje:', err.response?.data?.message || err.message);
        setClientes([]);
        if (!error) {
          setError('No se pudieron cargar los clientes. Error 500 en el backend.');
        }
      }
      
      // Datos hardcodeados - Cuando tengas endpoints en el backend, reemplaza estos
      setMetodosPago([
        { idMetodoPago: 1, nombre: 'Webpay' },
        { idMetodoPago: 2, nombre: 'Efectivo' },
        { idMetodoPago: 3, nombre: 'Mercado Pago' }
      ]);
      
      setTiposEntrega([
        { idTipoEntrega: 1, nombre: 'Delivery' },
        { idTipoEntrega: 2, nombre: 'Retiro en Local' }
      ]);
      
      // Cargar productos desde backend
      // Endpoint: /api/catalogo/productos (solo productos disponibles)
      try {
        console.log('Cargando productos disponibles desde /api/catalogo/productos...');
        const productosData = await productosService.obtenerProductosDisponibles();
        setProductos(Array.isArray(productosData) ? productosData : []);
        console.log('Productos cargados desde backend:', productosData.length, 'productos');
        console.log(' Muestra de productos:', productosData.slice(0, 2));
      } catch (err) {
        console.error(' Error cargando productos desde backend:', err);
        console.error('Status:', err.response?.status);
        console.error('Mensaje:', err.response?.data?.message || err.message);
        setProductos([]);
        setError('No se pudieron cargar los productos del catálogo.');
      }
      
      console.log('Estado final de clientes después de cargar todo:', clientes.length);
      
    } catch (err) {
      setError(err.message);
      console.error('Error cargando datos:', err);
    } finally {
      setLoading(false);
    }
  };

  // Cargar direcciones de un cliente
  const cargarDireccionesCliente = async (id) => {
    try {
      const response = await usuariosService.obtenerDireccionesPorCliente(id);
      setDireccionesCliente(Array.isArray(response) ? response : []);
    } catch (err) {
      console.error('Error cargando direcciones:', err);
      setDireccionesCliente([]);
    }
  };

  // Obtener precio del producto
  const obtenerPrecioProducto = (productoId = idProducto) => {
    const producto = productos.find(p => (p.idProducto || p.id) == productoId);
    return producto ? (producto.precioBase || producto.precio || 0) : 0;
  };
  
  // Obtener nombre del producto
  const getNombreProducto = (productoId) => {
    const producto = productos.find(p => (p.idProducto || p.id) == productoId);
    return producto ? (producto.nombreProducto || producto.nombre || 'Producto') : 'Producto';
  };

  // Función para buscar pedidos por nombre de cliente
  const handleBuscarPorCliente = async () => {
    if (!busquedaCliente.trim()) {
      setPedidosFiltrados([]);
      return;
    }
    
    try {
      // Buscar TODOS los clientes que coincidan con el nombre
      const clientesEncontrados = clientes.filter(c => 
        (c.nombreCliente )
          .toLowerCase()
          .includes(busquedaCliente.toLowerCase())
      );

      if (clientesEncontrados.length === 0) {
        setPedidosFiltrados([]);
        return;
      }

      // Obtener pedidos de TODOS los IDs encontrados
      const promesas = clientesEncontrados.map(cliente => {
        const idCliente = cliente.idCliente ;
        return pedidosService.getPedidosPorCliente(idCliente).catch(() => []);
      });

      const resultados = await Promise.all(promesas); 
      const todosPedidos = resultados.flat();
      
      // Eliminar duplicados por ID_PEDIDO
      const pedidosUnicos = todosPedidos.reduce((acc, pedido) => {
        const idPedido = pedido.idPedido;
        if (!acc.find(p => p.idPedido === idPedido)) {
          acc.push(pedido);
        }
        return acc;
      }, []);
      
      setPedidosFiltrados(pedidosUnicos);
    } catch (err) {
      console.warn('Error al buscar pedidos:', err);
      setPedidosFiltrados([]);
    }
  };

  // Función para limpiar la búsqueda y mostrar todos los pedidos
  const handleLimpiarBusqueda = () => {
    setBusquedaCliente('');
    setPedidosFiltrados([]);
  };

  // Determinar qué pedidos mostrar (filtrados o todos)
  // Si hay búsqueda activa, mostrar pedidosFiltrados (incluso si está vacío)
  // Si NO hay búsqueda, mostrar todos los pedidos
  const pedidosAMostrar = busquedaCliente.trim() ? pedidosFiltrados : pedidos;
  
  // Agregar producto al carrito temporal
  const handleAgregarProducto = (e) => {
    e.preventDefault();

    // Validar que los campos obligatorios estén llenos ANTES de agregar producto
    if (!idCliente) {
      alert('Por favor, seleccione un CLIENTE antes de agregar productos');
      return;
    }

    if (!idMetodoPago) {
      alert('Por favor, seleccione un MÉTODO DE PAGO antes de agregar productos');
      return;
    }

    if (!idTipoEntrega) {
      alert('Por favor, seleccione un TIPO DE ENTREGA antes de agregar productos');
      return;
    }

    if (!idProducto || !cantidad || cantidad <= 0) {
      alert('Seleccione un producto y cantidad válida');
      return;
    }

    const precioUnitario = obtenerPrecioProducto(idProducto);
    const cantidadNum = parseInt(cantidad);
    const subtotal = precioUnitario * cantidadNum;

    const nuevoProducto = {
      id: Date.now(), // ID temporal para el carrito
      idProducto: parseInt(idProducto), // Convertir a número AQUÍ
      nombreProducto: getNombreProducto(idProducto),
      cantidad: cantidadNum,
      precioUnitario: precioUnitario,
      subtotal: subtotal
    };

    setProductosCarrito([...productosCarrito, nuevoProducto]);

    // Limpiar selección de producto
    setIdProducto('');
    setCantidad('1');
  };
  
  // Eliminar producto del carrito temporal
  const handleEliminarProductoCarrito = (id) => {
    setProductosCarrito(productosCarrito.filter(p => p.id !== id));
  };
  
  // Calcular subtotal del carrito
  const calcularSubtotalCarrito = () => {
    return productosCarrito.reduce((sum, p) => sum + p.subtotal, 0); //suma los subtotales de cada producto
  };

  // ========================================
  // CREAR PEDIDO - Consumir API del Backend
  // ========================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar que haya al menos un producto en el carrito
    if (productosCarrito.length === 0) {
      alert('Debes agregar al menos un producto antes de crear el pedido.');
      return;
    }

    // Validar que todos los campos requeridos estén llenos
    if (!idCliente || !idEstadoPedido || !idMetodoPago || !idTipoEntrega) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    // 2. CALCULAR montos del pedido
    const subtotal = calcularSubtotalCarrito();
    const envio = parseFloat(montoEnvio) || 0;
    const total = subtotal + envio;

    // 3. CONSTRUIR el objeto del pedido según la estructura que espera el backend
    //    Este objeto se enviará al endpoint POST /api/pedidos/completo
    //    Los campos deben coincidir con lo que espera el backend (nombres en camelCase)
    const nuevoPedido = {
      // IDs de las relaciones (FK en la BD)
      idCliente: parseInt(idCliente),              // FK a tabla CLIENTE
      idEstadoPedido: parseInt(idEstadoPedido),    // FK a tabla ESTADOPEDIDO
      idMetodoPago: parseInt(idMetodoPago),        // FK a tabla METODOPAGO (1=Webpay, 2=Efectivo, 3=Mercado Pago)
      idTipoEntrega: parseInt(idTipoEntrega),      // FK a tabla TIPOENTREGA (1=Delivery, 2=Retiro)
      
      // Dirección de entrega (puede ser null si es retiro en local)
      idDireccionEntrega: idDireccion ? parseInt(idDireccion) : null, // FK a tabla DIRECCIONCLIENTE
      
      // Montos calculados
      montoSubtotal: subtotal,                     // Campo MONTO_SUBTOTAL en BD
      montoEnvio: envio,                           // Campo MONTO_ENVIO en BD
      montoTotal: total,                           // Campo MONTO_TOTAL en BD
      
      // Nota adicional del cliente
      notaCliente: notaCliente,                    // Campo NOTA_CLIENTE en BD
      
      // Array de detalles del pedido (tabla DETALLEPEDIDO)
      // Cada detalle representa un producto en el pedido
      detalles: productosCarrito.map(p => ({
        idProducto: parseInt(p.idProducto),        // FK a tabla PRODUCTO
        cantidad: p.cantidad,                      // Campo CANTIDAD en DETALLEPEDIDO
        precioUnitario: p.precioUnitario,          // Campo PRECIO_UNITARIO en DETALLEPEDIDO
        subtotalLinea: p.subtotal                  // Campo SUBTOTAL_LINEA en DETALLEPEDIDO
      }))
    };

    // 4. ENVIAR el pedido al backend mediante la API
    setLoading(true);
    try {
      // Llamada al servicio que hace POST /api/pedidos/completo
      // El backend creará:
      // - 1 registro en tabla PEDIDO
      // - 1 o más registros en tabla DETALLEPEDIDO
      console.log(' Enviando pedido al backend:', nuevoPedido);
      const response = await pedidosService.crearPedido(nuevoPedido);
      console.log(' Respuesta del backend:', response);
      
      // 5. RECARGAR todos los pedidos desde el backend para asegurar datos correctos
      const pedidosActualizados = await pedidosService.getPedidos();
      const pedidosOrdenados = Array.isArray(pedidosActualizados)
        ? pedidosActualizados.sort((a, b) => b.idPedido - a.idPedido)
        : [];
      setPedidos(pedidosOrdenados);
      
      alert('Pedido creado exitosamente');

      // 6. LIMPIAR el formulario y carrito después de crear el pedido
      setIdCliente('');
      setIdProducto('');
      setCantidad('1');
      setIdEstadoPedido('1');
      setIdMetodoPago('');
      setIdTipoEntrega('');
      setIdDireccion('');
      setMontoEnvio('0');
      setNotaCliente('');
      setProductosCarrito([]);
    } catch (err) {
      // 7. MANEJAR errores de la API
      console.error(' Error al crear pedido:', err);
      setError(err.message);
      alert('Error al crear pedido: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar pedido (con Boleta y Venta si existen)
  const handleEliminarPedido = async (id) => {
    // Verificar si el pedido tiene venta asociada para cambiar el mensaje
    let tieneVenta = false;
    try {
      const ventas = await ventaService.getVentas();
      const venta = ventas.find(v => (v.idPedido || v.id_pedido) === id);
      tieneVenta = !!venta;
    } catch (err) {
      console.warn('No se pudo verificar ventas:', err.message);
    }

    const mensaje = tieneVenta 
      ? '¿Está seguro de que desea CANCELAR este pedido?\n\nEsto eliminará:\n- La venta asociada\n- La boleta (si existe)\n- El estado cambiará a "Cancelado"'
      : '¿Está seguro de que desea ELIMINAR este pedido?\n\nEl pedido será eliminado permanentemente.';

    if (window.confirm(mensaje)) {
      setLoading(true);
      try {
        console.log('Iniciando eliminación del pedido:', id);
        
        // 1. Buscar si existe una venta asociada al pedido
        let idVenta = null;
        let idBoleta = null;
        
        try {
          const ventas = await ventaService.getVentas();
          const venta = ventas.find(v => (v.idPedido || v.id_pedido) === id);
          
          if (venta) {
            idVenta = venta.idVenta || venta.id_venta;
            console.log('Venta encontrada:', idVenta);
            
            // 2. Buscar si existe una boleta asociada a la venta
            try {
              const boletas = await boletaService.getBoletas();
              const boleta = boletas.find(b => {
                const idVentaBoleta = b.venta?.idVenta || b.venta?.id_venta;
                return idVentaBoleta === idVenta;
              });
              
              if (boleta) {
                idBoleta = boleta.idBoleta || boleta.id_boleta;
                console.log('Boleta encontrada:', idBoleta);
              }
            } catch (err) {
              console.warn('No se pudo buscar boletas:', err.message);
            }
          }
        } catch (err) {
          console.warn('No se pudo buscar ventas:', err.message);
        }
        
        // 3. Eliminar en orden: Boleta → Venta → Pedido
        if (idBoleta) {
          try {
            await boletaService.eliminarBoleta(idBoleta);
            console.log('Boleta eliminada');
          } catch (err) {
            console.warn('No se pudo eliminar boleta:', err.message);
          }
        }
        
        if (idVenta) {
          try {
            await ventaService.eliminarVenta(idVenta);
            console.log('Venta eliminada');
            
            // Cambiar el estado del pedido a "Cancelado" (ID 7) si tenía venta
            try {
              await pedidosService.actualizarEstadoPedido(id, 7);
              console.log('Estado del pedido cambiado a Cancelado');
            } catch (err) {
              console.warn('No se pudo actualizar el estado del pedido:', err.message);
            }
          } catch (err) {
            console.warn('No se pudo eliminar venta:', err.message);
          }
        } else {
          // Si NO tiene venta, eliminar el pedido directamente
          try {
            await pedidosService.eliminarPedido(id);
            console.log('Pedido eliminado');
          } catch (err) {
            console.error('Error al eliminar pedido:', err);
            throw err;
          }
        }
        
        // 4. Recargar pedidos para reflejar el cambio
        const pedidosActualizados = await pedidosService.getPedidos();
        const pedidosOrdenados = Array.isArray(pedidosActualizados)
          ? pedidosActualizados.sort((a, b) => b.idPedido - a.idPedido)
          : [];
        setPedidos(pedidosOrdenados);
        
        if (idVenta) {
          alert('Venta cancelada exitosamente' + 
                (idBoleta ? '\n- Boleta eliminada' : '') + 
                '\n- Estado del pedido cambiado a Cancelado');
        } else {
          alert('Pedido eliminado exitosamente');
        }
      } catch (err) {
        console.error('Error al eliminar:', err);
        alert('Error al eliminar: ' + err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  // Marcar pedido como pagado y crear venta automática
  const handleMarcarComoPagado = async (idPedido) => {
    if (window.confirm('¿Confirmar pago del pedido? Esto creará la venta automáticamente.')) {
      setLoading(true);
      try {
        // Llama al endpoint PUT /pedidos/procesar/{idPedido}
        // Este endpoint cambia el estado a "Pagado" (ID 2) y crea la venta
        await pedidosService.actualizarPedidoAPagado(idPedido);
        
        // Actualizar el estado del pedido en la lista local
        setPedidos(pedidos.map(p => 
          (p.idPedido) === idPedido 
            ? { ...p, idEstadoPedido: 2 } // Cambiar a estado "Pagado"
            : p
        ));
        
        alert('Pedido marcado como pagado y venta registrada exitosamente');
      } catch (err) {
        console.error('Error al procesar pago:', err);
        alert('Error al procesar pago: ' + (err.response?.data?.message || err.message));
      } finally {
        setLoading(false);
      }
    }
  };

  const handleAdminLogout = () => {
    console.log('Cerrando sesión...');
  };

  return (
    <div className="admin-layout-pedidos">
      <Sidebar onLogoutAdmin={handleAdminLogout} />

      <div className="content">
        <h1>Gestión de Pedidos</h1>

        {error && (
          <div style={{
            background: '#dc3545',
            color: 'white',
            padding: '15px',
            borderRadius: '5px',
            marginBottom: '20px'
          }}>
            Error: {error}
          </div>
        )}

        {/* CONTENEDOR PRINCIPAL - LAYOUT VERTICAL */}
        <div className="pedidos-wrapper-vertical">
          {/* CONTENEDOR 1: CREAR PEDIDO (ANCHO COMPLETO) */}
          <div className="crear-pedido-container-full">
            <h2>Crear Nuevo Pedido</h2>

            <form className="formPedidos" onSubmit={handleSubmit}>
              {/* Fila 1: Cliente y Estado */}
              <div className="form-row">
                <div className="form-group">
                  <label>Cliente *</label>
                  <select
                    required
                    value={idCliente}
                    onChange={(e) => setIdCliente(e.target.value)}
                    className="form-input"
                    disabled={loading}
                  >
                    <option value="">Seleccione Cliente</option>
                    {clientes.map(cliente => (
                      <option 
                        key={cliente.idCliente } 
                        value={cliente.idCliente }
                      >
                        {cliente.NOMBRE_CLIENTE || cliente.nombreCliente || cliente.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Estado del Pedido *</label>
                  <select
                    required
                    value={idEstadoPedido}
                    onChange={(e) => setIdEstadoPedido(e.target.value)}
                    className="form-input"
                    disabled={true}
                  >
                    <option value="1">Pendiente de Pago</option>
                  </select>
                </div>
              </div>

              {/* Fila 2: Producto y Cantidad */}
              <div className="form-row">
                <div className="form-group">
                  <label>Producto ({productos.length} disponibles)</label>
                  <select
                    value={idProducto}
                    onChange={(e) => setIdProducto(e.target.value)}
                    className="form-input"
                    disabled={loading}
                  >
                  <option value="">Seleccione Producto</option>
                  {productos.length === 0 && (
                    <option value="" disabled>No hay productos disponibles</option>
                  )}
                  {productos.map(producto => {
                    const id = producto.idProducto || producto.id;
                    const nombre = producto.nombreProducto || producto.nombre || producto.name || 'Sin nombre';
                    const precio = producto.precioBase || producto.precio || producto.price || 0;
                    
                    return (
                      <option 
                        key={id} 
                        value={id}
                      >
                        {nombre} - ${Number(precio).toFixed(2)}
                      </option>
                    );
                  })}
                  </select>
                </div>
                <div className="form-group">
                  <label>Cantidad</label>
                  <input
                    type="number"
                    min="1"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    className="form-input"
                    disabled={loading}
                  />
                </div>
              </div>
              
              {/* Botón para agregar producto al carrito */}
             

              {/* Fila 3: Método de Pago y Tipo de Entrega */}
              <div className="form-row">
                <div className="form-group">
                  <label>Método de Pago *</label>
                  <select
                    required
                    value={idMetodoPago}
                    onChange={(e) => setIdMetodoPago(e.target.value)}
                    className="form-input"
                    disabled={loading}
                  >
                    <option value="">Seleccione Método</option>
                    {metodosPago.map(metodo => (
                      <option key={metodo.idMetodoPago || metodo.id} value={metodo.idMetodoPago || metodo.id}>
                        {metodo.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Tipo de Entrega *</label>
                  <select
                    required
                    value={idTipoEntrega}
                    onChange={(e) => setIdTipoEntrega(e.target.value)}
                    className="form-input"
                    disabled={loading}
                  >
                    <option value="">Seleccione Tipo</option>
                    {tiposEntrega.map(tipo => (
                      <option key={tipo.idTipoEntrega } value={tipo.idTipoEntrega }>
                        {tipo.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Fila 4: Dirección y Envío */}
              <div className="form-row">
                <div className="form-group">
                  <label>Dirección de Entrega</label>
                  <select
                    value={idDireccion}
                    onChange={(e) => setIdDireccion(e.target.value)}
                    className="form-input"
                    disabled={loading || !idCliente || direccionesCliente.length === 0}
                  >
                    <option value="">Seleccione dirección</option>
                    {direccionesCliente.map(dir => (
                      <option key={dir.idDireccion} value={dir.idDireccion}>
                        {dir.alias ? `${dir.alias} - ` : ''}{dir.direccion}
                      </option>
                    ))}
                  </select>
                  {idCliente && direccionesCliente.length === 0 && (
                    <small style={{ color: '#999', fontSize: '0.85rem', marginTop: '4px', display: 'block' }}>
                      El cliente no tiene direcciones registradas
                    </small>
                  )}
                </div>

                <div className="form-group">
                  <label>Monto de Envío ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={montoEnvio}
                    onChange={(e) => setMontoEnvio(e.target.value)}
                    className="form-input"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Fila 5: Nota (ancho completo) */}
              <div className="form-row full">
                <div className="form-group">
                  <label>Nota del Cliente</label>
                  <textarea
                    value={notaCliente}
                    onChange={(e) => setNotaCliente(e.target.value)}
                    className="form-input form-textarea"
                    rows="2"
                    disabled={loading}
                    placeholder="Agregue notas adicionales..."
                  />
                </div>
              </div>

              
              {/* Carrito de productos - Detalles debajo del resumen */}
              {productosCarrito.length > 0 && (
                <div className="carrito-productos">
                  <h3>Productos en el Pedido</h3>
                  <div className="tabla-carrito-wrapper">
                    <table className="tabla-carrito">
                      <thead>
                        <tr>
                          <th>Producto</th>
                          <th>Precio Unit.</th>
                          <th>Cantidad</th>
                          <th>Subtotal</th>
                          <th>Acción</th>
                        </tr>
                      </thead>
                      <tbody>
                        {productosCarrito.map((item) => (
                          <tr key={item.id}>
                            <td>{item.nombreProducto}</td>
                            <td>${item.precioUnitario.toFixed(2)}</td>
                            <td>{item.cantidad}</td>
                            <td><strong>${item.subtotal.toFixed(2)}</strong></td>
                            <td>
                              <button 
                                type="button"
                                className="btn-eliminar"
                                onClick={() => handleEliminarProductoCarrito(item.id)}
                                style={{ 
                                  fontSize: '0.85em', 
                                  padding: '5px 10px',
                                  width: 'auto'
                                }}
                              >
                                 Quitar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              {/* RESUMEN DE MONTOS */}
              <div className="resumen-pedido">
                <div className="resumen-fila">
                  <span className="resumen-label">Subtotal Productos:</span>
                  <span className="resumen-valor">${calcularSubtotalCarrito().toFixed(2)}</span>
                </div>
                <div className="resumen-fila" style={{ color: '#999', fontSize: '0.9em' }}>
                  <span className="resumen-label">IVA (19% sobre productos):</span>
                  <span className="resumen-valor">${(calcularSubtotalCarrito() * 0.19).toFixed(2)}</span>
                </div>
                <div className="resumen-fila">
                  <span className="resumen-label">Envío:</span>
                  <span className="resumen-valor">${(parseFloat(montoEnvio) || 0).toFixed(2)}</span>
                </div>
                <div className="resumen-fila total" style={{ borderTop: '2px solid #ffcc00', paddingTop: '10px', marginTop: '8px' }}>
                  <span className="resumen-label-total">TOTAL A PAGAR (con IVA):</span>
                  <span className="resumen-valor-total">${(calcularSubtotalCarrito() * 1.19 + (parseFloat(montoEnvio) || 0)).toFixed(2)}</span>
                </div>
                <small style={{ display: 'block', marginTop: '8px', color: '#999', fontSize: '0.85em', fontStyle: 'italic' }}>
                  * El IVA se registrará en la boleta al momento del pago
                </small>
              </div>
              

              {/* BOTONES */}

              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-agregar-producto" 
                  onClick={handleAgregarProducto}
                  disabled={loading || !idProducto || !cantidad}
                >
                   Agregar Producto
                </button>
                <button type="submit" className="btn-agregar" disabled={loading}>
                  {loading ? 'Creando...' : ' Crear Pedido'}
                </button>
                <button
                  type="button"
                  className="btn-limpiar"
                  onClick={() => {
                    setIdCliente('');
                    setIdProducto('');
                    setCantidad('1');
                    setIdEstadoPedido('1');
                    setIdMetodoPago('');
                    setIdTipoEntrega('');
                    setIdDireccion('');
                    setMontoEnvio('0');
                    setNotaCliente('');
                    setProductosCarrito([]);
                  }}
                  disabled={loading}
                >
                  Limpiar Todo
                </button>
              </div>
            </form>
          </div>

          {/* CONTENEDOR 2: LISTA DE PEDIDOS (ANCHO COMPLETO) */}
          <div className="lista-pedidos-container-full">
            <h2>Pedidos Registrados</h2>
            
            {/* Barra de búsqueda por cliente */}
            <div style={{ 
              marginBottom: '20px', 
              padding: '15px', 
              background: '#2d2d2d', 
              borderRadius: '8px',
              border: '1px solid #555',
              display: 'flex',
              gap: '10px',
              alignItems: 'center'
            }}>
              <input
                type="text"
                placeholder="Buscar por nombre de cliente..."
                value={busquedaCliente}
                onChange={(e) => setBusquedaCliente(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px 12px',
                  border: '1px solid #555',
                  borderRadius: '5px',
                  fontSize: '14px',
                  background: '#1a1a1a',
                  color: '#fdfdfd'
                }}
                disabled={loading}
              />
              {busquedaCliente.trim() && (
                <button
                  onClick={handleLimpiarBusqueda}
                  style={{
                    padding: '10px 20px',
                    background: '#555',
                    color: '#fdfdfd',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: 'bold'
                  }}
                >
                  ✖ Limpiar
                </button>
              )}
            </div>

            {/* Indicador de búsqueda activa */}
            {pedidosFiltrados.length > 0 && (
              <div style={{
                padding: '10px 15px',
                background: '#2d2d2d',
                color: '#ffcc00',
                border: '1px solid #555',
                borderRadius: '5px',
                marginBottom: '15px',
                fontSize: '14px',
                fontWeight: '600'
              }}>
                 Mostrando {pedidosFiltrados.length} pedido(s) filtrado(s) por cliente
              </div>
            )}

            <div className="table-responsive">
              <table className="tabla-pedidos">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Cliente</th>
                    <th>Fecha</th>
                    <th>Productos</th>
                    <th>Estado</th>
                    <th>Método Pago</th>
                    <th>Tipo Entrega</th>
                    <th>Subtotal</th>
                    <th>Envío</th>
                    <th>Total</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {pedidosAMostrar.length > 0 ? (
                    pedidosAMostrar.map(pedido => (
                      <tr key={pedido.ID_PEDIDO || pedido.idPedido}>
                        <td>{pedido.ID_PEDIDO || pedido.idPedido}</td>
                        <td>{getNombreCliente(pedido.ID_CLIENTE || pedido.idCliente)}</td>
                        <td>{pedido.fechaPedido ? new Date(pedido.fechaPedido).toLocaleString() : 'Sin fecha'}</td>
                        <td>
                          {/* Mostrar todos los productos del pedido */}
                          {pedido.detalles && pedido.detalles.length > 0 ? (
                            <div style={{ fontSize: '0.9em' }}>
                              {pedido.detalles.map((detalle, index) => (
                                <div key={index} style={{ marginBottom: '5px', borderBottom: index < pedido.detalles.length - 1 ? '1px solid #eee' : 'none', paddingBottom: '5px' }}>
                                    <strong>{getNombreProducto(detalle.idProducto || detalle.ID_PRODUCTO)}</strong>
                                  <br />
                                  <span style={{ color: '#666' }}>
                                    Cant: {detalle.cantidad} × ${(detalle.precioUnitario)?.toFixed(2) || '0.00'} = ${(detalle.subtotalLinea)?.toFixed(2) || '0.00'}
                                  </span>
                                </div>
                              ))}
                              <div style={{ marginTop: '8px', paddingTop: '5px', borderTop: '2px solid #333', fontWeight: 'bold' }}>
                                Total items: {pedido.detalles.reduce((sum, d) => sum + (d.CANTIDAD || d.cantidad || 0), 0)}
                              </div>
                            </div>
                          ) : (
                            <span style={{ color: '#999' }}>Sin productos</span>
                          )}
                        </td>
                        <td>
                          <span className="badge-estado">
                            {getNombreEstadoPedido(pedido.idEstadoPedido)}
                          </span>
                        </td>
                        <td>{getNombreMetodoPago(pedido.idMetodoPago)}</td>
                        <td>{getNombreTipoEntrega(pedido.idTipoEntrega)}</td>
                        <td>${(pedido.montoSubtotal || 0).toFixed(2)}</td>
                        <td>${(pedido.montoEnvio || 0).toFixed(2)}</td>
                        <td>
                          <strong>${(pedido.montoTotal || 0).toFixed(2)}</strong>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '5px', flexDirection: 'column' }}>
                            {/* Botón Marcar como Pagado - solo visible si estado es Pendiente (1) */}
                            {(pedido.idEstadoPedido) === 1 && (
                              <button
                                className="btn-agregar"
                                onClick={() => handleMarcarComoPagado(pedido.idPedido)}
                                disabled={loading}
                                style={{ fontSize: '0.85em', padding: '5px 10px' }}
                              >
                                 Marcar Pagado
                              </button>
                            )}
                            {/* Botón Eliminar - siempre visible */}
                            <button
                              className="btn-eliminar"
                              onClick={() => handleEliminarPedido(pedido.idPedido)}
                              disabled={loading}
                              style={{ fontSize: '0.85em', padding: '5px 10px' }}
                            >
                               Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                        No hay pedidos registrados
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GestionPedidos;
