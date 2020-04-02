import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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
    const opts = {
      headers: new HttpHeaders({
        'Accept-Language': 'es,en'
      })
    }
    return this.http.get<any>(`https://browser.ihtsdotools.org/snowstorm/snomed-ct/browser/MAIN/SNOMEDCT-ES/2019-10-31/descriptions?&limit=10&term=${term}&active=true&conceptActive=true&lang=english`, opts);
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
