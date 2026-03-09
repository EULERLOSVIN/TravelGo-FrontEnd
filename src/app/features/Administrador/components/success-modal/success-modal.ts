import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-success-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './success-modal.html',
    styleUrls: ['./success-modal.scss']
})
export class SuccessModal {
    @Input() isOpen = false;
    @Input() title = '¡Éxito!';
    @Input() message = 'Operación realizada correctamente.';
    @Input() type: 'success' | 'error' | 'warning' = 'success';
    @Output() close = new EventEmitter<void>();

    onClose() {
        this.close.emit();
    }
}
