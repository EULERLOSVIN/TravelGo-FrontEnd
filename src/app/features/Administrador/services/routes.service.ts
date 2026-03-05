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
    isActive?: boolean;
}

export interface DepartureTime {
    idDepartureTime: number;
    idTravelRoute: number;
    hour: string; // Devuelto como "HH:mm:ss"
}

export interface AddDepartureTimeDto {
    idTravelRoute: number;
    hour: string; // Formato esperado "HH:mm:ss"
}

@Injectable({
    providedIn: 'root'
})
export class RoutesService {
    private apiUrl = `${environment.apiUrl}/TravelRoute`; // Usar URL del entorno
    private departureTimeUrl = `${environment.apiUrl}/DepartureTime`;

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

    // --- DEPARTURE TIMES (HORARIOS) ---
    getDepartureTimesByRoute(idTravelRoute: number): Observable<DepartureTime[]> {
        return this.http.get<DepartureTime[]>(`${this.departureTimeUrl}/route/${idTravelRoute}`);
    }

    addDepartureTime(dto: AddDepartureTimeDto): Observable<any> {
        return this.http.post<any>(`${this.departureTimeUrl}`, dto);
    }

    deleteDepartureTime(idDepartureTime: number): Observable<any> {
        return this.http.delete<any>(`${this.departureTimeUrl}/${idDepartureTime}`);
    }
}
