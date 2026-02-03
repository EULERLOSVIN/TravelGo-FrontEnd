/* ==================================================
   COMPONENT: EDIT VEHICLE
   ================================================== 
   Maneja el modal para EDITAR un vehículo existente.
*/

import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-edit-vehicle',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './edit-vehicle.component.html',
    styleUrl: './edit-vehicle.component.scss'
})
export class EditVehicleComponent implements OnChanges {

    @Input() isOpen = false;
    @Input() vehicleToEdit: any = null; // Datos a editar

    @Output() close = new EventEmitter<void>();

    // ESTADO LOCAL DEL FORMULARIO
    formData = {
        unitCode: '',
        plate: '',
        type: '',          // Nuevo
        model: '',
        seats: 0,
        driverName: '',
        status: 'active',
        soatExpiry: '',    // Nuevo
        photos: [] as any[] // Nuevo
    };

    constructor() { }

    // Cargar datos cuando cambia el input
    ngOnChanges(changes: SimpleChanges) {
        if (changes['vehicleToEdit'] && this.vehicleToEdit) {
            this.formData = { ...this.vehicleToEdit };
        }
    }

    closeModal() {
        this.close.emit();
    }

    updateVehicle() {
        /* ---------------------------------------------------------
           ZONA DE INTEGRACIÓN CON BACKEND
           --------------------------------------------------------- */
        console.log('DATOS ACTUALIZADOS LISTOS:', this.formData);

        // AQUÍ VA TU CÓDIGO BACKEND:
        // this.vehiclesService.update(this.formData.id, this.formData).subscribe(...)

        /* --------------------------------------------------------- */

        this.closeModal();
    }
}
