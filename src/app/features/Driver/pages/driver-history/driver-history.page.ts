import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';
import { TripService } from '../../services/trip.service';
import { ChangeDetectorRef } from '@angular/core';
import { TripMadeModel } from '../../models/TripMade.model';
import { FormsModule } from '@angular/forms';
import { StatisticsSummaryDriverModel } from '../../models/StatisticsSummaryDriver.model';

@Component({
  selector: 'app-driver-history.page',
  imports: [FormsModule],
  templateUrl: './driver-history.page.html',
  styleUrl: './driver-history.page.scss',
})
export class DriverHistoryPage implements OnInit {

  accountId: number = 0;
  Trips: TripMadeModel[] = [];
  selectedFilter: number = 0;
  staticsSummary: StatisticsSummaryDriverModel | null = null;

  ngOnInit(): void {
    this.getParamsOfLocalStorage();
    if (this.accountId > 0) {
      this.getTripsMadeOfDriver();
      this.getStaticsSummaryOfTrips()
    }
  }

  constructor(
    private tripService: TripService,
    private cdr: ChangeDetectorRef
  ) { }

  listFilters = [
    { id: 1, time: "Hoy", equivalentDay: 0 },
    { id: 2, time: "Hace 1 semana", equivalentDay: 7 },
    { id: 3, time: "Hace 2 semana", equivalentDay: 14 },
    { id: 4, time: "Hace 3 semana", equivalentDay: 21 },
    { id: 5, time: "Hace 1 mes", equivalentDay: 30 }
  ]

  getParamsOfLocalStorage() {
    const idAccountString = localStorage.getItem('idAccount');
    this.accountId = idAccountString ? parseInt(idAccountString, 10) : 0
  }

  getTripsMadeOfDriver(): void {
    this.tripService.getTripsMadeByDriver(this.accountId, this.selectedFilter).subscribe(
      {
        next: (response) => {
          if (response.isSuccess) {
            this.Trips = response.value;
            console.log(this.Trips);
            this.cdr.detectChanges();
          }
        },
        error: (err) => {
          console.log("Error al obtener los viajes realizados" + err);
        }
      }
    );
  }

  getStaticsSummaryOfTrips(): void{
    this.tripService.getStatisticsSummaryOfTrips(this.accountId).subscribe(
    {
      next:(response) =>{
        if(response.isSuccess){
          this.staticsSummary = response.value;
          this.cdr.detectChanges();
          console.log(this.staticsSummary);
        }
      },
      error:(err) => {
        console.log(err);
      }
    });
  }

  getBadgeClass(state: string) {
    switch (state) {
      case 'Completado': return 'bg-success';
      case 'En Ruta': return 'bg-primary';
      case 'Cancelado': return 'bg-danger';
      default: return 'bg-secondary';

    }
  }
}
