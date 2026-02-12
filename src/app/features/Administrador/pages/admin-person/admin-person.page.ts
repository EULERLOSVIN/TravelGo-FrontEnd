import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RegisterNewPersonComponent } from '../../components/register-new-person/register-new-person.component';
import { EditPersonComponent } from '../../components/edit-person/edit-person.component';
import { DeletePersonComponent } from '../../components/delete-person/delete-person.component';
import { PersonnelModel } from '../../models/personnel.model';
import { GetPersonnelService } from '../../services/get-personnel.service';
import { StatsPersonnelModel } from '../../models/statsPersonnel.model';
import { GetStatsUsersService } from '../../services/get-stats-users.service';


@Component({
  selector: 'app-admin-person',
  standalone: true,
  imports: [CommonModule, RegisterNewPersonComponent, EditPersonComponent, DeletePersonComponent],
  templateUrl: './admin-person.page.html',
  styleUrl: './admin-person.page.scss',
})
export class AdminPersonComponent implements OnInit {
  // @ViewChild('editModal') editModal!: ElementRef;
  // @ViewChild('deleteModal') deleteModal!: ElementRef;
  // @Input() selectedPerson: PersonnelModel | null = null;


  // VARIABLES DE MODAL
  isRegisterModalOpen = false;
  // isDeleteModalOpen = false;

  // VARIABLES DE DATOS
  personnelList: PersonnelModel[] = [];
  searchTerm: string = '';
  pageNumber: number = 1;
  isLastPage: boolean = false;
  isLoading: boolean = false;

  statsPersonnel: StatsPersonnelModel = {
    totalUsers: 0,
    usersActive: 0,
    usersInactive: 0
  };

  constructor(
    private personnelService: GetPersonnelService,
    private statsService: GetStatsUsersService,
    private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.loadStatsPersonnel();
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

  loadStatsPersonnel() {
    this.statsService.getStatsUsers().subscribe({
      next: (data) => {
        this.statsPersonnel = data;
        console.log('Estadísticas de personal:', this.statsPersonnel);
      },
      error: (err) => {
        console.error('Error al cargar estadísticas de personal:', err);
      },
    });
  }

  getBadgeColor(state: string): string {
    switch (state.toLowerCase()) {
      case 'activo':
        return 'bg-success';
      case 'inactivo':
        return 'bg-danger';
      default:
        return 'bg-secondary';
    }
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

  //MÉTODOS DE MODAL
  openRegisterModal(): void {
    this.isRegisterModalOpen = true;
  }
}
