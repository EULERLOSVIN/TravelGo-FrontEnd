import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QueueManagementService } from '../../services/queue-management.service';
import { HeadquarterContext, QueueItem, RouteFilter } from '../../models/queue.model';
import { RegisterQueue } from '../../components/register-queue/register-queue';
import { EditQueue } from '../../components/edit-queue/edit-queue';
import { DeleteQueue } from '../../components/delete-queue/delete-queue';
import { RegisterArrival } from '../../components/register-arrival/register-arrival';

@Component({
  selector: 'app-admin-queue-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RegisterQueue, EditQueue, DeleteQueue, RegisterArrival],
  templateUrl: './admin-queue.page.html',
  styleUrl: './admin-queue.page.scss'
})

export class AdminQueuePage implements OnInit, OnDestroy {
  headquarters: HeadquarterContext[] = [];
  selectedHeadquarterId: number = 0;

  routes: RouteFilter[] = [];
  selectedRouteId: number = 0;

  queue: QueueItem[] = [];

  // Counters for the cards
  departureCount: number = 0;
  arrivalCount: number = 0;

  newDriverDni: string = '';
  searchTerm: string = '';

  // Modal states
  modalNewDriverDni: string = '';
  modalSelectedRouteId: number = 0;

  itemToEdit: QueueItem | null = null;
  modalEditRouteId: number = 0;

  itemToDelete: QueueItem | null = null;

  // Arrival Modal State
  modalArrivalOpen: boolean = false;

  // View type logic now handled within the table filter
  viewType: 'departure' | 'arrival' = 'departure';

  private timerInterval: any;

  constructor(private queueService: QueueManagementService, private cdr: ChangeDetectorRef) { }

  get filteredQueue(): QueueItem[] {
    if (!this.searchTerm.trim()) return this.queue;

    const lowerTerm = this.searchTerm.toLowerCase().trim();
    return this.queue.filter(item =>
      item.driverFullName.toLowerCase().includes(lowerTerm) ||
      item.driverDni.includes(lowerTerm) ||
      (item.vehiclePlate && item.vehiclePlate.toLowerCase().includes(lowerTerm))
    );
  }

  getCurrentHeadquarter(): HeadquarterContext | undefined {
    return this.headquarters.find(h => h.idHeadquarter == this.selectedHeadquarterId);
  }

  ngOnInit(): void {
    this.loadHeadquarters();

    // Update countdown timers every 30 seconds
    this.timerInterval = setInterval(() => {
      this.updateTimers();
    }, 30000);
  }

