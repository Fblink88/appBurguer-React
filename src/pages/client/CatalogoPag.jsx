// src/pages/client/CatalogoPag.jsx

import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import HeaderComp from '../../components/HeaderComp';
import FooterComp from '../../components/FooterComp';
import { productosDB } from '../../data/dataBase';
import '../../styles/catalogo.css';

function CatalogoPag() {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedSize, setSelectedSize] = useState('Simple');
  const [carrito, setCarrito] = useState(() => {
    const carritoGuardado = localStorage.getItem('carrito');
    return carritoGuardado ? JSON.parse(carritoGuardado) : [];
  });

  const handleOpenModal = (producto) => {
    setSelectedProduct(producto);
    setSelectedSize('Simple');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
  };

  const handleAddToCart = () => {
    if (!selectedProduct) return;

    const precioFinal = selectedSize === 'Doble' 
      ? selectedProduct.precio * 1.5 
      : selectedProduct.precio;

    const nuevoItem = {
      ...selectedProduct,
      size: selectedSize,
      precio: precioFinal,
      cantidad: 1,
      id: `${selectedProduct.id}-${selectedSize}`
    };

    const carritoActualizado = [...carrito];
    const itemExistente = carritoActualizado.find(
      item => item.id === nuevoItem.id
    );

    if (itemExistente) {
      itemExistente.cantidad += 1;
    } else {
      carritoActualizado.push(nuevoItem);
    }

    setCarrito(carritoActualizado);
    localStorage.setItem('carrito', JSON.stringify(carritoActualizado));
    
    handleCloseModal();
    window.dispatchEvent(new Event('storage'));
  };

  const handleQuickAdd = (producto) => {
    const nuevoItem = {
      ...producto,
      size: 'Simple',
      precio: producto.precio,
      cantidad: 1,
      id: `${producto.id}-Simple`
    };

    const carritoActualizado = [...carrito];
    const itemExistente = carritoActualizado.find(
      item => item.id === nuevoItem.id
    );

    if (itemExistente) {
      itemExistente.cantidad += 1;
    } else {
      carritoActualizado.push(nuevoItem);
    }

    setCarrito(carritoActualizado);
    localStorage.setItem('carrito', JSON.stringify(carritoActualizado));
    window.dispatchEvent(new Event('storage'));
  };

  const agruparPorCategoria = () => {
    const grupos = {};
    productosDB.forEach(producto => {
      if (!grupos[producto.categoria]) {
        grupos[producto.categoria] = [];
      }
      grupos[producto.categoria].push(producto);
    });
    return grupos;
  };

  const productosAgrupados = agruparPorCategoria();

  const calcularTotal = () => {
    return carrito.reduce((total, item) => total + (item.precio * item.cantidad), 0);
  };

  return (
    <div className="pagina-completa">
      <HeaderComp />

      {/* Barra de navegación por categorías */}
      <div className="categorias-nav">
        <div className="container">
          <div className="categorias-wrapper">
            {Object.keys(productosAgrupados).map(categoria => (
              <a 
                key={categoria}
                className="btn-categoria" 
                href={`#${categoria.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {categoria}
              </a>
            ))}
          </div>
        </div>
      </div>

      <main className="contenido-principal">
        <div className="container py-4">
          {Object.entries(productosAgrupados).map(([categoria, productos]) => (
            <section 
              key={categoria} 
              id={categoria.toLowerCase().replace(/\s+/g, '-')} 
              className="categoria-seccion"
            >
              <h2 className="titulo-categoria">{categoria}</h2>
              
              {/* Grid de productos - diseño HORIZONTAL */}
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
                          <i className="bi bi-blus-lg"></i>
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
      {carrito.length > 0 && (
        <div className="checkout-bar-fixed">
          <div className="container">
            <div className="checkout-contenido">
              <span className="checkout-total">
                Total: <strong>${calcularTotal().toLocaleString('es-CL')}</strong>
              </span>
              <a href="/carrito" className="btn-pagar">
                Ir a pagar ({carrito.length})
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Modal de producto */}
      <Modal 
        show={showModal} 
        onHide={handleCloseModal} 
        size="xl"
        centered
        className="modal-producto"
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
              
              <div className="modal-grid">
                <div className="modal-imagen-seccion">
                  <img 
                    src={selectedProduct.imagen} 
                    alt={selectedProduct.nombre}
                    className="modal-imagen"
                  />
                </div>
                
                <div className="modal-info-seccion">
                  <h3 className="modal-titulo">{selectedProduct.nombre}</h3>
                  <p className="modal-descripcion">{selectedProduct.descripcion}</p>
                  
                  <div className="modal-precio">
                    ${selectedSize === 'Doble' 
                      ? (selectedProduct.precio * 1.5).toLocaleString('es-CL')
                      : selectedProduct.precio.toLocaleString('es-CL')}
                  </div>

                  <hr className="modal-separador" />
                  
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