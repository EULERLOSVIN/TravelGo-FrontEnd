import { Component, OnInit, ChangeDetectorRef, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TravelRouteModel } from '../../../models/TravelRoute.model';
import { DriverModel } from '../../../models/Driver.model';
import { StateVehicleModel } from '../../../models/StateVehicle.model';
import { VehiclesService } from '../../../services/vehicles.service';
import { RoutesService } from '../../../services/routes.service';
import { EditVehicleModel } from '../../../models/EditVehicle.model';
import { DetailVehicleModel } from '../../../models/DetailVehicle.model';

@Component({
  selector: 'app-edit-vehicle',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-vehicle.component.html',
  styleUrl: './edit-vehicle.component.scss',
})
export class EditVehicleComponent implements OnInit {

  @Output() onSaveSuccess = new EventEmitter<void>();

  isVisible = false;

  listDrivers: DriverModel[] = [];
  listRoutes: TravelRouteModel[] = [];
  listStateVehicle: StateVehicleModel[] = [];

  editForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private vehicleService: VehiclesService,
    private routeService: RoutesService,
    private cdr: ChangeDetectorRef
  ) {
    this.initForm();
  }

  ngOnInit(): void {
    this.getDriver();
    this.getStatesVehicle();
    this.getAllRoutes();
  }

  initForm(): void {
    this.editForm = this.fb.group({
      idVehicle: [0, Validators.required],
      mainPhoto: [null],
      plate: ['', Validators.required],
      vehicleType: ['', Validators.required],
      seatNumber: [0, [Validators.required, Validators.min(1)]],
      model: [''],
      idDriver: [null, Validators.required],
      idState: [null, Validators.required],
      soatExpirationDate: ['', Validators.required],
      idRoute: [null, Validators.required],
    });
  }

  open(vehicleData: DetailVehicleModel): void {
    const exists = this.listDrivers.find(d => d.idPerson === vehicleData.idDriver);

    if (!exists && vehicleData.idDriver > 0) {
      const currentDriver: DriverModel = {
        idPerson: vehicleData.idDriver,
        firstName: vehicleData.driver, 
        lastName: '',
      };
      
      this.listDrivers = [currentDriver, ...this.listDrivers];
    }

    const routeExists = this.listRoutes.find(r => r.idTravelRoute === vehicleData.idRoute);
    if (!routeExists && vehicleData.idRoute > 0) {
      this.listRoutes = [{
        idTravelRoute: vehicleData.idRoute,
        nameRoute: vehicleData.route,
      } as TravelRouteModel, ...this.listRoutes];
    }

    const photoUrl = vehicleData.photoBase64 ? 'data:image/png;base64,' + vehicleData.photoBase64 : null;
    const soatDate = vehicleData.expirationSoatDate ? new Date(vehicleData.expirationSoatDate).toISOString().split('T')[0] : '';

    this.editForm.patchValue({
      idVehicle: vehicleData.idVehicle,
      mainPhoto: photoUrl,
      plate: vehicleData.plate,
      vehicleType: vehicleData.type,
      seatNumber: vehicleData.seatNumber,
      model: vehicleData.model,
      soatExpirationDate: soatDate,
      idDriver: vehicleData.idDriver,
      idState: vehicleData.idState,
      idRoute: vehicleData.idRoute
    });

    this.isVisible = true;
    this.cdr.detectChanges();
  }

  close(): void {
    this.isVisible = false;
    this.editForm.reset();
  }

  onSave(): void {

    if (this.editForm.invalid) return;

    const data: EditVehicleModel = { ...this.editForm.value };
    if (data.mainPhoto && data.mainPhoto.includes(',')) {
      data.mainPhoto = data.mainPhoto.split(',')[1];
    }

    this.vehicleService.EditVehicle(data).subscribe({
      next: (res) => {

        if (res.isSuccess) {
          console.log('Vehículo editado correctamente');

          this.onSaveSuccess.emit();
          this.close();
        }

      },
      error: (err) => {
        console.error('Error al editar:', err);
      }
    });
  }

  onFileSelected(event: any): void {

    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      this.editForm.patchValue({
        mainPhoto: reader.result as string
      });
      this.cdr.detectChanges();
    };

    reader.readAsDataURL(file);
  }

  getDriver(): void {

    this.vehicleService.getDrivers().subscribe(response => {

      if (response.isSuccess) {
        this.listDrivers = response.value;
      }

    });
  }

  getAllRoutes(): void {

    this.routeService.getAll().subscribe(response => {

      if (response != null) {
        this.listRoutes = response;
      }

    });
  }

  getStatesVehicle(): void {

    this.vehicleService.getAllStateVehicle().subscribe(response => {

      if (response.isSuccess) {
        this.listStateVehicle = response.value;
      }

    });
  }
}