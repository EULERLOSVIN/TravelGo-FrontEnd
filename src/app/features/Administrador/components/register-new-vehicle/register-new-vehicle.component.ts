/* ==================================================
   COMPONENT: REGISTER NEW VEHICLE
   ================================================== */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-register-new-vehicle',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './register-new-vehicle.component.html',
    styleUrl: './register-new-vehicle.component.scss'
})
export class RegisterNewVehicleComponent {

    @Input() isOpen = false;
    @Output() close = new EventEmitter<void>();

    vehicleData = {
        unitCode: 'U-013',
        plate: '',
        type: '',
        seats: null as number | null, // ✅ SOLO ESTO SE AGREGA
        model: '',
        driverName: '',
        status: 'active',
        soatExpiry: '',
        photos: [] as any[]
    };

    closeModal() {
        this.close.emit();
    }

    saveVehicle() {
        console.log('NUEVO VEHÍCULO LISTO:', this.vehicleData);
        this.closeModal();
    }
}