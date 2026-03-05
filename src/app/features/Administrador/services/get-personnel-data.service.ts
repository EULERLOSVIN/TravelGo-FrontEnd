import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environment/environment.local';
import { Observable } from 'rxjs';
import { PersonnelModel } from '../models/personnel.model';

@Injectable({
    providedIn: 'root',
})
export class GetPersonnelDataService {
    apiUrl = `${environment.apiUrl}/ManagementPersonnel/GetUserByIdAccount`;
    constructor(private http: HttpClient) { }

    getPersonnelData(idAccount: number): Observable<PersonnelModel> {
        return this.http.get<PersonnelModel>(`${this.apiUrl}?id=${idAccount}`);
    }
}
