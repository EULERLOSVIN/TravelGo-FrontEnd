import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NewPlacesComponent } from '../../components/new-places/new-places.component';
import { EditPlacesComponent } from '../../components/edit-places/edit-places.component';
import { DeletePlacesComponent } from '../../components/delete-places/delete-places.component';
import { PlacesService, Place } from '../../services/places.service';

@Component({
  selector: 'places',
  standalone: true,
  imports: [CommonModule, FormsModule, NewPlacesComponent, EditPlacesComponent, DeletePlacesComponent],
  templateUrl: './admin-places.page.html',
  styleUrl: './admin-places.page.scss',
})
export class AdminPlacesPage implements OnInit {
  places: Place[] = [];
  searchTerm: string = '';

  isNewModalOpen = false;
  isEditModalOpen = false;
  isDeleteModalOpen = false;

  selectedPlace: any = null;

  constructor(private placesService: PlacesService, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.loadPlaces();
  }

  loadPlaces() {
    this.placesService.getAll().subscribe({
      next: (data) => {
        this.places = data;
        this.cdr.detectChanges();
      },
      error: (e) => console.error('Error cargando lugares', e)
    });
  }

  get filteredSedes() {
    return this.places.filter(s =>
      s.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      (s.description || '').toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  openNew() {
    this.isNewModalOpen = true;
  }

  openEdit(place: any) {
    this.selectedPlace = { ...place };
    this.isEditModalOpen = true;
  }

  openDelete(place: any) {
    this.selectedPlace = place;
    this.isDeleteModalOpen = true;
  }
}
