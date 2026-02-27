import { Component, Input } from '@angular/core';
import { CommonModule } from "@angular/common";
import { RouterLink } from '@angular/router';
import { SeatModal } from '../../models/seat.modal';

@Component({
  selector: 'app-card-purchase-detail',
  imports: [CommonModule, RouterLink],
  templateUrl: './card-purchase-detail.component.html',
  styleUrl: './card-purchase-detail.component.scss',
})
export class CardPurchaseDetailComponent {
  @Input() selectedSeats: SeatModal[] = [];
  @Input() priceSeat: number | undefined;
  @Input() idRoute: number | undefined;
  @Input() idVehicle: number | undefined;
  @Input() departureHour: string | undefined;
  @Input() nameRoute: string | undefined;

  get total(): number {
    if (!this.priceSeat) return 0;
    return this.selectedSeats.length * this.priceSeat;
  }

  get seatNumbers(): string {
    return this.selectedSeats.map(s => s.number).join(', ') || 'Ninguno';
  }

  // Nueva función para enviar solo los números de asiento
  getSerializedSeats(): string {
    return this.selectedSeats.map(s => s.number).join(',');
  }

}
