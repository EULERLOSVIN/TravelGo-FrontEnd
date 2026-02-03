import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-summary.page.html',
  styleUrl: './admin-summary.page.scss',
})
export class AdminSummaryComponent {
  currentMonth: string = 'Febrero 2024';

  // Métricas Financieras Corporativas
  financialStats = [
    { label: 'Egresos Planilla', value: 'S/ 18,500', trend: 'Secretaría/Limpieza', icon: 'bi-people-fill', color: '#10b981' },
    { label: 'Impuestos (SUNAT)', value: 'S/ 4,200', trend: 'Pendiente Pago', icon: 'bi-bank', color: '#ef4444' },
    { label: 'Salidas del Día', value: '32 Vehículos', trend: 'Carga Máxima', icon: 'bi-bus-front-fill', color: '#3b82f6' },
    { label: 'Servicios Terceros', value: 'S/ 2,850', trend: 'Mantenimiento/Luz', icon: 'bi-box-seam', color: '#f59e0b' }
  ];

  // Desglose de Pagos Administrativos
  expenseBreakdown = [
    { label: 'Planilla Secretarias', percentage: 40, amount: 'S/ 7,400', color: '#3b82f6' },
    { label: 'Personal Limpieza', percentage: 25, amount: 'S/ 4,625', color: '#10b981' },
    { label: 'Impuestos de Ley', percentage: 20, amount: 'S/ 3,700', color: '#ef4444' },
    { label: 'Mantenimiento Sede', percentage: 15, amount: 'S/ 2,775', color: '#f59e0b' }
  ];

  // Rutas con Mayor Demanda y Tráfico
  topRoutes = [
    { name: 'Tingo María - Aucayacu', tickets: 580, growth: 'Ruta más saturada' },
    { name: 'Huánuco - Tingo María', tickets: 420, growth: 'Alta demanda' },
    { name: 'Tingo María - Monzón', tickets: 190, growth: 'Crecimiento +15%' },
    { name: 'Salidas Locales', tickets: 120, growth: 'Estable' }
  ];
}
