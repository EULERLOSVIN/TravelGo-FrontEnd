import { Component } from '@angular/core';
import { RegisterNewVehicleComponent } from '../../components/register-new-vehicle/register-new-vehicle.component';
import { EditVehicleComponent } from '../../components/edit-vehicle/edit-vehicle.component';
import { DeleteVehicleComponent } from '../../components/delete-vehicle/delete-vehicle.component';

@Component({
  selector: 'app-admin-vehicles',
  standalone: true,
  imports: [RegisterNewVehicleComponent, EditVehicleComponent, DeleteVehicleComponent],
  templateUrl: './admin-vehicles.page.html',
  styleUrl: './admin-vehicles.page.scss',
})
export class AdminVehiclesComponent {

  // MODAL STATES
  isRegisterModalOpen = false;
  isEditModalOpen = false;
  isDeleteModalOpen = false;

  // DATA STATES
  selectedVehicle: any = null;

  /* ===============================
     METHODS
  ================================ */
  openRegisterModal() {
    this.isRegisterModalOpen = true;
  }

  openEditModal(vehicle: any) {
    this.selectedVehicle = vehicle;
    this.isEditModalOpen = true;
  }

  openDeleteModal() {
    this.isDeleteModalOpen = true;
  }
}
