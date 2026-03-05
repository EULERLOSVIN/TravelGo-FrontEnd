import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { RegisterNewVehicleComponent } from '../../components/register-new-vehicle/register-new-vehicle.component';
import { EditVehicleComponent } from '../../components/edit-vehicle/edit-vehicle.component';
import { DeleteVehicleComponent } from '../../components/delete-vehicle/delete-vehicle.component';

import { VehiclesService, VehicleListItemDto, VehicleSummaryDto }
  from '../../services/vehicles.service';

@Component({
  selector: 'app-admin-vehicles',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    RegisterNewVehicleComponent,
    EditVehicleComponent,
    DeleteVehicleComponent
  ],
  templateUrl: './admin-vehicles.page.html',
  styleUrl: './admin-vehicles.page.scss',
})
export class AdminVehiclesComponent implements OnInit {

  // MODAL STATES
  isRegisterModalOpen = false;
  isEditModalOpen = false;
  isDeleteModalOpen = false;

  // DATA STATES
  selectedVehicle: VehicleListItemDto | null = null;

  vehicles: VehicleListItemDto[] = [];

  totalUnits = 0;
  active = 0;
  inactive = 0;

  constructor(private vehiclesService: VehiclesService) {}

  ngOnInit(): void {
    this.loadVehicles();
    this.loadSummary();
  }

  loadVehicles(): void {
    this.vehiclesService.getVehicles().subscribe({
      next: (data: VehicleListItemDto[]) => {
        this.vehicles = data;
      },
      error: (err: unknown) => console.error('Error getVehicles:', err)
    });
  }

  loadSummary(): void {
    this.vehiclesService.getSummary().subscribe({
      next: (data: VehicleSummaryDto) => {
        this.totalUnits = data.totalUnits;
        this.active = data.active;
        this.inactive = data.inactive;
      },
      error: (err: unknown) => console.error('Error getSummary:', err)
    });
  }

  /* ===============================
     MODAL METHODS
  ================================ */

  openRegisterModal(): void {
    this.isRegisterModalOpen = true;
  }

  openEditModal(vehicle: VehicleListItemDto): void {
    this.selectedVehicle = vehicle;
    this.isEditModalOpen = true;
  }

  openDeleteModal(vehicle?: VehicleListItemDto): void {
    this.selectedVehicle = vehicle ?? null;
    this.isDeleteModalOpen = true;
  }
}
