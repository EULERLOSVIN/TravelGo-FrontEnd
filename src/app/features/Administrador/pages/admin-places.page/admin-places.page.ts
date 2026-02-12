import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NewPlacesComponent } from '../../components/new-places/new-places.component';
import { EditPlacesComponent } from '../../components/edit-places/edit-places.component';
import { DeletePlacesComponent } from '../../components/delete-places/delete-places.component';

@Component({
  selector: 'places',
  imports: [CommonModule, FormsModule, NewPlacesComponent, EditPlacesComponent, DeletePlacesComponent],
  templateUrl: './admin-places.page.html',
  styleUrl: './admin-places.page.scss',
})
export class AdminPlacesPage {
  searchTerm: string = '';
  isNewModalOpen = false;
  isEditModalOpen = false;
  isDeleteModalOpen = false;

  selectedPlace: any = null;

  sedes = [
    {
      nombre: 'Sede Central',
      descripcion: 'Oficina principal'
    },
    {
      nombre: 'Sede Norte',
      descripcion: 'Área operativa'
    }
  ];

  // Getter para filtrar las sedes
  get filteredSedes() {
    return this.sedes.filter(s =>
      s.nombre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      s.descripcion.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openNew() {
    this.isNewModalOpen = true;
  }

  openEdit(place: any) {
    this.selectedPlace = place;
    this.isEditModalOpen = true;
  }

  openDelete(place: any) {
    this.selectedPlace = place;
    this.isDeleteModalOpen = true;
  }
}
