
class Producto{
    
    constructor(nombre, precio, categoria){
        this.nombre = nombre;
        this.precio = precio;
        this.categoria = categoria;
    }
}

function calcularCuotas(total){
    let select = prompt("¿Desea financiar su compra en cuotas?").toLowerCase();
    console.log("respuesta: " + select);
    if(select == "si"){
        let totalRecargo = 0;
        select = prompt("¿En cuantas cuotas?: 3,6,9 o 12");
        switch(select){
            case "3":
                totalRecargo = total * 1.1;
                return alert("El total a abonar es de $" + totalRecargo + " en " + select + " cuotas de $" + totalRecargo / parseInt(select));
            case "6":
                totalRecargo = total * 1.25;
                return alert("El total a abonar es de $" + totalRecargo + " en " + select + " cuotas de $" + totalRecargo / parseInt(select));
            case "9":
                totalRecargo = total * 1.40;
                return alert("El total a abonar es de $" + totalRecargo + " en " + select + " cuotas de $" + totalRecargo / parseInt(select));
            case "12":
                totalRecargo = total * 1.60;
                return alert("El total a abonar es de $" + totalRecargo + " en " + select + " cuotas de $" + totalRecargo / parseInt(select));
            default:
                alert("La respuesta ingresada no es válida");
                return calcularCuotas(total);
        }
    } else if(select == "no"){
        return alert("El total a abonar es de $" + total);
    } else{
        alert("La respuesta ingresada no es válida");
        return calcularCuotas(total);
    }
}

function calcularTotal(arr){
    let totalCompra = 0;
    for(let i = 0; i < arr.length; i++){
        totalCompra += arr[i]["precio"];
        console.log("subtotal: " + totalCompra);
    }

    console.log("total: " + totalCompra);
    return totalCompra;
}

function meterAlCarrito(){
    let select = prompt("¿Desea ingresar un producto al carrito?").toLowerCase();
    console.log("respuesta: " + select);
    if(select == "si"){
        let nombre = prompt("Nombre del producto");
        let precio = parseInt(prompt("Precio del producto"));
        let categoria = prompt("Categoria del producto");
        carrito.push(new Producto(nombre,precio,categoria));
        console.log(carrito); 
        return meterAlCarrito();

    } else if(select == "no"){
        return carrito;
        
    } else{
        alert("La respuesta ingresada no es válida");
        return meterAlCarrito();
    }
}

let carrito = [];
calcularCuotas(calcularTotal(meterAlCarrito()));