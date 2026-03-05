import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ManageSalesService } from '../../services/manage-sales.service';
import { FilterOfManageSalesDto } from '../../models/FilterOfManageSales.model';
import { SaleModel } from '../../models/Sale.model';

@Component({
  selector: 'app-admin-sales',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-sales.page.html',
  styleUrl: './admin-sales.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdminSalesComponent implements OnInit {
  sales: SaleModel[] = [];
  routes: any[] = [];
  stateTickets: any[] = [];

  filters: FilterOfManageSalesDto = {
    page: 1,
    idRoute: null,
    stateTicket: null,
    fromDate: null,
    untilDate: null
  };

  isLastPage: boolean = false;
  readonly pageSize: number = 2; // Asegúrate de que coincida con tu backend

  constructor(
    private salesService: ManageSalesService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadFilters();
    this.loadSales();
  }

  loadFilters() {
    this.salesService.getFilters().subscribe(res => {
      if (res.isSuccess && res.value) {
        this.routes = res.value.routes;
        this.stateTickets = res.value.stateTickets;
        this.cdr.detectChanges();
      }
    });
  }

  loadSales() {
    this.salesService.getSalesByFilters(this.filters).subscribe(res => {
      if (res.isSuccess) {
        const data = res.value || [];

        // LÓGICA DE AUTORREPARACIÓN:
        // Si no hay datos Y estamos en una página mayor a 1, retrocedemos automáticamente.
        if (data.length === 0 && (this.filters.page || 1) > 1) {
          this.filters.page = (this.filters.page || 1) - 1;
          this.loadSales(); // Recargamos con la página corregida
          return; // Salimos para no ejecutar el resto del código
        }

        this.sales = data;
        // Si recibimos menos elementos que el tamaño de página, estamos en la última página
        this.isLastPage = this.sales.length < this.pageSize;
        this.cdr.detectChanges();
      } else {
        this.sales = [];
        this.isLastPage = true;
        this.cdr.detectChanges();
      }
    });
  }

  onFilterChange() {
    this.filters.page = 1; // Reseteamos a página 1 al filtrar
    this.loadSales();
  }

  setFilterStatus(status: number | null) {
    this.filters.stateTicket = status;
    this.onFilterChange();
  }

  changePage(direction: number) {
    const nextPage = (this.filters.page || 1) + direction;

    if (nextPage < 1) return;

    this.filters.page = nextPage;
    this.loadSales();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

 exportToExcel() {
  if (this.sales.length === 0) return;

  const separator = ';';
  const bom = '\ufeff'; 

  const headers = ['Fecha', 'Pasajero', 'DNI', 'Ruta', 'Asiento', 'Monto (S/)', 'Método'];
  
  const csvRows = this.sales.map(s => [
    s.date,
    `"${s.firstName} ${s.lastName}"`,
    s.dni,
    `"${s.route}"`,
    s.seatNumber || '—',
    // AQUÍ ESTÁ LA CORRECCIÓN: usamos ?? 0 para evitar el null
    (s.unitPrice ?? 0).toString().replace('.', ','),
    s.paymentMethod
  ]);

  const csvContent = bom + [
    headers.join(separator),
    ...csvRows.map(row => row.join(separator))
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'Reporte_Ventas.csv');
  link.click();
}
}