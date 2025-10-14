import React from 'react';
import Sidebar from '../../components/Sidebar';


function GestionUsuarios() {
  const handleAdminLogout = () => {
    console.log("Cerrando sesión del administrador...");
  };

  return (
    
    <div className="admin-layout"> 
      <Sidebar onLogoutAdmin={handleAdminLogout} />

      <main className="admin-content">
        <div className="container py-5 text-center">
          <h1>Página Gestión  Usuarios</h1>
          <p>¡Bienvenido al Admin de Golden Burger!</p>
        </div>
      </main>
    </div>
  );
}

export default GestionUsuarios;