import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { Drugs } from "../interfaces/drugs";

@Injectable({
  providedIn: 'root'
})
export class DrugsService {
  
  constructor(private http: HttpClient) { }

  getDrugByName(name: string): Observable<Drugs> {
    return this.http.get<Drugs>(`${environment.SNOMED_API}term=${name}${environment.SNOMED_PARAMS}`).pipe(
      tap(_ => console.log(`fetched drug name=${name}`)),
      catchError(this.handleError<Drugs>(`getDrugByName name=${name}`))
    );
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