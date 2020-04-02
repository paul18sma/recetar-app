import { Component, OnInit } from '@angular/core';
import { PatientsService } from './services/patients.service';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

  title = 'preinscriptions-control';
  prescriptionForm: FormGroup;
  today;

  constructor(private patientService: PatientsService, private fBuilder: FormBuilder){}

  ngOnInit(){
    this.initPrescriptionForm();
    this.today = new Date();
    // this.patientService.getPatient();
    // this.patientService.getPatientByDNI('37458993').subscribe(
    //   res => console.log(res, 'res'),
    //   err => console.log(err, 'err')
    // );
  }

  initPrescriptionForm(){
    this.prescriptionForm = this.fBuilder.group({
      dni: ['', [
        Validators.required,
        Validators.minLength(8)
      ]],
      date: ['', [
        Validators.required
      ]],
      professional: ['', [
        Validators.required
      ]],
      supply: ['', [
        Validators.required
      ]],
    });
  }

  onSubmitPrescriptionForm(){

  }

  get dni(): AbstractControl{
    return this.prescriptionForm.get('dni');
  }

  get date(): AbstractControl{
    return this.prescriptionForm.get('date');
  }

  get professional(): AbstractControl{
    return this.prescriptionForm.get('professional');
  }

  get supply(): AbstractControl{
    return this.prescriptionForm.get('supply');
  }
}
