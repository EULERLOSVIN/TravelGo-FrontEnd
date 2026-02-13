import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlacesService } from '../../services/places.service';

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

    isLoading = false;

    constructor(private placesService: PlacesService) { }

    confirmDelete() {
        if (!this.place || this.isLoading) return;
        this.isLoading = true;

        this.placesService.delete(this.place.idPlace).subscribe({
            next: () => {
                this.close.emit();
                window.location.reload();
            },
            error: (e) => {
                console.error('Error eliminando lugar', e);
                alert('No se pudo eliminar lugar. Probablemente tenga rutas asociadas.');
                this.isLoading = false;
            },
            complete: () => this.isLoading = false
        });
    }
}
