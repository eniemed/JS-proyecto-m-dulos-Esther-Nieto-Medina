/* PROYECTO 2 - MODIFICACIÓN CON MÓDULOS. ESTHER NIETO MEDINA  2º DAW */
import {desactivarBoton, validarFormulario} from "./funciones-generales.js"
import { añadirClienteDataBase } from "./funciones-nuevocliente.js"

// SELECTORES
export const nombreFormulario = document.querySelector("#nombre")
export const correoFormulario = document.querySelector("#email")
export const telefonoFormulario = document.querySelector("#telefono")
export const empresaFormulario = document.querySelector("#empresa")

export const botonAgregar = document.querySelector("#formulario input[type='submit']")

export const listaHTML = document.querySelector("#listado-clientes")

// LISTENERS
nombreFormulario.addEventListener("blur", validarFormulario)
correoFormulario.addEventListener("blur", validarFormulario)
telefonoFormulario.addEventListener("blur", validarFormulario)
empresaFormulario.addEventListener("blur", validarFormulario)

botonAgregar.addEventListener("click", añadirClienteDataBase)

//DECLARACIONES
export let DB = "" 

//ABRIENDO BASE DE DATOS INDEXEDDB
//eliminarBD() //Uso este método para resetear todo. Lo dejo comentado y lo descomento cuando necesito borrar todo para probar cosas

const request = indexedDB.open('miBase', 1) //Abro la base de datos en su versión primera

request.onerror = () => {
    console.error("Error al abrir la base de datos")
}

request.onsuccess = (evento) => {
    console.log("Base de datos abierta")
    DB = evento.target.result //guardo la base de datos

    
}

request.onupgradeneeded = (evento) => { //onupgradeneeded le doy el valor a la bbdd, creo el almacén con clave primaria autoincrementada y creo los campos
    DB = evento.target.result
    const almacen = DB.createObjectStore("clientes", {autoIncrement: true})

    almacen.createIndex("nombre", "nombre", {unique: false})
    almacen.createIndex("email", "email", {unique: true})
    almacen.createIndex("telefono", "telefono", {unique: true})
    almacen.createIndex("empresa", "empresa", {unique: false})
}

desactivarBoton() //empiezo con el botón desactivado para eviar problemas de añadir datos vacíos. Luego lo activo con condiciones



