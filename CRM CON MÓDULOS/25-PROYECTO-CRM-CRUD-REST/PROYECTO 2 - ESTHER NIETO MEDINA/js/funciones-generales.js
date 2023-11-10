import {DB, nombreFormulario, correoFormulario, telefonoFormulario, empresaFormulario, botonAgregar} from "./app.js"


export function desactivarBoton() { //función que desactiva el botón. Le añado la clase de transparencia para que se note que está desactivado. Le quito la animación de hover
    botonAgregar.disabled = true
    botonAgregar.classList.add("opacity-50")
    botonAgregar.classList.remove("hover:bg-teal-900")
}

export function activarBoton() { //función que activa el botón. Le quito la opacidad reducida y le añado el hover.
    botonAgregar.disabled = false
    botonAgregar.classList.remove("opacity-50")
    botonAgregar.classList.add("hover:bg-teal-900")
}

export function validarFormulario(e) { //esta función se encarga de comprobar que los valores introducidos son correctos, si no lo son muestra una alerta. Si todo es correcto activa el botón para agregar
    
    desactivarBoton()

    const nombre = nombreFormulario.value.trim()
    const email = correoFormulario.value.trim()
    const telefono = telefonoFormulario.value.trim()
    const empresa = empresaFormulario.value.trim()

    if (e.target.value.trim() === "") {
        limpiarAlerta(e.target.parentElement)
        desactivarBoton()
        mostrarAlerta(`El campo ${e.target.id} es obligatorio`, e.target.parentElement)  //para que aparezca bajo la caja que es
        comprobarEmail(email)
        comprobarTelefono(telefono)
        return
    }

    if (e.target.id === "email" && !comprobarEmail(email)) {
        mostrarAlerta("El email no es válido", e.target.parentElement)
        return
    }

    if (e.target.id === "telefono" && !comprobarTelefono(telefono)) {
        mostrarAlerta("El teléfono no es válido", e.target.parentElement)
        return
    }

    if (nombre !== "" && email !== "" && telefono !== "" && empresa !== "" && comprobarEmail(email) && comprobarTelefono(telefono)) {

        activarBoton()
    } else {
        desactivarBoton()
    }

    limpiarAlerta(e.target.parentElement) //limpio las alertas para evitar que se dupliquen

    //compruebo valores
    comprobarEmail(email)
    comprobarTelefono(telefono)
}

export function comprobarEmail(email) { //valida el email con expresión regular
    const regex = /^\w+([.-_+]?\w+)*@\w+([.-]?\w+)*(\.\w{2,10})+$/
    return regex.test(email)
}

export function comprobarTelefono(telefono) { //valida el telefono con expresión regular. Que empiece por un num de 0 a 9 y tenga 9 dígitos
    const regex = /^[0-9]\d{8}$/
    return regex.test(telefono)
}

export function mostrarAlerta(mensaje, referencia) { //tiene que recibir un mensaje para ser reutilizable, la referencia sirve para colocar la alerta bajo el campo correcto

    limpiarAlerta(referencia) //limpio las posibles alertas por si ya hay una para que la sustituya y no se acumulen

    const error = document.createElement("p")
    error.textContent = mensaje
    error.classList.add("bg-red-600", "text-center", "text-white", "p-2")
    referencia.appendChild(error) //introduzco la alerta bajo el campo correspondiente

}

export function limpiarAlerta(referencia) { //esta función eliminar la alerta si la encuentra en la referencia
    const alerta = referencia.querySelector(".bg-red-600")
    if (alerta) {
        alerta.remove()
    }
}



export function eliminarBD() { //función que elimina la bbdd y el almacén para hacer pruebas, comentado en el código
    var solicitudEliminar = indexedDB.open("miBase", 1)

    solicitudEliminar.onsuccess = function (evento) {
        DB = evento.target.result
        DB.close()

        var solicitudEliminacion = indexedDB.deleteDatabase("miBase")

        solicitudEliminacion.onsuccess = function () {
            console.log("Base de datos y almacén eliminados con éxito")
        }

        solicitudEliminacion.onerror = function () {
            console.error("Error al eliminar la base de datos y el almacén")
        }
    }

}