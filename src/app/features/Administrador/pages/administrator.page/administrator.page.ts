import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-administrator',
  standalone: true,
  imports: [
    CommonModule,   // 👈 necesario para *ngIf
    FormsModule     // 👈 necesario para ngModel
  ],
  templateUrl: './administrator.page.html',
  styleUrl: './administrator.page.scss',
})
export class AdministratorComponent {

  /* ===============================
     STATE
  ================================ */
  editMode = false;

  admin = {
    name: 'Darwin Chamaya',
    email: 'darwin.chamaya@travelgo.com',
    phone: '+34 600 000 000',
    dni: '12345678X',
    status: 'ACTIVO',
    role: 'Administrador General',
    id: '4589201',
  };

  private backup = { ...this.admin };

  /* ===============================
     ACTIONS
  ================================ */
  toggleEdit(): void {
    this.editMode = true;
    this.backup = { ...this.admin };
  }

  cancelEdit(): void {
    this.admin = { ...this.backup };
    this.editMode = false;
  }

  saveChanges(): void {
    console.log('Guardado:', this.admin);
    this.editMode = false;
  }
}
