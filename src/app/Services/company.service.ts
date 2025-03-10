import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Company, PagedResult, ResponseResult } from '../models/model';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
private apiUrl = 'https://localhost:7224/api/Company';
  private httpHeaders = new HttpHeaders().set('Accept', 'application/json').set('Access-Control-Allow-Origin', '*').set('content-type', 'application/json; charset=utf-8');

  constructor(private http: HttpClient) {}

  GetCompanyByCriteria(
    name: string,
    code: string,
    country: string,
    organizationId?:number,
    pageNumber?: number,
    pageSize?: number
  ): Observable<PagedResult<Company>> {
    const params = new HttpParams()
      .set('name', name || '')
      .set('code', code || '')
      .set('country', country || '')
      .set('organizationId', organizationId || '')
      .set('pageNumber', pageNumber!.toString())
      .set('pageSize', pageSize!.toString());
  
    return this.http.get<PagedResult<Company>>(`${this.apiUrl}/search`, { params });
  }
  
  addCompany(entity: Company): Observable<ResponseResult<Company>> {
    return this.http.post<ResponseResult<Company>>(this.apiUrl, entity, { headers: this.httpHeaders, responseType: 'json' })
      .pipe(
        catchError(err => {
          return throwError(err);
        })
      );
  }

  updateCompany( entity: Company): Observable<any> {
    return this.http.put<ResponseResult<Company>>(this.apiUrl, entity, { headers: this.httpHeaders, responseType: 'json' })
    .pipe(
      catchError(err => {
        return throwError(err);
      })
    );  }

  deleteCompany(id?: number): Observable<any> {
    return this.http.delete<ResponseResult<Company>>(`${this.apiUrl}/${id}`);
  }

}

