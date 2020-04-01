import { Component, OnInit } from '@angular/core';
import { PatientsService } from './services/patients.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {
  title = 'preinscriptions-control';

  constructor(private patientService: PatientsService){}

  ngOnInit(){
    this.patientService.getPatient();
    this.patientService.getPatientByDNI('37458993').subscribe(
      res => console.log(res, 'res'),
      err => console.log(err, 'err')
    );
  }

}
