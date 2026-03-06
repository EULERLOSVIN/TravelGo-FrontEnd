import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, map, throwError, switchMap } from 'rxjs';
import { environment } from '../../../../environment/environment.local';
import { HeadquarterContext, QueueItem, RouteFilter } from '../models/queue.model';
import { Result } from '../../../shared/models/result.model';

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
                headquarterName: h.nameHeadquarter || h.address
            })))
        );
    }

    getRoutesByHeadquarter(idHeadquarter: number): Observable<RouteFilter[]> {
        return this.http.get<any[]>(`${this.travelRouteUrl}/getAll`).pipe(
            map(res => res.map(tr => ({
                idRoute: tr.idTravelRoute,
                destinationName: tr.nameRoute,
                inQueueCount: 0
            })))
        );
    }

    getQueue(idHeadquarter: number, idRoute: number): Observable<QueueItem[]> {
        return this.http.get<Result<QueueItem[]>>(`${this.apiUrl}/getActiveQueue/${idHeadquarter}`).pipe(
            map(result => {
                const queue = result.value ?? [];
                this.activeQueueSubject.next(queue);
                return queue.filter(q => q.idRoute === idRoute);
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
