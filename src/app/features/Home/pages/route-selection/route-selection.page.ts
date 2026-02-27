import { Component, signal, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CommonModule, DecimalPipe } from '@angular/common';
import { RouteInformationModel, DepartureTimeByQueueModel } from '../../models/route-information.model';
import { SearchRouteService } from '../../services/search-route.service';
import { Result } from '../../../../shared/models/result.model';

@Component({
  selector: 'app-route-selection',
  standalone: true,
  imports: [CommonModule, RouterLink, DecimalPipe],
  templateUrl: './route-selection.page.html',
  styleUrl: './route-selection.page.scss',
})
export class RouteSelectionPage implements OnInit {

  routeData = signal<RouteInformationModel | null>(null);
  loading = signal(false);
  horarioSeleccionado = signal<DepartureTimeByQueueModel | null>(null);

  reservaIntentada = false;
  whatsappUrl: string = 'https://wa.me/51917639285';

  constructor(
    private route: ActivatedRoute,
    private searchRoute: SearchRouteService
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const idOrigin = params['from'];
      const idDestination = params['to'];
      const day = params['day'] !== undefined ? Number(params['day']) : 0;

      if (idOrigin && idDestination) {
        this.GetRoute(Number(idOrigin), Number(idDestination), day);
      }
    });
  }

  selectHorario(h: DepartureTimeByQueueModel): void {
    this.horarioSeleccionado.set(h);
    this.reservaIntentada = false;
  }

  onReservar(event: Event): void {
    this.reservaIntentada = true;
    if (!this.horarioSeleccionado() || !this.horarioSeleccionado()?.vehicle) {
      event.preventDefault();
    }
  }

  GetRoute(idOrigin: number, idDestination: number, dayOption: number) {
    this.loading.set(true);

    // CORRECCIÓN: Enviamos los 3 parámetros al servicio
    this.searchRoute.searcRoute(idOrigin, idDestination, dayOption).subscribe({
      next: (response: Result<RouteInformationModel>) => {
        if (response.isSuccess && response.value) {
          this.routeData.set(response.value);

          const primerTurno = response.value.departureHour.find(h => h.vehicle !== null);
          if (primerTurno) {
            this.horarioSeleccionado.set(primerTurno);
          } else {
            this.horarioSeleccionado.set(null);
          }
        } else {
          console.error('Error del servidor:', response.errorMessage);
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error de conexión:', err);
        this.loading.set(false);
      }
    });
  }
}