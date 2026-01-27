import { CommonModule } from '@angular/common';
import { Component, ViewChild } from '@angular/core';
import { ModalPayComponent } from "../../components/modal-pay.component/modal-pay.component";
import { ValidationPayComponent } from "../../components/validation-pay.component/validation-pay.component";

@Component({
  selector: 'app-fill-data',
  imports: [ModalPayComponent, ValidationPayComponent],
  templateUrl: './fill-data.component.html',
  styleUrl: './fill-data.component.scss',
  
})
export class FillDataComponent {
  

}
