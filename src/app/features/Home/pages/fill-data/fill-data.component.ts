import { Component, OnInit, inject, signal, ChangeDetectorRef } from '@angular/core'; // Agregué ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReniecService } from '../../services/reniec.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterBookingService } from '../../services/register-booking.service';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';

registerLocaleData(localeEs);

export interface RegisterBookingModel {
  idRoute: number;
  idVehicle: number;
  fullName: string;
  phoneNumeber: string;
  dni: string;
  email: string;
  operationCode: string;
  cardNumber: string;
  expirationDate: string;
  cvv: string;
  fullPayment: number;
  travelDate: string;
  seats: number[];
}

@Component({
  selector: 'app-fill-data',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './fill-data.component.html',
  styleUrl: './fill-data.component.scss',
})
export class FillDataComponent implements OnInit {
  private fb = inject(FormBuilder);
  private reniecService = inject(ReniecService);
  private route = inject(ActivatedRoute);
  private bookingService = inject(RegisterBookingService);
  private cdr = inject(ChangeDetectorRef); // Inyección clave para actualizar la vista

  passengerForm!: FormGroup;
  isLoadingDni = signal(false);
  isProcessingPayment = signal(false);
  paymentMethod = signal<string>('Yape');

  tripSummary = signal<{
    seats: string[];
    price: number;
    total: number;
    routeId: number;
    vehicleId: number;
    hour: string;
    nameRoute: string;
  } | null>(null);

  ngOnInit(): void {
    this.initForm();
    this.getParamsOfRoute();
  }

  initForm() {
    this.passengerForm = this.fb.group({
      dni: ['', [Validators.required, Validators.pattern('^[0-9]{8}$')]],
      fullName: [{ value: '', disabled: true }, Validators.required],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{9}$')]],
      email: ['', [Validators.email]],
      paymentReference: ['', Validators.required], // Inicialmente requerido para Yape
      cardNumber: [''],
      expiryDate: [''],
      cvv: ['']
    });
  }

  setPaymentMethod(method: string) {
    this.paymentMethod.set(method);
    
    // Lógica dinámica para que el botón "Confirmar" funcione
    const refControl = this.passengerForm.get('paymentReference');
    const cardControl = this.passengerForm.get('cardNumber');

    if (method === 'Yape') {
      refControl?.setValidators([Validators.required, Validators.minLength(6)]);
      cardControl?.clearValidators();
    } else {
      refControl?.clearValidators();
      cardControl?.setValidators([Validators.required, Validators.minLength(16)]);
    }
    
    refControl?.updateValueAndValidity();
    cardControl?.updateValueAndValidity();
  }

  validateDni() {
    const dniControl = this.passengerForm.get('dni');
    if (dniControl?.invalid) return;

    this.isLoadingDni.set(true);
    this.reniecService.getPersonDataByDni(Number(dniControl?.value)).subscribe({
      next: (response) => {
        if (response.isSuccess && response.value) {
          this.passengerForm.patchValue({ fullName: response.value.fullName });
        } else {
          alert('No se encontraron datos en RENIEC');
        }
        this.isLoadingDni.set(false);
      },
      error: () => this.isLoadingDni.set(false)
    });
  }

  getParamsOfRoute() {
    this.route.queryParams.subscribe(params => {
      const seatsString = params['selectedSeats'] || '';
      const seatsArray = seatsString ? seatsString.split(',') : [];
      const price = Number(params['priceSeat']) || 0;

      this.tripSummary.set({
        seats: seatsArray,
        price: price,
        total: seatsArray.length * price,
        routeId: Number(params['idRoute']),
        vehicleId: Number(params['idVehicle']),
        hour: params['departureHour'] || '',
        nameRoute: params['nameRoute'] || 'Ruta no especificada'
      });

      // ¡ESTA ES LA LÍNEA MÁGICA! 
      // Fuerza a Angular a pintar los datos inmediatamente al cargarlos.
      this.cdr.detectChanges(); 
    });
  }

  confirmarReserva() {
    if (this.passengerForm.invalid) {
      this.passengerForm.markAllAsTouched();
      return;
    }

    this.isProcessingPayment.set(true);
    const formValues = this.passengerForm.getRawValue();
    const summary = this.tripSummary();

    const finalPayload: RegisterBookingModel = {
      idRoute: summary?.routeId ?? 0,
      idVehicle: summary?.vehicleId ?? 0,
      fullName: formValues.fullName,
      phoneNumeber: formValues.phone,
      dni: formValues.dni,
      email: formValues.email,
      operationCode: this.paymentMethod() === 'Yape' ? formValues.paymentReference : '',
      cardNumber: this.paymentMethod() === 'Tarjeta' ? formValues.cardNumber : '',
      expirationDate: formValues.expiryDate || '',
      cvv: formValues.cvv || '',
      fullPayment: summary?.total ?? 0,
      travelDate: new Date().toISOString().split('T')[0],
      seats: summary?.seats?.map(Number) ?? []
    };
    console.log(finalPayload);
    this.bookingService.registerBooking(finalPayload).subscribe({
      
      next: (response) => {
        this.isProcessingPayment.set(false);
        if (response.isSuccess) {
          alert('¡Reserva confirmada con éxito!');
          console.log();
        } else {
          alert('Error: ' + (response.errorMessage || 'No se pudo procesar la reserva'));
        }
      },
      error: (err) => {
        this.isProcessingPayment.set(false);
        alert('Ocurrió un error al conectar con el servidor.');
      }
    });
  }
}