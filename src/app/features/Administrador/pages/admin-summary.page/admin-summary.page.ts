import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardModel } from '../../models/Dashboard.model';

@Component({
  selector: 'app-admin-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-summary.page.html',
  styleUrl: './admin-summary.page.scss',
})
export class AdminSummaryComponent implements OnInit {
  currentDate: string = '';
  dashboardData?: DashboardModel;
  loading: boolean = true;
  error: boolean = false;

  constructor(private dashboardService: DashboardService) {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    this.currentDate = today.toLocaleDateString('es-ES', options);
  }

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading = true;
    this.error = false;
    this.dashboardService.getSummary().subscribe({
      next: (result) => {
        if (result.isSuccess) {
          this.dashboardData = result.value;
        } else {
          this.error = true;
        }
        this.loading = false;
      },
      error: () => {
        this.error = true;
        this.loading = false;
      }
    });
  }

  getTrendClass(percentage: number): string {
    return percentage >= 0 ? 'positive' : 'negative';
  }

  getTrendIcon(percentage: number): string {
    return percentage >= 0 ? 'bi-arrow-up-short' : 'bi-arrow-down-short';
  }
}
