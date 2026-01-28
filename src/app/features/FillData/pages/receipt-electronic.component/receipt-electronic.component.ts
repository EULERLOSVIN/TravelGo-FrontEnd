import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-receipt-electronic',
  imports: [],
  templateUrl: './receipt-electronic.component.html',
  styleUrl: './receipt-electronic.component.scss',
})
export class ReceiptElectronicComponent {
  
  status: 'success' | 'error' = 'success';

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.status = params['status'] === 'error' ? 'error' : 'success';
    });
  }

}
