// ELEMENTOS DE DOM
let nombreProd = document.getElementById("inputNombre");
let catProd = document.getElementById("inputCategoria");
let precioProd = document.getElementById("inputPrecio");
let imgProd = document.getElementById("inputImg");
let previewImg = document.getElementById("previewImg");
let btnAdd = document.getElementById("btnAdd");
let successMsj = document.getElementById("successMsj");
let btnEnviar = document.getElementById("btnEnviar");
let tbody = document.getElementById("tbody");

// VARIABLES
const stock = (localStorage.hasOwnProperty("stock")) ? JSON.parse(localStorage.getItem("stock")) : [];
stock.forEach(producto => renderStock(producto));

// EVENTOS
imgProd.oninput = () => {
    previewImg.setAttribute("src", `${imgProd.value}`);
}

btnAdd.onclick = (e) => {
    e.preventDefault();
    let duplicado = stock.find(producto => producto.nombre == nombreProd.value); // verifico que el producto no esté ya en stock
    if(duplicado == undefined){
        let producto = new Producto(nombreProd.value,catProd.value,parseFloat(precioProd.value),imgProd.value); //creo objeto Producto
        stock.push(producto); // pusheo el nuevo objeto
        renderStock(producto);
        localStorage.setItem("stock", JSON.stringify(stock)); // cargo en storage
        // Muestro mensaje en pantalla
        successMsj.innerText = "El producto se cargó con éxito";
        successMsj.className = "text-success";
        // limpio los campos 
        nombreProd.value = "";
        precioProd.value = "";
        imgProd.value = "";
    }else{
        // Muestro mensaje en pantalla
        successMsj.innerText = "El producto ya esta en el stock";
        successMsj.className = "text-danger";
    }
}

// FUNCIONES
function Producto(nombre,categoria,precio,imagen){
    this.nombre = nombre;
    this.categoria = categoria;
    this.precio = precio;
    this.imagen = imagen;
}

function renderStock(producto) {
    let index = stock.indexOf(producto); //capturo el indice del producto en el arreglo stock

    let tr = document.createElement("tr"); // creo la fila

    let td = document.createElement("td"); //creo la celda
    td.innerText = index+1; // cargo el contenido
    tr.appendChild(td); // append de la celda en la fila    
    
    td = document.createElement("td"); //creo la celda
    td.innerText = producto.nombre; // cargo el contenido
    tr.appendChild(td); // append de la celda en la fila
    
    td = document.createElement("td"); //creo la celda
    td.innerText = producto.categoria; // cargo el contenido
    tr.appendChild(td); // append de la celda en la fila
    
    td = document.createElement("td"); //creo la celda
    td.innerText = `$${producto.precio}.-`; // cargo el contenido
    tr.appendChild(td); // append de la celda en la fila
    
    td = document.createElement("td"); //creo la celda
    td.innerHTML = 
    `<button class="btn btn-outline-none" id="btnDel${index}">
        <i class="fa-solid fa-trash"></i>
    </button>
    <button class="btn btn-outline-none" id="btnEdit${index}">
        <i class="fa-solid fa-pencil"></i>
    </button>
    `; // cargo el contenido
    tr.appendChild(td); // append de la celda en la fila

    tbody.appendChild(tr); // append de la fila en el cuerpo de la tabla

    let btnDel = document.getElementById(`btnDel${index}`); // capturo el boton de borrar elemento de la fila
    btnDel.onclick = () => {
        stock.splice(index, 1); // borro el producto dentro del arreglo
        // imprimo la tabla actualizada
        tbody.innerHTML = "";
        stock.forEach(producto => {
        renderStock(producto);
        });
        localStorage.setItem("stock", JSON.stringify(stock)); // cargo en storage
    };
}