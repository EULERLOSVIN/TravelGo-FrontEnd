// rutas=darwin  Usa HttpClient para llamar a tu API.
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment.local'; // Importar entorno

// Definimos cómo se ve una ruta en el frontend
export interface TravelRoute {
    idTravelRoute?: number;
    nameRoute: string; // "Origen - Destino"
    price: number;
    idPlaceA: number;
    idPlaceB: number;
}

@Injectable({
    providedIn: 'root'
})
export class RoutesService {
    private apiUrl = `${environment.apiUrl}/TravelRoute`; // Usar URL del entorno

    constructor(private http: HttpClient) { }

    getAll(): Observable<TravelRoute[]> {
        return this.http.get<TravelRoute[]>(`${this.apiUrl}/getAll`);
    }

    create(route: TravelRoute): Observable<number> {
        return this.http.post<number>(`${this.apiUrl}/add`, route);
    }

    update(route: TravelRoute): Observable<boolean> {
        return this.http.put<boolean>(`${this.apiUrl}/update`, route);
    }

    delete(id: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.apiUrl}/delete/${id}`);
    }
}
