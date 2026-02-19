// rutas=darwin
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoutesService, TravelRoute } from '../../services/routes.service';
import { PlacesService } from '../../services/places.service';

@Component({
  selector: 'app-register-new-route',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register-new-route.component.html',
  styleUrls: ['./register-new-route.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RegisterNewRouteComponent {
  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  // Variables temporales para el formulario
  origin: string = '';
  destination: string = '';

  formData: TravelRoute = {
    nameRoute: '',
    price: null as any,
    idPlaceA: null as any,
    idPlaceB: null as any,
    isActive: true
  };

  places: any[] = [];
  isLoading = false;

  constructor(private routesService: RoutesService, private placesService: PlacesService) {
    this.loadPlaces();
  }

  loadPlaces() {
    this.placesService.getAll().subscribe(data => this.places = data);
  }

  save() {
    if (this.isLoading) return;
    this.isLoading = true;

    // nameRoute se genera en backend
    this.formData.nameRoute = 'GENERANDO...';

    this.routesService.create(this.formData).subscribe({
      next: () => {
        this.close.emit();
        window.location.reload();
      },
      error: (e) => {
        console.error('Error al guardar ruta:', e);
        alert('Error: ' + (e.message || 'No se pudo conectar con el servidor.'));
        this.isLoading = false;
      },
      complete: () => this.isLoading = false
    });
  }
}
