// src/pages/client/CatalogoPag.jsx

import React, { useState } from 'react';// React Bootstrap components 
import { Modal, Button } from 'react-bootstrap'; //  se instala con: npm install react-bootstrap bootstrap
import HeaderComp from '../../components/HeaderComp'; 
import FooterComp from '../../components/FooterComp'; 
import { productosDB } from '../../data/dataBase';
import '../../styles/catalogo.css';

function CatalogoPag() { // Componente principal de la página de catálogo
  const [selectedProduct, setSelectedProduct] = useState(null); // Producto que se va a mostrar  en el modal y viene de la lista de productos, Un hook es una función especial que permite "enganchar" características de React, como el estado y el ciclo de vida, a componentes funcionales.
  const [showModal, setShowModal] = useState(false); // Estado para controlar la visibilidad del modal viene de React Bootstrap
  const [selectedSize, setSelectedSize] = useState('Simple'); // Tamaño seleccionado para la hamburguesa que viene del modal y el modal se abre al hacer click en un producto
  const [carrito, setCarrito] = useState(() => { // Estado del carrito de compras, inicializado desde localStorage
    const carritoGuardado = localStorage.getItem('carrito');// Si hay un carrito guardado en localStorage, lo parseamos, si no, iniciamos con un array vacío
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];  //  el carrito se guarda en localStorage cada vez que se agrega un producto Json.parse se usa para convertir el string guardado en localStorage a un objeto JavaScript
  });

  // Funciones para manejar el modal y el carrito
  const handleOpenModal = (producto) => { 
    setSelectedProduct(producto);
    setSelectedSize('Simple');
    setShowModal(true);
  };
  // Cierra el modal y resetea el producto seleccionado
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };
  // Agrega el producto seleccionado al carrito con el tamaño y precio correspondiente
  const handleAddToCart = () => {
    if (!selectedProduct) return;

    // Calcula el precio final según el tamaño seleccionado, esto es posible porque el estado selectedSize se actualiza al hacer click en una de las opción del modal
    const precioFinal = selectedSize === 'Doble' 
      ? selectedProduct.precio * 1.5 
      : selectedProduct.precio;


    // Crea un nuevo ítem para el carrito con la información necesaria
    // especificamente hace un spread del producto seleccionado y le agrega size, precio, cantidad e id único
    // este evento se activa cuando se hace click en el botón "Agregar al carrito" del modal
    //porque el estado selectedProduct contiene el producto mostrado en el modal
    //y el estado selectedSize contiene el tamaño seleccionado en el modal
    //y el precioFinal se calcula en base a esos dos estados
    // Luego actualiza el carrito y lo guarda en localStorage
    const nuevoItem = {
      ...selectedProduct,
      size: selectedSize,
      precio: precioFinal,
      cantidad: 1,
      id: `${selectedProduct.id}-${selectedSize}`
    };
    // Verifica si el ítem ya existe en el carrito 
    // y actualiza la cantidad si es así, 
    // de lo contrario lo agrega como nuevo ítem 
    // y siempre guarda el carrito actualizado en localStorage
    const carritoActualizado = [...carrito];
    const itemExistente = carritoActualizado.find(
      item => item.id === nuevoItem.id
    );

    if (itemExistente) {
      itemExistente.cantidad += 1;
    } else {
      carritoActualizado.push(nuevoItem);
    }

    // Actualiza el estado del carrito y lo guarda en localStorage
    // También dispara un evento de almacenamiento para notificar otros componentes
    //sirve para que otros componentes que escuchen este evento puedan actualizarse
    setCarrito(carritoActualizado);
    localStorage.setItem('carrito', JSON.stringify(carritoActualizado));
    
    handleCloseModal(); // Cierra el modal después de agregar al carrito, handleCloseModal declarada arriba
    window.dispatchEvent(new Event('storage'));// Notifica otros componentes del cambio en el carrito 
  };

  const handleQuickAdd = (producto) => { // Agrega rápidamente un producto simple al carrito desde la lista sin abrir el modal
    const nuevoItem = { // nuevo ítem con tamaño 'Simple' y precio normal
      ...producto,
      size: 'Simple',
      precio: producto.precio,
      cantidad: 1,
      id: `${producto.id}-Simple`
    };
    // Verifica si el ítem ya existe en el carrito y 
    // actualiza la cantidad si es así, de lo contrario lo agrega como nuevo ítem
    //ocurre porque el botón '+'  no abre el modal,
    // se asume que es de tamaño 'Simple' y el precio es el normal
    const carritoActualizado = [...carrito];
    const itemExistente = carritoActualizado.find(
      item => item.id === nuevoItem.id
    );

    if (itemExistente) { // Si el ítem ya existe, incrementa la cantidad
      itemExistente.cantidad += 1;
    } else {
      carritoActualizado.push(nuevoItem);// Si no existe, lo agrega al carrito
    }

    setCarrito(carritoActualizado); // Actualiza el estado del carrito y lo guarda en localStorage
    localStorage.setItem('carrito', JSON.stringify(carritoActualizado));
    window.dispatchEvent(new Event('storage'));
  };
  // Agrupa los productos por categoría para facilitar la renderización
  const agruparPorCategoria = () => {
    const grupos = {}; // variable temporal para almacenar las categorías y sus productos
    productosDB.forEach(producto => { // Recorre todos los productos
      if (!grupos[producto.categoria]) { // Si la categoría no existe, la crea
        grupos[producto.categoria] = [];// Inicializa el array de productos para esa categoría
      }
      grupos[producto.categoria].push(producto);// Agrega el producto a la categoría correspondiente
    });
    return grupos; // Devuelve el objeto con categorías y sus productos
  };
  // Obtiene los productos agrupados por categoría
  const productosAgrupados = agruparPorCategoria();
 // Calcula el total del carrito
  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0); // Suma el precio por cantidad de cada ítem
  };

