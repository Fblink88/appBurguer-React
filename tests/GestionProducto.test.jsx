import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';

// Importaciones
import GestionProductos from '../src/pages/admin/gestionProductos';

// Mock del Sidebar para evitar dependencias externas
vi.mock('../src/components/Sidebar', () => ({
    default: () => <div data-testid="mocked-sidebar">Sidebar</div>,
}));

// Mock de funciones
beforeEach(() => {
    localStorage.clear();
    window.confirm = vi.fn(() => true);
    window.URL.createObjectURL = vi.fn(() => 'mock-image-url');
});

describe('Componente GestionProductos', () => {

    it('debería renderizar el título correctamente', () => {
        render(<GestionProductos />);
        expect(screen.getByText('Gestión de Productos')).toBeInTheDocument();
    });

    it('debería renderizar todos los inputs con sus labels', () => {
        render(<GestionProductos />);

        // Verificar que los inputs existen (usando placeholder como alternativa)
        expect(screen.getByPlaceholderText('Nombre')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Categoria')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Precio')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Descripcion')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Stock')).toBeInTheDocument();
        
        // Verificar que los inputs tienen los atributos correctos
        const inputNombre = screen.getByPlaceholderText('Nombre');
        expect(inputNombre).toHaveAttribute('type', 'text');
        expect(inputNombre).toHaveAttribute('name', 'nombre_producto');

        const inputPrecio = screen.getByPlaceholderText('Precio');
        expect(inputPrecio).toHaveAttribute('type', 'number');
    });
// Verificar que el botón de agregar producto está presente
    it('debería renderizar el botón "Agregar Producto"', () => {
        render(<GestionProductos />);
        
        const botonAgregar = screen.getByRole('button', { name: /Agregar Producto/i });
        expect(botonAgregar).toBeInTheDocument();
        expect(botonAgregar).toHaveAttribute('type', 'submit');
        expect(botonAgregar).toHaveClass('btn-agregar');
    });

    it('debería permitir seleccionar una imagen', async () => {
        const user = userEvent.setup();
        render(<GestionProductos />);

        // Buscar el input file por su name
        const inputImagen = screen.getByRole('button', { name: /Agregar Producto/i }).closest('form').querySelector('input[type="file"]');
        const mockFile = new File(['contenido'], 'imagen.png', { type: 'image/png' });

        await user.upload(inputImagen, mockFile);

        expect(inputImagen.files[0]).toBe(mockFile);
        expect(inputImagen.files).toHaveLength(1);
    });

    it('debería renderizar botones "Eliminar" para cada producto', () => {
        render(<GestionProductos />);

        const botonesEliminar = screen.getAllByRole('button', { name: /Eliminar/i });
        
        expect(botonesEliminar.length).toBeGreaterThan(0);
        
        botonesEliminar.forEach(boton => {
            expect(boton).toHaveClass('btn-eliminar');
        });
    });

    it('debería mostrar confirmación al eliminar un producto', async () => {
        //se crea un usuario simulado
        const user = userEvent.setup();
        render(<GestionProductos />);

        const botonesEliminar = screen.getAllByRole('button', { name: /Eliminar/i });
        const primerBotonEliminar = botonesEliminar[0];

        await user.click(primerBotonEliminar);

        expect(window.confirm).toHaveBeenCalledWith('¿Estás seguro de eliminar este producto?');
        expect(window.confirm).toHaveBeenCalledTimes(1);
    });

    it('debería renderizar la tabla con las columnas correctas', () => {
        render(<GestionProductos />);

        // Buscar específicamente en los headers de la tabla
        const tabla = screen.getByRole('table');
        const headers = within(tabla).getAllByRole('columnheader');
        
        const textosHeaders = headers.map(header => header.textContent);
        expect(textosHeaders).toContain('Nombre');
        expect(textosHeaders).toContain('Categoria');
        expect(textosHeaders).toContain('Precio');
        expect(textosHeaders).toContain('Descripcion');
        expect(textosHeaders).toContain('Stock');
        expect(textosHeaders).toContain('Imagen');
        expect(textosHeaders).toContain('Acciones');
    });

    it('debería renderizar el sidebar', () => {
        render(<GestionProductos />);
        expect(screen.getByTestId('mocked-sidebar')).toBeInTheDocument();
    });
});