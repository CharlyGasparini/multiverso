// ELEMENTOS DEL DOM
let tbody = document.getElementById("tbody");
let subtotal = document.getElementById("subtotal");
let btnVaciar = document.getElementById("btnVaciar");
let total = document.getElementById("total");
let radio = document.getElementsByClassName("form-check-input");

//VARIABLES
const carrito = (localStorage.hasOwnProperty("carrito")) ? JSON.parse(localStorage.getItem("carrito")) : [];
const stock = JSON.parse(localStorage.getItem("stock"));

renderTarjetas(stock);
updateCarrito(carrito);

// EVENTOS

for(let i = 0; i < stock.length; i++){
    let btnAgregar = document.getElementById(`btnAgregar${i}`);
    btnAgregar.onclick = () => {
        let duplicado = carrito.find(item => item.producto == stock[i]); 
        if(duplicado != undefined){
            let index = carrito.indexOf(duplicado);
            carrito[index].cantidad++;
        }else{
            let item = new Item(stock[i], 1);
            carrito.push(item);
        }
        updateCarrito();
        localStorage.setItem("carrito", JSON.stringify(carrito));
    }
}

btnVaciar.onclick = () => {
    carrito.splice(0,carrito.length);
    updateCarrito();
    localStorage.setItem("carrito", JSON.stringify(carrito));
}

for(let i = 0; radio.length; i++){
    radio[i].oninput = () => {
        updateCarrito(carrito);
    }
}


// FUNCIONES
function Item(producto, cantidad){
    this.producto = producto;
    this.cantidad = cantidad;
}


function cantCuotas(arr){
    for(let i = 0; i < arr.length; i++){
        if(arr[i].checked == true){
            return arr[i].value;
        }
    }
}

function renderTarjetas(arr){

    let novedades = document.getElementById("novedades");
    arr.forEach(elem => {
        let index = arr.indexOf(elem);
        novedades.innerHTML += 
        `
        <div class="col">
            <div class="card text-dark border-danger">
                <img src="${elem.imagen}" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title">${elem.nombre}</h5>
                    <p class="card-text">$${elem.precio}.-</p>
                    <button class="btn btn-danger" id="btnAgregar${index}">
                        <i class='fa-solid fa-cart-shopping'></i>
                        Agregar al carrito
                    </button>
                </div>
            </div>
        </div>
        `;
    })
}

function crearFilaCarrito(item){
    let index = carrito.indexOf(item);
    
    let tr = document.createElement("tr");
    
    let td = document.createElement("td");
    td.innerText = item.producto.nombre;
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.innerText = item.cantidad;
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.innerText = `$${item.producto.precio * item.cantidad}.-`;
    tr.appendChild(td);
    
    td = document.createElement("td");
    td.innerHTML = 
    `
    <button class="btn btn-outline-none" id="btnMin${index}">
    <i class="fa-solid fa-minus"></i>
    </button>
    <button class="btn btn-outline-none" id="btnPlus${index}">
    <i class="fa-solid fa-plus"></i>
    </button>
    <button class="btn btn-outline-none" id="btnDel${index}">
    <i class="fa-solid fa-trash"></i>
    </button>
    `;
    tr.appendChild(td);
    
    tbody.appendChild(tr);
    
    let btnDel = document.getElementById(`btnDel${index}`); // capturo el boton de borrar elemento de la fila
    btnDel.onclick = () => {
        carrito.splice(index, 1); // borro el producto dentro del arreglo
        updateCarrito();
        localStorage.setItem("carrito", JSON.stringify(carrito)); // cargo en storage
    };
    
    let btnPlus = document.getElementById(`btnPlus${index}`); // capturo el boton de borrar elemento de la fila
    btnPlus.onclick = () => {
        carrito[index].cantidad++;
        updateCarrito();
        localStorage.setItem("carrito", JSON.stringify(carrito));
    };

    let btnMin = document.getElementById(`btnMin${index}`); // capturo el boton de borrar elemento de la fila
    btnMin.onclick = () => {
        if(carrito[index].cantidad > 1){
            carrito[index].cantidad--;
            updateCarrito();
            localStorage.setItem("carrito", JSON.stringify(carrito));
        } else if(carrito[index].cantidad == 1){
            btnMin.setAttribute("disabled", "");
        }
    };
}

function updateCarrito(){
    tbody.innerHTML = "";
    carrito.forEach(item => crearFilaCarrito(item));
    subtotal.innerText = `$${calcSubtotal(carrito)}.-`;
    total.innerText = calcCuotas(cantCuotas(radio), calcSubtotal(carrito));
}

function calcSubtotal(arr){
    let subt = 0;
    arr.forEach(item => {
        subt += item.producto.precio * item.cantidad;
    })
    return subt;
}

function calcCuotas(cantCuotas, subtotal){
    let totalRecargo = 0
    let cuota = 0
    switch(cantCuotas){
        case "1":
            return `$${subtotal}.-`;

        case "3":
            totalRecargo = (subtotal * 1.1).toFixed(2); 
            cuota = (totalRecargo / cantCuotas).toFixed(2);
            return `$${totalRecargo}.- en ${cantCuotas} cuotas de $${cuota}.-` ;
            
        case "6":
            totalRecargo = (subtotal * 1.25).toFixed(2); 
            cuota = (totalRecargo / cantCuotas).toFixed(2);
            return `$${totalRecargo}.- en ${cantCuotas} cuotas de $${cuota}.-` ;

        case "9":
            totalRecargo = (subtotal * 1.4).toFixed(2); 
            cuota = (totalRecargo / cantCuotas).toFixed(2);
            return `$${totalRecargo}.- en ${cantCuotas} cuotas de $${cuota}.-` ;

        case "12":
            totalRecargo = (subtotal * 1.6).toFixed(2); 
            cuota = (totalRecargo / cantCuotas).toFixed(2);
            return `$${totalRecargo}.- en ${cantCuotas} cuotas de $${cuota}.-` ;
    }
}
