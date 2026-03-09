import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
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
  @Output() onError = new EventEmitter<string>();

  driverDni: string = '';
  driverInfo: any = null;
  selectedRouteId: number = 0;
  isLoading: boolean = false;
  searchError: string | null = null;
  private searchTimeout: any;

  constructor(private queueService: QueueManagementService, private cdr: ChangeDetectorRef) { }

  ngOnChanges(changes: SimpleChanges): void {
  }

  onDniInput(): void {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    if (this.driverDni.length >= 8) {
      this.searchTimeout = setTimeout(() => {
        this.searchDriver();
      }, 300);
    } else {
      this.resetSearch();
      this.cdr.detectChanges();
    }
  }

  searchDriver(): void {
    this.isLoading = true;
    this.searchError = null;
    this.cdr.detectChanges();
    this.queueService.getDriverQueueInfo(this.driverDni).subscribe({
      next: (res) => {
        this.driverInfo = res;
        this.isLoading = false;
        if (this.driverInfo && this.driverInfo.assignedRoutes && this.driverInfo.assignedRoutes.length > 0) {
          this.selectedRouteId = this.driverInfo.assignedRoutes[0].idRoute;
        } else {
          this.selectedRouteId = 0;
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.driverInfo = null;
        this.isLoading = false;
        if (err.status === 404) {
          this.searchError = 'Chofer no encontrado. Verifique el DNI ingresado.';
        } else {
          // If the error is a string (thrown from service map), show it. 
          // Otherwise use fallback.
          this.searchError = typeof err === 'string' ? err : 'Error al buscar el chofer. Inténtelo de nuevo.';
        }
        this.cdr.detectChanges();
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
      this.onError.emit('Debe buscar un chofer válido y seleccionar una ruta de la lista.');
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
