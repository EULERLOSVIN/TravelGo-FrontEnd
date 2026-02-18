// rutas=darwin
import { Component, EventEmitter, Input, Output, ViewEncapsulation, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoutesService, TravelRoute } from '../../services/routes.service';
import { PlacesService } from '../../services/places.service';

@Component({
    selector: 'app-edit-route',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './edit-route.component.html',
    styleUrls: ['./edit-route.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditRouteComponent implements OnChanges {
    @Input() isOpen = false;
    @Input() routeToEdit: TravelRoute | null = null;
    @Output() close = new EventEmitter<void>();

    origin: string = '';
    destination: string = '';

    places: any[] = [];
    isLoading = false;

    constructor(private routesService: RoutesService, private placesService: PlacesService) {
        this.loadPlaces();
    }

    loadPlaces() {
        this.placesService.getAll().subscribe(data => this.places = data);
    }

    ngOnChanges(changes: SimpleChanges) {
        // No necesitamos hacer nada especial aquí ahora, el objeto se pasa por referencia
    }

    save() {
        if (!this.routeToEdit || this.isLoading) return;
        this.isLoading = true;

        // nameRoute se regenera en backend
        this.routesService.update(this.routeToEdit).subscribe({
            next: () => {
                this.close.emit();
                window.location.reload();
            },
            error: (e) => {
                console.error('Error al editar', e);
                alert('Error al editar: ' + (e.error?.message || e.message));
                this.isLoading = false;
            },
            complete: () => this.isLoading = false
        });
    }
}
