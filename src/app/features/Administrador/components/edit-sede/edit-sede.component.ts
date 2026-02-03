import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-edit-sede',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './edit-sede.component.html',
    styleUrl: './edit-sede.component.scss'
})
export class EditSedeComponent {
    @Input() isOpen = false;
    @Input() sede: any = null;
    @Output() close = new EventEmitter<void>();

    onClose() {
        this.close.emit();
    }
}
