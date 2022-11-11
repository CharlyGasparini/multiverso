let stock = [];
let carrito = [];
// capturo los elementos del DOM
let btnVaciar = document.getElementById("btnVaciar");
let btnCarrito = document.getElementById("btnCarrito");
let listaCarrito = document.getElementById("listaCarrito");
let bgListaCarrito = document.getElementById("bgListaCarrito");
let btnCerrarCarrito = document.getElementById("btnCerrarCarrito");
let novedades = document.getElementById("novedades");
let tbody = document.getElementById("tbody");
let badgeCantItems = document.getElementById("badgeCantItems");
let formEntrega = document.getElementById("formEntrega");
let subtotal = document.getElementById("subtotal");
let total = document.getElementById("total");
let btnIniciarCompra = document.getElementById("btnIniciarCompra");
const alertSuccess = Swal.mixin({
    icon: "success",
    title: "producto agregado al carrito",
    timer: 1000
});

cargarEventos();

setInterval(() => {
    getUsersName()
    .then(result => {
        let nombre = result[Math.floor(Math.random()*result.length)].nombre;
        let localidad = result[Math.floor(Math.random()*result.length)].localidad
        let nombreManga = stock[Math.floor(Math.random()*stock.length)].nombre;
        setTimeout(() => {
            Toastify({
                text: `${nombre} de ${localidad} ha comprado ${nombreManga}`,
                close: true,
                gravity: "bottom",
                position: "left",
                stopOnFocus: true,
                duration: 5000,
                onClick: function(){  
                    let manga = stock.find(elem => elem.nombre == nombreManga);
                    Swal.fire({
                        grow:"row",
                        showCloseButton:"true",
                        confirmButtonColor: "#3085d6",
                        confirmButtonText: `<i class='fa-solid fa-cart-shopping'></i>
                        Agregar al carrito`,
                        inputLabel: "Cantidad",
                        input: "number",
                        inputValue: "1",
                        customClass: {
                            input: "col-1 mx-auto text-center"
                        },
                        inputValidator: (value) => {
                            if(value < 1){
                                return "La cantidad ingresada no puede ser menor a 1"; 
                            }
                        },
                        html:
                        `
                        <div class="d-flex">
                            <img src="${manga.imagen}" alt="" class="img-fluid h-100 my-auto">
                            <div class ="d-flex flex-column justify-content-center p-5">
                                <h5 class="display-5 mb-3">${manga.nombre}</h5>
                                <div class="d-flex justify-content-evenly text-bg-danger p-3 my-3">
                                    <span class="me-5"><b>Autor/es: </b>${manga.autores}</span>
                                    <span><b>Volúmenes: </b>${manga.volumenes} (${manga.estado})</span>
                                    <span><b>Género: </b>${manga.genero.length != 0 ? manga.genero : "Varios" }</span>
                                </div>
                                <div>
                                    <h5 class="display-6 mb-3">Sinopsis</h5>
                                    <p>${manga.sinopsis}</p>
                                </div>
                            </div>
                        </div>
                        `
                    }).then(result => {
                        if(result.isConfirmed){
                            let duplicado = carrito.find(item => item.nombre == manga.nombre)
                            let index = carrito.indexOf(duplicado);
                            if(duplicado == undefined){
                                let item = new ItemCarrito(manga, parseInt(result.value));
                                carrito.push(item);
                                updateCarrito(carrito);
                                localStorage.setItem("carrito", JSON.stringify(carrito)); 
                                alertSuccess.fire();         
                            }else{
                                carrito[index].cantidad += parseInt(result.value);
                                updateCarrito(carrito);
                                localStorage.setItem("carrito", JSON.stringify(carrito));
                                alertSuccess.fire();   
                            }
                        }
                    })
                }
                }).showToast();
        }, 1000)
    })
},20000)

