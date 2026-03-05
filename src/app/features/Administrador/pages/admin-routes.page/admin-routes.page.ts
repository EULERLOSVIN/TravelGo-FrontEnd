// rutas=darwin
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegisterNewRouteComponent } from '../../components/register-new-route/register-new-route.component';
import { EditRouteComponent } from '../../components/edit-route/edit-route.component';
import { DeleteRouteComponent } from '../../components/delete-route/delete-route.component';
import { RoutesService} from '../../services/routes.service';
import { TravelRouteModel } from '../../models/TravelRoute.model';

@Component({
  selector: 'app-admin-routes',
  standalone: true,
  imports: [CommonModule, FormsModule, RegisterNewRouteComponent, EditRouteComponent, DeleteRouteComponent],
  templateUrl: './admin-routes.page.html',
  styleUrl: './admin-routes.page.scss',
})
export class AdminRoutesComponent implements OnInit {
  allRoutes: TravelRouteModel[] = []; // Ruta Maestra
  routes: TravelRouteModel[] = []; // Vista Filtrada

  // Departure times per route: { [idTravelRoute]: string[] }
  routeDepartureTimes: Record<number, string[]> = {};

  // Stats
  statsRoute = {
    total: 0,
    activas: 0,
    inactivas: 0
  }

  // Filters
  searchTerm: string = '';
  filterState = 'active'; // 'all', 'active', 'inactive'

  // Pagination
  paginatedRoutes: TravelRouteModel[] = [];
  currentPage = 1;
  pageSize = 15;
  totalPages = 1;
  Math = Math; // Expose Math to template

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
        this.allRoutes = data || [];

        // Calcular contadores reales
        this.statsRoute.total = this.allRoutes.length;
        this.statsRoute.activas = this.allRoutes.filter(r => r.isActive !== false).length;
        this.statsRoute.inactivas = this.allRoutes.filter(r => r.isActive === false).length;

        // Inicializar lista filtrada
        this.applyFilters();
        this.cdr.detectChanges();

        // Load departure times for each route
        this.allRoutes.forEach(r => {
          if (r.idTravelRoute) {
            this.loadDepartureTimes(r.idTravelRoute);
          }
        });
      },
      error: (e) => console.error('Error al cargar rutas', e)
    });
  }

  loadDepartureTimes(idTravelRoute: number) {
    this.routesService.getDepartureTimesByRoute(idTravelRoute).subscribe({
      next: (times) => {
        // Convertir "HH:mm:ss" a "HH:mm" para mostrar más limpio
        this.routeDepartureTimes[idTravelRoute] = times.map(t => t.hour.substring(0, 5));
        this.cdr.detectChanges();
      },
      error: () => {
        this.routeDepartureTimes[idTravelRoute] = [];
      }
    });
  }

  applyFilters() {
    let temp = [...this.allRoutes];

    // 1. Filtrar por Estado
    if (this.filterState === 'active') {
      temp = temp.filter(r => r.isActive !== false);
    } else if (this.filterState === 'inactive') {
      temp = temp.filter(r => r.isActive === false);
    }

    // 2. Filtrar por Texto Buscado
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      temp = temp.filter(r =>
        r.nameRoute.toLowerCase().includes(term)
      );
    }

    this.routes = temp;
    this.currentPage = 1; // Reset to first page on filter
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.routes.length / this.pageSize) || 1;
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedRoutes = this.routes.slice(start, end);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  getPages(): number[] {
    // Simple pagination logic to show max 5 buttons
    let start = Math.max(1, this.currentPage - 2);
    let end = Math.min(this.totalPages, start + 4);

    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }

  setFilterState(state: string) {
    this.filterState = state;
    this.applyFilters();
  }

  openEdit(route: any) {
    this.selectedRoute = { ...route };
    this.isEditModalOpen = true;
  }

  openDelete(route: any) {
    this.selectedRoute = route;
    this.isDeleteModalOpen = true;
  }
}
