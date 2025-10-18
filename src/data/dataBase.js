// Este archivo ahora solo exporta el array de productos.
// Ya no se usa 'window.productosDB'. Cualquier componente que necesite
// esta lista, simplemente la importará.

export const productosDB = [
    // --- Combos ---
    {
        id: 1,
        nombre: 'Combo Clásica',
        categoria: 'Combos',
        precio: 7990,
        descripcion: 'Hamburguesa 120g, doble chedar, pepinillos, salsa Golden, tomate, lechuga, cebolla morada y pepinillos.',
        stock: 5,
        imagen: '/src/assets/img/Clasica.PNG' // Asegúrate que tus imágenes estén en la carpeta public/img/
    },
    // --- Burgers ---
    {
        id: 2,
        nombre: 'Clásica',
        categoria: 'Burgers',
        precio: 6990,
        descripcion: 'Hamburguesa 120g, doble chedar, pepinillos, salsa Golden, tomate, lechuga, cebolla morada y pepinillos.',
        stock: 5,
        imagen: '/src/assets/img/Clasica.PNG'
    },
    {
        id: 3,
        nombre: 'Champiñon',
        categoria: 'Burgers',
        precio: 8790,
        descripcion: 'Hamburguesa 120g, queso mantecoso, champiñones, cebolla caramelizada y Mayonesa.',
        stock: 5,
        imagen: '/src/assets/img/Champiñon.JPG'
    },
    {
        id: 4,
        nombre: 'Triple Queso',
        categoria: 'Burgers',
        precio: 9990,
        descripcion: 'Hamburguesa 120g, triple cheddar, ketchup y pepinillos.',
        stock: 5,
        imagen: '/src/assets/img/TripleQueso.PNG'
    },
    {
        id: 5,
        nombre: 'Golden',
        categoria: 'Burgers',
        precio: 7990,
        descripcion: 'Hamburguesa 120g, doble cheddar, pepinillos, tocino, salsa golden.',
        stock: 5,
        imagen: '/src/assets/img/Golden.PNG'
    },
    {
        id: 6,
        nombre: 'Bacon BBQ',
        categoria: 'Burgers',
        precio: 8990,
        descripcion: 'Hamburguesa premium 120gr, doble cheddar, doble bacon, salsa BBQ y cebolla crispy.',
        stock: 5,
        imagen: '/src/assets/img/BaconBBQ.PNG'
    },
    {
        id: 7,
        nombre: 'Italiana',
        categoria: 'Burgers',
        precio: 6290,
        descripcion: 'Hamburguesa 120g, Palta, tomate y mayonesa.',
        stock: 5,
        imagen: '/src/assets/img/Italiana.PNG'
    },
    {
        id: 8,
        nombre: 'Spicy',
        categoria: 'Burgers',
        precio: 7790,
        descripcion: 'Hamburguesa premium 120g, cheddar, jalapeños, bacon, cebolla crispy y salsa spicy.',
        stock: 5,
        imagen: '/src/assets/img/Spicy.JPG'
    },
    {
        id: 9,
        nombre: 'Bacon Cheeseburger',
        categoria: 'Burgers',
        precio: 6990,
        descripcion: 'Hamburguesa 120g, doble cheddar, pepinillos, cebolla, tocino y salsa Golden.',
        stock: 5,
        imagen: '/src/assets/img/BaconCheese.PNG'
    },
    {
        id: 10,
        nombre: 'Cheeseburger',
        categoria: 'Burgers',
        precio: 7890,
        descripcion: 'Hamburguesa 120g, doble cheddar, pepinillos, cebolla y salsa Golden.',
        stock: 5,
        imagen: '/src/assets/img/Cheeseburger.PNG'
    },
    // --- Acompañamientos ---
    {
        id: 11,
        nombre: 'Papas Golden',
        categoria: 'Acompañamientos',
        precio: 6990,
        descripcion: 'Papas fritas cubiertas de cheddar y topping de tocino crispy.',
        stock: 5,
        imagen: '/src/assets/img/papasGolden.JPG'
    },
    {
        id: 12,
        nombre: 'Chicken Pop',
        categoria: 'Acompañamientos',
        precio: 6990,
        descripcion: 'Bolitas crujientes de pollo.',
        stock: 5,
        imagen: '/src/assets/img/ChickenPop.PNG'
    },
    // --- Refrescos ---
    {
        id: 13,
        nombre: 'Coca-Cola',
        categoria: 'Refrescos',
        precio: 1490,
        descripcion: 'Coca-Cola original 350 ml.',
        stock: 5,
        imagen: '/src/assets/img/CocaCola.PNG'
    },
    {
        id: 14,
        nombre: 'Coca-Cola Zero',
        categoria: 'Refrescos',
        precio: 1490,
        descripcion: 'Coca-Cola sin azucar 350 ml.',
        stock: 5,
        imagen: '/src/assets/img/CocaZero.JPG'
    },
    {
        id: 15,
        nombre: 'Fanta',
        categoria: 'Refrescos',
        precio: 1490,
        descripcion: 'Fanta Original 350 ml.',
        stock: 5,
        imagen: '/src/assets/img/Fanta.JPG'
    },
    {
        id: 16,
        nombre: 'Sprite',
        categoria: 'Refrescos',
        precio: 1490,
        descripcion: 'Bebida refresacnte sabor lima 350 ml.',
        stock: 5,
        imagen: '/src/assets/img/Sprite.JPG'
    },
    {
        id: 17,
        nombre: 'Jumex',
        categoria: 'Refrescos',
        precio: 1490,
        descripcion: 'Nectar de frutas sabor durazno 350 ml.',
        stock: 5,
        imagen: '/src/assets/img/Jumex.JPG'
    },
    // --- Kids ---
    {
        id: 18,
        nombre: 'Avocado Kids',
        categoria: 'Kids',
        precio: 3890,
        descripcion: 'Hamburguesa con Palta.',
        stock: 5,
        imagen: '/src/assets/img/AvocadoKids.PNG'
    },
    {
        id: 19,
        nombre: 'Play Queso',
        categoria: 'Kids',
        precio: 3890,
        descripcion: 'Hamburguesa con queso.',
        stock: 5,
        imagen: '/src/assets/img/Playqueso.PNG'
    }
];

