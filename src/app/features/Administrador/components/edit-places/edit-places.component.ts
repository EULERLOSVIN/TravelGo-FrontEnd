import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-edit-places',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './edit-places.component.html',
    styles: []
})
export class EditPlacesComponent implements OnChanges {
    @Input() isOpen = false;
    @Input() placeToEdit: any;
    @Output() close = new EventEmitter<void>();

    place = {
        nombre: '',
        descripcion: ''
    };

    ngOnChanges(changes: SimpleChanges) {
        if (changes['placeToEdit'] && this.placeToEdit) {
            this.place = { ...this.placeToEdit };
        }
    }

    save() {
        console.log('Editando lugar:', this.place);
        this.close.emit();
    }
}
