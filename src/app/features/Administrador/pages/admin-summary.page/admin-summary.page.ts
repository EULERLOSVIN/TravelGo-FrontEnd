import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { delay } from 'rxjs';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardModel } from '../../models/Dashboard.model';

@Component({
  selector: 'app-admin-summary',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-summary.page.html',
  styleUrl: './admin-summary.page.scss',
})
export class AdminSummaryComponent implements OnInit {
  currentDate: string = '';
  dashboardData: DashboardModel = {
    dailyMetrics: {
      todayIncome: 0, yesterdayIncome: 0, incomeTrendPercentage: 0,
      todayTicketsSold: 0, yesterdayTicketsSold: 0, ticketsTrendPercentage: 0,
      occupancyRate: 0, totalVehiclesInRoute: 0, totalVehiclesInQueue: 0
    },
    topRoutes: [],
    hourlyDemand: [],
    upcomingDepartures: [],
    activeAlerts: [],
    recentActivity: [],
    salesByChannel: []
  };
  loading: boolean = true;
  error: boolean = false;
  kpiCards: any[] = [];

  constructor(
    private dashboardService: DashboardService,
    private cd: ChangeDetectorRef
  ) {
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
    this.dashboardService.getSummary()
      .pipe(delay(1500))
      .subscribe({
        next: (result) => {
          if (result.isSuccess) {
            this.dashboardData = result.value;
            this.updateKpiCards();
          } else {
            this.error = true;
          }
          this.loading = false;
          this.cd.detectChanges();
        },
        error: () => {
          this.error = true;
          this.loading = false;
          this.cd.detectChanges();
        }
      });
  }

  updateKpiCards() {
    if (!this.dashboardData) {
      this.kpiCards = [];
      return;
    }

    this.kpiCards = [
      {
        label: 'Ingresos Hoy',
        value: `S/ ${this.dashboardData.dailyMetrics.todayIncome.toLocaleString('es-PE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
        trend: this.dashboardData.dailyMetrics.incomeTrendPercentage,
        icon: 'bi-bank',
        color: 'success'
      },
      {
        label: 'Ventas Totales',
        value: this.dashboardData.dailyMetrics.todayTicketsSold.toString(),
        trend: this.dashboardData.dailyMetrics.ticketsTrendPercentage,
        icon: 'bi-ticket-detailed',
        color: 'primary'
      },
      {
        label: 'Ocupación Promedio',
        value: `${this.dashboardData.dailyMetrics.occupancyRate}%`,
        icon: 'bi-grid-3x3-gap',
        color: 'warning',
        isProgress: true
      },
      {
        label: 'Unidades en Ruta',
        value: `${this.dashboardData.dailyMetrics.totalVehiclesInRoute} / ${this.dashboardData.dailyMetrics.totalVehiclesInRoute + this.dashboardData.dailyMetrics.totalVehiclesInQueue}`,
        sub: `${this.dashboardData.dailyMetrics.totalVehiclesInQueue} en cola`,
        icon: 'bi-bus-front',
        color: 'info'
      }
    ];
  }

  getTrendClass(percentage: number): string {
    return percentage >= 0 ? 'positive' : 'negative';
  }

  getTrendIcon(percentage: number): string {
    return percentage >= 0 ? 'bi-arrow-up-short' : 'bi-arrow-down-short';
  }
}
