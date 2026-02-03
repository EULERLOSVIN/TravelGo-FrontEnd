import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// COMPONENTES HIJOS
import { RegisterNewPersonComponent } from '../../components/register-new-person/register-new-person.component';
import { EditPersonComponent } from '../../components/edit-person/edit-person.component';
import { DeletePersonComponent } from '../../components/delete-person/delete-person.component';

@Component({
  selector: 'app-admin-person',
  standalone: true,
  imports: [
    CommonModule,
    RegisterNewPersonComponent,
    EditPersonComponent,
    DeletePersonComponent
  ],
  templateUrl: './admin-person.page.html',
  styleUrl: './admin-person.page.scss'
})
export class AdminPersonComponent {

  // VARS MODALES
  isRegisterModalOpen = false;
  isEditModalOpen = false;
  isDeleteModalOpen = false;

  // VARS DATA
  selectedPerson: any = null;

  personalList = [
    { id: 1, name: 'Ana Lucía Martínez', role: 'Secretaria', dni: '45678901', phone: '987 654 321', status: 'active', user: 'amartinez' },
    { id: 2, name: 'Carlos Ruiz', role: 'Chofer', dni: '12345678', phone: '999 888 777', status: 'active', user: 'cruiz' },
    { id: 3, name: 'Jorge Soto', role: 'Administrador', dni: '87654321', phone: '912 345 678', status: 'inactive', user: 'jsoto' }
  ];

  /* ----------------------
     METODOS
     ---------------------- */

  openRegisterModal() {
    this.isRegisterModalOpen = true;
  }

  openEditModal(person: any) {
    this.selectedPerson = person;
    this.isEditModalOpen = true;
  }

  openDeleteModal() {
    this.isDeleteModalOpen = true;
  }

}
