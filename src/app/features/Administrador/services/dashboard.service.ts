import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Result } from '../../../shared/models/result.model';
import { DashboardModel } from '../models/Dashboard.model';
import { environment } from '../../../../environment/environment.local';

@Injectable({ providedIn: 'root' })
export class DashboardService {

    private baseUrl = `${environment.apiUrl}/Dashboard`;

    constructor(private http: HttpClient) { }

    getSummary(): Observable<Result<DashboardModel>> {
        return this.http.get<Result<DashboardModel>>(`${this.baseUrl}/GetSummary`);
    }
}
