// VARIABLES
const stock = [];
const carrito = [];

// EJECUCIÓN
agregarProducto(stock);
meterAlCarrito(stock);
calcularTotal(carrito);

// FUNCIONES

function agregarProducto(arr){
    let select = prompt("¿Quiere ingresar un producto al stock? SI|NO").toUpperCase();
    console.log("respuesta: " + select);

    if(select == "SI"){
        // pido los valores del objeto por teclado
        let nombre = prompt("Ingrese nombre del producto");
        let categoria = prompt("Ingrese categoria del producto");
        let precio = parseFloat(prompt("Ingrese precio del producto"));
        arr.push(new Producto(nombre, categoria, precio));// creo nuevo objeto
        console.log(arr);
        agregarProducto(arr); // ejecuto nuevamente la función
    }else if(select == "NO"){
        console.log("Lista de productos en stock:");
        for(let i = 0; i < arr.length; i++){
            console.log(arr[i]["nombre"] + "----- " + "$" + arr[i]["precio"]);
        }
    }else{
        alert("La respuesta ingresada no es válida");
        agregarProducto(arr);
    }
}

function meterAlCarrito(arr){
    let select = prompt("¿Desea ingresar un producto al carrito?").toUpperCase();
    console.log("respuesta: " + select);

    if(select == "SI"){
        // pido los valores del objeto por teclado  
        select = prompt("¿Qué producto desea meter en el carrito?").toLowerCase();
        console.log(select);
        let producto = arr.find(prod => prod.nombre == select);
        console.log(producto);
        let cantidad = prompt(`¿Cuantos ${producto.nombre} desea comprar?`);
        carrito.push(new Item(producto, cantidad)); // creo objeto nuevo
        console.log(carrito);
        meterAlCarrito(arr);

    } else if(select == "NO"){
        console.log(`Lista de items en el carrito:\n\nNombre ----- Cantidad ----- Precio`);
        carrito.forEach(item => {
            console.log(`${item.producto.nombre} ---------- ${item.cantidad} ---------- ${item.producto.precio*item.cantidad}`);
        })
        
    } else{
        alert("La respuesta ingresada no es válida");
        meterAlCarrito(arr);
    }
}

function calcularTotal(arr){
    let subtotal = 0;
    let total;
    arr.forEach(item => {
        subtotal += item.producto.precio*item.cantidad;
    })
   total = calcularCuotas(subtotal);
   console.log(total);
}

function calcularCuotas(subtotal){
    let select = prompt("¿Desea financiar su compra en cuotas?").toUpperCase();
    console.log("respuesta: " + select);
    if(select == "SI"){
        let totalRecargo = 0;
        select = prompt("¿En cuantas cuotas?: 3,6,9 o 12");
        switch(select){
            case "3":
                totalRecargo = subtotal * 1.1;
                return "El total a abonar es de $" + totalRecargo.toFixed(2) + " en " + select + " cuotas de $" + (totalRecargo / parseInt(select)).toFixed(2);
            case "6":
                totalRecargo = subtotal * 1.25;
                return "El total a abonar es de $" + totalRecargo + " en " + select + " cuotas de $" + (totalRecargo / parseInt(select)).toFixed(2);
            case "9":
                totalRecargo = subtotal * 1.40;
                return "El total a abonar es de $" + totalRecargo + " en " + select + " cuotas de $" + (totalRecargo / parseInt(select)).toFixed(2);
            case "12":
                totalRecargo = subtotal * 1.60;
                return "El total a abonar es de $" + totalRecargo + " en " + select + " cuotas de $" + (totalRecargo / parseInt(select)).toFixed(2);
            default:
                alert("La respuesta ingresada no es válida");
                calcularCuotas(subtotal);
        }
    } else if(select == "NO"){
        return "El total a abonar es de $" + subtotal.toFixed(2);
    } else{
        alert("La respuesta ingresada no es válida");
        calcularCuotas(subtotal);
    }
}