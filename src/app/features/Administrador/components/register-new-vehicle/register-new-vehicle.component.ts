import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { VehiclesService } from '../../services/vehicles.service';
import { DriverModel } from '../../models/Driver.model';
import { RoutesService } from '../../services/routes.service';
import { TravelRouteModel } from '../../models/TravelRoute.model';
import { CreateVehicleModel } from '../../models/CreateVehicle.model';
import { StateVehicleModel } from '../../models/StateVehicle.model';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-register-new-vehicle',
    standalone: true,
    imports: [CommonModule, FormsModule, ReactiveFormsModule],
    templateUrl: './register-new-vehicle.component.html',
    styleUrl: './register-new-vehicle.component.scss'
})
export class RegisterNewVehicleComponent implements OnInit {

    isVisible = false;
    vehicleForm!: FormGroup;

    listDrivers: DriverModel[] = []
    listRoutes: TravelRouteModel[] = [];
    listStateVehicle: StateVehicleModel[] = [];

    constructor(
        private fb: FormBuilder,
        private vehicleService: VehiclesService,
        private routeServece: RoutesService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.getDriver();
        this.getAllRoutes();
        this.getStatesVehicle();
        this.initForm();
    }

    open() { this.isVisible = true }
    close() { this.isVisible = false }

    initForm(): void {
        this.vehicleForm = this.fb.group({
            mainPhoto: [null],
            plate: ['', [Validators.required, Validators.pattern(/^[A-Z0-9-]{6,10}$/)]],
            vehicleType: ['', Validators.required],
            seatNumber: [null, [Validators.required, Validators.min(1)]],
            model: [''],
            idDriver: [null, Validators.required],
            idState: [null, Validators.required],
            soatExpirationDate: ['', Validators.required],
            idRoute: [null, Validators.required]
        })
    }

    // En tu método onFileSelected
    onFileSelected(event: any): void {
        const file: File = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                // Guardamos el string completo con el prefijo
                this.vehicleForm.patchValue({ mainPhoto: reader.result as string });
                this.cdr.detectChanges();
            };
            reader.readAsDataURL(file);
        }
    }

    onSubmit(): void {
        if (this.vehicleForm.invalid) {
            this.vehicleForm.markAllAsTouched();
            return;
        }

        const vehicleData: CreateVehicleModel = { ...this.vehicleForm.value };

        if (vehicleData.mainPhoto && vehicleData.mainPhoto.includes(',')) {
            vehicleData.mainPhoto = vehicleData.mainPhoto.split(',')[1];
        }

        this.vehicleService.RegisterVehicle(vehicleData).subscribe({
            next: (result) => {
                if (result.isSuccess) {
                    console.log('Vehículo registrado exitosamente');
                    this.close();
                    this.vehicleForm.reset();
                }
            },
            error: (err) => {
                console.error('Error al registrar:', err);
            }
        });
    }

    getDriver(): void {
        this.vehicleService.getDrivers().subscribe(
            {
                next: (response) => {
                    if (response.isSuccess) {
                        this.listDrivers = response.value;
                        console.log(this.listDrivers);
                    }
                },
                error: (err) => {
                    console.log(err);
                }
            });
    }

    getAllRoutes(): void {
        this.routeServece.getAll().subscribe(
            {
                next: (response) => {
                    if (response != null) {
                        this.listRoutes = response;
                        console.log(response);
                    }
                },
                error: (err) => {
                    console.log(err);
                }
            }
        );
    }

    getStatesVehicle(): void {
        this.vehicleService.getAllStateVehicle().subscribe({
            next: (response) => {
                if (response.isSuccess) {
                    this.listStateVehicle = response.value;
                    console.log(response);
                } else {
                    console.log(response.errorMessage);
                }
            },
            error: (err) => {
                console.log(err);
            }
        });
    }
}