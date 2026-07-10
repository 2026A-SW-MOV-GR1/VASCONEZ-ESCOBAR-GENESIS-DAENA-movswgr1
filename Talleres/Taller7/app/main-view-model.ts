import { Observable, ApplicationSettings } from '@nativescript/core'

export class CounterViewModel extends Observable {
  private _counter: number

  constructor() {
    super()

    // LECTURA DEL ESTADO Y PERSISTENCIA:
    // Al inicializar el ViewModel (por ejemplo, tras una rotación de pantalla o reinicio de la app),
    // se lee el valor almacenado previamente en las preferencias compartidas a través de ApplicationSettings.
    // Si no se encuentra un valor guardado (primera ejecución), se asigna el valor predeterminado de 0.
    this._counter = ApplicationSettings.getNumber('counter_value', 0)
  }

  // Obtiene el valor actual del contador para enlazarlo con la vista (data binding).
  get counter(): number {
    return this._counter
  }

  // Setter del contador con enlace de propiedades reactivo.
  // Cada vez que cambia el valor del contador:
  // 1. Se actualiza el atributo privado.
  // 2. Se dispara notifyPropertyChange para que la UI se actualice automáticamente.
  // 3. Se guarda inmediatamente el nuevo valor usando ApplicationSettings.setNumber().
  // Este enfoque evita que el contador vuelva a cero ante cambios de configuración (como la rotación de pantalla)
  // o si el sistema operativo destruye la actividad en segundo plano por falta de memoria.
  set counter(value: number) {
    if (this._counter !== value) {
      this._counter = value
      this.notifyPropertyChange('counter', value)
      ApplicationSettings.setNumber('counter_value', value)
    }
  }

  // Método que incrementa el contador en +1 al ser invocado por el evento tap del botón.
  increment() {
    this.counter++
  }
}

