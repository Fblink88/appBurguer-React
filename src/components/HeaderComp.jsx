// src/components/client/HeaderComp.jsx

import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';

// Importamos los componentes específicos de React-Bootstrap
import { Navbar, Nav, Container, NavDropdown, Button } from 'react-bootstrap';
import logo from '/src/assets/img/Logo.JPG';

export default function HeaderComp() {
  // --- 1. LÓGICA Y ESTADO (Esto no cambia) ---
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
      const userName = localStorage.getItem('userName');
      setUsuario({ nombre: userName });
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userName');
    setUsuario(null);
    navigate('/');
  };

  // --- 2. RENDERIZADO CON COMPONENTES DE REACT-BOOTSTRAP ---
  return (
    // Usamos el componente <Navbar> en lugar de <nav> y <header>
    // Las propiedades (props) como 'bg', 'variant', 'sticky' reemplazan a las clases CSS.
    <Navbar bg="dark" variant="dark" sticky="top" expand="lg" className="shadow-sm rounded-bottom-4">
      <Container>
        {/* <Navbar.Brand> es el reemplazo de 'navbar-brand' y lo convertimos en un Link */}
        <Navbar.Brand as={Link} to="/">
          <img src={logo} height="26" alt="Golden Burger" className="d-inline-block align-top me-2" />
          <strong>GOLDEN <span className="text-warning">BURGER</span></strong>
        </Navbar.Brand>

        {/* Estos componentes gestionan el menú hamburguesa en móviles automáticamente */}
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          
          {/* <Nav> reemplaza al <ul>. 'mx-auto' lo centra. */}
          <Nav className="mx-auto">
            {/* <Nav.Link> reemplaza al <li> y <a>. Lo convertimos en NavLink para el estilo 'active'. */}
            <Nav.Link as={NavLink} to="/inicio" className="fw-bold">INICIO</Nav.Link>
            <Nav.Link as={NavLink} to="/catalogo" className="fw-bold">CATÁLOGO</Nav.Link>
            <Nav.Link as={NavLink} to="/nosotros" className="fw-bold">NOSOTROS</Nav.Link>
            <Nav.Link as={NavLink} to="/contacto" className="fw-bold">CONTACTO</Nav.Link>
          </Nav>

          {/* Sección derecha de la barra de navegación */}
          <Nav className="align-items-center">
            <Nav.Link as={Link} to="/carrito" className="fs-5 position-relative">
              <i className="bi bi-cart"></i>
              {/* Aquí irá la lógica del contador del carrito en el futuro */}
            </Nav.Link>

            {/* La lógica condicional de React se mantiene igual */}
            {usuario ? (
              // Usamos el componente <NavDropdown> para el menú de usuario. Es mucho más limpio.
              <NavDropdown title={`Hola, ${usuario.nombre}`} id="basic-nav-dropdown" menuVariant="dark">
                <NavDropdown.Item as={Link} to="/perfil">Mi perfil</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Cerrar sesión</NavDropdown.Item>
              </NavDropdown>
            ) : (
              // Usamos un componente <Button> para el login, que convertimos en un Link.
              <Button as={Link} to="/login" variant="warning" size="sm" className="text-dark fw-semibold">
                <i className="bi bi-box-arrow-in-right me-1"></i> Iniciar sesión
              </Button>
            )}
          </Nav>

        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}