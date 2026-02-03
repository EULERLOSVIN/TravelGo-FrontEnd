import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-register-new-sede',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './register-new-sede.component.html',
    styleUrl: './register-new-sede.component.scss'
})
export class RegisterNewSedeComponent {
    @Input() isOpen = false;
    @Output() close = new EventEmitter<void>();

    onClose() {
        this.close.emit();
    }
}
