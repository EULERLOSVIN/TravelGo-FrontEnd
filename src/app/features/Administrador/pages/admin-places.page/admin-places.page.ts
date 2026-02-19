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
  allPlaces: Place[] = []; // Master list
  places: Place[] = []; // Filtered list
  searchTerm: string = '';

  // Pagination
  paginatedPlaces: Place[] = [];
  currentPage = 1;
  pageSize = 15;
  totalPages = 1;
  Math = Math;

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
        this.allPlaces = data || [];
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (e) => console.error('Error cargando lugares', e)
    });
  }

  applyFilters() {
    let temp = [...this.allPlaces];

    // Filter by Search Term
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      temp = temp.filter(s =>
        s.name.toLowerCase().includes(term) ||
        (s.description || '').toLowerCase().includes(term)
      );
    }

    this.places = temp;
    this.currentPage = 1; // Reset to first page
    this.updatePagination();
  }

  updatePagination() {
    this.totalPages = Math.ceil(this.places.length / this.pageSize) || 1;
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.paginatedPlaces = this.places.slice(start, end);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePagination();
    }
  }

  getPages(): number[] {
    let start = Math.max(1, this.currentPage - 2);
    let end = Math.min(this.totalPages, start + 4);

    if (end - start < 4) {
      start = Math.max(1, end - 4);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
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
