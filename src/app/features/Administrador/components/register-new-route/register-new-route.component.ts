// rutas=darwin
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RoutesService, TravelRoute } from '../../services/routes.service';

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
    price: 0,
    idPlaceA: 1, // Valor por defecto
    idPlaceB: 2  // Valor por defecto
  };

  isLoading = false;

  constructor(private routesService: RoutesService) { }

  save() {
    if (this.isLoading) return;
    this.isLoading = true;

    // Concatenamos Origen y Destino para crear el nombre de la ruta
    this.formData.nameRoute = `${this.origin} - ${this.destination}`;

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
