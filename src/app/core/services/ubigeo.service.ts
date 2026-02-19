import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, of, tap } from 'rxjs';

export interface Departamento {
  id_ubigeo: string;
  nombre_ubigeo: string;
}

export interface Provincia {
  id_ubigeo: string;
  nombre_ubigeo: string;
}

export interface Distrito {
  id_ubigeo: string;
  nombre_ubigeo: string;
}

// Interfaces to match the specific JSON structure from jmcastagnetto
interface RawDepartamento {
  id_ubigeo: string;
  departamento: string;
}

interface RawProvincia {
  id_ubigeo: string;
  provincia: string;
  departamento: string; // Needed for filtering
}

interface RawDistrito {
  id_ubigeo: string;
  distrito: string;
  provincia: string;     // Needed for filtering
  departamento: string;  // Needed for filtering
}

@Injectable({
  providedIn: 'root'
})
export class UbigeoService {
  // URLs pointing to the raw JSON files on GitHub
  private depUrl = 'https://raw.githubusercontent.com/jmcastagnetto/ubigeo-peru-aumentado/main/ubigeo_departamento.json';
  private provUrl = 'https://raw.githubusercontent.com/jmcastagnetto/ubigeo-peru-aumentado/main/ubigeo_provincia.json';
  private distUrl = 'https://raw.githubusercontent.com/jmcastagnetto/ubigeo-peru-aumentado/main/ubigeo_distrito.json';

  // Cache to store the data once fetched so we don't hit GitHub repeatedly
  private depCache: RawDepartamento[] | null = null;
  private provCache: RawProvincia[] | null = null;
  private distCache: RawDistrito[] | null = null;

  constructor(private http: HttpClient) { }

  /**
   * Get all Departments.
   * Returns a list of strings (names).
   */
  getDepartments(): Observable<RawDepartamento[]> {
    if (this.depCache) {
      return of(this.depCache);
    }

    return this.http.get<RawDepartamento[]>(this.depUrl).pipe(
      tap(data => this.depCache = data)
    );
  }

  /**
   * Get Provinces filtered by Department Name.
   */
  getProvinces(departmentName: string): Observable<RawProvincia[]> {
    if (this.provCache) {
      return of(this.filterProvinces(this.provCache, departmentName));
    }

    return this.http.get<RawProvincia[]>(this.provUrl).pipe(
      tap(data => this.provCache = data),
      map(data => this.filterProvinces(data, departmentName))
    );
  }

  /**
   * Get Districts filtered by Province Name.
   * Note: The JSON structure implies unique province names within a department, 
   * but to be safe we might usually filter by ID. 
   * However, since we are storing Names in the backend, we filter by Name here.
   */
  getDistricts(provinceName: string, departmentName: string): Observable<RawDistrito[]> {
    if (this.distCache) {
      return of(this.filterDistricts(this.distCache, provinceName, departmentName));
    }

    return this.http.get<RawDistrito[]>(this.distUrl).pipe(
      tap(data => this.distCache = data),
      map(data => this.filterDistricts(data, provinceName, departmentName))
    );
  }

  // --- Helper Filters ---

  private filterProvinces(all: RawProvincia[], deptName: string): RawProvincia[] {
    // Filter provinces where 'departamento' matches
    return all.filter(p => p.departamento === deptName);
  }

  private filterDistricts(all: RawDistrito[], provName: string, deptName: string): RawDistrito[] {
    // Filter districts where 'provincia' matches AND 'departamento' matches (to avoid duplicates like 'San Isidro')
    // Although the JSON implies hierarchal structure, filtering by both is safer.
    return all.filter(d => d.provincia === provName && d.departamento === deptName);
  }
}
