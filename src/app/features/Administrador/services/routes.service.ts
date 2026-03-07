// rutas=darwin
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../../environment/environment.local';
import { TravelRouteModel } from '../models/TravelRoute.model';
import { Result } from '../../../shared/models/result.model';

export interface DepartureTime {
    idDepartureTime: number;
    idTravelRoute: number;
    hour: string;
}

export interface AddDepartureTimeDto {
    idTravelRoute: number;
    hour: string;
}

@Injectable({
    providedIn: 'root'
})
export class RoutesService {
    private apiUrl = `${environment.apiUrl}/TravelRoute`;
    private departureTimeUrl = `${environment.apiUrl}/DepartureTime`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<TravelRouteModel[]> {
        return this.http.get<Result<TravelRouteModel[]>>(`${this.apiUrl}/getAll`).pipe(
            map(result => result.value ?? [])
        );
    }

    create(route: TravelRouteModel): Observable<Result<number>> {
        return this.http.post<Result<number>>(`${this.apiUrl}/add`, route);
    }

    update(route: TravelRouteModel): Observable<Result<boolean>> {
        return this.http.put<Result<boolean>>(`${this.apiUrl}/update`, route);
    }

    delete(id: number): Observable<Result<boolean>> {
        return this.http.delete<Result<boolean>>(`${this.apiUrl}/delete/${id}`);
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
