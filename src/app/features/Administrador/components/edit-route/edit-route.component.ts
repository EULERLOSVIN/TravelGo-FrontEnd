// rutas=darwin
import { Component, EventEmitter, Input, Output, ViewEncapsulation, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
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

    constructor(private routesService: RoutesService, private placesService: PlacesService, private cdr: ChangeDetectorRef) {
        this.loadPlaces();
    }

    loadPlaces() {
        this.placesService.getAll().subscribe(data => {
            this.places = data;
            this.cdr.detectChanges(); // Forzar actualización al cargar lugares
        });
    }

    originalRoute: TravelRoute | null = null;

    ngOnChanges(changes: SimpleChanges) {
        if (changes['routeToEdit'] && this.routeToEdit) {
            // Crear copia profunda para comparación
            this.originalRoute = JSON.parse(JSON.stringify(this.routeToEdit));
            // Forzar actualización con timeout para asegurar que el DOM esté listo
            setTimeout(() => {
                this.cdr.detectChanges();
            }, 0);
        }
    }

    hasChanges(): boolean {
        if (!this.routeToEdit || !this.originalRoute) return false;
        return this.routeToEdit.idPlaceA != this.originalRoute.idPlaceA ||
            this.routeToEdit.idPlaceB != this.originalRoute.idPlaceB ||
            this.routeToEdit.price != this.originalRoute.price ||
            this.routeToEdit.isActive != this.originalRoute.isActive;
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
