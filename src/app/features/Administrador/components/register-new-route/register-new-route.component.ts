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

  // Horarios de Salida
  departureTimes: string[] = []; // Array de strings "HH:mm"
  newTime: string = '';

  constructor(private routesService: RoutesService, private placesService: PlacesService) {
    this.loadPlaces();
  }

  loadPlaces() {
    this.placesService.getAll().subscribe(data => this.places = data);
  }

  addTime() {
    if (this.newTime && !this.departureTimes.includes(this.newTime)) {
      this.departureTimes.push(this.newTime);
      this.departureTimes.sort(); // Ordenar del más temprano al más tarde
      this.newTime = '';
    }
  }

  removeTime(index: number) {
    this.departureTimes.splice(index, 1);
  }

  save() {
    if (this.isLoading) return;
    this.isLoading = true;

    // nameRoute se genera en backend
    this.formData.nameRoute = 'GENERANDO...';

    this.routesService.create(this.formData).subscribe({
      next: (createdRouteId) => {
        // Si hay horarios, guardarlos 1 por 1
        if (this.departureTimes.length > 0) {
          const timePromises = this.departureTimes.map(time => {
            // Formateamos "14:30" => "14:30:00" para coincidir con TimeOnly en C#
            return this.routesService.addDepartureTime({
              idTravelRoute: createdRouteId,
              hour: time + ':00'
            }).toPromise();
          });

          Promise.all(timePromises).then(() => {
            this.close.emit();
            window.location.reload();
          }).catch(e => {
            console.error('Error guardando horarios:', e);
            // Aún así recargamos para mostrar la ruta creada
            this.close.emit();
            window.location.reload();
          });
        } else {
          // No hay horarios, simplemente cerrar
          this.close.emit();
          window.location.reload();
        }
      },
      error: (e) => {
        console.error('Error al guardar ruta:', e);
        alert('Error: ' + (e.message || 'No se pudo conectar con el servidor.'));
        this.isLoading = false;
      }
    });
  }
}
