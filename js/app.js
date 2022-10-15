// VARIABLES
const productos = [
    {nombre:"Kimetsu no Yaiba #23", marca: "ivrea", categoria: "manga", precio: 1200},
    {nombre:"SlamDunk #12", marca: "ivrea", categoria: "manga", precio: 1800},
    {nombre:"Figura The Batman", marca: "funco", categoria: "figuras", precio: 6000},
    {nombre:"Crisis en tierras Infinitas", marca: "Salvat", categoria: "comic", precio: 3000},
    {nombre:"Kengan Ashura #3", marca: "ivrea", categoria: "manga", precio: 1200},
    {nombre:"FlashPoint", marca: "Ovni", categoria: "comic", precio: 3500},
    {nombre:"El señor de los Anillos: Las dos Torres", marca: "minotauro", categoria: "novela", precio: 4000},
    {nombre:"Berserk #32", marca: "panini", categoria: "manga", precio: 1200}
];
const carrito = [];

// ELEMENTOS DEL DOM
let btnCompra = document.getElementById("btn-compra");
let feesSection = document.createElement("section");
let main = document.getElementById("main");
let tablaTotal = document.getElementById("table-price");
// EJECUCIÓN
crearCartas(productos);

for(let i = 0; i < productos.length; i++){
    let btnAdd = document.getElementById(`btn-agregar-${productos.indexOf(productos[i])}`);
    btnAdd.addEventListener("click", (evento) => {
        evento.preventDefault();
        tablaTotal.innerText= `$${calcularTotal(meterAlCarrito(productos[i]))}.-`;
    });
}

btnCompra.addEventListener("click", (evento) => {
    evento.preventDefault();
    if(carrito.length != 0){
        feesSection.innerHTML =
        `
        <div class="container text-center col-6">
        <h2>CUOTAS</h2>
        <form action="">
        <input type="radio" name="formaPago" id="1pago" value="1"> 1 pago
        <br>
        <input type="radio" name="formaPago" id="3pago" value="3"> 3 pagos
        <br>
        <input type="radio" name="formaPago" id="6pago" value="6"> 6 pagos
        <br>
        <input type="radio" name="formaPago" id="9pago" value="9"> 9 pagos
        <br>
        <input type="radio" name="formaPago" id="12pago" value="12"> 12 pagos
        </form>
        </div>
        `
        main.appendChild(feesSection);

    } else{
        feesSection.innerHTML =
        `
        <div class="container text-center">
        <p class="text-danger fw"><strong>El carrito esta vacio. Ingrese algun item</strong></p
        </div>
        `
        main.appendChild(feesSection);
    }
})
            

// FUNCIONES

function crearCartas(arr){
    let novedades = document.getElementById("novedades");
    arr.forEach(item => {
        novedades.innerHTML += 
        `
        <div class="col">
            <div class="card border-danger">
                <img src="https://picsum.photos/1200/800" alt="" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title">${item.nombre}</h5>
                    <p class="card-text">$${item.precio}.-</p>
                    <button class="btn btn-outline-danger" id="btn-agregar-${arr.indexOf(item)}">Agregar al carrito</button>
                </div>
            </div>
        </div>
        `;
    });
}

function meterAlCarrito(item){
    carrito.push(item);
    imprItem(item);
    return carrito;
}

function calcularTotal(arr){
    let totalCompra = 0;
    for(let i = 0; i < arr.length; i++){
        totalCompra += arr[i]["precio"];
    }
    return totalCompra;
}

function imprItem(item){
    document.getElementById("cart-body").innerHTML +=
    `
    <tr>
        <td>${item.nombre}</td>
        <td>${item.marca}</td>
        <td>${item.categoria}</td>
        <td>
        <input type="number" name="number" class="cant-items" value=1 min="1" max="100">
        </td>
        <td>$${item.precio}.-</td>
    </tr>
    `;
}

function calcularCuotas(total){
    let checkedBtn = document.querySelector("input:checked");
    switch(checkedBtn.value){
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
}