// Calcula el total de items en el carrito (sumando cantidades)
const calcularTotalItems = () => {
  return carrito.reduce((total, item) => total + item.cantidad, 0);
};








  //=================================
  // Renderiza la página de catálogo
  //=================================
  return (
    <div className="pagina-completa">
      <HeaderComp />

      {/* Barra de navegación por categorías */}
      {/*Funcion de mapeo */}
      <div className="categorias-nav">
        <div className="container">
          <div className="categorias-wrapper"> 
            {Object.keys(productosAgrupados).map(categoria => ( // Recorre las categorías para crear los enlaces de navegación
              <a 
                key={categoria} // Clave única para cada categoría
                className="btn-categoria" // Clase para estilo de botón de categoría
                href={`#${categoria.toLowerCase().replace(/\s+/g, '-')}`} // Convierte el nombre de la categoría en un ID válido para el enlace
              >
                {categoria}
              </a>
            ))}
          </div>
        </div>
      </div>
      {/* Contenido principal con productos agrupados por categoría */}
      <main className="contenido-principal">
        <div className="container py-4">
          {Object.entries(productosAgrupados).map(([categoria, productos]) => (
            <section 
              key={categoria} // ID basado en el nombre de la categoría con esta Key se crea un ancla para la navegación y se hace scroll a esa sección al hacer click en el botón de la categoría
              id={categoria.toLowerCase().replace(/\s+/g, '-')}  // ID para navegación
              className="categoria-seccion"
            >
              <h2 className="titulo-categoria">{categoria}</h2>
              
              {/*Grid de productos*/ }
              <div className="productos-grid-horizontal">
                {productos.map(producto => (
                  <div key={producto.id} className="producto-horizontal">
                    {/* Imagen a la izquierda */}
                    <div 
                      className="producto-imagen-izq"
                      onClick={() => handleOpenModal(producto)}
                      style={{ backgroundImage: `url(${producto.imagen})` }}
                    >
                    </div>
                    
                    {/* Info a la derecha */}
                    <div className="producto-info-der">
                      <h3 className="producto-nombre">{producto.nombre}</h3>
                      <p className="producto-descripcion">{producto.descripcion}</p>
                      
                      <div className="producto-acciones">
                        <div className="producto-precio-box">
                          <span className="producto-precio">
                            ${producto.precio.toLocaleString('es-CL')}
                          </span>
                          <span className="producto-unidad">c/u</span>
                        </div>
                        <button 
                          className="btn-producto-agregar"
                          onClick={() => handleQuickAdd(producto)}
                          title='Agregar al carrito'
                        >
                          <i className="bi bi-plus-lg"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* Barra de checkout inferior */}
      {carrito.length > 0 && ( // Muestra la barra de checkout solo si hay productos en el carrito, Si el length del carrito es mayor a 0
        <div className="checkout-bar-fixed"> 
          <div className="container">
            <div className="checkout-contenido">
              <span className="checkout-total">
                Total: <strong>${calcularTotal().toLocaleString('es-CL')}</strong>
              </span>
              <a href="/carrito" className="btn-pagar">
                Ir a pagar ({calcularTotalItems()}) 
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Modal de producto */}
      <Modal 
        show={showModal} // Muestra el modal si showModal es true (cuando se hace click en un producto)
        onHide={handleCloseModal}  // Se cierra el modal (cuando se hace click fuera )
        size="xl" // Tamaño extra grande 
        centered // Centrado verticalmente
        className="modal-producto" // Clase personalizada para estilos
      >
        <Modal.Body className="p-0"> 
          {selectedProduct && (
            <div className="modal-producto-contenido">
              <button 
                type="button" 
                className="modal-cerrar"
                onClick={handleCloseModal}
              >
                <i className="bi bi-x-lg"></i>
              </button>
              {/* Grid del modal con imagen e info */}
              <div className="modal-grid">
                <div className="modal-imagen-seccion">
                  <img 
                    src={selectedProduct.imagen} 
                    alt={selectedProduct.nombre}
                    className="modal-imagen"
                  />
                </div>
                {/* Info del producto y opciones */}
                <div className="modal-info-seccion">
                  <h3 className="modal-titulo">{selectedProduct.nombre}</h3>
                  <p className="modal-descripcion">{selectedProduct.descripcion}</p>
                  
                  <div className="modal-precio">
                    ${selectedSize === 'Doble' 
                      ? (selectedProduct.precio * 1.5).toLocaleString('es-CL')
                      : selectedProduct.precio.toLocaleString('es-CL')}
                  </div>
                      {/* Separador */ }
                  <hr className="modal-separador" />
                  {/* Opciones de tamaño para burgers y combos */ }
                  {(selectedProduct.categoria === 'Burgers' || selectedProduct.categoria === 'Combos') && (
                    <div className="modal-opciones">
                      <label className="modal-label">Selecciona el tamaño:</label>
                      <div className="modal-radio-group">
                        <label className="radio-option">
                          <input 
                            type="radio" 
                            name="sizeBurger" 
                            checked={selectedSize === 'Simple'}
                            onChange={() => setSelectedSize('Simple')}
                          />
                          <span>Simple</span>
                        </label>
                        <label className="radio-option">
                          <input 
                            type="radio" 
                            name="sizeBurger" 
                            checked={selectedSize === 'Doble'}
                            onChange={() => setSelectedSize('Doble')}
                          />
                          <span>Doble (+50%)</span>
                        </label>
                      </div>
                    </div>
                  )}

                  <button 
                    className="modal-btn-agregar"
                    onClick={handleAddToCart}
                  >
                    Agregar al carrito
                  </button>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>

      <FooterComp />
    </div>
  );
}

export default CatalogoPag;
