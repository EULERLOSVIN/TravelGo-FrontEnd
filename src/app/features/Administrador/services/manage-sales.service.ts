// manage-sales.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment.local';
import { FilterOfManageSalesDto } from '../models/FilterOfManageSales.model';
import { SaleModel } from '../models/Sale.model';
import { Result } from '../../../shared/models/result.model';
import { FiltersManageSales } from '../models/FiltersManageSales.model';


@Injectable({ providedIn: 'root' })
export class ManageSalesService {
  private apiUrl = `${environment.apiUrl}/ManageSales`;

  constructor(private http: HttpClient) {}

 getSalesByFilters(filters: FilterOfManageSalesDto): Observable<Result<SaleModel[]>> {
    let params = new HttpParams();

    if (filters.fromDate) params = params.set('fromDate', filters.fromDate);
    if (filters.untilDate) params = params.set('untilDate', filters.untilDate);
    if (filters.idRoute != null) params = params.set('idRoute', filters.idRoute.toString());
    if (filters.stateTicket != null) params = params.set('stateTicket', filters.stateTicket.toString());
    if (filters.page != null) params = params.set('page', filters.page.toString());

    return this.http.get<Result<SaleModel[]>>(`${this.apiUrl}/GetSalesMade`, { params });
  }

  getFilters(): Observable<Result<FiltersManageSales>>{
    return this.http.get<Result<FiltersManageSales>>(`${this.apiUrl}/GetFiltersForManageSales`);
  }
}