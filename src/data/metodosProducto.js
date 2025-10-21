import { productosDB as productosSeedDB } from "./dataBase"; 

const DB_KEY = 'productos_storage'; // Nombre para guardar en localStorage

// --- Función de ayuda para OBTENER la DB ---
const getDB = () => {
  let db = JSON.parse(localStorage.getItem(DB_KEY));
  
  // Si no hay nada en localStorage, usamos tu lista original para rellenarlo
  if (!db || db.length === 0) {
    db = productosSeedDB; 
    localStorage.setItem(DB_KEY, JSON.stringify(db));
  }
  return db;
};

// --- Función de ayuda para GUARDAR la DB ---
const saveDB = (db) => {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
};

// Listar productos - CONVERTIR a estructura del componente
export const listarProductos = () => {
  const productosDB = getDB(); // Obtenemos los datos de localStorage

  return productosDB.map(producto => ({
    id: producto.id,
    nombre_producto: producto.nombre,           
    categoria_producto: producto.categoria,    
    precio_producto: producto.precio,           
    descripcion_producto: producto.descripcion, 
    imagenSrc: producto.imagen,
    
    stock_producto: producto.stock || 0 
  }));
};

// Agregar producto - MANEJAR ambas estructuras
export const agregarProducto = (productoData) => {
  const productosDB = getDB(); // Obtenemos los datos de localStorage

  // Encontrar próximo ID
  const nextId = productosDB.length > 0 
    ? Math.max(...productosDB.map(p => p.id)) + 1 
    : 1;

  const nuevoProducto = {
    id: nextId,
    // Para productosDB (estructura original)
    nombre: productoData.nombre_producto,
    categoria: productoData.categoria_producto,
    precio: parseInt(productoData.precio_producto),
    descripcion: productoData.descripcion_producto,
    stock: parseInt(productoData.stock_producto) || 0,
    imagen: productoData.imagenSrc || "/img/default.png"
  };

  productosDB.push(nuevoProducto);
  saveDB(productosDB); // ¡Guardamos la lista actualizada en localStorage!

  console.log('Producto agregado a DB:', nuevoProducto);
  
 

  return {
    id: nuevoProducto.id,
    nombre_producto: nuevoProducto.nombre,
    categoria_producto: nuevoProducto.categoria,
    precio_producto: nuevoProducto.precio,
    descripcion_producto: nuevoProducto.descripcion,
    stock_producto: nuevoProducto.stock,
    imagenSrc: nuevoProducto.imagen
  };
};

// Eliminar producto
export const eliminarProducto = (id) => {
  let productosDB = getDB(); // Obtenemos los datos de localStorage
  
  const index = productosDB.findIndex(p => p.id === id);
  if (index !== -1) {
    const productoEliminado = productosDB.splice(index, 1)[0];
    saveDB(productosDB); // ¡Guardamos la lista actualizada en localStorage!
    return productoEliminado;
  }
  return null;
};