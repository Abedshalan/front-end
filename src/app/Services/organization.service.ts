import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Organization } from '../models/model';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private apiUrl = 'https://localhost:7224/api/organizations';

  constructor(private http: HttpClient) {}

  getOrganizations(): Observable<Organization[]> {
    return this.http.get<Organization[]>(this.apiUrl);
  }
  getOrganizationById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  addOrganization(org: Organization): Observable<any> {
    return this.http.post(this.apiUrl, org);
  }

  updateOrganization(id: number, data: Organization): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, data);
  }

  deleteOrganization(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
