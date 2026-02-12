import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-delete-places',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './delete-places.component.html',
    styles: []
})
export class DeletePlacesComponent {
    @Input() isOpen = false;
    @Input() place: any;
    @Output() close = new EventEmitter<void>();

    confirmDelete() {
        console.log('Eliminando lugar:', this.place);
        this.close.emit();
    }
}
