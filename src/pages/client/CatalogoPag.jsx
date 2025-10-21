import React, { useState, useEffect } from 'react';
import HeaderComp from '../../components/HeaderComp';
import FooterComp from '../../components/FooterComp';
import { productosDB } from '../../data/dataBase.js';
import '../../styles/estilos.css';

function CatalogoPag() {
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('Todos');

  useEffect(() => {
    setProductos(productosDB);
  }, []);

  const categorias = ['Todos', ...new Set(productosDB.map(producto => producto.categoria))];

  const productosFiltrados = categoriaSeleccionada === 'Todos'
    ? productos
    : productos.filter(producto => producto.categoria === categoriaSeleccionada);

  const formatPrice = (price) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(price);

  return (
    <div className="pagina-completa">
      <HeaderComp />

      <main className="contenido-principal">
        <div className="container py-5">
          <h1 className="text-center mb-4" style={{ color: '#ffc107' }}>Nuestro Catálogo</h1>

          {/* Navegación de categorías */}
          <div className="categorias-nav">
            <div className="container">
              <div className="d-flex flex-wrap justify-content-center gap-2">
                {categorias.map(categoria => (
                  <button
                    key={categoria}
                    className={`btn-categoria ${categoriaSeleccionada === categoria ? 'active' : ''}`}
                    onClick={() => setCategoriaSeleccionada(categoria)}
                  >
                    {categoria}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Grid de productos */}
          <div className="productos-grid-horizontal">
            {productosFiltrados.map(producto => (
              <div key={producto.id} className="producto-horizontal">
                <div
                  className="producto-imagen-izq"
                  style={{ backgroundImage: `url(${producto.imagen})` }}
                />
                <div className="producto-info-der">
                  <h3 className="fw-bold">{producto.nombre}</h3>
                  <p className="text-muted small mb-2">{producto.descripcion}</p>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="price">{formatPrice(producto.precio)}</span>
                    <button className="btn-producto-agregar" title="Agregar al carrito">
                      <i className="bi bi-plus"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <FooterComp />
    </div>
  );
}

export default CatalogoPag;