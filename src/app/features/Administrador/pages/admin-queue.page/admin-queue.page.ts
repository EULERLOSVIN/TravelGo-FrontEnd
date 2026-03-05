import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { QueueManagement } from '../../services/queue-management';
import { HeadquarterContext, QueueItem, RouteFilter } from '../../models/queue.model';
import { RegisterQueue } from '../../components/register-queue/register-queue';
import { EditQueue } from '../../components/edit-queue/edit-queue';
import { DeleteQueue } from '../../components/delete-queue/delete-queue';

@Component({
  selector: 'app-admin-queue-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RegisterQueue, EditQueue, DeleteQueue],
  templateUrl: './admin-queue.page.html',
  styleUrl: './admin-queue.page.scss'
})
export class AdminQueuePage implements OnInit, OnDestroy {
  headquarters: HeadquarterContext[] = [];
  selectedHeadquarterId: number = 0;

  routes: RouteFilter[] = [];
  selectedRouteId: number = 0;

  queue: QueueItem[] = [];

  newDriverDni: string = '';
  searchTerm: string = '';

  // Modal states
  modalNewDriverDni: string = '';
  modalSelectedRouteId: number = 0;

  itemToEdit: QueueItem | null = null;
  modalEditRouteId: number = 0;

  itemToDelete: QueueItem | null = null;

  private timerInterval: any;

  constructor(private queueService: QueueManagement, private cdr: ChangeDetectorRef) { }

  get filteredQueue(): QueueItem[] {
    if (!this.searchTerm.trim()) return this.queue;

    const lowerTerm = this.searchTerm.toLowerCase().trim();
    return this.queue.filter(item =>
      item.driverFullName.toLowerCase().includes(lowerTerm) ||
      item.driverDni.includes(lowerTerm) ||
      (item.vehiclePlate && item.vehiclePlate.toLowerCase().includes(lowerTerm))
    );
  }

  ngOnInit(): void {
    this.loadInitialData();

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
    const now = new Date().getTime();
    this.queue.forEach(item => {
      if (item.scheduledDepartureTime) {
        const diffMs = new Date(item.scheduledDepartureTime).getTime() - now;
        item.estimatedWaitTimeMinutes = Math.max(0, Math.floor(diffMs / 60000));
      }
    });
  }

  loadInitialData(): void {
    this.queueService.getHeadquarters().subscribe(hqs => {
      this.headquarters = hqs;
      if (hqs.length > 0) {
        this.selectedHeadquarterId = hqs[0].idHeadquarter;
        this.loadRoutesForHeadquarter();
      }
      this.cdr.detectChanges();
    });
  }

  loadRoutesForHeadquarter(): void {
    if (!this.selectedHeadquarterId) return;
    this.queueService.getRoutesByHeadquarter(this.selectedHeadquarterId).subscribe(rts => {
      this.routes = rts;
      if (rts.length > 0) {
        this.selectedRouteId = rts[0].idRoute;
        this.modalSelectedRouteId = rts[0].idRoute; // Default for modal
        this.loadQueue();
      } else {
        this.queue = [];
      }
      this.cdr.detectChanges();
    });
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
      this.queueService.getQueue(Number(this.selectedHeadquarterId), Number(this.selectedRouteId)).subscribe(q => {
        this.queue = q;
        this.updateTimers(); // Force update on load
        this.cdr.detectChanges();
      });
    }
  }

  openAddDriverModal(): void {
    this.modalNewDriverDni = '';
    this.modalSelectedRouteId = this.selectedRouteId;
    // Usually triggered via data-bs-toggle="modal", but kept here for programmatic expanding later if needed
  }

  confirmAddDriverFromComponent(data: { dni: string, routeId: number, departureTimeId: number | null }): void {
    if (!data.dni || data.dni.trim().length < 8) {
      alert('Por favor ingrese un DNI o Nombre válido para buscar.');
      return;
    }

    this.queueService.addDriverToQueue(data.dni, Number(data.routeId), data.departureTimeId).subscribe(() => {
      if (Number(data.routeId) === Number(this.selectedRouteId)) {
        this.loadQueue();
      }
      this.loadRoutesForHeadquarter();
    });
  }

  openDeleteModal(item: QueueItem): void {
    this.itemToDelete = item;
  }

  confirmDeleteDriverFromComponent(): void {
    if (this.itemToDelete) {
      this.queueService.removeDriverFromQueue(this.itemToDelete.idQueue).subscribe(() => {
        this.itemToDelete = null;
        this.loadQueue();
        this.loadRoutesForHeadquarter();
      });
    }
  }

  editRoute(item: QueueItem): void {
    this.itemToEdit = item;
  }

  confirmEditRouteFromComponent(newRouteId: number): void {
    if (this.itemToEdit && newRouteId) {
      if (Number(newRouteId) !== this.itemToEdit.idRoute) {
        this.queueService.removeDriverFromQueue(this.itemToEdit.idQueue).subscribe(() => {
          this.queueService.addDriverToQueue(this.itemToEdit!.driverDni, Number(newRouteId)).subscribe(() => {
            this.itemToEdit = null;
            this.loadQueue();
            this.loadRoutesForHeadquarter();
          });
        });
      }
    }
  }
}
