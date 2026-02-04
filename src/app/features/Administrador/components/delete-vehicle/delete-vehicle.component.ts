/* ==================================================
   COMPONENT: DELETE VEHICLE
   ================================================== */
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-delete-vehicle',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './delete-vehicle.component.html',
    styleUrl: './delete-vehicle.component.scss'
})
export class DeleteVehicleComponent {

    @Input() isOpen = false;
    @Output() close = new EventEmitter<void>();

    // STATE: 'confirm' (pregunta) | 'success' (feedback)
    step: 'confirm' | 'success' = 'confirm';

    closeModal() {
        this.close.emit();
        setTimeout(() => { this.step = 'confirm'; }, 300); // Reset state
    }

    confirmDelete() {
        // BACKEND INTEGRATION
        // this.vehiclesService.delete(...).subscribe()

        this.step = 'success';
    }
}
