import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from "@angular/common";
import { CardSelectSeatComponent } from "../../components/card-select-seat/card-select-seat.component";
import { CardPurchaseDetailComponent } from "../../components/card-purchase-detail/card-purchase-detail.component";
import { ActivatedRoute } from '@angular/router';
import { GetSeatByIdOfVehicleService } from '../../services/get-seat-by-id-of-vehicle.service';
import { Result } from '../../../../shared/models/result.model';
import { SeatModal } from '../../models/seat.modal';

@Component({
  selector: 'app-select-seat',
  imports: [CommonModule, CardSelectSeatComponent, CardPurchaseDetailComponent],
  templateUrl: './select-seat.page.html',
  styleUrl: './select-seat.page.scss',
})
export class SelectSeatPage implements OnInit {
  selectionData = signal<{ idVehicle: number; idRoute: number, price: number, departureHour: string,nameRoute: string } | null>(null);
  seatsSelectedInView: SeatModal[] = [];

  constructor(
    private route: ActivatedRoute,
    private getSeatService: GetSeatByIdOfVehicleService
  ) { }

  // En select-seat.page.ts
  ngOnInit(): void {
    this.route.queryParams.pipe(
      // Es una buena práctica usar operators si necesitas transformar algo
    ).subscribe(params => {
      // Usamos Number() para asegurar que el cálculo matemático no falle después
      const idVehicle = Number(params["vehicleId"]);
      const idRoute = Number(params["routeId"]);
      const price = Number(params["price"]);
      const departureHour = params["departureHour"];
      const nameRoute = params["nameRoute"];

      if (idVehicle && idRoute) {
        this.selectionData.set({ idVehicle, idRoute, price, departureHour,nameRoute  });
      }
    });
  }
  onSeatsChanged(seats: SeatModal[]) {
    this.seatsSelectedInView = seats;
  }
}
