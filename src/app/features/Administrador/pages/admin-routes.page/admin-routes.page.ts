import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterNewRouteComponent } from '../../components/register-new-route/register-new-route.component';
import { EditRouteComponent } from '../../components/edit-route/edit-route.component';
import { DeleteRouteComponent } from '../../components/delete-route/delete-route.component';

@Component({
  selector: 'app-admin-routes',
  standalone: true, // Asegurar standalone
  imports: [CommonModule, RegisterNewRouteComponent, EditRouteComponent, DeleteRouteComponent],
  templateUrl: './admin-routes.page.html',
  styleUrl: './admin-routes.page.scss',
})
export class AdminRoutesComponent {

  // MODAL STATES
  isModalOpen = false;       // Nuevo
  isEditModalOpen = false;   // Editar
  isDeleteModalOpen = false; // Eliminar (Feedback)

  // DATA STATES
  selectedRoute: any = null; // Ruta seleccionada para editar

  openModal() {
    this.isModalOpen = true;
  }

  openEditModal(routeData: any) {
    this.selectedRoute = routeData;
    this.isEditModalOpen = true;
  }

  openDeleteModal() {
    this.isDeleteModalOpen = true;
  }
}
