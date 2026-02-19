import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RegisterNewSedeComponent } from '../../components/register-new-sede/register-new-sede.component';
import { EditSedeComponent } from '../../components/edit-sede/edit-sede.component';
import { DeleteSedeComponent } from '../../components/delete-sede/delete-sede.component';
import { Headquarter } from '../../models/headquarter.model';
import { HeadquartersService } from '../../services/headquarters.service';

@Component({
    selector: 'app-admin-sede',
    standalone: true,
    imports: [CommonModule, FormsModule, RegisterNewSedeComponent, EditSedeComponent, DeleteSedeComponent],
    templateUrl: './admin-sede.page.html',
    styleUrl: './admin-sede.page.scss'
})
export class AdminSedeComponent implements OnInit {
    allSedes: Headquarter[] = []; // Master list
    sedes: Headquarter[] = []; // Filtered list for display

    // Stats
    totalSedes = 0;
    activeSedes = 0;
    inactiveSedes = 0;

    // Filters
    searchTerm = '';
    filterState = 'all'; // 'all', 'active', 'inactive'

    // Pagination
    paginatedSedes: Headquarter[] = [];
    currentPage = 1;
    pageSize = 15;
    totalPages = 1;
    Math = Math; // Expose Math to template

    isRegisterModalOpen = false;
    isEditModalOpen = false;
    isDeleteModalOpen = false;
    selectedSede: Headquarter | null = null;
    isLoading = false;

    constructor(
        private headquartersService: HeadquartersService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit() {
        this.loadSedes();
    }

    loadSedes() {
        this.isLoading = true;
        console.log('Iniciando carga de sedes...');
        this.headquartersService.getAll().subscribe({
            next: (data) => {
                console.log('Sedes cargadas:', data);
                this.allSedes = data || [];

                // Calcular estadísticas
                this.totalSedes = this.allSedes.length;
                this.activeSedes = this.allSedes.filter(s => s.stateHeadquarter === 'Activa' || s.stateHeadquarter === 'Activo').length;
                this.inactiveSedes = this.allSedes.filter(s => s.stateHeadquarter === 'Inactiva' || s.stateHeadquarter === 'Inactivo').length;

                // Inicializar lista filtrada
                this.applyFilters();

                this.isLoading = false;
                this.cdr.detectChanges();
            },
            error: (err) => {
                console.error('Error cargando sedes', err);
                this.isLoading = false;
                this.cdr.detectChanges();
            }
        });
    }

    applyFilters() {
        let temp = [...this.allSedes];

        // 1. Filtrar por Estado
        if (this.filterState === 'active') {
            temp = temp.filter(s => s.stateHeadquarter === 'Activa' || s.stateHeadquarter === 'Activo');
        } else if (this.filterState === 'inactive') {
            temp = temp.filter(s => s.stateHeadquarter === 'Inactiva' || s.stateHeadquarter === 'Inactivo');
        }

        // 2. Filtrar por Texto Buscado
        if (this.searchTerm.trim()) {
            const term = this.searchTerm.toLowerCase();
            temp = temp.filter(s =>
                s.name.toLowerCase().includes(term) ||
                s.address.toLowerCase().includes(term) ||
                (s.department + ' ' + s.province + ' ' + s.district).toLowerCase().includes(term) ||
                s.email?.toLowerCase().includes(term) ||
                s.phone.includes(term)
            );
        }

        this.sedes = temp;
        this.currentPage = 1; // Reset to first page on filter
        this.updatePagination();
    }

    updatePagination() {
        this.totalPages = Math.ceil(this.sedes.length / this.pageSize) || 1;
        const start = (this.currentPage - 1) * this.pageSize;
        const end = start + this.pageSize;
        this.paginatedSedes = this.sedes.slice(start, end);
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

    openRegisterModal() {
        this.isRegisterModalOpen = true;
    }

    closeRegisterModal(result?: any) {
        this.isRegisterModalOpen = false;
        if (result) {
            this.loadSedes(); // Recargar si hubo cambios
        }
    }

    openEditModal(sede: Headquarter) {
        this.selectedSede = sede;
        this.isEditModalOpen = true;
    }

    closeEditModal(result?: any) {
        this.isEditModalOpen = false;
        this.selectedSede = null;
        if (result) {
            this.loadSedes();
        }
    }

    openDeleteModal(sede: Headquarter) {
        this.selectedSede = sede;
        this.isDeleteModalOpen = true;
    }

    closeDeleteModal() {
        this.isDeleteModalOpen = false;
        this.selectedSede = null;
        this.loadSedes();
    }

    confirmDelete() {
        if (this.selectedSede) {
            this.headquartersService.delete(this.selectedSede.idHeadquarter).subscribe({
                next: () => {
                    // La modal se encarga de mostrar éxito
                },
                error: (err) => console.error('Error eliminando sede', err)
            });
        }
    }
}
