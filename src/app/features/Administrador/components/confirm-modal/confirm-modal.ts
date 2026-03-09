import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-confirm-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './confirm-modal.html',
    styleUrls: ['./confirm-modal.scss']
})
export class ConfirmModal {
    @Input() isOpen = false;
    @Input() title = '¿Estás seguro?';
    @Input() message = 'Esta acción no se puede deshacer.';
    @Input() confirmText = 'Confirmar';
    @Input() cancelText = 'Cancelar';
    @Input() type: 'danger' | 'primary' | 'warning' = 'primary';

    @Output() confirm = new EventEmitter<void>();
    @Output() close = new EventEmitter<void>();

    onConfirm() {
        this.confirm.emit();
    }

    onClose() {
        this.close.emit();
    }
}
