import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PlacesService } from '../../services/places.service';

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
        name: '',
        description: ''
    };

    isLoading = false;

    constructor(private placesService: PlacesService) { }

    save() {
        if (this.isLoading) return;
        this.isLoading = true;

        this.placesService.create(this.place).subscribe({
            next: (id) => {
                console.log('Lugar creado con ID:', id);
                this.close.emit();
                window.location.reload();
            },
            error: (e) => {
                console.error('Error creando lugar', e);
                alert('Error al crear lugar: ' + (e.error?.message || e.message));
                this.isLoading = false;
            },
            complete: () => this.isLoading = false
        });
    }
}
