// Alert de exito
const alertSuccess = Swal.mixin({
    icon: "success",
    timer: 1000,
    confirmButtonColor: "#3085d6"
});

// Alert de advertencia
const alertWarning = Swal.mixin({
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Si, borrar",
    cancelButtonText: "Cancelar"
})

// Alert de error
const alertError = Swal.mixin({
    icon: "error",
    timer:2000,
    confirmButtonColor: "#3085d6"
})

// Alert de datos del producto
const alertAgregar = Swal.mixin({
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
    }
})