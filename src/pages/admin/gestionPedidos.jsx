import React from 'react';
import Sidebar from '../../components/Sidebar';


function GestionPedidos() {
  const handleAdminLogout = () => {
    console.log("Cerrando sesión del administrador...");
  };

  return (
    
    <div className="admin-layout"> 
      <Sidebar onLogoutAdmin={handleAdminLogout} />

      <main className="admin-content">
        <div className="container py-5 text-center">
          <h1>Página Gestión Pedidos</h1>
          <p>¡Bienvenido al Admin de Golden Burger!</p>
        </div>
      </main>
    </div>
  );
}

export default GestionPedidos;