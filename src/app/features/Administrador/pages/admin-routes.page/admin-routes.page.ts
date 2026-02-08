import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterNewRouteComponent } from '../../components/register-new-route/register-new-route.component';
import { EditRouteComponent } from '../../components/edit-route/edit-route.component';
import { DeleteRouteComponent } from '../../components/delete-route/delete-route.component';

@Component({
  selector: 'app-admin-routes',
  standalone: true,
  imports: [CommonModule, RegisterNewRouteComponent, EditRouteComponent, DeleteRouteComponent],
  templateUrl: './admin-routes.page.html',
  styleUrl: './admin-routes.page.scss',
})
export class AdminRoutesComponent {
  isModalOpen = false;
  isEditModalOpen = false;
  isDeleteModalOpen = false;
  selectedRoute: any = null;

  openEdit(route: any) {
    this.selectedRoute = route;
    this.isEditModalOpen = true;
  }
}
