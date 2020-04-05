import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { Prescriptions } from "../interfaces/prescriptions";

@Injectable({
  providedIn: 'root'
})
export class PrescriptionsService {
  
  constructor(private http: HttpClient) { }

  getPrescriptions(): Observable<any>{
    return this.http.get(`${environment.API_END_POINT}/prescriptions`);
  }

  getPrescriptionByDate(date: Date): Observable<Prescriptions> {
    return this.http.get<Prescriptions>(`${environment.API_END_POINT}/prescriptions/get-by-date/${date}`).pipe(
      tap(_ => console.log(`fetched prescription date=${date}`)),
      catchError(this.handleError<Prescriptions>(`getPrescriptionByDate date=${date}`))
    );
  }

  getByPatientId(id: string): Observable<Prescriptions> {
    return this.http.get<Prescriptions>(`${environment.API_END_POINT}/prescriptions/get-by-patient-id/${id}`).pipe(
      tap(_ => console.log(`fetched prescription patient id=${id}`)),
      catchError(this.handleError<Prescriptions>(`getPrescriptionByPatientId id=${id}`))
    );
  }

  newPrescription(prescription: Prescriptions): Observable<Prescriptions> {
    return this.http.post<Prescriptions>(`${environment.API_END_POINT}/prescriptions`, prescription).pipe(
      tap((p: Prescriptions) => console.log(`added prescription w/ id=${p._id}`)),
      catchError(this.handleError<Prescriptions>('newPrescription'))
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
