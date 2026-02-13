import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlacesService } from '../../services/places.service';

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
        idPlace: 0,
        name: '',
        description: ''
    };

    isLoading = false;

    constructor(private placesService: PlacesService) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['placeToEdit'] && this.placeToEdit) {
            this.place = { ...this.placeToEdit };
        }
    }

    save() {
        if (this.isLoading) return;
        this.isLoading = true;

        this.placesService.update(this.place).subscribe({
            next: () => {
                this.close.emit();
                window.location.reload();
            },
            error: (e) => {
                console.error('Error editando lugar', e);
                alert('Error al editar lugar: ' + (e.error?.message || e.message));
                this.isLoading = false;
            },
            complete: () => this.isLoading = false
        });
    }
}
