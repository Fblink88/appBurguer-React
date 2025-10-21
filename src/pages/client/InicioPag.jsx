<<<<<<< HEAD
import React from 'react';
import { Link } from 'react-router-dom';

// --- COMPONENTES ---
import HeaderComp from '../../components/HeaderComp';
import FooterComp from '../../components/FooterComp';
import Carousel from 'react-bootstrap/Carousel';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import '../../styles/estilos.css'

// --- DATOS Y IMÁGENES ---
import { productosDB } from '../../data/dataBase.js';

// Imágenes para el carrusel
import carrusel1 from '/src/assets/img/Carrusel1.png';
import carrusel2 from '/src/assets/img/Carrusel2.png';
import carrusel3 from '/src/assets/img/Carrusel3.png';

// Imágenes para las tarjetas de productos
import goldenImg from '/src/assets/img/Golden.PNG';
import baconBbqImg from '/src/assets/img/BaconBBQ.PNG';
import tripleQuesoImg from '/src/assets/img/TripleQueso.PNG';

// Mapeo para conectar las rutas de texto de la DB con las imágenes importadas
const imageMap = {
  '/src/assets/img/Golden.PNG': goldenImg,
  '/src/assets/img/BaconBBQ.PNG': baconBbqImg,
  '/src/assets/img/TripleQueso.PNG': tripleQuesoImg,
};

// --- COMPONENTE REUTILIZABLE PARA LA TARJETA DE PRODUCTO ---
function ProductoCard({ producto }) {
  // Función para formatear el precio a moneda chilena
  const formatPrice = (price) => {
    return new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);
  };

  return (
    <Card className="h-100 shadow-sm">
      <Card.Img variant="top" src={imageMap[producto.imagen]} />
      <Card.Body className="d-flex flex-column">
        <Card.Title>{producto.nombre}</Card.Title>
        <Card.Text className="text-muted small">
          {producto.descripcion}
        </Card.Text>
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <span className="price fw-bold">{formatPrice(producto.precio)}</span>
          <Button as={Link} to="/catalogo" variant="warning" className="fw-bold">
            Ver más
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}

// --- COMPONENTE PRINCIPAL DE LA PÁGINA DE INICIO ---
function InicioPag() {
  // Filtramos la base de datos para obtener solo los productos "Más Vendidos"
  const masVendidos = productosDB.filter(producto =>
    producto.nombre === 'Golden' ||
    producto.nombre === 'Bacon BBQ' ||
    producto.nombre === 'Triple Queso'
  );

  return (
    <div className="pagina-completa">
      <HeaderComp />

      <main className="contenido-principal">
        <br />
        <Carousel>
          <Carousel.Item interval={2000}>
            <img className="d-block w-100" src={carrusel1} alt="Promoción de hamburguesas" />
            <Carousel.Caption>
              <h3>Las Mejores Hamburguesas</h3>
              <p>Hechas con ingredientes frescos y de la mejor calidad.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item interval={2000}>
            <img className="d-block w-100" src={carrusel2} alt="Promoción de combos" />
            <Carousel.Caption>
              <h3>Combos Imperdibles</h3>
              <p>Acompaña tu burger favorita con nuestras papas y refrescos.</p>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item interval={2000}>
            <img className="d-block w-100" src={carrusel3} alt="Oferta especial" />
            <Carousel.Caption>
              <h3>Pide Ahora</h3>
              <p>Disfruta del auténtico sabor de Golden Burger en tu casa.</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>

        {/* --- SECCIÓN "MÁS VENDIDOS" --- */}
        <section className="container my-5 py-5">
          <h2 className="text-center section-title mb-4">LOS MÁS VENDIDOS</h2>
          <div className="row g-4">
            {masVendidos.map((producto) => (
              <div key={producto.id} className="col-md-4">
                <ProductoCard producto={producto} />
              </div>
            ))}
          </div>
        </section>

        {/* --- SECCIÓN "PRÓXIMAMENTE" --- */}
        <section className="container my-5 py-5">
          <div className="row">
            <div className="col text-center">
              <h2 className="section-title">PRÓXIMAMENTE</h2>
            </div>
          </div>
        </section>
=======
import React from 'react'
import HeaderComp from '../../components/HeaderComp'
import FooterComp from '../../components/FooterComp'


function InicioPag() {
  return (
    <div className="pagina-completa">
      <HeaderComp />
      <main className="contenido-principal">
        <div className="container py-5 text-center">
          <h1>Página de Inicio</h1>
          <p>¡Bienvenido a Golden Burger!</p>
          
        </div>
>>>>>>> 6962bfb (Se agrega Catalogo.jsx y se modifica el archivo estilos.css)
      </main>

      <FooterComp />
    </div>
<<<<<<< HEAD
  );
}

export default InicioPag;
=======
  )
}

export default InicioPag
>>>>>>> 6962bfb (Se agrega Catalogo.jsx y se modifica el archivo estilos.css)
