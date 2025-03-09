import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { Organization, PagedResult, ResponseResult } from '../models/model';

@Injectable({
  providedIn: 'root'
})
export class OrganizationService {
  private apiUrl = 'https://localhost:7224/api/Organization';
  private httpHeaders = new HttpHeaders().set('Accept', 'application/json').set('Access-Control-Allow-Origin', '*').set('content-type', 'application/json; charset=utf-8');

  constructor(private http: HttpClient) {}

  GetOrganizationByCriteria(
    name: string,
    code: string,
    country: string,
    pageNumber: number,
    pageSize: number
  ): Observable<PagedResult<Organization>> {
    const params = new HttpParams()
      .set('name', name || '')
      .set('code', code || '')
      .set('country', country || '')
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());
  
    return this.http.get<PagedResult<Organization>>(`${this.apiUrl}/search`, { params });
  }
  
  getOrganizationById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  // addOrganization(org: Organization): Observable<Organization> {
  //   return this.http.post(this.apiUrl, org);
  // }
  addOrganization(entity: Organization): Observable<ResponseResult<Organization>> {
    return this.http.post<ResponseResult<Organization>>(this.apiUrl, entity, { headers: this.httpHeaders, responseType: 'json' })
      .pipe(
        catchError(err => {
          return throwError(err);
        })
      );
  }

  updateOrganization( entity: Organization): Observable<any> {
    return this.http.put<ResponseResult<Organization>>(this.apiUrl, entity, { headers: this.httpHeaders, responseType: 'json' })
    .pipe(
      catchError(err => {
        return throwError(err);
      })
    );  }

  deleteOrganization(id?: number): Observable<any> {
    return this.http.delete<ResponseResult<Organization>>(`${this.apiUrl}/${id}`);
  }
}
