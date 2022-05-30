import { gestionarDatosCita, crearNuevaCita, crearDB } from '../funciones.js'
import {
  inputMascota,
  inputPropietario,
  inputTelefono,
  inputFecha,
  inputHora,
  inputSintomas,
  formulario,
} from '../selectores.js'

class App {
  constructor() {
    this.initApp()
  }

  initApp() {
    window.onload = () => {
      //Event listeners
      eventListeners()
      crearDB()
    }

    function eventListeners() {
      inputMascota.addEventListener('change', gestionarDatosCita)
      inputPropietario.addEventListener('change', gestionarDatosCita)
      inputTelefono.addEventListener('change', gestionarDatosCita)
      inputFecha.addEventListener('change', gestionarDatosCita)
      inputHora.addEventListener('change', gestionarDatosCita)
      inputSintomas.addEventListener('change', gestionarDatosCita)
      formulario.addEventListener('submit', crearNuevaCita)
    }
  }
}

export default App
