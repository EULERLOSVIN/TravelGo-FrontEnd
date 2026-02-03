import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterNewSedeComponent } from '../../components/register-new-sede/register-new-sede.component';
import { EditSedeComponent } from '../../components/edit-sede/edit-sede.component';
import { DeleteSedeComponent } from '../../components/delete-sede/delete-sede.component';

@Component({
    selector: 'app-admin-sede',
    standalone: true,
    imports: [CommonModule, RegisterNewSedeComponent, EditSedeComponent, DeleteSedeComponent],
    templateUrl: './admin-sede.page.html',
    styleUrl: './admin-sede.page.scss'
})
export class AdminSedeComponent {
    isRegisterModalOpen = false;
    isEditModalOpen = false;
    isDeleteModalOpen = false;
    selectedSede: any = null;

    openRegisterModal() {
        this.isRegisterModalOpen = true;
    }

    closeRegisterModal() {
        this.isRegisterModalOpen = false;
    }

    openEditModal(sede: any) {
        this.selectedSede = sede;
        this.isEditModalOpen = true;
    }

    closeEditModal() {
        this.isEditModalOpen = false;
    }

    openDeleteModal(sede: any) {
        this.selectedSede = sede;
        this.isDeleteModalOpen = true;
    }

    closeDeleteModal() {
        this.isDeleteModalOpen = false;
    }

    confirmDelete() {
        console.log('Eliminando sede:', this.selectedSede);
        // Lógica real de eliminación aquí
        // this.closeDeleteModal(); // Se comenta para permitir ver el paso de éxito
    }
}
