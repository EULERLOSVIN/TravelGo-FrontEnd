import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouteFilter } from '../../models/queue.model';
import { QueueManagementService } from '../../services/queue-management.service';

@Component({
  selector: 'app-register-queue',
  imports: [CommonModule, FormsModule],
  templateUrl: './register-queue.html',
  styleUrl: './register-queue.scss',
})
export class RegisterQueue implements OnChanges {
  @Input() routes: RouteFilter[] = [];
  @Output() onAddQueue = new EventEmitter<{ dni: string, idTravelRoute: number }>();

  driverDni: string = '';
  driverInfo: any = null;
  selectedRouteId: number = 0;
  isLoading: boolean = false;
  searchError: string | null = null;

  constructor(private queueService: QueueManagementService) { }

  ngOnChanges(changes: SimpleChanges): void {
  }

  onDniInput(): void {
    if (this.driverDni.length >= 8) {
      this.searchDriver();
    } else {
      this.resetSearch();
    }
  }

  searchDriver(): void {
    this.isLoading = true;
    this.searchError = null;
    this.queueService.getDriverQueueInfo(this.driverDni).subscribe({
      next: (res) => {
        this.driverInfo = res;
        this.isLoading = false;
        if (this.driverInfo && this.driverInfo.assignedRoutes && this.driverInfo.assignedRoutes.length > 0) {
          this.selectedRouteId = this.driverInfo.assignedRoutes[0].idRoute;
        } else {
          this.selectedRouteId = 0;
        }
      },
      error: (err) => {
        this.driverInfo = null;
        this.isLoading = false;
        if (err.status === 404) {
          this.searchError = 'Chofer no encontrado. Verifique el DNI ingresado.';
        } else {
          this.searchError = 'Error al buscar el chofer. Inténtelo de nuevo.';
        }
      }
    });
  }

  resetSearch(): void {
    this.driverInfo = null;
    this.selectedRouteId = 0;
    this.searchError = null;
  }

  submit(): void {
    if (!this.driverInfo || !this.selectedRouteId || this.selectedRouteId === 0) {
      alert('Debe buscar un chofer validó y seleccionar una ruta de la lista.');
      return;
    }

    this.onAddQueue.emit({
      dni: this.driverDni,
      idTravelRoute: Number(this.selectedRouteId)
    });

    this.driverDni = '';
    this.resetSearch();
  }
}
