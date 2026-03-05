import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment.local';

export interface CompanySettings {
    idCompany: number;
    businessName: string;
    ruc: string;
    fiscalAddress: string;
    phone: string;
    email: string;
}

@Injectable({
    providedIn: 'root'
})
export class SettingsGeneralService {
    private apiUrl = `${environment.apiUrl}/Settings/Company`;

    constructor(private http: HttpClient) { }

    private getHeaders(): { headers: HttpHeaders } {
        const token = localStorage.getItem('token');
        return {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${token}`
            })
        };
    }

    getSettings(): Observable<CompanySettings> {
        return this.http.get<CompanySettings>(this.apiUrl, this.getHeaders());
    }

    updateSettings(settings: CompanySettings): Observable<any> {
        return this.http.put(this.apiUrl, settings, this.getHeaders());
    }
}
