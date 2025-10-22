import React from 'react';
import Sidebar from '../../components/Sidebar';
import '../../styles/gestionPedidos.css';


function GestionPedidos() {
  const handleAdminLogout = () => {
    console.log("Cerrando sesión del administrador...");
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
            value={producto}
            onChange={(e) => setProducto(e.target.value)}
          >
            <option value="">Seleccione Producto</option>
            <option value="Hamburguesa">Hamburguesa</option>
            <option value="Papas Fritas">Papas Fritas</option>
            <option value="Bebida">Bebida</option>
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
                    onClick={() =>
                      setPedidos(pedidos.filter((p) => p.id !== pedido.id))
                    }
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
};

export default AdminPedidos;