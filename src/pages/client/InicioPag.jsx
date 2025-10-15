import React from 'react'
import HeaderComp from '../../components/HeaderComp'
import FooterComp from '../../components/FooterComp'
import Carousel from 'react-bootstrap/Carousel';
import carrusel1 from '/src/assets/img/Carrusel1.png'
import carrusel2 from '/src/assets/img/Carrusel2.png'
import carrusel3 from '/src/assets/img/Carrusel3.png'


function InicioPag() {
  return (
    <div className="pagina-completa">
      <HeaderComp />


      <main className="contenido-principal">
        <br />
        <Carousel>
          <Carousel.Item interval={2000}>
            {/* 4. Reemplaza ExampleCarouselImage con la etiqueta <img> */}
            <img
              className="d-block w-100"
              src={carrusel1}
              alt="Primera imagen del carrusel"
            />
            <Carousel.Caption>
              <h3>Las Mejores Hamburguesas</h3>
              <p>Hechas con ingredientes frescos y de la mejor calidad.</p>
            </Carousel.Caption>
          </Carousel.Item>
          
          <Carousel.Item interval={2000}>
            <img
              className="d-block w-100"
              src={carrusel2}
              alt="Segunda imagen del carrusel"
            />
            <Carousel.Caption>
              <h3>Combos Imperdibles</h3>
              <p>Acompaña tu burger favorita con nuestras papas y refrescos.</p>
            </Carousel.Caption>
          </Carousel.Item>

          <Carousel.Item interval={2000}>
            <img
              className="d-block w-100"
              src={carrusel3}
              alt="Tercera imagen del carrusel"
            />
            <Carousel.Caption>
              <h3>Pide Ahora</h3>
              <p>Disfruta del auténtico sabor de Golden Burger en tu casa.</p>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>

        
        <div className="container py-5 text-center">
          <h1>Página de Inicio</h1>
          <p>¡Bienvenido a Golden Burger!</p>
          
        </div>
      </main>

      <FooterComp />
    </div>
  )
}

export default InicioPag