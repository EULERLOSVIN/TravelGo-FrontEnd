import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Result } from '../../../shared/models/result.model';
import { SecurityAlertsModel } from '../models/SecurityAlerts.model';
import { environment } from '../../../../environment/environment.local';

@Injectable({ providedIn: 'root' })
export class AlertsService {

    private baseUrl = `${environment.apiUrl}/SecurityAlerts`;

    constructor(private http: HttpClient) { }

    getExpiringDocuments(): Observable<Result<SecurityAlertsModel>> {
        return this.http.get<Result<SecurityAlertsModel>>(`${this.baseUrl}/GetExpiringDocuments`);
    }
}
