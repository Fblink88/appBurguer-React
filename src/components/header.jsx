import React from 'react';
// Usaremos Link y NavLink para la navegación sin recargar la página
import { Link, NavLink } from 'react-router-dom'; 
// Importa tu logo desde la carpeta de assets
import logo from '/src/assets/img/Logo.JPG'; 

// El componente recibe sus datos (props) desde un componente padre (App.jsx)
export default function Header({ usuario, cantidadItems, onLogout }) {
  return (
    <header>
      <nav className="navbar navbar-dark bg-dark sticky-top shadow-sm rounded-bottom-4">
        <div className="container">
          {/* El logo y los enlaces de navegación usan <Link> o <NavLink> en lugar de <a> */}
          <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
            <img src={logo} height="26" alt="Golden Burger" />
            <strong>GOLDEN <span className="text-warning">BURGER</span></strong>
          </Link>
          
          <ul className="navbar-nav flex-row gap-3 mx-auto">
            {/* NavLink es especial porque puede agregar una clase 'active' automáticamente al enlace de la página actual */}
            <li className="nav-item">
              <NavLink className="nav-link text-light fw-bold" to="/">INICIO</NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link text-light fw-bold" to="/catalogo">CATÁLOGO</NavLink>
            </li>
            {/* ... otros enlaces de navegación ... */}
          </ul>

          <div className="d-flex align-items-center gap-3">
            <Link to="/carrito" className="text-light fs-5 position-relative">
              <i className="bi bi-cart"></i>
              {/* Renderizado condicional: El contador solo aparece si hay items */}
              {cantidadItems > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {cantidadItems}
                </span>
              )}
            </Link>

            {/* Renderizado condicional: Muestra el menú de usuario O el botón de login */}
            {usuario ? (
              // Si el prop 'usuario' existe, muestra esto:
              <div className="dropdown">
                <button className="btn btn-warning text-dark fw-semibold btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Hola, {usuario.nombre}
                </button>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li><Link to="/perfil" className="dropdown-item">Mi perfil</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  {/* El botón de logout llama a la función recibida por props */}
                  <li><button className="dropdown-item" onClick={onLogout}>Cerrar sesión</button></li>
                </ul>
              </div>
            ) : (
              // Si el prop 'usuario' NO existe (es null), muestra esto:
              <Link to="/login" className="btn btn-warning text-dark fw-semibold btn-sm">
                <i className="bi bi-box-arrow-in-right me-1"></i> Iniciar sesión
              </Link>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}