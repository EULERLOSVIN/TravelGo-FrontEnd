import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.local';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Result } from '../../../shared/models/result.model';
import { RouteInformationModel } from '../models/route-information.model';

@Injectable({
  providedIn: 'root',
})
export class SearchRouteService {
  apiUrl = `${environment.apiUrl}/TravelRoute/GetRoutesByPlace`;

  constructor(private http: HttpClient) { }

  searcRoute(idOrigin: number, idDestination: number, dayOption: number = 0): Observable<Result<RouteInformationModel>> {
    // Configuramos los parámetros para que coincidan con lo que espera el Backend
    const params = new HttpParams()
      .set('searchTravelDto.IdPlaceOrigin', idOrigin.toString())
      .set('searchTravelDto.IdPlaceDestination', idDestination.toString())
      .set('searchTravelDto.DayOption', dayOption.toString());

    return this.http.get<Result<RouteInformationModel>>(this.apiUrl, { params });
  }
}
