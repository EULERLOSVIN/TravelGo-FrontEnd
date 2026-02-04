import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-delete-sede',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './delete-sede.component.html',
    styleUrl: './delete-sede.component.scss'
})
export class DeleteSedeComponent {
    @Input() isOpen = false;
    @Input() sede: any = null;
    @Output() close = new EventEmitter<void>();
    @Output() confirm = new EventEmitter<void>();

    // ESTADOS: 'confirm' o 'success'
    step: 'confirm' | 'success' = 'confirm';

    onClose() {
        this.close.emit();
        // Resetear estado después de cerrar (con delay para evitar parpadeo)
        setTimeout(() => {
            this.step = 'confirm';
        }, 300);
    }

    onConfirm() {
        this.confirm.emit();
        this.step = 'success';
    }
}
