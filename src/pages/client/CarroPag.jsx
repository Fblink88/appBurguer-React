import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import HeaderComp from '../../components/HeaderComp';
import FooterComp from '../../components/FooterComp';
import '../../styles/carrito.css';
// Componente de la página del carrito de compras
function CarroPag() {
  const navigate = useNavigate();
  const [carrito, setCarrito] = useState([]);

  useEffect(() => { // Carga el carrito desde el localStorage al montar el componente
    const carritoGuardado = localStorage.getItem('carrito'); // Obtiene el carrito guardado en localStorage
    if (carritoGuardado) { // Si existe un carrito guardado
      setCarrito(JSON.parse(carritoGuardado)); // coNVIERTE  el JSON y lo establece en carritoGuardado
    }
  }, []);

  useEffect(() => {
    if (carrito.length > 0) { // Guarda el carrito en localStorage cada vez que cambia
      localStorage.setItem('carrito', JSON.stringify(carrito)); // Convierte el carrito a JSON y lo guarda     
    } else {
      localStorage.removeItem('carrito'); // Si el carrito está vacío, lo elimina del localStorage
    }
    window.dispatchEvent(new Event('storage')); // Dispara un evento de almacenamiento para actualizar otros componentes (como el contador del carrito en el header)
  }, [carrito]); // Se ejecuta cada vez que cambia el carrito, PORQUE ESTA DENTRO DE UN USEEFFECT, por ejemplo cuando se agrega o elimina un producto

  const calcularSubtotal = () => { //
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0); // Calcula el subtotal sumando el precio por cantidad de cada item
  };

  const calcularTotal = () => {
    return calcularSubtotal();
  };

  const calcularTotalItems = () => {
  return carrito.reduce((total, item) => total + item.cantidad, 0);
};
  // Funciones para aumentar, disminuir y eliminar productos del carrito
  const aumentarCantidad = (itemId) => {
    setCarrito(carrito.map(item =>
      item.id === itemId 
        ? { ...item, cantidad: item.cantidad + 1 }// Aumenta la cantidad del item en 1, se activa cuando el usuario hace click en el botón +
        : item// Mantiene el item sin cambios si no coincide el ID
    ));
  };

  // Disminuye la cantidad de un producto en el carrito
  const disminuirCantidad = (itemId) => { //recibe el id del item que se va a disminuir
    const item = carrito.find(i => i.id === itemId);
  
    if (item.cantidad === 1) {
    // Si la cantidad es 1, eliminar el producto
      eliminarProducto(itemId);
    } else {
    // Si la cantidad es mayor a 1, solo disminuir
      setCarrito(carrito.map(i =>
        i.id === itemId
          ? { ...i, cantidad: i.cantidad - 1 }
          : i
      ));
    }
  };
  // Elimina un producto del carrito después de que el usuario agrego productos
  //  y confirma que quiere eliminarlo
  const eliminarProducto = (itemId) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      setCarrito(carrito.filter(item => item.id !== itemId));
    }
  };
  // Vacía todo el carrito Se le pregunta 
  // al usuario si está seguro antes de vaciarlo
  // y luego hace un removeItem en el localStorage
  const vaciarCarrito = () => {
    if (confirm('¿Estás seguro de vaciar todo el carrito?')) {
      setCarrito([]);
      localStorage.removeItem('carrito');
    }
  };
  // Procede al pago redirigiendo
  //  a la página de checkout
  const procederAlPago = () => {
    if (carrito.length === 0) { //primero verifica si el carrito está vacío
      alert('El carrito está vacío');
      return;// si está vacío, muestra una alerta y no hace nada más
    }
    navigate('/checkout'); // Si el carrito tiene productos, te lleva a la página de checkout
  };







  //=========================================
 // RENDERIZA LA PAGINA DEL CARRITO DE COMPRAS
 //=========================================
  return (
    <div className="pagina-completa">
      <HeaderComp />

      <main className="contenido-principal">
        <div className="container py-5">
          <h1 className="titulo-carrito">Mi Carrito de Compras</h1>

          {carrito.length === 0 ? (
            // CARRITO VACÍO
            <div className="carrito-vacio">
              <div className="carrito-vacio-icono">
                <i className="bi bi-cart-x"></i>
              </div>
              <h3>Tu carrito está vacío</h3>
              <p>Añade algunos productos deliciosos desde nuestro catálogo.</p>
              <button 
                className="btn-ver-catalogo"
                onClick={() => navigate('/catalogo')}
              >
                Ver Catálogo
              </button>
            </div>
          ) : (
            // CARRITO CON PRODUCTOS
            <div className="carrito-contenido">
              
              {/* LISTA DE PRODUCTOS */}
              <div className="carrito-productos">
                <div className="carrito-header">
                  <h2>Productos ({calcularTotalItems()})</h2>
                  <button 
                    className="btn-vaciar-carrito"
                    onClick={vaciarCarrito}
                  >
                    <i className="bi bi-trash"></i> Vaciar carrito
                  </button>
                </div>

                {carrito.map((item) => ( // Recorre los productos en el carrito y los muestra
                  <div key={item.id} className="carrito-item"> 
                    
                    <div 
                      className="carrito-item-imagen"
                      style={{ backgroundImage: `url(${item.imagen})` }}
                    />

                    <div className="carrito-item-info">
                      <h3 className="carrito-item-nombre">{item.nombre}</h3>
                      <p className="carrito-item-descripcion">{item.descripcion}</p>
                      {item.size && (
                        <span className="carrito-item-size">Tamaño: {item.size}</span>
                      )}
                    </div>

                    <div className="carrito-item-precio">
                      <span className="precio-label">Precio</span> 
                      <span className="precio-valor">
                        ${item.precio.toLocaleString('es-CL')} 
                      </span>
                    </div>

                    <div className="carrito-item-cantidad">
                      <span className="cantidad-label">Cantidad</span>
                      <div className="cantidad-controles">
                        <button 
                          className="btn-cantidad" // Botón para disminuir la cantidad, botstraps icono de dash
                          onClick={() => disminuirCantidad(item.id)} // llama a la función disminuirCantidad con el id del item
                        >
                          <i className="bi bi-dash"></i> 
                        </button>
                        <span className="cantidad-numero">{item.cantidad}</span>
                        <button 
                          className="btn-cantidad"
                          onClick={() => aumentarCantidad(item.id)}
                        >
                          <i className="bi bi-plus-lg"></i> 
                        </button>
                      </div>
                    </div>

                    <div className="carrito-item-subtotal">
                      <span className="subtotal-label">Subtotal</span>
                      <span className="subtotal-valor">
                        ${(item.precio * item.cantidad).toLocaleString('es-CL')}
                      </span>
                    </div>

                    <button 
                      className="btn-eliminar-item"
                      onClick={() => eliminarProducto(item.id)}
                      title="Eliminar producto"
                    >
                      <i className="bi bi-x-lg"></i>
                    </button>
                  </div>
                ))}
              </div>

              {/* RESUMEN DEL PEDIDO */}
              <div className="carrito-resumen">
                <div className="resumen-card">
                  <h2 className="resumen-titulo">Resumen del Pedido</h2>
                  
                  <div className="resumen-linea">
                    <span>Subtotal:</span>
                    <span>${calcularSubtotal().toLocaleString('es-CL')}</span>
                  </div>

                  <div className="resumen-linea">
                    <span>Envío:</span>
                    <span className="text-success">Gratis</span>
                  </div>

                  <hr className="resumen-separador" />

                  <div className="resumen-total">
                    <span>Total:</span>
                    <span className="total-valor">
                      ${calcularTotal().toLocaleString('es-CL')}
                    </span>
                  </div>

                  <button 
                    className="btn-proceder-pago"
                    onClick={procederAlPago}
                  >
                    Proceder al Pago
                  </button>

                  <button 
                    className="btn-seguir-comprando" 
                    onClick={() => navigate('/catalogo')}
                  >
                    <i className="bi bi-arrow-left"></i> 
                    Seguir Comprando
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <FooterComp />
    </div>
  );
}

export default CarroPag;