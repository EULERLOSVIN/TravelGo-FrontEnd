import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.local';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Result } from '../../../shared/models/result.model';
import { PersonApiReniecModel } from '../models/personApiReniec.model';

@Injectable({
  providedIn: 'root',
})
export class ReniecService {
  private readonly apiUrl = `${environment.apiUrl}/Booking/GetPersonDataByDni`;

  constructor(private http: HttpClient) {}

  getPersonDataByDni(dni: number): Observable<Result<PersonApiReniecModel>> {
    return this.http.get<Result<PersonApiReniecModel>>(`${this.apiUrl}?dni=${dni}`);
  }
}
