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
  }

}
