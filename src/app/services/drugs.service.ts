import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import Drugs from "../interfaces/drugs";

@Injectable({
  providedIn: 'root'
})
export class DrugsService {

  constructor(private http: HttpClient) { }

  getDrugByName(name: string): Observable<Drugs> {
    return this.http.get<Drugs>(`${environment.SNOMED_API}search=${name}${environment.SNOMED_PARAMS}`).pipe(
      tap(_ => console.log(`fetched drug name=${name}`)),
      catchError(this.handleError<Drugs>(`getDrugByName name=${name}`))
    );
  }

  getDrugByTerm(term: string): Observable<any>{
    const params = new HttpParams().set('supplyName', term);
    return this.http.get<any>(`${environment.API_END_POINT}/supplies/get-by-name`, {params});
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
