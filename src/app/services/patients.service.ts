import { Injectable } from '@angular/core';
import  { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PatientsService {

  constructor(private http: HttpClient) { }

  getPatient(){
    this.http.get('http://181.114.143.88:8085/api/v1/patients/2').subscribe(
      res => console.log('res', res),
      err => console.log('err', err)
    );
  }

  getPatientByDNI(dni: string){
    return this.http.get(`https://app.andes.gob.ar/api/modules/obraSocial/puco/${dni}`);
  }
}
