import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoutesService } from '../../services/routes.service';

@Component({
    selector: 'app-delete-route',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './delete-route.component.html',
    styleUrls: ['./delete-route.component.scss']
})
export class DeleteRouteComponent {
    @Input() isOpen = false;
    @Input() route: any = null;
    @Output() close = new EventEmitter<void>();

    isLoading = false;

    constructor(private routesService: RoutesService) { }

    confirmDelete() {
        if (!this.route || this.isLoading) return;
        this.isLoading = true;

        this.routesService.delete(this.route.idTravelRoute).subscribe({
            next: () => {
                this.close.emit();
                window.location.reload();
            },
            error: (e) => {
                console.error('Error al eliminar', e);
                alert('No se pudo eliminar. \n\nCausa probable: La ruta tiene historial (Tickets o Asignaciones) y no puede ser borrada.');
                this.isLoading = false;
            },
            complete: () => this.isLoading = false
        });
    }
}
