import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Result } from '../../../shared/models/result.model';
import { DriverModel } from '../models/Driver.model';
import { environment } from '../../../../environment/environment.local';
import { CreateVehicleModel } from '../models/CreateVehicle.model';
import { StateVehicleModel } from '../models/StateVehicle.model';
import { DetailVehicleModel } from '../models/DetailVehicle.model';

export interface VehicleSummaryDto {
  totalUnits: number;
  active: number;
  inactive: number;
}


@Injectable({ providedIn: 'root' })
export class VehiclesService {

  private baseUrl = `${environment.apiUrl}/vehicles`;

  constructor(private http: HttpClient) {}

  // OBTENER VEHICULOS
  getVehiclesByFilters(searchTerm: string, pageNumber: number): Observable<Result<DetailVehicleModel[]>> {
    let params = new HttpParams()
      .set('searchTerm', searchTerm)
      .set('pageNumber', pageNumber.toString());

    return this.http.get<Result<DetailVehicleModel[]>>(`${this.baseUrl}/GetVehiclesByFilter`, { params });
  }
  // REGISTRAR VEHICULO
  RegisterVehicle(dto: CreateVehicleModel): Observable<Result<boolean>> {
    return this.http.post<Result<boolean>>(`${this.baseUrl}/RegisterVehicle`, dto);
  }

  getSummary(): Observable<VehicleSummaryDto> {
    return this.http.get<VehicleSummaryDto>(`${this.baseUrl}/summary`);
  }
  
  getDrivers(): Observable<Result<DriverModel[]>> {
    return this.http.get<Result<DriverModel[]>>(`${this.baseUrl}/GetDrivers`);
  }

  deleteVehicle(unitId: string): Observable<any> {
    const params = new HttpParams().set('unitId', unitId);
    return this.http.post(`${this.baseUrl}/DeleteVehicle`, null, { params });
  }

  updateVehicle(unitId: string, dto: CreateVehicleModel): Observable<Result<boolean>> {
    const params = new HttpParams().set('unitId', unitId);
    return this.http.post<Result<boolean>>(`${this.baseUrl}/UpdateVehicle`, dto, { params });
  }
  //OBTENER ESTADOS DE VEHICULOS
  getAllStateVehicle(): Observable<Result<StateVehicleModel[]>>{
    return this.http.get<Result<StateVehicleModel[]>>(`${this.baseUrl}/GetAllStateVehicles`);
  }
}