import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-delete-person',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './delete-person.component.html',
    styleUrls: ['./delete-person.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DeletePersonComponent {
    @Input() isOpen = false;
    @Output() close = new EventEmitter<void>();

    step: 'confirm' | 'success' = 'confirm';

    closeModal() {
        this.close.emit();
        setTimeout(() => this.step = 'confirm', 300);
    }

    confirm() {
        this.step = 'success';
    }
}
