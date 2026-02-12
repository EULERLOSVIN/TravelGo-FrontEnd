import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-new-places',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './new-places.component.html',
    styles: []
})
export class NewPlacesComponent {
    @Input() isOpen = false;
    @Output() close = new EventEmitter<void>();

    place = {
        nombre: '',
        descripcion: ''
    };

    save() {
        console.log('Guardando lugar:', this.place);
        this.close.emit();
    }
}
