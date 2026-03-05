import { Component, OnInit } from '@angular/core';
import { TripService } from '../../services/trip.service';
import { ChangeDetectorRef } from '@angular/core';
import { TripMadeModel } from '../../models/TripMade.model';

@Component({
  selector: 'app-driver-main.page',
  imports: [],
  templateUrl: './driver-main.page.html',
  styleUrl: './driver-main.page.scss',
})
export class DriverMainPage implements OnInit {
  departureOrder: number = 0;
  accountId: number = 0;

  Trips: TripMadeModel[] = []

  constructor(
    private tripService: TripService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.getParamsOfLocalStorage();
    console.log("Account ID recuperado:", this.accountId);
    if (this.accountId > 0) {
      this.getDepartureOrderOfDriver();
      this.getTripsMadeOfDriver();
    }
  }

  getParamsOfLocalStorage() {
    const idAccountString = localStorage.getItem('idAccount');
    this.accountId = idAccountString ? parseInt(idAccountString, 10) : 0
  }

  getDepartureOrderOfDriver(): void {
    this.tripService.getStartingOrderOfDriver(this.accountId).subscribe({
      next: (response) => {
        if (response.isSuccess) {
          this.departureOrder = response.value
          console.log("numero de orden:" + response.value);
          this.cdr.detectChanges();
        }
      },
      error: (err) => {
        console.log("Error al obtener order de la cola" + err);
      }

    });
  }

  getTripsMadeOfDriver(): void {
    this.tripService.getTripsMadeByDriver(this.accountId, 0).subscribe(
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
}
