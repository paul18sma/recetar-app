import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { Insurances } from "../interfaces/insurances";

@Injectable({
  providedIn: 'root'
})
export class InsurancesService {

  constructor(private http: HttpClient) { }

  getInsuranceByPatientDni(dni: string): Observable<Insurances> {
    const url = `https://app.andes.gob.ar/api/modules/obraSocial/puco/${dni}`
    return this.http.get<Insurances>(url).pipe(
      tap(_ => console.log(`fetched insurance`)),
      catchError(this.handleError<Insurances>(`getInsuranceByName`))
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
