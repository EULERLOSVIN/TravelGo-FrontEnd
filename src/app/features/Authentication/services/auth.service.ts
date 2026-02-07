import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environment/environment.local';
import { LoginRequestModel } from '../models/LoginRequest.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly Url = `${environment.apiUrl}/Auth/login`;

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequestModel): Observable<any> {
    return this.http.post<any>(this.Url, credentials).pipe(
      tap(response => {
        localStorage.setItem('userEmail', response.email);
        
        localStorage.setItem('token', response.token);
        localStorage.setItem('userRole', response.rol);
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