import { Component } from '@angular/core';
import { CommonModule } from "@angular/common";
import { CardSelectSeatComponent } from "../../components/card-select-seat/card-select-seat.component";
import { CardPurchaseDetailComponent } from "../../components/card-purchase-detail/card-purchase-detail.component";


@Component({
  selector: 'app-select-seat',
  imports: [CommonModule, CardSelectSeatComponent, CardPurchaseDetailComponent],
  templateUrl: './select-seat.page.html',
  styleUrl: './select-seat.page.scss',
})
export class SelectSeatPage {

}
