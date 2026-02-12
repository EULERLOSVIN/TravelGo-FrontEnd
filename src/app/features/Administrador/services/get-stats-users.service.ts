import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.local';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { StatsPersonnelModel } from '../models/statsPersonnel.model';

@Injectable({
  providedIn: 'root',
})
export class GetStatsUsersService {
  apiUrl = `${environment.apiUrl}/ManagementPersonnel/GetStatsPersonnel`;
  constructor(private http: HttpClient) {}
  
  getStatsUsers(): Observable<StatsPersonnelModel> {
    return this.http.get<StatsPersonnelModel>(this.apiUrl);
  }
}
