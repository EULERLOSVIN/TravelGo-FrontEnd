import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment.local';
import { Result } from '../../../shared/models/result.model';

export interface RouteDto {
    idTravelRoute: number;
    nameRoute: string;
}

export interface DriverQueueInfo {
    idPerson: number;
    fullName: string;
    idVehicle: number;
    plateNumber: string;
    model: string;
    assignedRoutes: RouteDto[];
}

@Injectable({
    providedIn: 'root'
})
export class QueueManagementService {
    private apiUrl = `${environment.apiUrl}/QueueManagement`;

    constructor(private http: HttpClient) { }

    getDriverInfo(dni: string): Observable<DriverQueueInfo> {
        return this.http.get<DriverQueueInfo>(`${this.apiUrl}/driver-info/${dni}`);
    }

    addToQueue(idVehicle: number): Observable<number> {
        return this.http.post<number>(`${this.apiUrl}/add`, { idVehicle });
    }

    getActiveQueue(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/active`);
    }

    removeFromQueue(idQueueVehicle: number): Observable<boolean> {
        return this.http.delete<boolean>(`${this.apiUrl}/delete/${idQueueVehicle}`);
    }
}
