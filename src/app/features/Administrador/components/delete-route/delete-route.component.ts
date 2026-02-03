/* ==================================================
   COMPONENT: DELETE ROUTE SUCCESS
   ================================================== 
   Modal de confirmación/éxito al eliminar una ruta.
   Muestra un feedback visual positivo.
*/

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-delete-route',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './delete-route.component.html',
    styleUrl: './delete-route.component.scss'
})
export class DeleteRouteComponent {

    @Input() isOpen = false;
    @Output() close = new EventEmitter<void>();

    /* ===============================
       STATE MANAGEMENT
       'confirm': Muestra pregunta "¿Estás seguro?"
       'success': Muestra mensaje "Eliminado correctamente"
    ================================ */
    step: 'confirm' | 'success' = 'confirm';

    closeModal() {
        this.close.emit();
        // Resetear al estado inicial para la próxima vez que se abra
        setTimeout(() => {
            this.step = 'confirm';
        }, 300);
    }

    /* ===============================
       ACTIONS
    ================================ */
    confirmDelete() {
        // AQUÍ IRÍA LA LLAMADA AL BACKEND
        // this.service.delete(id).subscribe(...)

        // Simulación de éxito:
        this.step = 'success';
    }
}
