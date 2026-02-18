// places=darwin
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment.local';

export interface Place {
    idPlace?: number;
    name: string;
    description?: string;
}

@Injectable({
    providedIn: 'root'
})
export class PlacesService {
    private apiUrl = `${environment.apiUrl}/Place`;

    constructor(private http: HttpClient) { }

    getAll(): Observable<Place[]> {
        return this.http.get<Place[]>(`${this.apiUrl}/getAll`);
    }

    create(place: Place): Observable<number> {
        return this.http.post<number>(`${this.apiUrl}/add`, place);
    }

    update(place: Place): Observable<boolean> {
        return this.http.put<boolean>(`${this.apiUrl}/update`, place);
    }

    delete(id: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.apiUrl}/delete/${id}`);
    }
}
