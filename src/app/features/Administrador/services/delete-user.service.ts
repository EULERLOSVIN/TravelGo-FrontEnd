import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment/environment.local';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DeleteUserService {
  apiUrl = `${environment.apiUrl}/ManagementPersonnel/DeleteUser`;
  constructor(private http: HttpClient) {}

  deleteUser(id: number) {
    // Asegúrate de que la URL sea la correcta y use el método DELETE
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
