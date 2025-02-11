// Definición de la clase Producto
function Producto(nombre, precio, imagen) {
    this.nombre = nombre;
    this.precio = precio;
    this.imagen = imagen;
}

Producto.prototype.getPrecioConImpuesto = function(tasaImpuesto = 0.1) {
    return this.precio * (1 + tasaImpuesto);
};

// Definición de la clase ProductoConDescuento
function ProductoConDescuento(nombre, precio, imagen, porcentajeDescuento) {
    Producto.call(this, nombre, precio, imagen);
    this.porcentajeDescuento = porcentajeDescuento;
}

ProductoConDescuento.prototype = Object.create(Producto.prototype);
ProductoConDescuento.prototype.constructor = ProductoConDescuento;

ProductoConDescuento.prototype.getPrecioConDescuento = function() {
    return this.precio * (1 - this.porcentajeDescuento / 100);
};

// Inicialización de productos
const productos = [
    new Producto("Edad oscura", 29.99, "./img/1.jpg"),
    new ProductoConDescuento("El café de las leyendas", 19.99, "./img/2.jpg", 10),
    new Producto("El héroe de las eras", 24.99, "./img/3.jpg"),
    new ProductoConDescuento("La república del dragón", 34.99, "./img/4.jpg", 15),
    new Producto("Asistente del villano", 14.99, "./img/5.jpg"),
    new ProductoConDescuento("Ciudad de jade", 22.99, "./img/6.jpg", 12),
    new Producto("Butcher & Blackbird", 19.99, "./img/7.jpg"),
    new ProductoConDescuento("Tormenta de espadas", 28.99, "./img/8.jpg", 18),
    new Producto("Mareas de medianoche", 24.99, "./img/9.jpg"),
    new ProductoConDescuento("Alas de ónix", 21.99, "./img/10.jpg", 10),
    new Producto("El imperio del vampiro", 32.99, "./img/11.jpg"),
    new ProductoConDescuento("La canción de Aquiles", 18.99, "./img/12.jpg", 5),
    new Producto("Viento y verdad", 27.99, "./img/13.jpg"),
    new ProductoConDescuento("Ciudad medialuna", 30.99, "./img/14.jpg", 20),
    new Producto("El color de la magia", 16.99, "./img/15.jpg"),
];



let carrito = [];
let indiceProductoActual = 0;

// Elementos del DOM
const imagenProducto = document.getElementById('product-image');
const nombreProducto = document.getElementById('product-name');
const precioProducto = document.getElementById('product-price');
const descuentoProducto = document.getElementById('product-discount');
const botonAgregarCarrito = document.getElementById('add-to-cart');
const botonAnterior = document.getElementById('prev-product');
const botonSiguiente = document.getElementById('next-product');
const listaCarrito = document.getElementById('cart-items');
const totalCarrito = document.getElementById('cart-total');
const botonFinalizarCompra = document.getElementById('finalize-purchase');

// Función para actualizar el carrusel
function actualizarCarrusel() {
    const producto = productos[indiceProductoActual];
    imagenProducto.src = producto.imagen;
    nombreProducto.textContent = producto.nombre;
    precioProducto.textContent = `${producto.precio.toFixed(2)}€`;
    
    if (producto instanceof ProductoConDescuento) {
        descuentoProducto.textContent = `Precio con descuento: ${producto.getPrecioConDescuento().toFixed(2)}€`;
        descuentoProducto.style.display = 'block';
    } else {
        descuentoProducto.style.display = 'none';
    }
}

// Función para agregar al carrito
function agregarAlCarrito() {
    carrito.push(productos[indiceProductoActual]);
    actualizarCarrito();
    guardarCarritoEnLocalStorage();
}

// Función para actualizar el carrito
function actualizarCarrito() {
    listaCarrito.innerHTML = '';
    let total = 0;
    
    carrito.forEach((producto, index) => {
        const li = document.createElement('li');
        const precio = producto instanceof ProductoConDescuento ? producto.getPrecioConDescuento() : producto.precio;
        li.textContent = `${producto.nombre} - ${precio.toFixed(2)}€`;
        
        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.onclick = () => eliminarDelCarrito(index);
        
        li.appendChild(botonEliminar);
        listaCarrito.appendChild(li);
        
        total += precio;
    });
    
    totalCarrito.textContent = total.toFixed(2);
}

// Función para eliminar del carrito
function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    actualizarCarrito();
    guardarCarritoEnLocalStorage();
}

// Función para finalizar la compra
function finalizarCompra() {
    const fechaCompra = new Date().toLocaleString();
    const detallesCompra = carrito.map(item => item.nombre).join(', ');
    alert(`Compra realizada el ${fechaCompra}. Artículos: ${detallesCompra}`);
    carrito = [];
    actualizarCarrito();
    guardarCarritoEnLocalStorage();
}

// Funciones para guardar y cargar el carrito en localStorage
function guardarCarritoEnLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function cargarCarritoDesdeLocalStorage() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
        actualizarCarrito();
    }
}

// Event Listeners
botonAgregarCarrito.addEventListener('click', agregarAlCarrito);
botonAnterior.addEventListener('click', () => {
    indiceProductoActual = (indiceProductoActual - 1 + productos.length) % productos.length;
    actualizarCarrusel();
});
botonSiguiente.addEventListener('click', () => {
    indiceProductoActual = (indiceProductoActual + 1) % productos.length;
    actualizarCarrusel();
});
botonFinalizarCompra.addEventListener('click', finalizarCompra);

// Inicialización
actualizarCarrusel();
cargarCarritoDesdeLocalStorage();

// Evento para resaltar el producto en el carrusel
imagenProducto.addEventListener('mouseover', () => {
    imagenProducto.style.opacity = '0.7';
});
imagenProducto.addEventListener('mouseout', () => {
    imagenProducto.style.opacity = '1';
});