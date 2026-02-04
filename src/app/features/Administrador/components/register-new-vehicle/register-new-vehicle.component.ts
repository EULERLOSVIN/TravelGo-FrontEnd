/* ==================================================
   COMPONENT: REGISTER NEW VEHICLE
   ================================================== 
   Maneja el modal para registrar un nuevo vehículo en la flota.
*/

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-register-new-vehicle',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './register-new-vehicle.component.html',
    styleUrl: './register-new-vehicle.component.scss' // Reutilizaremos estilos o crearemos nuevos similares
})
export class RegisterNewVehicleComponent {

    @Input() isOpen = false;
    @Output() close = new EventEmitter<void>();

    // MODELO DE DATOS
    vehicleData = {
        unitCode: 'U-013', // Simulado auto-increment
        plate: '',
        type: '',          // Nuevo: Tipo de vehículo
        model: '',
        driverName: '',
        status: 'active',
        soatExpiry: '',    // Nuevo: Fecha SOAT
        photos: [] as any[] // Nuevo: Array para fotos (lógica futura)
    };

    constructor() { }

    closeModal() {
        this.close.emit();
    }

    saveVehicle() {
        /* ---------------------------------------------------------
           ZONA DE INTEGRACIÓN CON BACKEND
           (Esta parte la configura el desarrollador Backend)
           --------------------------------------------------------- */
        console.log('NUEVO VEHÍCULO LISTO:', this.vehicleData);

        // AQUÍ VA TU CÓDIGO BACKEND:
        // Ejemplo: this.vehiclesService.create(this.vehicleData).subscribe(...)

        /* --------------------------------------------------------- */

        this.closeModal();
    }
}
