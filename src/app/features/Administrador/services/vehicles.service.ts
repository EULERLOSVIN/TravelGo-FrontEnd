import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Result } from '../../../shared/models/result.model';
import { DriverModel } from '../models/Driver.model';
import { environment } from '../../../../environment/environment.local';

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

/* DTO PARA CREAR / EDITAR (tu backend usa CreateVehicleDto también para update) */
export interface CreateVehicleDto {
  plate: string;
  model: number | null;
  idVehicleState: number;
  idPerson: number | null;
  vehicleType: string;
  seatNumber: number;
  soatExpiry: string;        // "YYYY-MM-DD"
  mainPhoto: string | null;  // base64
}

@Injectable({ providedIn: 'root' })
export class VehiclesService {

  private baseUrl = `${environment.apiUrl}/vehicles`;

  constructor(private http: HttpClient) {}

  // ===============================
  // GET LIST
  // ===============================
  getVehicles(): Observable<VehicleListItemDto[]> {
    return this.http.get<VehicleListItemDto[]>(this.baseUrl);
  }

  // ===============================
  // GET SUMMARY
  // ===============================
  getSummary(): Observable<VehicleSummaryDto> {
    return this.http.get<VehicleSummaryDto>(`${this.baseUrl}/summary`);
  }

  // ===============================
  // CREATE
  // ===============================
  createVehicle(dto: CreateVehicleDto): Observable<any> {
    return this.http.post(this.baseUrl, dto);
  }

  // ===============================
  // GET DRIVERS
  // ===============================
  getDrivers(): Observable<Result<DriverModel[]>> {
    return this.http.get<Result<DriverModel[]>>(`${this.baseUrl}/GetDrivers`);
  }

  // ===============================
  // ✅ DELETE (según tu controller)
  // POST /api/vehicles/DeleteVehicle?unitId=U-013
  // Devuelve: { message: "..."} si OK, BadRequest si no
  // ===============================
  deleteVehicle(unitId: string): Observable<any> {
    const params = new HttpParams().set('unitId', unitId);
    return this.http.post(`${this.baseUrl}/DeleteVehicle`, null, { params });
  }

  // ===============================
  // ✅ UPDATE (según tu controller)
  // POST /api/vehicles/UpdateVehicle?unitId=U-013
  // Devuelve Result (según tu controller usas result.IsSuccess)
  // ===============================
  updateVehicle(unitId: string, dto: CreateVehicleDto): Observable<Result<boolean>> {
    const params = new HttpParams().set('unitId', unitId);
    return this.http.post<Result<boolean>>(`${this.baseUrl}/UpdateVehicle`, dto, { params });
  }
}