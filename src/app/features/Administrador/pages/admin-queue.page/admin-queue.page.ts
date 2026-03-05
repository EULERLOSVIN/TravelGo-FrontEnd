import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QueueManagement } from '../../services/queue-management';
import { HeadquarterContext, QueueItem, RouteFilter } from '../../models/queue.model';
import { QueueAddDriver } from '../../components/queue-add-driver/queue-add-driver';

@Component({
  selector: 'app-admin-queue-page',
  standalone: true,
  imports: [CommonModule, FormsModule, QueueAddDriver],
  templateUrl: './admin-queue.page.html',
  styleUrl: './admin-queue.page.scss'
})
export class AdminQueuePage implements OnInit {
  headquarters: HeadquarterContext[] = [];
  selectedHeadquarterId: number = 0;

  routes: RouteFilter[] = [];
  selectedRouteId: number = 0;

  queue: QueueItem[] = [];

  newDriverDni: string = '';

  constructor(private queueService: QueueManagement) { }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.queueService.getHeadquarters().subscribe(hqs => {
      this.headquarters = hqs;
      if (hqs.length > 0) {
        this.selectedHeadquarterId = hqs[0].idHeadquarter;
        this.loadRoutesForHeadquarter();
      }
    });
  }

  loadRoutesForHeadquarter(): void {
    this.queueService.getRoutesByHeadquarter(this.selectedHeadquarterId).subscribe(rts => {
      this.routes = rts;
      if (rts.length > 0) {
        this.selectedRouteId = rts[0].idRoute;
        this.loadQueue();
      } else {
        this.queue = [];
      }
    });
  }

  onHeadquarterChange(): void {
    this.loadRoutesForHeadquarter();
  }

  onRouteSelect(idRoute: number): void {
    this.selectedRouteId = idRoute;
    this.loadQueue();
  }

  loadQueue(): void {
    if (this.selectedHeadquarterId && this.selectedRouteId) {
      this.queueService.getQueue(this.selectedHeadquarterId, this.selectedRouteId).subscribe(q => {
        this.queue = q;
      });
    }
  }

  registerDriver(): void {
    if (!this.newDriverDni || this.newDriverDni.length < 8) {
      alert('Por favor ingrese un DNI válido.');
      return;
    }

    this.queueService.addDriverToQueue(this.newDriverDni, this.selectedRouteId).subscribe(() => {
      this.newDriverDni = '';
      this.loadQueue(); // Refresh list automatically
      this.loadRoutesForHeadquarter();
    });
  }

  removeDriver(idQueue: number): void {
    if (confirm('¿Está seguro de que desea quitar a este conductor de la cola?')) {
      this.queueService.removeDriverFromQueue(idQueue).subscribe(() => {
        this.loadQueue();
        this.loadRoutesForHeadquarter();
      });
    }
  }

  assignRoute(idQueue: number): void {
    alert(`Ruta y Vehículo asignados para el item ${idQueue} (En desarrollo)`);
  }

  registerDriverFromComponent(dni: string): void {
    this.newDriverDni = dni;
    this.registerDriver();
  }
}
