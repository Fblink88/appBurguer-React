<<<<<<< HEAD
import React from 'react';
import HeaderComp from '../../components/HeaderComp';
import FooterComp from '../../components/FooterComp';
import Card from 'react-bootstrap/Card'; // 1. Importa el componente Card
=======
import React from 'react'
import HeaderComp from '../../components/HeaderComp'
import FooterComp from '../../components/FooterComp'
>>>>>>> 6962bfb (Se agrega Catalogo.jsx y se modifica el archivo estilos.css)

function NosotrosPag() {
  return (
    <div className="pagina-completa">
      <HeaderComp />

<<<<<<< HEAD
      <main>
        <div className="container py-5">
          {/* 2. Reemplaza el <div> por el componente <Card> */}
          <Card bg="dark" text="light" className="shadow-lg p-4 mx-auto" style={{ maxWidth: '900px', backgroundColor: '#3a3c43' }}>
            <Card.Body>
              <h2 className="text-center mb-4" style={{ color: '#ffc107' }}>Sobre Nosotros</h2>
              <p className="text-center">
                Bienvenidos a <strong>Golden Burger</strong>, tu lugar favorito para disfrutar de hamburguesas únicas...
              </p>
              <div className="row text-center mt-5">
                {/* ... El contenido de Misión, Visión, Valores va aquí sin cambios ... */}
                <div className="col-md-4 mb-4">
                  <i className="bi bi-bullseye display-4 mb-2" style={{ color: '#ffc107' }}></i>
                  <h5 className="mt-2">Misión</h5>
                  <p>Brindar hamburguesas deliciosas y un servicio cálido, creando experiencias memorables en cada visita.</p>
                </div>
                <div className="col-md-4 mb-4">
                  <i className="bi bi-eye display-4 mb-2" style={{ color: '#ffc107' }}></i>
                  <h5 className="mt-2">Visión</h5>
                  <p>Ser la cadena de hamburguesas preferida en nuestra ciudad, destacando por sabor, innovación y frescura.</p>
                </div>
                <div className="col-md-4 mb-4">
                  <i className="bi bi-heart-fill display-4 mb-2" style={{ color: '#ffc107' }}></i>
                  <h5 className="mt-2">Valores</h5>
                  <p>Calidad, compromiso, creatividad y pasión por la gastronomía y nuestros clientes.</p>
                </div>
              </div>
            </Card.Body>
          </Card>

          <br /><br /><br />

          {/* Hacemos lo mismo para la segunda tarjeta */}
          <Card bg="dark" text="light" className="shadow-lg p-4 mx-auto" style={{ maxWidth: '900px', backgroundColor: '#3a3c43' }}>
            <Card.Body>
              <p className="text-center">
                <strong>Dirección: </strong> Etchevers 210, Viña del Mar<br />
                {/* ... resto de la información de contacto ... */}
              </p>
              <div className="text-center">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3344.331213451557!2d-71.55018868481115!3d-33.04781798089204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9689dde138b169c7%3A0x8a70c6b12f1f8b3d!2sEtchevers%20210%2C%20Vi%C3%B1a%20del%20Mar%2C%20Valpara%C3%ADso!5e0!3m2!1ses!2scl!4v1668524430761!5m2!1ses!2scl"
                  width="600" 
                  height="450" 
                  style={{ border: 0, maxWidth: '100%' }} 
                  allowFullScreen="" 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade">
                </iframe>
              </div>
            </Card.Body>
          </Card>
=======
      <main className="contenido-principal">
        <div className="container py-5 text-center">
          <h1>Página de Nosotros</h1>
          <p>¡Bienvenido a Golden Burger!</p>
>>>>>>> 6962bfb (Se agrega Catalogo.jsx y se modifica el archivo estilos.css)
        </div>
      </main>

      <FooterComp />
    </div>
<<<<<<< HEAD
  );
}

export default NosotrosPag;
=======
  )
}

export default NosotrosPag
>>>>>>> 6962bfb (Se agrega Catalogo.jsx y se modifica el archivo estilos.css)
