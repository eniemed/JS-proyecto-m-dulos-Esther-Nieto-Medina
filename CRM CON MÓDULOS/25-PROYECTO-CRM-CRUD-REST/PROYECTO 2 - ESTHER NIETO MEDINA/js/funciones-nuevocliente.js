import { DB, nombreFormulario, correoFormulario, telefonoFormulario, empresaFormulario, listaHTML } from "./app.js"
import { editarCliente } from "./funciones-editarcliente.js"


let listaClientes = []
export let clave

export function añadirClienteDataBase(e) { //esta función añade los clientes a la base de datos
    e.preventDefault()

    const transaccion = DB.transaction(["clientes"], "readwrite")
 
    const store = transaccion.objectStore("clientes")

    let objetoCliente = { //creo un objeto para guardarlo 
        nombre: nombreFormulario.value.trim(),
        email: correoFormulario.value.trim(),
        telefono: telefonoFormulario.value.trim(),
        empresa: empresaFormulario.value.trim(),
    }


    let requestAñadir = store.add(objetoCliente) //añado el objeto a la bbdd

    requestAñadir.onsuccess = function(evento) {
        console.log("Agregado con éxito")
        clave = evento.target.result //guardo su clave primaria para poder eliminarlo más adelante
        cargarClientesDesdeDB() //actualizo la lista dinámica
        
    }

    requestAñadir.onerror = function(event) {
        console.error("Error al agregar", event)
    }
    
}

export function cargarClientesDesdeDB() { //recorre la bbdd de indexeddb con un cursor y lo pasa todo a la lista. De esta manera podemos trabajar solo en la bbdd y la lista se podrá actualizar sola
    listaClientes = [] //para evitar duplicaciones, vaciamos la lista

    const transaccion = DB.transaction(["clientes"], "readonly") //abrimos una transaccion en el almacén
    const store = transaccion.objectStore("clientes")

    store.openCursor().onsuccess = function (event) { //abrimos el cursor para recorrer el almacén
        const cursor = event.target.result
        if (cursor) {
            listaClientes.push(cursor.value) //metemos los objetos en la lista
            cursor.continue()
        }
    }

    transaccion.oncomplete = function () {
        mostrarListaClientes() //cuando se termina la transacción, mostramos la lista para que se actualice
    }
}



export function eliminarCliente(e) { //elimina un cliente de la base de datos y de la lista
    
    e.preventDefault()

    const transaccion = DB.transaction(["clientes"], "readwrite") //abrimos transacción en el almacén
    const objectStore = transaccion.objectStore("clientes")

    const deleteRequest = objectStore.delete(parseInt(clave)) //borramos elemento por clave

    deleteRequest.onsuccess = function(event) {
        console.log("Cliente eliminado correctamente")
        e.target.parentElement.parentElement.remove()
    }

    deleteRequest.onerror = function(event) {
        console.error("Error al eliminar el cliente: ", event.target.errorCode)
    }

    console.log("borrando...")
    const claveEmail = e.target.getAttribute("data-id") //recuperamos el email para usarlo de clave de borrado en la lista

    listaClientes = listaClientes.filter((cliente) => cliente.email !== claveEmail) //filtrado por email
}



export function mostrarListaClientes() { //crea la lista al vuelo con los botones de eliminar y editar correspondientes. Añade los valores a cada celda para que se muestre correctamnente

    const botonEliminar = document.createElement("button")
    const botonEditar = document.createElement("button")
    const tr1 = document.createElement("tr")
    const tr2 = document.createElement("tr")
    const celda1 = document.createElement("td")
    const celda2 = document.createElement("td")
    const celda3 = document.createElement("td")
    const celda4 = document.createElement("td")
    const celda5 = document.createElement("td")
    const celda6 = document.createElement("td")

    botonEliminar.textContent = "ELIMINAR"
    botonEditar.textContent = "EDITAR"

    celda5.appendChild(botonEditar)
    celda6.appendChild(botonEliminar)

    tr2.appendChild(celda5)
    tr2.appendChild(celda6)

    listaClientes.forEach((elemento) => {
        celda1.textContent = elemento.nombre
        celda2.textContent = elemento.email
        celda3.textContent = elemento.telefono
        celda4.textContent = elemento.empresa
        botonEditar.classList.add("esquinas-redondeadas", "boton-editar") //clases que he creado para hacer los botones más atractivos
        botonEliminar.classList.add("esquinas-redondeadas", "boton-eliminar")
        
        botonEliminar.setAttribute("data-id", elemento.email) //almaceno el email para usarlo como clave del objeto a borrar de la lista, ya que el email es único (al igual que el telefono)
    })
    
    tr1.appendChild(celda1)
    tr1.appendChild(celda2)
    tr1.appendChild(celda3)
    tr1.appendChild(celda4)
    tr1.appendChild(tr2)

    listaHTML.appendChild(tr1)

    botonEditar.addEventListener("click", editarCliente)
    botonEliminar.addEventListener("click", eliminarCliente)
}