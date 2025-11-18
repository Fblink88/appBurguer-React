// src/pages/admin/GestionPedidos.jsx

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import '../../styles/gestionPedidos.css';
import {
  productosAPI,
  clientesAPI,
  pedidosAPI,
  catalogosAPI,
  cargarDatosIniciales as cargarDatos
} from '../../api';

function GestionPedidos() {
  // Estados del formulario
  const [idCliente, setIdCliente] = useState('');
  const [idProducto, setIdProducto] = useState('');
  const [cantidad, setCantidad] = useState('1');
  const [idEstadoPedido, setIdEstadoPedido] = useState('');
  const [idMetodoPago, setIdMetodoPago] = useState('');
  const [idTipoEntrega, setIdTipoEntrega] = useState('');
  const [idDireccion, setIdDireccion] = useState('');
  const [montoEnvio, setMontoEnvio] = useState('0');
  const [notaCliente, setNotaCliente] = useState('');

  // Estados para datos
  const [clientes, setClientes] = useState([]);
  const [productos, setProductos] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [estadosPedido, setEstadosPedido] = useState([]);
  const [metodosPago, setMetodosPago] = useState([]);
  const [tiposEntrega, setTiposEntrega] = useState([]);
  const [direccionesCliente, setDireccionesCliente] = useState([]);

  // Estados de carga
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar datos al montar
  useEffect(() => {
    inicializarDatos();
  }, []);

  // Cargar direcciones cuando cambia el cliente
  useEffect(() => {
    if (idCliente) {
      cargarDireccionesCliente(idCliente);
    } else {
      setDireccionesCliente([]);
      setIdDireccion('');
    }
  }, [idCliente]);

  // Inicializar todos los datos
  const inicializarDatos = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log('Cargando datos iniciales...');
      const datos = await cargarDatos();
      console.log('Datos recibidos:', datos);
      
      setProductos(datos.productos || []);
      setClientes(datos.clientes || []);
      setPedidos(datos.pedidos || []);
      setEstadosPedido(datos.estadosPedido || []);
      setMetodosPago(datos.metodosPago || []);
      setTiposEntrega(datos.tiposEntrega || []);
      
      console.log('Productos:', datos.productos);
      console.log('Clientes:', datos.clientes);
      console.log('Estados:', datos.estadosPedido);
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
      const response = await clientesAPI.obtenerDirecciones(id);
      setDireccionesCliente(response.data);
    } catch (err) {
      console.error('Error cargando direcciones:', err);
      setDireccionesCliente([]);
    }
  };

  // Obtener precio del producto
  const obtenerPrecioProducto = () => {
    const producto = productos.find(p => (p.idProducto || p.id) == idProducto);
    return producto ? (producto.precioProducto || producto.precio_producto || 0) : 0;
  };

  // Calcular subtotal
  const calcularSubtotal = () => {
    const precio = obtenerPrecioProducto();
    return precio * parseInt(cantidad || 0);
  };

  // Calcular total
  const calcularTotal = () => {
    const subtotal = calcularSubtotal();
    const envio = parseFloat(montoEnvio) || 0;
    return subtotal + envio;
  };

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!idCliente || !idProducto || !idEstadoPedido || !idMetodoPago || !idTipoEntrega) {
      alert('Por favor, completa todos los campos requeridos');
      return;
    }

    const subtotal = calcularSubtotal();
    const envio = parseFloat(montoEnvio) || 0;
    const total = subtotal + envio;

    const nuevoPedido = {
      idCliente: parseInt(idCliente),
      idEstadoPedido: parseInt(idEstadoPedido),
      idMetodoPago: parseInt(idMetodoPago),
      idTipoEntrega: parseInt(idTipoEntrega),
      idDireccionEntrega: idDireccion ? parseInt(idDireccion) : null,
      montoSubtotal: subtotal,
      montoEnvio: envio,
      montoTotal: total,
      notaCliente: notaCliente,
      detalles: [
        {
          idProducto: parseInt(idProducto),
          cantidad: parseInt(cantidad),
          precioUnitario: obtenerPrecioProducto(),
          subtotalLinea: subtotal
        }
      ]
    };

    setLoading(true);
    try {
      const response = await pedidosAPI.crear(nuevoPedido);
      setPedidos([...pedidos, response.data]);
      alert('Pedido creado exitosamente');

      // Limpiar formulario
      setIdCliente('');
      setIdProducto('');
      setCantidad('1');
      setIdEstadoPedido('');
      setIdMetodoPago('');
      setIdTipoEntrega('');
      setIdDireccion('');
      setMontoEnvio('0');
      setNotaCliente('');
    } catch (err) {
      setError(err.message);
      alert('Error al crear pedido: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Eliminar pedido
  const handleEliminarPedido = async (id) => {
    if (window.confirm('¿Está seguro de que desea eliminar este pedido?')) {
      setLoading(true);
      try {
        await pedidosAPI.eliminar(id);
        setPedidos(pedidos.filter(p => (p.idPedido || p.id) !== id));
        alert('Pedido eliminado');
      } catch (err) {
        alert('Error al eliminar: ' + err.message);
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

        {/* CONTENEDOR PRINCIPAL */}
        <div className="pedidos-wrapper">
          {/* CONTENEDOR 1: CREAR PEDIDO */}
          <div className="crear-pedido-container">
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
                      <option key={cliente.idCliente || cliente.id} value={cliente.idCliente || cliente.id}>
                        {cliente.nombre}
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
                    disabled={loading}
                  >
                    <option value="">Seleccione Estado</option>
                    {estadosPedido.map(estado => (
                      <option key={estado.idEstadoPedido || estado.id} value={estado.idEstadoPedido || estado.id}>
                        {estado.nombre}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Fila 2: Producto y Cantidad */}
              <div className="form-row">
                <div className="form-group">
                  <label>Producto *</label>
                  <select
                    required
                    value={idProducto}
                    onChange={(e) => setIdProducto(e.target.value)}
                    className="form-input"
                    disabled={loading}
                  >
                    <option value="">Seleccione Producto</option>
                    {productos.map(producto => (
                      <option key={producto.idProducto || producto.id} value={producto.idProducto || producto.id}>
                        {producto.nombreProducto || producto.nombre_producto} - ${(producto.precioProducto || producto.precio_producto).toFixed(2)}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label>Cantidad *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={cantidad}
                    onChange={(e) => setCantidad(e.target.value)}
                    className="form-input"
                    disabled={loading}
                  />
                </div>
              </div>

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
                      <option key={tipo.idTipoEntrega || tipo.id} value={tipo.idTipoEntrega || tipo.id}>
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
                    disabled={!idCliente || loading}
                  >
                    <option value="">Seleccione Dirección</option>
                    {direccionesCliente.map(direccion => (
                      <option key={direccion.idDireccion || direccion.id} value={direccion.idDireccion || direccion.id}>
                        {direccion.calle}, {direccion.ciudad}
                      </option>
                    ))}
                  </select>
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

              {/* RESUMEN DE MONTOS */}
              <div className="resumen-pedido">
                <div className="resumen-fila">
                  <span className="resumen-label">Precio Unitario:</span>
                  <span className="resumen-valor">${obtenerPrecioProducto().toFixed(2)}</span>
                </div>
                <div className="resumen-fila">
                  <span className="resumen-label">Cantidad:</span>
                  <span className="resumen-valor">{cantidad}</span>
                </div>
                <div className="resumen-fila">
                  <span className="resumen-label">Subtotal:</span>
                  <span className="resumen-valor">${calcularSubtotal().toFixed(2)}</span>
                </div>
                <div className="resumen-fila">
                  <span className="resumen-label">Envío:</span>
                  <span className="resumen-valor">${(parseFloat(montoEnvio) || 0).toFixed(2)}</span>
                </div>
                <div className="resumen-fila total">
                  <span className="resumen-label-total">TOTAL:</span>
                  <span className="resumen-valor-total">${calcularTotal().toFixed(2)}</span>
                </div>
              </div>

              {/* BOTONES */}

              <div className="form-actions">
                <button type="submit" className="btn-agregar" disabled={loading}>
                  {loading ? 'Creando...' : 'Crear Pedido'}
                </button>
                <button
                  type="button"
                  className="btn-limpiar"
                  onClick={() => {
                    setIdCliente('');
                    setIdProducto('');
                    setCantidad('1');
                    setIdEstadoPedido('');
                    setIdMetodoPago('');
                    setIdTipoEntrega('');
                    setIdDireccion('');
                    setMontoEnvio('0');
                    setNotaCliente('');
                  }}
                  disabled={loading}
                >
                  Limpiar
                </button>
              </div>
            </form>
          </div>

          {/* CONTENEDOR 2: LISTA DE PEDIDOS */}
          <div className="lista-pedidos-container">
            <h2>Pedidos Registrados</h2>
            <div className="table-responsive">
              <table className="tabla-pedidos">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Cliente</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
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
                  {pedidos.length > 0 ? (
                    pedidos.map(pedido => (
                      <tr key={pedido.idPedido || pedido.id}>
                        <td>{pedido.idPedido || pedido.id}</td>
                        <td>{pedido.cliente?.nombre || 'N/A'}</td>
                        <td>
                          {pedido.detalles?.[0]?.producto?.nombreProducto ||
                            pedido.detalles?.[0]?.nombreProducto ||
                            'N/A'}
                        </td>
                        <td>{pedido.detalles?.[0]?.cantidad || '-'}</td>
                        <td>
                          <span className="badge-estado">
                            {pedido.estadoPedido?.nombre || 'Pendiente'}
                          </span>
                        </td>
                        <td>{pedido.metodoPago?.nombre || '-'}</td>
                        <td>{pedido.tipoEntrega?.nombre || '-'}</td>
                        <td>${(pedido.montoSubtotal || 0).toFixed(2)}</td>
                        <td>${(pedido.montoEnvio || 0).toFixed(2)}</td>
                        <td>
                          <strong>${(pedido.montoTotal || 0).toFixed(2)}</strong>
                        </td>
                        <td>
                          <button
                            className="btn-eliminar"
                            onClick={() => handleEliminarPedido(pedido.idPedido || pedido.id)}
                            disabled={loading}
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="11" style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
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
