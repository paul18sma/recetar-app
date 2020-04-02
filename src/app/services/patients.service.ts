import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { Patients } from "../interfaces/patients";

@Injectable({
  providedIn: 'root'
})
export class PatientsService {
  
  constructor(private http: HttpClient) { }

  getPatients(): Observable<any>{
    return this.http.get(`${environment.API_END_POINT}/patients`);
  }

  getPatientByDni(id: string): Observable<Patients> {
    return this.http.get<Patients>(`${environment.API_END_POINT}/patients/dni=${id}`).pipe(
      tap(_ => console.log(`fetched patient id=${id}`)),
      catchError(this.handleError<Patients>(`getPatientByDni id=${id}`))
    );
  }

  getPatientById(id: string): Observable<Patients> {
    return this.http.get<Patients>(`${environment.API_END_POINT}/patients/${id}`).pipe(
      tap(_ => console.log(`fetched patient id=${id}`)),
      catchError(this.handleError<Patients>(`getPatientById id=${id}`))
    );
  }

  newPatient(patient: Patients): Observable<Patients> {
    return this.http.post<Patients>(`${environment.API_END_POINT}/patients`, patient).pipe(
      tap((p: Patients) => console.log(`added patient w/ id=${p._id}`)),
      catchError(this.handleError<Patients>('newPatient'))
    );
  }

  updatePatient(id: string, patient: Patients): Observable<Patients> {
    return this.http.put<Patients>(`${environment.API_END_POINT}/patients/${id}`, patient).pipe(
      tap(_ => console.log(`updated patient id=${id}`)),
      catchError(this.handleError<Patients>('updatePatient'))
    );
  }

  deletePatient(id: string): Observable<Patients> {
    return this.http.delete<Patients>(`${environment.API_END_POINT}/patients/${id}`).pipe(
      tap(_ => console.log(`deleted patient id=${id}`)),
      catchError(this.handleError<Patients>('deletePatient'))
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