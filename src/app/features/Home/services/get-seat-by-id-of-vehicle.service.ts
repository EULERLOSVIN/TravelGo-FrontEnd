import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.local';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Result } from '../../../shared/models/result.model';
import { SeatModal } from '../models/seat.modal';

@Injectable({
  providedIn: 'root',
})
export class GetSeatByIdOfVehicleService {

  apiUrl = `${environment.apiUrl}/Booking/GetSeatByIdOfVehicle`;
  constructor(private http: HttpClient){}

  GetSeatsByIdOfVehicle(idVehicle:number): Observable<Result<SeatModal[]>>{
    return this.http.get<Result<SeatModal[]>>(`${this.apiUrl}?idVehicle=${idVehicle}`);
  }
}
