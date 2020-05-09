import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { Prescriptions } from "../interfaces/prescriptions";
import { AuthService } from '@auth/services/auth.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionsService {

  constructor(private http: HttpClient, private authService: AuthService) { }

  getPrescriptions(): Observable<any>{
    return this.http.get(`${environment.API_END_POINT}/prescriptions`);
  }

  getById(id: string): Observable<Prescriptions>{
    return this.http.get<Prescriptions>(`${environment.API_END_POINT}/prescriptions/${id}`);
  }

  dispense(prescription: Prescriptions): Observable<Prescriptions> {
    var params = {'prescriptionId': prescription._id, 'userId': this.authService.getLoggedUserId() };
    return this.http.patch<Prescriptions>(`${environment.API_END_POINT}/prescriptions/dispense/${params.prescriptionId}&${params.userId}`, params);
  }

  getFromDniAndDate(params: {patient_dni: string, dateFilter: Date | null}): Observable<Prescriptions[]>{
    let date = '';
    if(params.dateFilter){
      date = moment(params.dateFilter, 'DD/MM/YYYY').format('YYYY-MM-DD');
    }
    return this.http.get<Prescriptions[]>(`${environment.API_END_POINT}/prescriptions/find/${params.patient_dni}&${date}`);
  }

  getByPatientAndDate(patientId: string, date: Date): Observable<Prescriptions[]> {
    return this.http.get<Prescriptions[]>(`${environment.API_END_POINT}/prescriptions/get-by-patient-and-date/${patientId}&${date}`);
  }

  getByPatientId(patientId: string): Observable<Prescriptions[]> {
    return this.http.get<Prescriptions[]>(`${environment.API_END_POINT}/prescriptions/get-by-patient-id/${patientId}`);
  }

  getByUserId(userId: string): Observable<Prescriptions[]> {
    return this.http.get<Prescriptions[]>(`${environment.API_END_POINT}/prescriptions/get-by-user-id/${userId}`);
  }

  newPrescription(prescription: Prescriptions): Observable<Prescriptions> {
    return this.http.post<Prescriptions>(`${environment.API_END_POINT}/prescriptions`, prescription);
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
