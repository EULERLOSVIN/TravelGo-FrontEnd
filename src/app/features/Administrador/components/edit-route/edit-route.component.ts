// rutas=darwin
import { Component, EventEmitter, Input, Output, ViewEncapsulation, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoutesService, TravelRoute } from '../../services/routes.service';

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

    isLoading = false;

    constructor(private routesService: RoutesService) { }

    ngOnChanges(changes: SimpleChanges) {
        if (changes['routeToEdit'] && this.routeToEdit) {
            // Separar nombre "Origen - Destino"
            const parts = this.routeToEdit.nameRoute.split('-');
            this.origin = parts[0]?.trim() || '';
            this.destination = parts[1]?.trim() || '';
        }
    }

    save() {
        if (!this.routeToEdit || this.isLoading) return;
        this.isLoading = true;

        this.routeToEdit.nameRoute = `${this.origin} - ${this.destination}`;

        this.routesService.update(this.routeToEdit).subscribe({
            next: () => {
                this.close.emit();
                window.location.reload();
            },
            error: (e) => {
                console.error('Error al editar', e);
                alert('Error al editar: ' + (e.error?.message || e.message || 'Revise la consola'));
                this.isLoading = false;
            },
            complete: () => this.isLoading = false
        });
    }
}