  ngOnDestroy(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  updateTimers(): void {
    // Timers are now fully managed by the backend (RemainingMinutes). 
    // This frontend countdown might be redundant or we could just decrement `remainingMinutes` locally.
    this.queue.forEach(item => {
      if (item.remainingMinutes > 0) {
        item.remainingMinutes--;
      }
    });
  }

  loadHeadquarters(): void {
    this.queueService.getHeadquarters().subscribe({
      next: (hqs) => {
        this.headquarters = hqs;
        // Auto-selection removed to allow "Seleccione una sede" state
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error fetching headquarters', err)
    });
  }

  loadRoutesForHeadquarter(): void {
    if (!this.selectedHeadquarterId) return;
    this.queueService.getRoutesByHeadquarter(this.selectedHeadquarterId, this.viewType).subscribe(rts => {
      this.routes = rts;
      if (rts.length > 0) {
        // If a route was already selected and still belongs to this HQ/view, keep it. Otherwise, default to the first one.
        const currentRouteExists = rts.some(r => r.idRoute === this.selectedRouteId);
        if (!currentRouteExists) {
          this.selectedRouteId = rts[0].idRoute;
        }
        this.modalSelectedRouteId = this.selectedRouteId; // Sync modal default

        this.loadQueue();
      } else {
        this.queue = [];
      }
      this.cdr.detectChanges();
    });
  }

  setViewType(type: 'departure' | 'arrival'): void {
    if (this.viewType !== type) {
      this.viewType = type;
      this.loadRoutesForHeadquarter();
    }
  }

  onHeadquarterChange(): void {
    this.selectedHeadquarterId = Number(this.selectedHeadquarterId);
    this.loadRoutesForHeadquarter();
  }

  onRouteSelect(): void {
    this.selectedRouteId = Number(this.selectedRouteId);
    this.loadQueue();
  }

  loadQueue(): void {
    if (this.selectedHeadquarterId && this.selectedRouteId) {
      const isArrival = this.viewType === 'arrival';
      this.queueService.getQueue(Number(this.selectedHeadquarterId), Number(this.selectedRouteId), isArrival).subscribe(q => {
        this.queue = q;

        // Update the specific count for the current view
        if (isArrival) {
          this.arrivalCount = q.length;
        } else {
          this.departureCount = q.length;
        }

        this.cdr.detectChanges();
      });

      // Fetch the other count in the background for the "Total" card
      const otherView = !isArrival;
      this.queueService.getQueue(Number(this.selectedHeadquarterId), Number(this.selectedRouteId), otherView).subscribe(q => {
        if (otherView) {
          this.arrivalCount = q.length;
        } else {
          this.departureCount = q.length;
        }
        this.cdr.detectChanges();
      });
    }
  }

  openAddDriverModal(): void {
    this.modalNewDriverDni = '';
    this.modalSelectedRouteId = this.selectedRouteId;
  }

  openArrivalModal(): void {
    this.modalArrivalOpen = true;
  }

  confirmArrivalFromComponent(dni: string): void {
    this.queueService.registerArrival(dni).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          alert('Llegada registrada exitosamente.');
          this.modalArrivalOpen = false;
          // Refresh the queue since the trip finished
          this.loadQueue();
          this.cdr.detectChanges();
        } else {
          alert(res.errorMessage || 'Error al registrar llegada.');
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        alert(err.error?.errorMessage || err.error || 'Error de conexión al registrar llegada.');
      }
    });
  }

  confirmAddDriverFromComponent(data: { dni: string, idTravelRoute: number }): void {
    if (!data.dni || data.dni.trim().length < 8) {
      alert('Por favor ingrese un DNI válido.');
      return;
    }

    this.queueService.addDriverToQueue(data.dni, data.idTravelRoute, null).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          // Switch to "Salidas" view and the correct route to ensure visibility
          this.viewType = 'departure';
          this.selectedRouteId = data.idTravelRoute;
          this.loadRoutesForHeadquarter();
          this.cdr.detectChanges();
        } else {
          alert(res.errorMessage || 'Error al agregar chofer a la cola.');
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        alert(err.error?.errorMessage || err.error || 'Error al agregar chofer a la cola. Verifique que tenga un vehículo y ruta asignados.');
        this.cdr.detectChanges();
      }
    });
  }

  openDeleteModal(item: QueueItem): void {
    this.itemToDelete = item;
  }

  confirmDeleteDriverFromComponent(): void {
    if (this.itemToDelete) {
      this.queueService.removeDriverFromQueue(this.itemToDelete.idAssignQueue).subscribe({
        next: () => {
          this.itemToDelete = null;
          this.loadQueue();
          this.loadRoutesForHeadquarter();
          this.cdr.detectChanges();
        },
        error: (err) => {
          alert(err.error || 'Error al quitar chofer de la cola.');
        }
      });
    }
  }

  editRoute(item: QueueItem): void {
    this.itemToEdit = item;
  }

  confirmEditRouteFromComponent(newRouteId: number): void {
    if (this.itemToEdit && newRouteId) {
      if (Number(newRouteId) !== this.itemToEdit.idRoute) {
        this.queueService.updateDriverRoute(this.itemToEdit.idAssignQueue, Number(newRouteId)).subscribe({
          next: () => {
            this.itemToEdit = null;
            this.loadQueue();
            this.loadRoutesForHeadquarter();
            this.cdr.detectChanges();
          },
          error: (err) => {
            alert(err.error || 'Error al cambiar la ruta del chofer.');
          }
        });
      }
    }
  }

  dispatchVehicle(item: QueueItem): void {
    if (!item.idAssignQueue) return;

    if (confirm(`¿Está seguro de despachar el vehículo ${item.vehiclePlate} de ${item.driverFullName}? Esto iniciará el viaje y lo moverá a la lista de llegadas.`)) {
      this.queueService.dispatchVehicle(item.idAssignQueue).subscribe({
        next: (res) => {
          if (res.isSuccess) {
            this.loadQueue();
            this.loadRoutesForHeadquarter();
            this.cdr.detectChanges();
          } else {
            alert(res.errorMessage || 'Error al despachar el vehículo.');
            this.cdr.detectChanges();
          }
        },
        error: (err) => {
          alert('Error de conexión al despachar el vehículo.');
        }
      });
    }
  }
}