// src/data/dataBase.js
// src/data/dataBase.js

// ---- Usuarios ----
const KEY_USUARIOS = "usuarios";
const seedUsuarios = [
  { run: "11.111.111-1", nombre: "Ana", apellidos: "Pérez", email: "ana@example.com", rol: "Admin" },
  { run: "22.222.222-2", nombre: "Juan", apellidos: "Soto", email: "juan@example.com", rol: "Cajero" }
];

function ensureSeedUsuarios() {
  if (!localStorage.getItem(KEY_USUARIOS)) {
    localStorage.setItem(KEY_USUARIOS, JSON.stringify(seedUsuarios));
  }
}

export const usuariosStore = {
  key: KEY_USUARIOS,
  read() {
    ensureSeedUsuarios();
    return JSON.parse(localStorage.getItem(KEY_USUARIOS)) || [];
  },
  create(usuario) {
    const arr = usuariosStore.read();
    arr.push(usuario);
    localStorage.setItem(KEY_USUARIOS, JSON.stringify(arr));
  },
  update(index, usuario) {
    const arr = usuariosStore.read();
    if (arr[index]) {
      arr[index] = usuario;
      localStorage.setItem(KEY_USUARIOS, JSON.stringify(arr));
    }
  },
  remove(index) {
    const arr = usuariosStore.read();
    if (arr[index]) {
      arr.splice(index, 1);
      localStorage.setItem(KEY_USUARIOS, JSON.stringify(arr));
    }
  }
};

// ---- Productos ----
const KEY_PRODUCTOS = "productos";
const seedProductos = [
  { id: 1, nombre: "Hamburguesa Clásica", precio: 4500, categoria: "Hamburguesas" },
  { id: 2, nombre: "Papas Fritas", precio: 2000, categoria: "Acompañamientos" },
];

function ensureSeedProductos() {
  if (!localStorage.getItem(KEY_PRODUCTOS)) {
    localStorage.setItem(KEY_PRODUCTOS, JSON.stringify(seedProductos));
  }
}

export const productosStore = {
  key: KEY_PRODUCTOS,
  read() {
    ensureSeedProductos();
    return JSON.parse(localStorage.getItem(KEY_PRODUCTOS)) || [];
  },
  create(producto) {
    const arr = productosStore.read();
    arr.push(producto);
    localStorage.setItem(KEY_PRODUCTOS, JSON.stringify(arr));
  },
  update(index, producto) {
    const arr = productosStore.read();
    if (arr[index]) {
      arr[index] = producto;
      localStorage.setItem(KEY_PRODUCTOS, JSON.stringify(arr));
    }
  },
  remove(index) {
    const arr = productosStore.read();
    if (arr[index]) {
      arr.splice(index, 1);
      localStorage.setItem(KEY_PRODUCTOS, JSON.stringify(arr));
    }
  }
};
