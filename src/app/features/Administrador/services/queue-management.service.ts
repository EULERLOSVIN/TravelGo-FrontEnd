import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map, throwError, switchMap } from 'rxjs';
import { environment } from '../../../../environment/environment.local';
import { HeadquarterContext, QueueItem, RouteFilter } from '../models/queue.model';
import { Result } from '../../../shared/models/result.model';

export interface DriverQueueInfo {
    driverDni: string;
    driverFullName: string;
    vehiclePlate: string;
    vehicleModel: string;
    destinationName: string;
}

@Injectable({
    providedIn: 'root',
})
export class QueueManagementService {
    private apiUrl = `${environment.apiUrl}/QueueVehicle`;
    private hqUrl = `${environment.apiUrl}/Headquarter`;
    private travelRouteUrl = `${environment.apiUrl}/TravelRoute`;

    // BehaviorSubject to broadcast the active queue to all subscribed components
    private activeQueueSubject = new BehaviorSubject<QueueItem[]>([]);
    activeQueue$ = this.activeQueueSubject.asObservable();

    constructor(private http: HttpClient) { }

    getHeadquarters(): Observable<HeadquarterContext[]> {
        return this.http.get<any[]>(this.hqUrl).pipe(
            map(res => res.map(h => ({
                idHeadquarter: h.idHeadquarter,
                headquarterName: h.name || h.address // Use h.name directly as the Name property from DTO
            })))
        );
    }

    getRoutesByHeadquarter(idHeadquarter: number, type: 'departure' | 'arrival' = 'departure'): Observable<RouteFilter[]> {
        return this.http.get<any[]>(`${this.travelRouteUrl}/getRoutesByHeadquarter/${idHeadquarter}?type=${type}`).pipe(
            map(res => {
                if (!res) return [];
                return res.map((tr: any) => ({
                    idRoute: tr.idTravelRoute,
                    destinationName: tr.nameRoute,
                    inQueueCount: 0
                }));
            })
        );
    }

    getQueue(headquarterId: number, idRoute: number): Observable<QueueItem[]> {
        // We leave headquarterId in the signature so we don't break existing calls wildly, 
        // but we only pass idRoute to the backend.
        return this.http.get<Result<any[]>>(`${this.apiUrl}/getActiveQueue/${idRoute}`).pipe(
            map(response => {
                if (!response.isSuccess || !response.value) return [];
                return response.value.map(item => ({
                    idAssignQueue: item.idAssignQueue,
                    turn: item.turn,
                    driverFullName: item.driverFullName,
                    driverDni: item.driverDni,
                    vehiclePlate: item.vehiclePlate,
                    vehicleModel: item.vehicleModel,
                    idRoute: item.idRoute,
                    destinationName: item.destinationName,
                    occupiedSeats: item.occupiedSeats,
                    totalSeats: item.totalSeats,
                    scheduledDepartureTime: item.scheduledDepartureTime,
                    remainingMinutes: item.remainingMinutes,
                    status: item.status
                }));
            })
        );
    }

    getDriverQueueInfo(dni: string): Observable<any> {
        return this.http.get<Result<any>>(`${this.apiUrl}/getDriverQueueInfo/${dni}`).pipe(
            switchMap(result => {
                if (!result.isSuccess) {
                    return throwError(() => ({ status: 404, error: result.errorMessage }));
                }
                return [result.value];
            })
        );
    }

    registerArrival(dni: string): Observable<Result<boolean>> {
        return this.http.post<Result<boolean>>(`${this.apiUrl}/registerArrival`, { driverDni: dni });
    }

    addDriverToQueue(dni: string, idRoute: number, departureTimeId?: number | null): Observable<Result<number>> {
        return this.http.post<Result<number>>(`${this.apiUrl}/add`, {
            driverDni: dni,
            idTravelRoute: idRoute,
            idDepartureTime: departureTimeId
        });
    }

    updateDriverRoute(idQueue: number, idRoute: number): Observable<Result<boolean>> {
        return this.http.put<Result<boolean>>(`${this.apiUrl}/updateRoute`, {
            idAssignQueue: idQueue,
            newIdTravelRoute: idRoute
        });
    }

    removeDriverFromQueue(idQueue: number): Observable<Result<boolean>> {
        return this.http.delete<Result<boolean>>(`${this.apiUrl}/delete/${idQueue}`);
    }
}