function cargarEventos () {
    document.addEventListener("DOMContentLoaded", () => {
        stock = JSON.parse(localStorage.getItem("stock")) || [];
        carrito = JSON.parse(localStorage.getItem("carrito")) || [];
        imprCartas(stock);
        updateCarrito(carrito);
    });

    novedades.addEventListener("click", (e) =>{
        if(e.target.classList.contains("btnAgregar")){
            let manga = stock[e.target.value];
            Swal.fire({
                grow:"row",
                showCloseButton:"true",
                confirmButtonColor: "#3085d6",
                confirmButtonText: `<i class='fa-solid fa-cart-shopping'></i>
                Agregar al carrito`,
                inputLabel: "Cantidad",
                input: "number",
                inputValue: "1",
                customClass: {
                    input: "col-1 mx-auto text-center"
                },
                inputValidator: (value) => {
                    if(value < 1){
                        return "La cantidad ingresada no puede ser menor a 1"; 
                    }
                },
                html:
                `
                <div class="d-flex">
                    <img src="${manga.imagen}" alt="" class="img-fluid h-100 my-auto">
                    <div class ="d-flex flex-column justify-content-center p-5">
                        <h5 class="display-5 mb-3">${manga.nombre}</h5>
                        <div class="d-flex justify-content-evenly text-bg-danger p-3 my-3">
                            <span class="me-5"><b>Autor/es: </b>${manga.autores}</span>
                            <span><b>Volúmenes: </b>${manga.volumenes} (${manga.estado})</span>
                            <span><b>Género: </b>${manga.genero.length != 0 ? manga.genero : "Varios" }</span>
                        </div>
                        <div>
                            <h5 class="display-6 mb-3">Sinopsis</h5>
                            <p>${manga.sinopsis}</p>
                        </div>
                    </div>
                </div>
                `
            }).then(result => {
                if(result.isConfirmed){
                    let duplicado = carrito.find(item => item.nombre == manga.nombre)
                    let index = carrito.indexOf(duplicado);
                    if(duplicado == undefined){
                        let item = new ItemCarrito(manga, parseInt(result.value));
                        carrito.push(item);
                        updateCarrito(carrito);
                        localStorage.setItem("carrito", JSON.stringify(carrito)); 
                        alertSuccess.fire();         
                    }else{
                        carrito[index].cantidad += parseInt(result.value);
                        updateCarrito(carrito);
                        localStorage.setItem("carrito", JSON.stringify(carrito));
                        alertSuccess.fire();   
                    }
                }
            })
        }
    })

    btnVaciar.onclick = () => {
        Swal.fire({
            icon: "warning",
            title: "¿Desea vaciar el carrito?",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, vaciar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if(result.isConfirmed) {
                carrito.splice(0, carrito.length); // borro el producto dentro del arreglo
                updateCarrito(carrito); // imprimo la tabla actualizada
                localStorage.setItem("carrito", JSON.stringify(carrito)); // cargo en storage
                Swal.fire({
                    icon: "success",
                    title: "El carrito ha sido vaciado",
                    timer: 1000,
                    confirmButtonColor: "#3085d6",
                })
            }
        })
    }

    btnCarrito.onclick = () => {
        listaCarrito.classList.remove("d-none");
        bgListaCarrito.classList.remove("d-none");        
    }

    btnCerrarCarrito.onclick = () => {
        listaCarrito.classList.add("d-none");
        bgListaCarrito.classList.add("d-none");
    }

    bgListaCarrito.onclick = () => {
        listaCarrito.classList.add("d-none");
        bgListaCarrito.classList.add("d-none");
    }

    formEntrega.addEventListener("input", (e) =>{
        calcTotal(calcSubtotal(carrito), e.target.value);
    })
}

function imprCartas(arr){
    arr.forEach(elem => {
        let index = arr.indexOf(elem);
        novedades.innerHTML += 
        `
        <div class="col">
            <div class="card text-dark border-danger">
                <img src="${elem.imagen}" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title">${elem.nombre}</h5>
                    <p class="card-text">$${elem.precio}</p>
                    <button class="btnAgregar btn btn-primary w-100" value="${index}" id="btnAgregar${index}">
                        <i class='fa-solid fa-cart-shopping'></i>
                        Agregar al carrito
                    </button>
                </div>
            </div>
        </div>
        `
        ;
    })
}

