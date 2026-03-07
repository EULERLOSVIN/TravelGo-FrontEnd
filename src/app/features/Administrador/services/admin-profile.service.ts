import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environment/environment.local';

export interface AdminProfileModel {
    idAccount: number;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    documentNumber: string;
    documentType: string;
    role: string;
    newPassword?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AdminProfileService {
    private apiUrl = `${environment.apiUrl}/Profile`;

    constructor(private http: HttpClient) { }

    private getHeaders(): { headers: HttpHeaders } {
        const token = localStorage.getItem('token');
        return {
            headers: new HttpHeaders({
                'Authorization': `Bearer ${token}`
            })
        };
    }

    getProfile(idAccount: number): Observable<AdminProfileModel> {
        return this.http.get<AdminProfileModel>(`${this.apiUrl}/${idAccount}`, this.getHeaders());
    }

    updateProfile(idAccount: number, profile: AdminProfileModel): Observable<any> {
        return this.http.put(`${this.apiUrl}/${idAccount}`, profile, this.getHeaders());
    }
}
