import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.local';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RolesAndDocumentTypes } from '../models/RolesAndDocumentTypes.model';

@Injectable({
  providedIn: 'root',
})
export class GetRoleAndTypeDocumentService {
  apiUrl = `${environment.apiUrl}/ManagementPersonnel/GetPersonnelFormRequirements`;
  constructor(private http: HttpClient) {}

  getRolesAndDocumentTypes(): Observable<RolesAndDocumentTypes> {
    return this.http.get<RolesAndDocumentTypes>(this.apiUrl);
  }
}
