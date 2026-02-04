import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../../environment/environment.local';
import { LoginRequestModel } from '../models/LoginRequest.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly URL = `${environment.apiUrl}/Auth/login`;

  constructor(private http: HttpClient) { }

  login(credentials: LoginRequestModel): Observable<number> {
    return this.http.post<number>(`${this.URL}`, credentials).pipe(
      tap(response => {
        localStorage.setItem('userId', response.toString());
      })
    );
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('userId');
  }

  logout(): void {
    localStorage.removeItem('userId');
  }
}