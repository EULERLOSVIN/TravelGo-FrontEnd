import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Result } from '../../../shared/models/result.model';
import { DriverModel } from '../models/Driver.model';
import { environment } from '../../../../environment/environment.local';
import { CreateVehicleModel } from '../models/CreateVehicle.model';
import { StateVehicleModel } from '../models/StateVehicle.model';
import { DetailVehicleModel } from '../models/DetailVehicle.model';
import { SummaryStatisticalOfVehicleModel } from '../models/SummaryStatisticalOfVehicle.model';
import { EditVehicleModel } from '../models/EditVehicle.model';


@Injectable({ providedIn: 'root' })
export class VehiclesService {

  private baseUrl = `${environment.apiUrl}/vehicles`;

  constructor(private http: HttpClient) { }

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
  //OBTENER RESUMEN ESTADISTICO DE LOS VEHICULOS
  getStatisticalSummaryOfVehicles(): Observable<Result<SummaryStatisticalOfVehicleModel>> {
    return this.http.get<Result<SummaryStatisticalOfVehicleModel>>(`${this.baseUrl}/GetSummaryStatisticalOfVehicles`);
  }
  //OBTENER CONDUCTORES
  getDrivers(): Observable<Result<DriverModel[]>> {
    return this.http.get<Result<DriverModel[]>>(`${this.baseUrl}/GetDrivers`);
  }
  //EDITAR VEHICULO
  EditVehicle(newData: EditVehicleModel): Observable<Result<boolean>> {
    return this.http.put<Result<boolean>>(`${this.baseUrl}/EditVehicle`, newData);
  }
  //OBTENER ESTADOS DE VEHICULOS
  getAllStateVehicle(): Observable<Result<StateVehicleModel[]>> {
    return this.http.get<Result<StateVehicleModel[]>>(`${this.baseUrl}/GetAllStateVehicles`);
  }
}