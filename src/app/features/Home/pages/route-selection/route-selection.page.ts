import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-route-selection',
  imports: [RouterLink],
  templateUrl: './route-selection.page.html',
  styleUrl: './route-selection.page.scss',
})
export class RouteSelectionPage {
  origen = '';
  destino = '';
  fecha = '';

  horarios: string[] = [
    '8:00am ',
    '11:00am ',
    '2:00pm ',
    '5:00pm ',
  ];

  horarioSeleccionado: string | null = null;
  reservaIntentada = false;

  whatsappUrl!: string;

  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(params => {
      this.origen = params.get('origen') ?? '';
      this.destino = params.get('destino') ?? '';
      this.fecha = params.get('fecha') ?? '';
    });

    const phone = '51948287543';
    const message = `Hola TravelGo, quiero cotizar un viaje privado.
      Origen: ${this.origen}
      Destino: ${this.destino}
      Fecha: ${this.fecha}
      Pasajeros:`;

    this.whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  }

  selectHorario(h: string): void {
    this.horarioSeleccionado = h;
    this.reservaIntentada = false;
  }

  onReservar(event: Event): void {
    if (!this.horarioSeleccionado) {
      event.preventDefault();
      event.stopPropagation();
      this.reservaIntentada = true;
    }
  }
}
