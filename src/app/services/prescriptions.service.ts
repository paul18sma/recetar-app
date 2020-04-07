import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { Prescriptions } from "../interfaces/prescriptions";
import { AuthService } from '@auth/services/auth.service';
import Patient from '@interfaces/patients';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionsService {
  
  constructor(private http: HttpClient, private authService: AuthService,) { }

  getPrescriptions(): Observable<any>{
    return this.http.get(`${environment.API_END_POINT}/prescriptions`);
  }

  dispense(prescription: Prescriptions): Observable<Prescriptions> {
    prescription.status = 'Dispensada'
    prescription.dispensedBy = this.authService.getLoggedUserId();
    return this.http.put<Prescriptions>(`${environment.API_END_POINT}/prescriptions/${prescription._id}`, prescription).pipe(
      tap(_ => console.log(`fetched prescription date=${prescription._id}`)),
      catchError(this.handleError<Prescriptions>(`getPrescriptionByDate date=${prescription._id}`))
    );
  }

  getByPatientAndDate(patientId: string, date: Date): Observable<Prescriptions> {
    return this.http.get<Prescriptions>(`${environment.API_END_POINT}/prescriptions/get-by-patient-and-date/?patientId=${patientId}?date=${date}`).pipe(
      tap(_ => console.log(`fetched prescription with date and patient`)),
      catchError(this.handleError<Prescriptions>(`getPrescriptionByPatientAndDate`))
    );
  }

  getByPatientId(patient_id): Observable<Prescriptions> {
    return this.http.get<Prescriptions>(`${environment.API_END_POINT}/prescriptions/get-by-patient-id/${patient_id}`).pipe(
      tap(_ => console.log(`fetched prescription patient id=${patient_id}`)),
      catchError(this.handleError<Prescriptions>(`getPrescriptionByPatientId id=${patient_id}`))
    );
  }

  newPrescription(prescription: Prescriptions): Observable<Prescriptions> {
    return this.http.post<Prescriptions>(`${environment.API_END_POINT}/prescriptions`, prescription).pipe(
      tap((p: Prescriptions) => console.log(`Added prescription`)),
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