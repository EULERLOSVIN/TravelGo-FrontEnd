import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.local';
import { RegisterPersonnelModel } from '../models/register-personnel.model';
import { Observable } from 'rxjs';
import { Result } from '../../../shared/models/result.model';

@Injectable({
  providedIn: 'root',
})
export class RegisterPersonnelService {
  apiUrl = `${environment.apiUrl}/Auth/register`;

  constructor(private http: HttpClient) {}

  registerPersonnel(data: RegisterPersonnelModel): Observable<Result<boolean>> {
    return this.http.post<Result<boolean>>(this.apiUrl, data);
  }
}
