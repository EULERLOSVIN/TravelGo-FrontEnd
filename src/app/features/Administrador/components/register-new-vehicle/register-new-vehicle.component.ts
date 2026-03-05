import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { VehiclesService } from '../../services/vehicles.service';
import { Subject, takeUntil, finalize } from 'rxjs';

interface Result<T> {
  isSuccess: boolean;
  value: T;
  message?: string;
}

interface DriverModel {
  idPerson: number;
  name: string;
}

@Component({
  selector: 'app-register-new-vehicle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register-new-vehicle.component.html',
  styleUrl: './register-new-vehicle.component.scss'
})
export class RegisterNewVehicleComponent implements OnChanges, OnDestroy {

  @Input() isOpen = false;
  @Output() close = new EventEmitter<void>();

  drivers: DriverModel[] = [];
  loadingDrivers = false;
  saving = false;

  // cache simple para evitar pedir drivers siempre
  private driversLoadedOnce = false;

  // para cancelar subs al cerrar / destruir
  private destroy$ = new Subject<void>();

  mainPhotoBase64: string | null = null;

  vehicleData = {
    unitCode: 'U-013',
    plate: '',
    type: '',
    seats: null as number | null,
    model: '',
    driverId: null as number | null,
    statusId: 1,
    soatExpiry: '',
  };

  constructor(private vehiclesService: VehiclesService) {}

  ngOnChanges(changes: SimpleChanges): void {
    // Carga drivers solo cuando se abre
    if (changes['isOpen']?.currentValue === true) {
      this.loadDriversIfNeeded();
    }

    // Si el modal se cierra, opcional: cancelar requests en vuelo
    if (changes['isOpen']?.currentValue === false) {
      // No reseteo destroy$ porque también se usa para OnDestroy.
      // Si quieres cancelar al cerrar sin destruir, usa otro Subject "close$".
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  closeModal() {
    this.close.emit();
  }

  // ===============================
  // DRIVERS (optimizado)
  // ===============================
  private loadDriversIfNeeded() {
    // Si ya cargaste antes y tienes data, no vuelvas a llamar
    if (this.driversLoadedOnce && this.drivers.length > 0) return;

    this.loadingDrivers = true;

    this.vehiclesService.getDrivers()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.loadingDrivers = false))
      )
      .subscribe({
        next: (res: Result<DriverModel[]>) => {
          if (res?.isSuccess) {
            this.drivers = res.value ?? [];
            this.driversLoadedOnce = true;
          } else {
            this.drivers = [];
            console.error('GetDrivers no success:', res?.message);
          }
        },
        error: (err: any) => {
          console.error('Error GetDrivers:', err);
          this.drivers = [];
        }
      });
  }

  driverFullName(d: DriverModel): string {
    return d?.name ?? 'Conductor';
  }

  // ===============================
  // IMAGEN -> BASE64 (mejorado)
  // ===============================
  onMainPhotoSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];

    // mini protección: si el archivo es enorme, te va a volver lenta la request
    // ajusta el límite según tu caso (ej. 2MB)
    const MAX_MB = 2;
    if (file.size > MAX_MB * 1024 * 1024) {
      alert(`La imagen supera ${MAX_MB}MB. Reduce el tamaño para que cargue más rápido.`);
      input.value = '';
      this.mainPhotoBase64 = null;
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      this.mainPhotoBase64 = result.includes(',')
        ? result.split(',')[1]
        : result;
    };
    reader.readAsDataURL(file);
  }

  // ===============================
  // GUARDAR (optimizado)
  // ===============================
  saveVehicle() {
    if (this.saving) return;

    const plate = this.vehicleData.plate.trim();
    const type = this.vehicleData.type.trim();

    if (!plate) return alert('Ingrese la placa');
    if (!type) return alert('Seleccione el tipo de vehículo');
    if (!this.vehicleData.seats || this.vehicleData.seats <= 0) return alert('Ingrese el número de asientos');
    if (!this.vehicleData.soatExpiry) return alert('Ingrese fecha vencimiento SOAT');

    this.saving = true;

    const payload = {
      plate,
      model: this.tryParseInt(this.vehicleData.model),
      idVehicleState: Number(this.vehicleData.statusId),
      idPerson: this.vehicleData.driverId != null ? Number(this.vehicleData.driverId) : null,
      vehicleType: type,
      seatNumber: Number(this.vehicleData.seats),
      soatExpiry: this.vehicleData.soatExpiry,
      mainPhoto: this.mainPhotoBase64
    };

    this.vehiclesService.createVehicle(payload)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.saving = false))
      )
      .subscribe({
        next: () => {
          alert('Vehículo creado ✅');
          this.closeModal();
        },
        error: (err: any) => {
          console.error('Error createVehicle:', err);
          alert('Error al crear vehículo ❌ (mira consola)');
        }
      });
  }

  private tryParseInt(value: string): number | null {
    const v = (value ?? '').trim();
    if (!v) return null;
    const n = Number.parseInt(v, 10);
    return Number.isFinite(n) ? n : null;
  }
}