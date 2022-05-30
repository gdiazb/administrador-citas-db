import { eliminarCita, cargarEdicion, imprimirCitasNoUI } from '../funciones.js'
import { listaCitas, alert } from '../selectores.js'

class UI {
  imprimirAlerta(message, type) {
    alert.classList.add('visible')
    alert.textContent = message
    if (type === 'error') {
      alert.classList.add('alert-danger')
    } else {
      alert.classList.add('alert-success')
    }

    setTimeout(() => {
      alert.classList.remove('visible', 'alert-danger', 'alert-success')
      alert.textContent = ''
    }, 3000)
  }

  imprimirCitas() {
    this.limpiarHTML()

    imprimirCitasNoUI()
  }

  limpiarHTML() {
    while (listaCitas.firstChild) {
      listaCitas.removeChild(listaCitas.firstChild)
    }
  }
}

export default UI
