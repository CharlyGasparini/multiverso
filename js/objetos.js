function Producto(id, precio, imagen, nombre, autores, genero, volumenes, estado, sinopsis){
    this.id = id; 
    this.imagen = imagen;
    this.nombre = nombre;
    this.autores = autores;
    this.genero = genero;
    this.volumenes = volumenes;
    this.estado = estado;
    this.sinopsis = sinopsis;
    this.precio = precio;
}

function ItemCarrito({imagen, nombre, precio}, cantidad){
    this.imagen = imagen;
    this.nombre = nombre;
    this.precio = precio;
    this.cantidad = cantidad;
}

function Usuario({name:nombre, address:{city:localidad}}){
    this.nombre = nombre;
    this.localidad = localidad;
}

function Pedido(carrito, tipoEntrega){
    this.carrito = carrito;
    this.tipoEntrega = tipoEntrega;
}