function updateCarrito(arr){
    tbody.innerHTML = "";
    arr.forEach(item => imprItem(item));
    subtotal.innerText = `$${calcSubtotal(arr)}`;
    badgeCantItems.innerText = carrito.length == 0 ? "" : carrito.length;
}

function imprItem(item){
    let index = carrito.indexOf(item); //capturo el indice del producto en el arreglo stock
    
    let tr = document.createElement("tr"); // creo la fila

    let td = document.createElement("td"); //creo una celda
    let img = document.createElement("img"); // creo tag img
    img.className = "img-thumbnail"; // le asigno una clase a img
    img.setAttribute("src", `${item.imagen}`); // le asigno valor al src de img
    td.appendChild(img); // append img dentro de la celda
    tr.appendChild(td); // append celda dentro de la fila

    td = document.createElement("td"); //creo una celda
    td.innerText = item.nombre; //asigno contenido a la celda 
    tr.appendChild(td);// append celda dentro de la fila
    
    td = document.createElement("td"); //creo una celda
    td.innerText = item.cantidad;//asigno contenido a la celda 
    tr.appendChild(td);// append celda dentro de la fila
    
    td = document.createElement("td"); //creo una celda
    td.innerText = `$${item.precio * item.cantidad}`;//asigno contenido a la celda 
    tr.appendChild(td);// append celda dentro de la fila
    
    td = document.createElement("td"); //creo una celda
    //asigno contenido a la celda
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
    
    tr.appendChild(td);// append celda dentro de la fila
    
    tbody.appendChild(tr); // append de la fila al tbody
    
    let btnDel = document.getElementById(`btnDel${index}`); // capturo el boton de borrar elemento de la fila
    btnDel.onclick = () => {
        Swal.fire({
            icon: "warning",
            title: `¿Desea borrar ${carrito[index].nombre} del carrito?`,
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, borrar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if(result.isConfirmed) {
                carrito.splice(index, 1); // borro el producto dentro del arreglo
                updateCarrito(carrito); // imprimo la tabla actualizada
                localStorage.setItem("carrito", JSON.stringify(carrito)); // cargo en storage
                Swal.fire({
                    icon: "success",
                    title: `${carrito[index].nombre} ha sido borrado`,
                    timer: 1000,
                    confirmButtonColor: "#3085d6",
                })
            }
        })
    };
    
    let btnPlus = document.getElementById(`btnPlus${index}`); // capturo el boton de borrar elemento de la fila
    btnPlus.onclick = () => {
        carrito[index].cantidad++;
        updateCarrito(carrito);
        localStorage.setItem("carrito", JSON.stringify(carrito));
    };

    let btnMin = document.getElementById(`btnMin${index}`); // capturo el boton de borrar elemento de la fila
    btnMin.onclick = () => {
        if(carrito[index].cantidad > 1){
            carrito[index].cantidad--;
            updateCarrito(carrito);
            localStorage.setItem("carrito", JSON.stringify(carrito));
        } else if(carrito[index].cantidad == 1){
            Swal.fire({
                icon: "warning",
                title: `¿Desea borrar ${carrito[index].nombre} del carrito?`,
                showCancelButton: true,
                confirmButtonColor: "#3085d6",
                cancelButtonColor: "#d33",
                confirmButtonText: "Si, borrar",
                cancelButtonText: "Cancelar",
            }).then((result) => {
                if(result.isConfirmed) {
                    carrito.splice(index, 1); // borro el producto dentro del arreglo
                    updateCarrito(carrito); // imprimo la tabla actualizada
                    localStorage.setItem("carrito", JSON.stringify(carrito)); // cargo en storage
                    Swal.fire({
                        icon: "success",
                        title: `${carrito[index].nombre} ha sido borrado`,
                        timer: 1000,
                        confirmButtonColor: "#3085d6",
                    })
                }
            })
        }
    };
}

function calcSubtotal(arr){
    let subt = 0;
    arr.forEach(item => {
        subt += item.precio * item.cantidad;
    })
    return subt;
}

function calcTotal(subt, costEntr){
    let tot = 0;
    tot += subt + parseFloat(costEntr);
    total.innerText = `$${tot}`;
}
