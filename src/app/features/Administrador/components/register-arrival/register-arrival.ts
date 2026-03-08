// rutas=darwin
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QueueManagementService, DriverQueueInfo } from '../../services/queue-management.service';

@Component({
    selector: 'app-register-arrival',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './register-arrival.html',
    styleUrls: ['./register-arrival.scss']
})
export class RegisterArrival {
    @Input() isOpen = false;
    @Output() close = new EventEmitter<void>();
    @Output() confirm = new EventEmitter<string>();

    driverDni: string = '';
    driverInfo: DriverQueueInfo | null = null;
    errorMessage: string = '';
    isLoadingInfo: boolean = false;
    isSubmitting: boolean = false;

    private searchTimeout: any;

    constructor(private queueService: QueueManagementService) { }

    onDniInput(event: any): void {
        const value = event.target.value;
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
        this.errorMessage = '';
        this.driverInfo = null;

        if (value && value.length === 8) {
            this.isLoadingInfo = true;
            this.searchTimeout = setTimeout(() => {
                this.queueService.getDriverQueueInfo(value).subscribe({
                    next: (info) => {
                        this.driverInfo = info;
                        this.isLoadingInfo = false;
                    },
                    error: (err) => {
                        this.errorMessage = err.error || 'Chofer no encontrado.';
                        this.driverInfo = null;
                        this.isLoadingInfo = false;
                    }
                });
            }, 500);
        }
    }

    onConfirm(): void {
        if (this.driverDni && this.driverInfo) {
            this.confirm.emit(this.driverDni);
            this.driverDni = '';
            this.driverInfo = null;
        }
    }

    onClose(): void {
        this.driverDni = '';
        this.driverInfo = null;
        this.errorMessage = '';
        this.close.emit();
    }
}
