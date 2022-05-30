import Citas from './clases/Citas.js'
import UI from './clases/UI.js'
import { listaCitas } from './selectores.js'

import {
  inputMascota,
  inputPropietario,
  inputTelefono,
  inputFecha,
  inputHora,
  inputSintomas,
  formulario,
} from './selectores.js'

const ui = new UI()
const administrarCitas = new Citas()
let DB;

const citaObj = {
  id: '',
  mascota: '',
  propietario: '',
  telefono: '',
  fecha: '',
  hora: '',
  sintomas: '',
}

//modo edicion
let moodEdit = false

export function gestionarDatosCita(e) {
  citaObj[e.target.name] = e.target.value
}

export function crearNuevaCita(e) {
  e.preventDefault()
  validarForm()
}

export function validarForm() {
  const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj

  if (
    mascota === '' ||
    propietario === '' ||
    telefono === '' ||
    fecha === '' ||
    hora === '' ||
    sintomas === ''
  ) {
    ui.imprimirAlerta('Todos los campos son obligatorios', 'error')
    return
  }

  if (moodEdit) {
    administrarCitas.editarCita({ ...citaObj })
    //Cambiar texto del botón
    formulario.querySelector('button[type="submit"]').textContent = 'Crear cita'
    //Mostrar Alerta
    ui.imprimirAlerta('Se editó correctamente')
    //quitar modo edición
    moodEdit = false
  } else {
    citaObj.id = Date.now()

    administrarCitas.agregarCita({ ...citaObj })


    // INSERTAR EN LA DB

    const transaction = DB.transaction(['citas'], 'readwrite');
    const objectStore = transaction.objectStore('citas');

    objectStore.add(citaObj)

    transaction.oncomplete = () => {
      console.log('cita agregada')

      ui.imprimirAlerta('Se agregó correctamente')

    }

  }

  ui.imprimirCitas()

  reiniciarObj()

  formulario.reset()
}

export function reiniciarObj() {
  citaObj.mascota = ''
  citaObj.propietario = ''
  citaObj.telefono = ''
  citaObj.fecha = ''
  citaObj.hora = ''
  citaObj.sintomas = ''
  citaObj.id = ''
}

export function eliminarCita(id) {
  //Eliminar la cita
  administrarCitas.eliminarCita(id)
  //Mostrar mensaje de eliminado correctamente
  ui.imprimirAlerta('Eliminado correctamente')
  //Refrescar las citas
  ui.imprimirCitas()
}

export function cargarEdicion(cita) {
  const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita
  inputMascota.value = mascota
  inputPropietario.value = propietario
  inputTelefono.value = telefono
  inputFecha.value = fecha
  inputHora.value = hora
  inputSintomas.value = sintomas

  //llenar obj
  citaObj.mascota = mascota
  citaObj.propietario = propietario
  citaObj.telefono = telefono
  citaObj.fecha = fecha
  citaObj.hora = hora
  citaObj.sintomas = sintomas
  citaObj.id = id
  //Cambiar texto del botón
  formulario.querySelector('button[type="submit"]').textContent =
    'Guardar cambios'

  //setear el modo edición
  moodEdit = true
}

export function crearDB() {
  const crearDB = window.indexedDB.open('citas', 1);

  crearDB.onerror = function() {
    console.log('Hubo un error')
  }

  crearDB.onsuccess = function() {
    console.log('Creada exitosamente')

    DB = crearDB.result

    ui.imprimirCitas()

  }

  crearDB.onupgradeneeded = function(e) {
    const db = e.target.result

    const objectStorage = db.createObjectStore('citas', {
      keyPath: 'id',
      autoIncrement: true
    })

    objectStorage.createIndex('mascota', 'mascota', { unique: false })
    objectStorage.createIndex('propietario', 'propietario', { unique: false })
    objectStorage.createIndex('telefono', 'telefono', { unique: false })
    objectStorage.createIndex('fecha', 'fecha', { unique: false })
    objectStorage.createIndex('hora', 'hora', { unique: false })
    objectStorage.createIndex('sintomas', 'sintomas', { unique: false })
    objectStorage.createIndex('id', 'id', { unique: true })

    console.log('DB creada y lista')

  }

}

export function imprimirCitasNoUI() {
  const objectStore = DB.transaction('citas').objectStore('citas')

  objectStore.openCursor().onsuccess = function(e) {
    const cursor = e.target.result;

    if(cursor) {
      const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cursor.value
      const citaItem = document.createElement('li')
      citaItem.classList.add('cita', 'p-3')
      citaItem.dataset.id = id
  
      citaItem.innerHTML = `
              <h2 class="card-title font-weight-bolder">${mascota}</h2>
              <ul>
              <li><p>Propietario: <span class="ui-mascota font-weight-bolder">${propietario}</span></p></li>
              <li><p>Teléfono: <span class="ui-mascota font-weight-bolder">${telefono}</span></p></li>
              <li><p>Fecha: <span class="ui-mascota font-weight-bolder">${fecha}</span></p></li>
              <li><p>Hora: <span class="ui-mascota font-weight-bolder">${hora}</span></p></li>
              <li><p>Sintomas: <span class="ui-mascota font-weight-bolder">${sintomas}</span></p></li>
              </ul>
          `
  
      //delete btn
      const deleteBtn = document.createElement('button')
      deleteBtn.classList.add('btn', 'btn-danger', 'mr-2')
      deleteBtn.innerHTML =
        'Eliminar <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>'
      deleteBtn.onclick = () => eliminarCita(id)
  
      //edit btn
      const btnEditar = document.createElement('button')
      btnEditar.classList.add('btn', 'btn-info')
      btnEditar.innerHTML =
        'Editar <svg fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" viewBox="0 0 24 24" stroke="currentColor"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>'
      btnEditar.onclick = () => cargarEdicion(cita)
  
      //add delete btn
      citaItem.appendChild(deleteBtn)
      //add edit btn
      citaItem.appendChild(btnEditar)
      //add item
      listaCitas.appendChild(citaItem)

      cursor.continue()
    }
  }
}