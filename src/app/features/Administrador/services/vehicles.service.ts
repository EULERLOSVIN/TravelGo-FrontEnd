import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/* ============================
   INTERFACES
============================ */

export interface VehicleListItemDto {
  unitId: string;
  plate: string;
  model: string;
  driver: string;
  isActive: boolean;
  soatOk: boolean;
}

export interface VehicleSummaryDto {
  totalUnits: number;
  active: number;
  inactive: number;
}

/* ============================
   SERVICE
============================ */

@Injectable({
  providedIn: 'root'
})
export class VehiclesService {

  private baseUrl = 'https://localhost:7134/api/Vehicles';

  constructor(private http: HttpClient) { }

  getVehicles(): Observable<VehicleListItemDto[]> {
    return this.http.get<VehicleListItemDto[]>(this.baseUrl);
  }

  getSummary(): Observable<VehicleSummaryDto> {
    return this.http.get<VehicleSummaryDto>(`${this.baseUrl}/summary`);
  }
}
