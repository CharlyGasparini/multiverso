// Variables
let stock = JSON.parse(localStorage.getItem("stock")) || [];

// Captura de los elementos del DOM
let tbody = document.getElementById("tbody");
let btnVaciar = document.getElementById("btnVaciar");
let btnCargar = document.getElementById("btnCargar");
let inpSelect = document.getElementById("mangas");
let inpPrecio = document.getElementById("precio");
let inpStock = document.getElementById("stock");
let previewImg = document.getElementById("preview");

cargarEventos();
cargarOpciones();
updateStock(stock);

function cargarEventos() {

    // Evento que carga la imagen del manga cuando este se selecciona en el select
    inpSelect.oninput = () => {
        getMangaInfo()
        .then(result => {
            let index = inpSelect.value;
            if(index != "#"){
                previewImg.setAttribute("src", `${result[index][0]}`);          
            }else{
                previewImg.setAttribute("src", `${index}`);
            }
        })
    }

    // Evento que carga un producto en el stock
    btnCargar.onclick = (e) => {
        e.preventDefault();

        if(inpSelect.value != "#" && inpPrecio.value != ""){
            if(inpPrecio.value > 0){
                getMangaInfo()
                .then(result => {
                    let manga = result[inpSelect.value];
                    let duplicado = stock.find(prod => prod.nombre == manga[1]);

                    if(duplicado == undefined){
                        let id = 1;
                        if(stock.length != 0){
                            let lastID = stock[stock.length-1].id;
                            id = lastID + 1;
                        }
                        let producto = new Producto(id, inpPrecio.value, ...manga);
                        stock.push(producto);
                        imprProducto(producto);
                        localStorage.setItem("stock", JSON.stringify(stock));
                        alertSuccess.fire({
                            title: `${producto.nombre} ha sido agregado al stock`
                        });
                        inpSelect.value = "";
                        inpPrecio.value = "";
                    } else{
                        alertError.fire({      
                            title: "El producto ya esta en stock"       
                        })
                    }
                })
                
            } else {
                alertError.fire({   
                    title: "El precio no puede ser menor a $1"             
                })
            }

        } else{
            alertError.fire({
                title: "Complete los campos vacios"
            })
        }  
    }

    // Evento que vacia la tabla
    btnVaciar.onclick = () => {
        if(stock.length != 0){
            alertWarning.fire({
                title: "¿Desea vaciar el stock?"
            }).then((result) => {
                if(result.isConfirmed) {
                    stock.splice(0, stock.length); // borro el producto dentro del stockeglo
                    updateStock(stock); // imprimo la tabla actualizada
                    localStorage.setItem("stock", JSON.stringify(stock)); // cargo en storage
                    alertSuccess.fire({
                        title: "El stock ha sido vaciado",
                    })
                }
            })
        }
    }
}

// Inserta los nombres de mangas de la API como opciones de un select
function cargarOpciones(){
    getMangaInfo()
    .then(result => {    
        //inserto los nombres de los mangas como opciones del input de tipo select
        result.forEach(manga =>{
            let option = document.createElement("option");
            option.innerText = manga[1];
            option.value =  result.indexOf(manga);
            inpSelect.appendChild(option);
        })
    })
}

// Actualiza el contenido de la lista de productos cargados
function updateStock(arr){
    tbody.innerHTML = "";
    arr.forEach(prod => imprProducto(prod));
}

// Crea una fila con el producto cargado
function imprProducto(producto) {
    let index = stock.indexOf(producto); //capturo el indice del producto en el arreglo stock

    let tr = document.createElement("tr"); // creo la fila

    let td = document.createElement("td"); //creo la celda
    td.innerText = producto.id; // cargo el contenido
    tr.appendChild(td); // append de la celda en la fila    
    
    td = document.createElement("td"); //creo la celda
    td.innerText = producto.nombre; // cargo el contenido
    tr.appendChild(td); // append de la celda en la fila
    
    td = document.createElement("td"); //creo la celda
    td.innerText = `$${producto.precio}`; // cargo el contenido
    tr.appendChild(td); // append de la celda en la fila
    
    td = document.createElement("td"); //creo la celda
    td.innerHTML = 
    `
    <button class="btn btn-outline-none" id="btnDel${index}">
    <i class="fa-solid fa-trash"></i>
    </button>
    `; // cargo el contenido
    tr.appendChild(td); // append de la celda en la fila

    tbody.appendChild(tr); // append de la fila en el cuerpo de la tabla

    let btnDel = document.getElementById(`btnDel${index}`); // capturo el boton de borrar elemento de la fila
    btnDel.onclick = () => {
        Swal.fire({
            icon: "warning",
            title: `¿Desea borrar ${producto.nombre} del stock?`,
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, borrar",
            cancelButtonText: "Cancelar",
        }).then((result) => {
            if(result.isConfirmed) {
                stock.splice(index, 1); // borro el producto dentro del arreglo
                updateStock(stock); // imprimo la tabla actualizada
                localStorage.setItem("stock", JSON.stringify(stock)); // cargo en storage
                Swal.fire({
                    icon: "success",
                    title: `${producto.nombre} ha sido borrado`,
                    timer: 1000,
                    confirmButtonColor: "#3085d6",
                })
            }
        })
    };
}



