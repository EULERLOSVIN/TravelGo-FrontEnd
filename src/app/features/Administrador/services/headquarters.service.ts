import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Headquarter } from '../models/headquarter.model';
import { environment } from '../../../../environment/environment.local'; // Usamos environment.local

@Injectable({
  providedIn: 'root'
})
export class HeadquartersService {
  private apiUrl = `${environment.apiUrl}/headquarter`; // Ajusta según tu environment

  constructor(private http: HttpClient) { }

  getAll(): Observable<Headquarter[]> {
    return this.http.get<Headquarter[]>(this.apiUrl);
  }

  create(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }

  update(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  seed(): Observable<any> {
    // Ajustamos la URL porque SeedController está en /api/seed, no /api/headquarter/seed
    const seedUrl = this.apiUrl.replace('/headquarter', '/seed');
    return this.http.post(seedUrl, {});
  }
}
