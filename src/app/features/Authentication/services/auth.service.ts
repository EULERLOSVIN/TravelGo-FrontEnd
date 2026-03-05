import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environment/environment.local';
import { LoginRequestModel } from '../models/LoginRequest.model';
import { LoginResponse } from '../models/login-response.model';
import { Result } from '../../../shared/models/result.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  apiUrl = `${environment.apiUrl}/Auth/login`;

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequestModel): Observable<Result<LoginResponse>> {
    return this.http.post<Result<LoginResponse>>(this.apiUrl, credentials).pipe(
      tap(response => {
        // Solo guardamos si el backend confirmó éxito
        if (response.isSuccess && response.value) {
          // Guardamos el ID de la cuenta para que módulos de uso personal (ej. Profile) lo consuman de forma independiente
          localStorage.setItem('idAccount', response.value.idAccount.toString());
          localStorage.setItem('token', response.value.token);
          localStorage.setItem('userEmail', response.value.email);
          localStorage.setItem('userRole', response.value.rol);
        }
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  logout(): void {
    localStorage.clear();
  }
}