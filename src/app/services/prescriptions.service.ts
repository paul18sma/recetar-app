import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Prescriptions } from "../interfaces/prescriptions";
import { AuthService } from '@auth/services/auth.service';
import { tap, mapTo, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PrescriptionsService {

  private myPrescriptions: BehaviorSubject<Prescriptions[]>;
  private prescriptionsArray: Prescriptions[] = [];

  constructor(private http: HttpClient, private authService: AuthService) {
    this.myPrescriptions = new BehaviorSubject<Prescriptions[]>(this.prescriptionsArray);
   }


  // getPrescriptions(): Observable<any>{
  //   return this.http.get(`${environment.API_END_POINT}/prescriptions`);
  // }

  getById(id: string): Observable<Prescriptions>{
    return this.http.get<Prescriptions>(`${environment.API_END_POINT}/prescriptions/${id}`);
  }

  dispense(prescriptionId: string): Observable<boolean> {
    var params = {'prescriptionId': prescriptionId, 'userId': this.authService.getLoggedUserId() };
    return this.http.patch<Prescriptions>(`${environment.API_END_POINT}/prescriptions/dispense/${params.prescriptionId}&${params.userId}`, params).pipe(
      tap((updatedPrescription: Prescriptions) => this.updatePrescription(updatedPrescription)),
      mapTo(true)
    );
  }

  getFromDniAndDate(params: {patient_dni: string, dateFilter: string}): Observable<boolean>{
    return this.http.get<Prescriptions[]>(`${environment.API_END_POINT}/prescriptions/find/${params.patient_dni}&${params.dateFilter}`).pipe(
      tap((prescriptions: Prescriptions[]) => this.setPrescriptions(prescriptions)),
      map((prescriptions: Prescriptions[]) => prescriptions.length > 0)
    );
  }

  getByUserId(userId: string): Observable<Boolean> {
    return this.http.get<Prescriptions[]>(`${environment.API_END_POINT}/prescriptions/get-by-user-id/${userId}`).pipe(
      tap((prescriptions: Prescriptions[]) => this.setPrescriptions(prescriptions)),
      mapTo(true)
    );
  }

  newPrescription(prescription: Prescriptions): Observable<Boolean> {
    return this.http.post<Prescriptions>(`${environment.API_END_POINT}/prescriptions`, prescription).pipe(
      tap((newPrescription: Prescriptions) => this.addPrescription(newPrescription)),
      mapTo(true)
    );
  }

  editPrescription(prescription: Prescriptions): Observable<Boolean> {
    return this.http.patch<Prescriptions>(`${environment.API_END_POINT}/prescriptions/${prescription._id}`, prescription).pipe(
      tap((updatedPrescription: Prescriptions) => this.updatePrescription(updatedPrescription)),
      mapTo(true)
    );
  }

  deletePrescription(prescriptionId: string): Observable<Boolean> {
    return this.http.delete<Prescriptions>(`${environment.API_END_POINT}/prescriptions/${prescriptionId}`).pipe(
      tap(() => this.removePrescription(prescriptionId)),
      mapTo(true)
    );
  }

  private setPrescriptions(prescriptions: Prescriptions[]){
    this.prescriptionsArray.push(...prescriptions);
    this.myPrescriptions.next(prescriptions);
  }


  private addPrescription(prescription: Prescriptions){
    this.prescriptionsArray.unshift(prescription);
    this.myPrescriptions.next(this.prescriptionsArray);
  }

  private removePrescription(removedPrescription: string){
    const removeIndex = this.prescriptionsArray.findIndex((prescription: Prescriptions) => prescription._id === removedPrescription);

    this.prescriptionsArray.splice(removeIndex, 1);
    this.myPrescriptions.next(this.prescriptionsArray);
  }

  private updatePrescription(updatedPrescription: Prescriptions){
    const updateIndex = this.prescriptionsArray.findIndex((prescription: Prescriptions) => prescription._id === updatedPrescription._id);

    this.prescriptionsArray.splice(updateIndex, 1, updatedPrescription);
    this.myPrescriptions.next(this.prescriptionsArray);
  }

  get prescriptions(): Observable<Prescriptions[]> {
    return this.myPrescriptions.asObservable();
  }
}
