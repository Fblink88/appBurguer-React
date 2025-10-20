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

// src/database.js

// Datos base de ejemplo
export const usuarios = [
  {
    run: "12345678-9",
    nombre: "Juan",
    apellidos: "Pérez",
    email: "juan@test.com",
    rol: "Admin",
  },
  {
    run: "98765432-1",
    nombre: "María",
    apellidos: "Gómez",
    email: "maria@test.com",
    rol: "Cajero",
  },
  {
    run: "11222333-4",
    nombre: "Pedro",
    apellidos: "Rojas",
    email: "pedro@test.com",
    rol: "Cocinero",
  },
];

export const clientes = [
  {
    nombre: "Carlos",
    correo: "carlos@cliente.com",
  },
  {
    nombre: "Ana",
    correo: "ana@cliente.com",
  },
];
