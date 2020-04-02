import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { Medics } from "../interfaces/medics";

@Injectable({
  providedIn: 'root'
})
export class MedicsService {
  
  constructor(private http: HttpClient) { }

  getMedics(): Observable<any>{
    return this.http.get(`${environment.API_END_POINT}/medics`);
  }

  getMedicByDni(id: string): Observable<Medics> {
    return this.http.get<Medics>(`${environment.API_END_POINT}/medics/dni=${id}`).pipe(
      tap(_ => console.log(`fetched medic id=${id}`)),
      catchError(this.handleError<Medics>(`getMedicByDni id=${id}`))
    );
  }

  getMedicById(id: string): Observable<Medics> {
    return this.http.get<Medics>(`${environment.API_END_POINT}/medics/${id}`).pipe(
      tap(_ => console.log(`fetched medic id=${id}`)),
      catchError(this.handleError<Medics>(`getMedicById id=${id}`))
    );
  }

  newMedic(medic: Medics): Observable<Medics> {
    return this.http.post<Medics>(`${environment.API_END_POINT}/medics`, medic).pipe(
      tap((p: Medics) => console.log(`added medic w/ id=${p._id}`)),
      catchError(this.handleError<Medics>('newMedic'))
    );
  }

  updateMedic(id: string, medic: Medics): Observable<Medics> {
    return this.http.put<Medics>(`${environment.API_END_POINT}/medics/${id}`, medic).pipe(
      tap(_ => console.log(`updated medic id=${id}`)),
      catchError(this.handleError<Medics>('updateMedic'))
    );
  }

  deleteMedic(id: string): Observable<Medics> {
    return this.http.delete<Medics>(`${environment.API_END_POINT}/medics/${id}`).pipe(
      tap(_ => console.log(`deleted medic id=${id}`)),
      catchError(this.handleError<Medics>('deleteMedic'))
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