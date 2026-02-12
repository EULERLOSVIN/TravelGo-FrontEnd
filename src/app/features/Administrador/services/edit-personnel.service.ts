import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment/environment.local';
import { EditPersonnelModel } from '../models/EditPersonnel.model';

@Injectable({
  providedIn: 'root',
})
export class EditPersonnelService {
  apiUrl = `${environment.apiUrl}/ManagementPersonnel/UpdateUser`;

  constructor(private http: HttpClient) {}

  updatePersonnel(data: EditPersonnelModel) {
    return this.http.put(this.apiUrl, data);
  }
}
