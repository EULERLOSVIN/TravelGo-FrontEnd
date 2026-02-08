import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterNewPersonComponent } from '../../components/register-new-person/register-new-person.component';
import { EditPersonComponent } from '../../components/edit-person/edit-person.component';
import { DeletePersonComponent } from '../../components/delete-person/delete-person.component';
import { PersonnelModel } from '../../models/personnel.model';
import { GetPersonnelService } from '../../services/get-personnel.service';

@Component({
  selector: 'app-admin-person',
  standalone: true,
  imports: [CommonModule, RegisterNewPersonComponent, EditPersonComponent, DeletePersonComponent],
  templateUrl: './admin-person.page.html',
  styleUrl: './admin-person.page.scss',
})
export class AdminPersonComponent implements OnInit {
  // VARIABLES DE MODAL
  isRegisterModalOpen = false;
  isEditModalOpen = false;
  isDeleteModalOpen = false;
  selectedPerson: PersonnelModel | null = null;

  // VARIABLES DE DATOS
  personnelList: PersonnelModel[] = [];
  searchTerm: string = '';
  pageNumber: number = 1;
  pageSize: number = 10;
  isLastPage: boolean = false;
  isLoading: boolean = false;

  constructor(
    private personnelService: GetPersonnelService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loadPersonnel();
  }

  loadPersonnel(): void {
    this.isLoading = true;

    const term = this.searchTerm?.trim() || '';
    const page = this.pageNumber || 1;

    this.personnelService.getPersonnel(term, page).subscribe({
      next: (data) => {
        this.personnelList = data ? [...data] : [];
        this.isLastPage = this.personnelList.length === 0;

        this.isLoading = false;

        this.cdr.detectChanges();

        console.log('Datos renderizados:', this.personnelList);
      },
      error: (err) => {
        console.error('Error al cargar personal:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      },
    });
  }

  onSearch(value: string): void {
    this.searchTerm = value;
    this.pageNumber = 1;
    this.loadPersonnel();
  }

  changePage(newPage: number): void {
    if (newPage < 1) return;
    if (newPage > this.pageNumber && this.isLastPage) return;

    this.pageNumber = newPage;
    this.loadPersonnel();

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // MÉTODOS DE MODAL
  openRegisterModal(): void {
    this.isRegisterModalOpen = true;
  }

  openEditModal(person: PersonnelModel): void {
    this.selectedPerson = person;
    this.isEditModalOpen = true;
  }

  openDeleteModal(person: PersonnelModel): void {
    this.selectedPerson = person;
    this.isDeleteModalOpen = true;
  }

  closeModals(): void {
    this.isRegisterModalOpen = false;
    this.isEditModalOpen = false;
    this.isDeleteModalOpen = false;
    this.selectedPerson = null;
  }
}
