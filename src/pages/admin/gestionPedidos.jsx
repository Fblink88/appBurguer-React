// src/pages/admin/GestionPedidos.jsx

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
// Asegúrate de que listarClientes esté importado y funcione correctamente en metodosProducto.js
import { listarProductos, agregarPedido, eliminarPedido, listarPedidos, listarClientes } from '../../data/metodosProducto';
import '../../styles/gestionPedidos.css';

function GestionPedidos() {
  // Estados para el formulario
  const [nombreClienteSeleccionado, setNombreClienteSeleccionado] = useState(''); // Estado para el cliente seleccionado
  const [productoId, setProductoId] = useState('');
  // Inicializa pedidos llamando a listarPedidos (que lee localStorage)
  const [pedidos, setPedidos] = useState(() => listarPedidos());
  const [productos, setProductos] = useState([]);
  // Inicializa clientes como array vacío, se llenará en useEffect
  const [clientes, setClientes] = useState([]);

  // Cargar productos Y clientes al montar el componente
  useEffect(() => {
    const productosData = listarProductos();
    // Llama a listarClientes, que AHORA devuelve la lista combinada
    const clientesData = listarClientes();
    setProductos(productosData);
    setClientes(clientesData); // Guarda la lista combinada en el estado
  }, []); // El array vacío asegura que esto solo se ejecute una vez al montar

  const handleAdminLogout = () => {
    console.log("Cerrando sesión del administrador...");
  };

  // Función para manejar el envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault();

    if (nombreClienteSeleccionado && productoId) {
      const productoSeleccionado = productos.find(p => p.id === parseInt(productoId));

      if (productoSeleccionado) {
        const nuevoPedido = {
          nombre: nombreClienteSeleccionado, // Usa el nombre del cliente seleccionado
          producto: productoSeleccionado.nombre_producto,
          monto: productoSeleccionado.precio_producto
        };

        const pedidoCreado = agregarPedido(nuevoPedido); // Guarda en localStorage a través de la función
        setPedidos(prevPedidos => [...prevPedidos, pedidoCreado]); // Actualiza estado local

        // Limpiar formulario
        setNombreClienteSeleccionado('');
        setProductoId('');
      } else {
         console.error("Producto seleccionado no encontrado");
      }
    } else {
       alert("Por favor, seleccione un cliente y un producto.");
    }
  };

  // Función para eliminar pedido
  const handleEliminarPedido = (id) => {
    eliminarPedido(id); // Elimina de localStorage a través de la función
    setPedidos(prevPedidos => prevPedidos.filter(p => p.id !== id)); // Actualiza estado local
  };

  // --- Renderizado del Componente ---
  return (
    <div className="admin-layout-pedidos">
      <Sidebar onLogoutAdmin={handleAdminLogout} />

      <div className="content">
        <h1>Gestión de Pedidos</h1>

        <form id="formPedido" className="formPedidos" onSubmit={handleSubmit}>

          {/* Select para Clientes */}
          <select
            id="cliente"
            required
            value={nombreClienteSeleccionado}
            onChange={(e) => setNombreClienteSeleccionado(e.target.value)}
          >
            <option value="">Seleccione Cliente</option>
            {/* Mapea sobre la lista de clientes (que ya viene combinada) */}
            {clientes.map((cliente, index) => (
              <option key={cliente.correo || index} value={cliente.nombre}>
                {cliente.nombre} ({cliente.correo})
              </option>
            ))}
          </select>

          {/* Select para Productos */}
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

        {/* Tabla de Pedidos */}
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
            {/* Mensaje si no hay pedidos */}
            {pedidos.length === 0 && (
                <tr>
                    <td colSpan="6" className="text-center text-muted">No hay pedidos registrados.</td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default GestionPedidos;