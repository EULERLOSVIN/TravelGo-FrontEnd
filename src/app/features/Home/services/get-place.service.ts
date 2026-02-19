import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.local';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Result } from '../../../shared/models/result.model';
import { PlaceModel } from '../models/place.model';

@Injectable({
  providedIn: 'root',
})
export class GetPlaceService {
  apiUrl = `${environment.apiUrl}/TravelRoute/getPlacesOfRoutes`

  constructor(private http: HttpClient){}

  getPlaces(): Observable<Result<PlaceModel[]>>{
    return this.http.get<Result<PlaceModel[]>>(this.apiUrl);
  }
  
}
