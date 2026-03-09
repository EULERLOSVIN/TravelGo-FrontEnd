import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QueueManagementService } from '../../services/queue-management.service';
import { HeadquarterContext, QueueItem, RouteFilter } from '../../models/queue.model';
import { RegisterQueue } from '../../components/register-queue/register-queue';
import { EditQueue } from '../../components/edit-queue/edit-queue';
import { DeleteQueue } from '../../components/delete-queue/delete-queue';
import { RegisterArrival } from '../../components/register-arrival/register-arrival';
import { SuccessModal } from '../../components/success-modal/success-modal';
import { ConfirmModal } from '../../components/confirm-modal/confirm-modal';

@Component({
  selector: 'app-admin-queue-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RegisterQueue, DeleteQueue, RegisterArrival, SuccessModal, ConfirmModal],
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

  // Feedback Modal State (using SuccessModal component)
  feedbackModalOpen: boolean = false;
  feedbackModalTitle: string = '';
  feedbackModalMessage: string = '';
  feedbackModalType: 'success' | 'error' | 'warning' = 'success';

  // Confirm Modal State
  confirmModalOpen: boolean = false;
  confirmModalTitle: string = '';
  confirmModalMessage: string = '';
  itemToDispatch: QueueItem | null = null;

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

  showAlert(title: string, message: string, type: 'success' | 'error' | 'warning' = 'success'): void {
    this.feedbackModalTitle = title;
    this.feedbackModalMessage = message;
    this.feedbackModalType = type;
    this.feedbackModalOpen = true;
    this.cdr.detectChanges();
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
        this.selectedRouteId = 0;
        this.queue = [];
        this.resetCounters();
      }
      this.cdr.detectChanges();
    });
  }

  resetCounters(): void {
    this.departureCount = 0;
    this.arrivalCount = 0;
  }

  setViewType(type: 'departure' | 'arrival'): void {
    if (this.viewType !== type) {
      this.viewType = type;
      this.queue = [];
      this.resetCounters();
      this.loadRoutesForHeadquarter();
    }
  }

  onHeadquarterChange(): void {
    this.selectedHeadquarterId = Number(this.selectedHeadquarterId);
    this.selectedRouteId = 0;
    this.queue = [];
    this.resetCounters();
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
          this.showAlert('¡Llegada Registrada!', 'La llegada del vehículo se ha registrado correctamente y el viaje ha finalizado.', 'success');
          this.modalArrivalOpen = false;
          // Refresh the queue since the trip finished
          this.loadQueue();
        } else {
          this.showAlert('Error', res.errorMessage || 'Error al registrar llegada.', 'error');
        }
      },
      error: (err) => {
        this.showAlert('Error de Conexión', err.error?.errorMessage || err.error || 'Error de conexión al registrar llegada.', 'error');
      }
    });
  }

  confirmAddDriverFromComponent(data: { dni: string, idTravelRoute: number }): void {
    if (!data.dni || data.dni.trim().length < 8) {
      this.showAlert('DNI Inválido', 'Por favor ingrese un DNI válido.', 'warning');
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
          this.showAlert('Error', res.errorMessage || 'Error al agregar chofer a la cola.', 'error');
        }
      },
      error: (err) => {
        this.showAlert('Error', err.error?.errorMessage || err.error || 'Error al agregar chofer a la cola. Verifique que tenga un vehículo y ruta asignados.', 'error');
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
          this.showAlert('Error', err.error || 'Error al quitar chofer de la cola.', 'error');
        }
      });
    }
  }

  /*
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
            this.showAlert('Error', err.error || 'Error al cambiar la ruta del chofer.', 'error');
          }
        });
      }
    }
  }
  */

  dispatchVehicle(item: QueueItem): void {
    if (!item.idAssignQueue) return;
    this.itemToDispatch = item;
    this.confirmModalTitle = 'Confirmar Despacho';
    this.confirmModalMessage = `¿Está seguro de despachar el vehículo ${item.vehiclePlate} de ${item.driverFullName}? Esto iniciará el viaje y lo moverá a la lista de llegadas.`;
    this.confirmModalOpen = true;
  }

  confirmDispatch(): void {
    if (!this.itemToDispatch || !this.itemToDispatch.idAssignQueue) return;

    const item = this.itemToDispatch;
    this.confirmModalOpen = false;

    this.queueService.dispatchVehicle(item.idAssignQueue).subscribe({
      next: (res) => {
        if (res.isSuccess) {
          this.showAlert('Vehículo Despachado', `El vehículo ${item.vehiclePlate} ha sido despachado exitosamente e inició su ruta.`, 'success');

          this.loadQueue();
          this.loadRoutesForHeadquarter();
        } else {
          this.showAlert('Error de Despacho', res.errorMessage || 'Error al despachar el vehículo.', 'error');
        }
      },
      error: (err) => {
        this.showAlert('Error de Conexión', 'Error de conexión al despachar el vehículo.', 'error');
      }
    });
  }
}
