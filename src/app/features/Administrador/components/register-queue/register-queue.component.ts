import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QueueManagementService, DriverQueueInfo, RouteDto } from '../../services/queue-management.service';

@Component({
    selector: 'app-register-queue',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './register-queue.component.html',
    styleUrl: './register-queue.component.scss'
})
export class RegisterQueueComponent implements OnChanges {
    @Input() isOpen = false;
    @Output() close = new EventEmitter<void>();

    dni: string = '';
    isLoading = false;
    driverInfo: DriverQueueInfo | null = null;
    errorMessage: string = '';
    selectedRouteId: number | null = null;

    constructor(
        private queueService: QueueManagementService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['isOpen'] && !this.isOpen) {
            this.resetForm();
        }
    }

    onSearchDni(): void {
        if (this.dni.length < 8) return;

        this.isLoading = true;
        this.errorMessage = '';
        this.driverInfo = null;
        this.selectedRouteId = null;

        this.queueService.getDriverInfo(this.dni).subscribe({
            next: (info) => {
                this.driverInfo = info;
                this.isLoading = false;
                if (info.assignedRoutes && info.assignedRoutes.length > 0) {
                    this.selectedRouteId = info.assignedRoutes[0].idTravelRoute;
                }
                this.cdr.detectChanges();
            },
            error: (err) => {
                this.errorMessage = err.error?.message || 'No se encontró información para este DNI.';
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    onSubmit(): void {
        if (!this.driverInfo) return;

        this.isLoading = true;
        this.queueService.addToQueue(this.driverInfo.idVehicle).subscribe({
            next: (queueId) => {
                alert('Vehículo ingresado a cola correctamente ✅');
                this.isLoading = false;
                this.closeModal();
            },
            error: (err) => {
                this.errorMessage = err.error?.message || 'Error al ingresar a cola.';
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    closeModal(): void {
        this.close.emit();
    }

    private resetForm(): void {
        this.dni = '';
        this.driverInfo = null;
        this.errorMessage = '';
        this.selectedRouteId = null;
        this.isLoading = false;
    }
}
