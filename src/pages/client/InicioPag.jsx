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
      </main>

      <FooterComp />
    </div>
  )
}

export default InicioPag