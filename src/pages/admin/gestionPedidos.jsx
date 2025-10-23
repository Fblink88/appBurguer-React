import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { listarProductos, agregarPedido, eliminarPedido } from '../../data/metodosProducto';
import '../../styles/gestionPedidos.css';

function GestionPedidos() {
  // Estados para el formulario
  const [nombre, setNombre] = useState('');
  const [productoId, setProductoId] = useState('');
  const [pedidos, setPedidos] = useState([]);
  const [productos, setProductos] = useState([]);

  // Cargar productos y pedidos al montar el componente
  useEffect(() => {
    const productosData = listarProductos();
    
    setProductos(productosData);
    
  }, []);

  const handleAdminLogout = () => {
    console.log("Cerrando sesión del administrador...");
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (nombre && productoId) {
      // Buscar el producto seleccionado para obtener sus datos
      const productoSeleccionado = productos.find(p => p.id === parseInt(productoId));
      
      if (productoSeleccionado) {
        const nuevoPedido = {
          nombre: nombre,
          producto: productoSeleccionado.nombre_producto,
          monto: productoSeleccionado.precio_producto
        };
        
        // Agregar pedido a la base de datos
        const pedidoCreado = agregarPedido(nuevoPedido);
        
        // Actualizar estado local
        setPedidos([...pedidos, pedidoCreado]);
        
        // Limpiar formulario
        setNombre('');
        setProductoId('');
      }
    }
  };

  // Función para eliminar pedido
  const handleEliminarPedido = (id) => {
    // Eliminar de la base de datos
    eliminarPedido(id);
    
    // Actualizar estado local
    setPedidos(pedidos.filter(p => p.id !== id));
  };

  return (
    <div className="admin-layout-pedidos">
      <Sidebar onLogoutAdmin={handleAdminLogout} />

      <div className="content">
        <h1>Gestión de Pedidos</h1>

        <form id="formPedido" className="formPedidos" onSubmit={handleSubmit}>
          <input
            type="text"
            id="nombre"
            placeholder="Nombre Cliente"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
          />

          <select
            id="producto"
            required
            value={productoId}
            onChange={(e) => setProductoId(e.target.value)}
          >
            <option value="">Seleccione Producto</option>
            {productos.map((producto) => (
              <option key={producto.id} value={producto.id}>
                {producto.nombre_producto} - ${producto.precio_producto.toLocaleString()}
              </option>
            ))}
          </select>

          <button type="submit" className="btn-agregar">
            Agregar Pedido
          </button>
        </form>

        <table id="tablaPedidos">
          <thead>
            <tr>
              <th>#</th>
              <th>Fecha</th>
              <th>Nombre Cliente</th>
              <th>Producto</th>
              <th>Monto</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidos.map((pedido) => (
              <tr key={pedido.id}>
                <td>{pedido.id}</td>
                <td>{pedido.fecha}</td>
                <td>{pedido.nombre}</td>
                <td>{pedido.producto}</td>
                <td>${pedido.monto.toLocaleString()}</td>
                <td>
                  <button
                    className="btn-eliminar"
                    onClick={() => handleEliminarPedido(pedido.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GestionPedidos;