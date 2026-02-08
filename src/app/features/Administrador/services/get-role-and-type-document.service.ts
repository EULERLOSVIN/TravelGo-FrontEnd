import { Injectable } from '@angular/core';
import { environment } from '../../../../environment/environment.local';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GetRoleAndTypeDocumentService {
  apiUrl = `${environment.apiUrl}/ManagementPersonnel/GetPersonnelFormRequirements`;
  constructor(private http: HttpClient) {}

  getRolesAndDocumentTypes() {
    return this.http.get(this.apiUrl);
  }
}
