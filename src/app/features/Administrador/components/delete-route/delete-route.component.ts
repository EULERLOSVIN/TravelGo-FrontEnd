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
            next: (success) => {
                if (success) {
                    alert('Ruta eliminada (desactivada) correctamente.');
                    this.close.emit();
                    window.location.reload();
                } else {
                    alert('No se pudo desactivar la ruta. Es posible que el registro ya no exista.');
                    this.isLoading = false;
                }
            },
            error: (e) => {
                console.error('Error al eliminar', e);
                const msg = e.error?.message || e.message || 'Error desconocido';
                alert('Error al procesar la solicitud: ' + msg);
                this.isLoading = false;
            }
        });
    }
}
