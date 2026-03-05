import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { RegisterNewVehicleComponent } from '../../components/register-new-vehicle/register-new-vehicle.component';
import { EditVehicleComponent } from '../../components/edit-vehicle/edit-vehicle.component';

import {
  VehiclesService,
  VehicleListItemDto,
  VehicleSummaryDto
} from '../../services/vehicles.service';

@Component({
  selector: 'app-admin-vehicles',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    RegisterNewVehicleComponent,
    EditVehicleComponent
  ],
  templateUrl: './admin-vehicles.page.html',
  styleUrl: './admin-vehicles.page.scss',
})
export class AdminVehiclesComponent implements OnInit {

  // MODAL STATES
  isRegisterModalOpen = false;
  isEditModalOpen = false;

  // DATA STATES
  selectedVehicle: VehicleListItemDto | null = null;

  vehicles: VehicleListItemDto[] = [];

  totalUnits = 0;
  active = 0;
  inactive = 0;

  // SEARCH
  searchTerm = '';

  constructor(private vehiclesService: VehiclesService) {}

  ngOnInit(): void {
    this.refreshAll();
  }

  refreshAll(): void {
    this.loadVehicles();
    this.loadSummary();
  }

  loadVehicles(): void {
    this.vehiclesService.getVehicles().subscribe({
      next: (data: VehicleListItemDto[]) => {
        this.vehicles = data ?? [];
      },
      error: (err: unknown) => console.error('Error getVehicles:', err)
    });
  }

  loadSummary(): void {
    this.vehiclesService.getSummary().subscribe({
      next: (data: VehicleSummaryDto) => {
        this.totalUnits = data?.totalUnits ?? 0;
        this.active = data?.active ?? 0;
        this.inactive = data?.inactive ?? 0;
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

  closeRegisterModal(): void {
    this.isRegisterModalOpen = false;
    this.refreshAll();
  }

  openEditModal(vehicle: VehicleListItemDto): void {
    this.selectedVehicle = vehicle;
    this.isEditModalOpen = true;
  }

  closeEditModal(): void {
    this.isEditModalOpen = false;
    this.selectedVehicle = null;
    this.refreshAll();
  }

  /* ===============================
     DELETE (REAL)
  ================================ */
  confirmDelete(v: VehicleListItemDto): void {
    const ok = confirm(`¿Eliminar ${v.unitId} - ${v.plate}?`);
    if (!ok) return;

    this.vehiclesService.deleteVehicle(v.unitId).subscribe({
      next: () => {
        alert('Vehículo eliminado ✅');
        this.refreshAll();
      },
      error: (err) => {
        console.error('Error deleteVehicle:', err);
        alert('No se pudo eliminar ❌');
      }
    });
  }

  /* ===============================
     HELPERS
  ================================ */

  filteredVehicles(): VehicleListItemDto[] {
    const term = (this.searchTerm ?? '').trim().toLowerCase();
    if (!term) return this.vehicles;

    return this.vehicles.filter(v =>
      (v.unitId ?? '').toLowerCase().includes(term) ||
      (v.plate ?? '').toLowerCase().includes(term)
    );
  }

  trackByVehicle(index: number, v: VehicleListItemDto): string {
    return v.unitId;
  }

  getDriverInitials(driver?: string | null): string {
    const name = (driver ?? '').trim();
    return name ? name.substring(0, 2).toUpperCase() : 'SA';
  }
}