import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.local';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Result } from '../../../shared/models/result.model';
import { TripMadeModel } from '../models/TripMade.model';
import { StatisticsSummaryDriverModel } from '../models/StatisticsSummaryDriver.model';

@Injectable({
  providedIn: 'root',
})
export class TripService {
  apiUrl = `${environment.apiUrl}/Driver`;

  constructor(private http: HttpClient){}
  
  getStartingOrderOfDriver(idAcount: number): Observable<Result<number>>{
    return this.http.get<Result<number>>(`${this.apiUrl}/GetStartingOrderOfDriver?IdAccount=${idAcount}`);
  }

  getTripsMadeByDriver(idAccount: number, days: number): Observable<Result<TripMadeModel[]>>{
    return this.http.get<Result<TripMadeModel[]>>(`${this.apiUrl}/GetTripsMadeByDriver?IdAccount=${idAccount}&filterOption=${days}`);
  }

  getStatisticsSummaryOfTrips(idAccount:number): Observable<Result<StatisticsSummaryDriverModel>>{
    return this.http.get<Result<StatisticsSummaryDriverModel>>(`${this.apiUrl}/GetStatisticsSummaryOfTrips?IdAccount=${idAccount}`);
  }
}
