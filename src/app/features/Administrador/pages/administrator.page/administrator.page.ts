import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-administrator',
  standalone: true,
  imports: [
    CommonModule,   // 👈 necesario para *ngIf
    FormsModule     // 👈 necesario para ngModel
  ],
  templateUrl: './administrator.page.html',
  styleUrl: './administrator.page.scss',
})
export class AdministratorComponent {
  currentTime: Date = new Date();
  adminName: string = 'Darwin Chamaya';

  // Stats para el Dashboard
  stats = [
    { label: 'Ventas de Hoy', value: 'S/ 4,250.00', icon: 'bi-currency-dollar', color: '#10b981', trend: '+12%' },
    { label: 'Buses en Ruta', value: '18', icon: 'bi-bus-front', color: '#3b82f6', trend: 'Estable' },
    { label: 'Viajes Pendientes', value: '7', icon: 'bi-calendar-event', color: '#f59e0b', trend: '-2' },
    { label: 'Alertas Sistema', value: '3', icon: 'bi-exclamation-triangle', color: '#ef4444', trend: 'Crítico' }
  ];

  // Actividades Recientes
  recentActivity = [
    { type: 'route', title: 'Nueva ruta: Tingo María - Lima', time: 'Hace 5 min', icon: 'bi-plus-circle-fill' },
    { type: 'assignment', title: 'Bus B-402 asignado a Ruta sur', time: 'Hace 15 min', icon: 'bi-check-circle-fill' },
    { type: 'alert', title: 'Mantenimiento preventivo: Bus A-105', time: 'Hace 1 hora', icon: 'bi-tools' },
    { type: 'sale', title: 'Meta de ventas diaria alcanzada', time: 'Hace 2 horas', icon: 'bi-trophy-fill' }
  ];

  // Accesos Rápidos
  quickActions = [
    { label: 'Nueva Ruta', icon: 'bi-map', color: '#eff6ff', textColor: '#2563eb' },
    { label: 'Reporte Diario', icon: 'bi-file-earmark-bar-graph', color: '#f0fdf4', textColor: '#16a34a' },
    { label: 'Gestionar Buses', icon: 'bi-truck-front', color: '#fffbeb', textColor: '#d97706' },
    { label: 'Usuarios', icon: 'bi-people', color: '#faf5ff', textColor: '#9333ea' }
  ];

  formatDate(date: Date): string {
    return date.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
  }
}
