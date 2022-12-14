// Variables
let stock = JSON.parse(localStorage.getItem("stock")) || [];
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let tipoEntrega;
let costoEntrega;

// Captura los elementos del DOM
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

cargarEventos();
cargarToastsCompras();
imprCartas(stock);
updateCarrito(carrito);


function cargarEventos () {

    // Evento que crea y agrega un item al carrito en cuanto se hace click sobre el boton de agregar al carrito
    novedades.addEventListener("click", (e) =>{
        if(e.target.classList.contains("btnAgregar")){
            let manga = stock[e.target.value];
            alertAgregar.fire({
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
                        alertSuccess.fire({
                            title: `${item.nombre} ha sido agregado al carrito`
                        });         
                    }else{
                        carrito[index].cantidad += parseInt(result.value);
                        updateCarrito(carrito);
                        localStorage.setItem("carrito", JSON.stringify(carrito));
                        alertSuccess.fire({
                            title: `${carrito[index].nombre} ha sido agregado al carrito`
                        });  
                    }
                }
            })
        }
    })

    // Evento que vacia el carrito
    btnVaciar.onclick = () => {
        if(carrito.length != 0){
            alertWarning.fire({
                title: "¿Desea vaciar el carrito?"
            }).then((result) => {
                if(result.isConfirmed) {
                    carrito.splice(0, carrito.length); // borro el producto dentro del arreglo
                    updateCarrito(carrito); // imprimo la tabla actualizada
                    localStorage.setItem("carrito", JSON.stringify(carrito)); // cargo en storage
                    alertSuccess.fire({
                        title: "El carrito ha sido vaciado",
                        timer: 1000,
                    })
                }
            })
        }
    }

    // Evento que despliega la tabla del carrito de compras
    btnCarrito.onclick = () => {
        listaCarrito.classList.remove("d-none");
        bgListaCarrito.classList.remove("d-none");        
    }

    // Evento que colapsa la tabla del carrito de compras
    btnCerrarCarrito.onclick = () => {
        listaCarrito.classList.add("d-none");
        bgListaCarrito.classList.add("d-none");
    }

    //Evento que permite que al cliquear fuera de la tabla del carrito cuando este esta desplegado, tambien colapse
    bgListaCarrito.onclick = () => {
        listaCarrito.classList.add("d-none");
        bgListaCarrito.classList.add("d-none");
    }

    // Evento que permite al carrito calcular el total de la compra una vez elegido el metodo de entrega
    formEntrega.addEventListener("input", (e) =>{
        tipoEntrega = e.target.value;
        switch(e.target.value){
            case "local":
                costoEntrega = 0;
                break;
            case "domicilio":
                costoEntrega = 750;
                break;
            case "correo":
                costoEntrega = 400;
                break;
        }
        updateCarrito(carrito);
    })

    // Evento que evalua si se puede hacer la compra y crea el pedido
    btnIniciarCompra.onclick = () =>{
        if(carrito.length != 0){
            if(tipoEntrega != undefined){
                let pedido = new Pedido(carrito, tipoEntrega);
                localStorage.setItem("pedido", JSON.stringify(pedido));
                alertSuccess.fire({
                    title: "El pedido fue realizado con éxito"
                })
            }else{
                alertError.fire({
                    title: "No se definió el tipo de entrega"
                })
            }
        } else{
            alertError.fire({
                title: "El carrito está vacio"
            })
        }
    } 
}

// Carga los toast de compras
function cargarToastsCompras() {
    setInterval(() => {
        getUsuario()
        .then(result => {
            let nombre = result[Math.floor(Math.random()*result.length)].nombre;
            let localidad = result[Math.floor(Math.random()*result.length)].localidad
            let nombreManga = stock[Math.floor(Math.random()*stock.length)].nombre;
            setTimeout(() => {
                Toastify({
                    text: `${nombre.toUpperCase()} desde la ciudad de ${localidad.toUpperCase()} ha comprado ${nombreManga.toUpperCase()}`,
                    close: true,
                    gravity: "bottom",
                    position: "left",
                    stopOnFocus: true,
                    duration: 5000,
                    onClick: function(){  
                        let manga = stock.find(elem => elem.nombre == nombreManga);
                        alertAgregar.fire({
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
                                    alertSuccess.fire({
                                        title: `${item.nombre} ha sido agregado al carrito`
                                    });          
                                }else{
                                    carrito[index].cantidad += parseInt(result.value);
                                    updateCarrito(carrito);
                                    localStorage.setItem("carrito", JSON.stringify(carrito));
                                    alertSuccess.fire({
                                        title: `${carrito[index].nombre} ha sido agregado al carrito`
                                    });    
                                }
                            }
                        })
                    }
                    }).showToast();
            }, 1000)
        })
    },30000)
}

// Imprime las cartas de productos
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

// Actualiza el contenido del carrito
function updateCarrito(arr){
    tbody.innerHTML = "";
    arr.forEach(item => imprItem(item));
    subtotal.innerText = `$${calcSubtotal(arr)}`;
    total.innerText = `$${calcTotal(calcSubtotal(arr), costoEntrega == undefined ? 0 : costoEntrega)}`;
    badgeCantItems.innerText = arr.length == 0 ? "" : cantTotalItems(arr);
}

// Calcula la cantidad total de productos en el carrito
function cantTotalItems(arr) {
    let cantTotal = 0;
    arr.forEach(item => {
        cantTotal += item.cantidad;
    })
    return cantTotal;
}

// Crea la fila del carrito con los datos del producto ingresado
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
        alertWarning.fire({
            title: `¿Desea borrar ${carrito[index].nombre} del carrito?`
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
            alertWarning.fire({
                title: `¿Desea borrar ${carrito[index].nombre} del carrito?`
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

// Calcula el subtotal de la compra
function calcSubtotal(arr){
    let subt = 0;
    arr.forEach(item => {
        subt += item.precio * item.cantidad;
    })
    return subt;
}

// Calcula el total de la compra teniendo en cuenta el costo del envio
function calcTotal(subt, costEntr){
    let tot = 0;
    tot += subt + parseFloat(costEntr);
    return tot;
}
