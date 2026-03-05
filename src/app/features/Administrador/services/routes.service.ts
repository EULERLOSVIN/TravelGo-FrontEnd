// rutas=darwin  Usa HttpClient para llamar a tu API.
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment.local'; // Importar entorno
import { TravelRouteModel } from '../models/TravelRoute.model';
// Definimos cómo se ve una ruta en el frontend


@Injectable({
    providedIn: 'root'
})
export class RoutesService {
    private apiUrl = `${environment.apiUrl}/TravelRoute`; // Usar URL del entorno

    constructor(private http: HttpClient) { }

    getAll(): Observable<TravelRouteModel[]> {
        return this.http.get<TravelRouteModel[]>(`${this.apiUrl}/getAll`);
    }

    create(route: TravelRouteModel): Observable<number> {
        return this.http.post<number>(`${this.apiUrl}/add`, route);
    }

    update(route: TravelRouteModel): Observable<boolean> {
        return this.http.put<boolean>(`${this.apiUrl}/update`, route);
    }

    delete(id: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.apiUrl}/delete/${id}`);
    }
}
