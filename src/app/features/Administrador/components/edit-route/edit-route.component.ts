/* ==================================================
   COMPONENT: EDIT ROUTE
   ================================================== 
   Este componente maneja el modal para EDITAR una ruta existente.
   Recibe los datos de la ruta seleccionada para pre-llenar el formulario.
*/

import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-edit-route',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './edit-route.component.html',
    styleUrl: './edit-route.component.scss'
})
export class EditRouteComponent implements OnChanges {

    /* ===============================
       1. INPUTS & OUTPUTS
    ================================ */
    @Input() isOpen = false;
    @Input() routeToEdit: any = null; // Datos de la ruta a editar (recibidos del padre)

    @Output() close = new EventEmitter<void>();

    /* ===============================
       2. FORM STATE
    ================================ */
    // Copia local para editar sin modificar directamente la tabla hasta guardar
    formData = {
        origin: '',
        destination: '',
        time: null,
        price: null,
        status: 'active'
    };

    constructor() { }

    /* ===============================
       3. LIFECYCLE HOOKS
    ================================ */
    // Detecta cambios en los Inputs (cuando se abre modal con nueva ruta)
    ngOnChanges(changes: SimpleChanges) {
        if (changes['routeToEdit'] && this.routeToEdit) {
            // Crear una copia para no mutar el objeto original por referencia
            this.formData = { ...this.routeToEdit };
        }
    }

    /* ===============================
       4. ACTIONS
    ================================ */

    closeModal() {
        this.close.emit();
    }

    updateRoute() {
        /* ---------------------------------------------------------
           ZONA DE INTEGRACIÓN CON BACKEND
           (Esta parte la configura el desarrollador Backend)
           --------------------------------------------------------- */
        console.log('DATOS ACTUALIZADOS LISTOS PARA ENVIAR:', this.formData);

        // AQUÍ VA TU CÓDIGO BACKEND:
        // Ejemplo: this.routesService.update(this.formData.id, this.formData).subscribe(...)

        /* --------------------------------------------------------- */

        this.closeModal();
    }
}
