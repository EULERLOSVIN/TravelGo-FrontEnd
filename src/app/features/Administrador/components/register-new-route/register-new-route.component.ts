/* ==================================================
   COMPONENT: REGISTER NEW ROUTE
   ================================================== 
   Este componente maneja el modal para registrar una nueva
   ruta en el sistema. Es reutilizable y flotante.
*/

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Necesario para la directiva [(ngModel)]

@Component({
  selector: 'app-register-new-route',
  standalone: true, // Componente independiente (Angular 17+)
  imports: [CommonModule, FormsModule],
  templateUrl: './register-new-route.component.html',
  styleUrl: './register-new-route.component.scss'
})
export class RegisterNewRouteComponent {

  /* ===============================
     1. INPUTS & OUTPUTS
     Comunicación con el componente padre
  ================================ */
  // Controla si el modal está visible o no
  @Input() isOpen = false;

  // Evento para notificar al padre que debe cerrar el modal
  @Output() close = new EventEmitter<void>();

  /* ===============================
     2. FORM STATE / MODELO DE DATOS
     Almacena la información del formulario
  ================================ */
  routeData = {
    origin: '',        // Ciudad de origen
    destination: '',   // Ciudad de destino
    time: null,        // Tiempo estimado en horas
    price: null,       // Precio base del pasaje
    status: 'active'   // Estado inicial: 'active' o 'inactive'
  };

  constructor() { }

  /* ===============================
     3. ACTIONS / MÉTODOS
     Lógica de negocio del componente
  ================================ */

  /**
   * Cierra el modal emitiendo el evento al padre.
   * Se usa en el botón de cerrar (X) y en "Cancelar".
   */
  closeModal() {
    this.close.emit();
  }

  /**
   * Se ejecuta al enviar el formulario (Submit).
   * Aquí iría la llamada al servicio para guardar en Backend.
   */
  saveRoute() {
    /* ---------------------------------------------------------
       ZONA DE INTEGRACIÓN CON BACKEND
       (Esta parte la configura el desarrollador Backend)
       --------------------------------------------------------- */
    console.log('DATOS LISTOS PARA ENVIAR:', this.routeData);

    // AQUÍ VA TU CÓDIGO BACKEND:
    // Ejemplo: this.routesService.create(this.routeData).subscribe(...)

    /* --------------------------------------------------------- */

    this.closeModal();
  }
}
