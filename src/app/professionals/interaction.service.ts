import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Prescriptions } from '@interfaces/prescriptions';

@Injectable({
  providedIn: 'root'
})
export class InteractionService {
  private _deletePrescriptionSource = new Subject<Prescriptions>();
  deletePrescription$ = this._deletePrescriptionSource.asObservable();
  constructor() { }

  deletePrescription(prescription: Prescriptions){
    this._deletePrescriptionSource.next(prescription);
  }
}
