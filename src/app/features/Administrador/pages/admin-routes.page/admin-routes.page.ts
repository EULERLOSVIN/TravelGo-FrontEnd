// rutas=darwin

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegisterNewRouteComponent } from '../../components/register-new-route/register-new-route.component';
import { EditRouteComponent } from '../../components/edit-route/edit-route.component';
import { DeleteRouteComponent } from '../../components/delete-route/delete-route.component';
import { RoutesService, TravelRoute } from '../../services/routes.service';

@Component({
  selector: 'app-admin-routes',
  standalone: true,
  imports: [CommonModule, FormsModule, RegisterNewRouteComponent, EditRouteComponent, DeleteRouteComponent],
  templateUrl: './admin-routes.page.html',
  styleUrl: './admin-routes.page.scss',
})
export class AdminRoutesComponent implements OnInit {
  routes: TravelRoute[] = [];
  searchTerm: string = ''; // Para la búsqueda

  isModalOpen = false;
  isEditModalOpen = false;
  isDeleteModalOpen = false;
  selectedRoute: any = null;

  constructor(private routesService: RoutesService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.loadRoutes();
  }

  loadRoutes() {
    this.routesService.getAll().subscribe({
      next: (data) => {
        this.routes = data;
        console.log('Rutas cargadas:', data);
        this.cdr.detectChanges(); // Forzar actualización de vista
      },
      error: (e) => console.error('Error al cargar rutas', e)
    });
  }

  // Filtro simple en frontend
  get filteredRoutes() {
    return this.routes.filter(r =>
      r.nameRoute.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openEdit(route: any) {
    this.selectedRoute = { ...route }; // Copia para no modificar directo
    this.isEditModalOpen = true;
  }

  openDelete(route: any) {
    this.selectedRoute = route;
    this.isDeleteModalOpen = true;
  }

  statsRoute  = {
    total:25,
    activas:24,
    inactivas:1
  }
}
