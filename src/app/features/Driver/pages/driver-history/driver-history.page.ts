import { Component } from '@angular/core';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-driver-history.page',
  imports: [NgClass],
  templateUrl: './driver-history.page.html',
  styleUrl: './driver-history.page.scss',
})
export class DriverHistoryPage {

  listFilters = [
    { id: 1, label: 'Hoy', value: 'today' },
    { id: 2, label: 'Hace 1 semana', value: '1_week' },
    { id: 3, label: 'Hace 2 semanas', value: '2_weeks' },
    { id: 4, label: 'Hace 3 semanas', value: '3_weeks' },
    { id: 5, label: 'Hace 1 mes', value: '1_month' }
  ];

  listRoute = [
    { id: 1, nameRoute: 'HUÁNUCO - TINGO MARIA', passengers: '4', state: 'Completado', fecha: '2026-02-17' },
    { id: 2, nameRoute: 'JUANJUI - LIMA', passengers: '4', state: 'En Ruta', fecha: '2026-02-17' },
    { id: 3, nameRoute: 'PUCALLPA - TOCACHE', passengers: '4', state: 'Cancelado', fecha: '2026-02-17' },
    { id: 4, nameRoute: 'TARAPOTO - TINGO MARIA', passengers: '4', state: 'Completado', fecha: '2026-02-17' }
  ];

  getBadgeClass(state: string) {
    switch (state) {
      case 'Completado': return 'bg-success';
      case 'En Ruta': return 'bg-primary';
      case 'Cancelado': return 'bg-danger';
      default: return 'bg-secondary';

    }
  }
}
