import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { RegisterNewVehicleComponent } from '../../components/register-new-vehicle/register-new-vehicle.component';
import { VehiclesService } from '../../services/vehicles.service';
import { DetailVehicleModel } from '../../models/DetailVehicle.model';
import { SummaryStatisticalOfVehicleModel } from '../../models/SummaryStatisticalOfVehicle.model';
import { EditVehicleComponent } from '../../components/Modals/edit-vehicle/edit-vehicle.component';

@Component({
  selector: 'app-admin-vehicles',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RegisterNewVehicleComponent,
    EditVehicleComponent
  ],
  templateUrl: './admin-vehicles.page.html',
  styleUrl: './admin-vehicles.page.scss',
})

export class AdminVehiclesComponent implements OnInit {
  @ViewChild('miModal') modal !: RegisterNewVehicleComponent;
  @ViewChild('modalEditVehicle') modalEditVehicle !: EditVehicleComponent;

  // MODAL STATES
  selectedVehicle: DetailVehicleModel | null = null;
  vehiclesList: DetailVehicleModel[] = [];
  summaryStatisticalVehicle: SummaryStatisticalOfVehicleModel | null = null;


  searchTerm = '';
  isLoading: boolean = false;
  isLastPage: boolean = false;
  pageNumber: number = 1;

  constructor(
    private vehiclesService: VehiclesService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loadVehicles();
    this.loadDataStatisticalOfVehicle();
  }

  openModalRegisterVehicle() {
    this.modal.open();
  }

  openModalEditVehicle(vehicle: DetailVehicleModel) {
    console.log('enviando vehiculo desde el padre:', vehicle);
    this.modalEditVehicle.open(vehicle);
  }

  loadVehicles(): void {
    this.isLoading = true;
    const term = this.searchTerm?.trim() || '';
    const page = this.pageNumber || 1;

    this.vehiclesService.getVehiclesByFilters(this.searchTerm, this.pageNumber).subscribe({
      next: (response) => {
        this.vehiclesList = response.value;
        this.isLastPage = this.vehiclesList.length === 0;
        this.isLoading = false;
        this.cdr.detectChanges();

        console.log(response.value);
      },
      error: (err) => {
        console.error('Error al cargar personal:', err);
        this.isLoading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onSearch(value: string): void {
    this.searchTerm = value;
    this.pageNumber = 1;
    this.loadVehicles();
  }

  changePage(newPage: number): void {
    if (newPage < 1) return;
    if (newPage > this.pageNumber && this.isLastPage) return;

    this.pageNumber = newPage;
    this.loadVehicles();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  getBadgeColor(state: string): string {
    switch (state.toLowerCase()) {
      case 'activo':
        return 'bg-success';
      case 'inactivo':
        return 'bg-danger';
      default:
        return 'bg-secondary'
    }
  }

  loadDataStatisticalOfVehicle(): void {
    this.vehiclesService.getStatisticalSummaryOfVehicles().subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.summaryStatisticalVehicle = response.value;
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.log(err);
        this.cdr.detectChanges();
      }
    });
  }
}