import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environment/environment.local';
import { Observable } from 'rxjs';
import { PersonnelModel } from '../models/personnel.model';

@Injectable({
  providedIn: 'root',
})
export class GetPersonnelService {
  apiUrl = `${environment.apiUrl}/ManagementPersonnel/GetPersonnel`;
  constructor(private http: HttpClient) {}

  getPersonnel(searchTerm: string, pageNumber: number): Observable<PersonnelModel[]> {
    let params = new HttpParams()
      .set('searchTerm', searchTerm)
      .set('pageNumber', pageNumber.toString());

    return this.http.get<PersonnelModel[]>(this.apiUrl, { params });
  }
}
