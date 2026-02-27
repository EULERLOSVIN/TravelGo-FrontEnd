import { Component, Input, DestroyRef, inject, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Importaciones de tus servicios y modelos
import { GetSeatByIdOfVehicleService } from '../../services/get-seat-by-id-of-vehicle.service';
import { Result } from '../../../../shared/models/result.model';
import { SeatModal } from '../../models/seat.modal';

export interface SeatSelectionData {
  idVehicle: number;
  idRoute: number;
}

@Component({
  selector: 'app-card-select-seat',
  standalone: true,
  imports: [NgClass, CommonModule],
  templateUrl: './card-select-seat.component.html',
  styleUrl: './card-select-seat.component.scss',
})
export class CardSelectSeatComponent {
  // Variable privada para el setter
  private _data!: SeatSelectionData;

  // Al usar un setter, el componente reacciona automáticamente si el ID cambia
  @Input({ required: true })
  set data(value: SeatSelectionData) {
    this._data = value;
    if (value && value.idVehicle) {
      this.loadSeats(value.idVehicle);
    }
  }

  get data(): SeatSelectionData {
    return this._data;
  }

  listSeat: SeatModal[] = [];
  selectedSeats: number[] = [];
  @Output() seatsChanged = new EventEmitter<SeatModal[]>();

  // Inyecciones modernas de Angular
  private destroyRef = inject(DestroyRef);
  private cdr = inject(ChangeDetectorRef);

  constructor(private seatService: GetSeatByIdOfVehicleService) { }

  loadSeats(idVehicle: number): void {
    this.seatService.GetSeatsByIdOfVehicle(idVehicle)
      .pipe(takeUntilDestroyed(this.destroyRef)) // Evita memory leaks
      .subscribe({
        next: (response: Result<SeatModal[]>) => {
          if (response.isSuccess && response.value) {
            this.listSeat = [...response.value];
            console.log(response.value);
            this.cdr.detectChanges(); // Fuerza la actualización de la vista
          } else {
            console.error('Error del servidor:', response.errorMessage);
          }
        },
        error: (err) => {
          console.error('Error de conexión:', err);
        }
      });
  }

  selectSeat(seat: SeatModal): void {
    if (!seat.isAvailable) return;

    const index = this.selectedSeats.indexOf(seat.id);
    if (index === -1) {
      if (this.selectedSeats.length < 6) this.selectedSeats.push(seat.id);
    } else {
      this.selectedSeats.splice(index, 1);
    }

    // Emitimos los objetos completos de los asientos seleccionados
    const selectedObjects = this.listSeat.filter(s => this.selectedSeats.includes(s.id));
    this.seatsChanged.emit(selectedObjects);
  }
  isSeatSelected(id: number): boolean {
    return this.selectedSeats.includes(id);
  }
  getSelectedSeatNumbers(): string {
    return this.listSeat
      .filter(s => this.selectedSeats.includes(s.id))
      .map(s => s.number)
      .sort((a, b) => a - b) // Los ordenamos numéricamente
      .join(', ');
  }
}