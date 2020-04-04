import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { DrugsService } from '@root/app/services/drugs.service'
import Drugs from '@root/app/interfaces/drugs';
import { PatientsService } from '@root/app/services/patients.service';
import { Patients } from '@root/app/interfaces/patients';

@Component({
  selector: 'app-professional-form',
  templateUrl: './professional-form.component.html',
  styleUrls: ['./professional-form.component.sass']
})
export class ProfessionalFormComponent implements OnInit {

  title = 'preinscriptions-control';
  professionalForm: FormGroup;
  today;

  filteredOptions: Observable<string[]>;
  options: string[] = [];
  drugs: Drugs[] = [];
  patient: Patients;

  constructor(private drugsService: DrugsService, private fBuilder: FormBuilder, private patientsService: PatientsService){}

  ngOnInit(): void {
    this.initProfessionalForm();
    this.today = new Date();

    this.professionalForm.get('supply').valueChanges.subscribe(
      term => {
        this.getDrugs(term);
      }
    )

    this.professionalForm.get('patient_dni').valueChanges.subscribe(
      term => {
        this.getPatientByDni(term);
      }
    )
  }

  initProfessionalForm(){
    this.professionalForm = this.fBuilder.group({
      patient_dni: ['', [
        Validators.required,
        Validators.minLength(8)
      ]],
      patient_last_name: ['', [
        Validators.required
      ]],
      patient_first_name: ['', [
        Validators.required
      ]],
      date: ['', [
        Validators.required
      ]],
      professional: ['', [
        Validators.required
      ]],
      professional_enrollment: ['', [
        Validators.required
      ]],
      professional_first_name: ['', [
        Validators.required
      ]],
      professional_last_name: ['', [
        Validators.required
      ]],
      supply: ['', [
        Validators.required
      ]],
    });
  }

  getDrugs(term: string):void{
    if(term.length > 2){

      this.drugsService.getDrugByTerm(term).subscribe(
        res => {
          this.drugs = res.items;
        },
      );
    }
  }

  getPatientByDni(term: string):void{
    if(term.length > 2){

      this.patientsService.getPatientByDni(term).subscribe(
        res => {
          this.patient = res;
        },
      );
    }
  }

  completePatientInputs(patient: Patients):void{
    this.professionalForm.get('patient_dni').setValue(patient.dni); 
    this.professionalForm.get('patient_last_name').setValue(patient.last_name); 
    this.professionalForm.get('patient_first_name').setValue(patient.first_name);
  }

  onSubmitProfessionalForm(){
    console.log('page under construction');
  }

  get patient_dni(): AbstractControl{
    return this.professionalForm.get('patient_dni');
  }

  get patient_last_name(): AbstractControl{
    return this.professionalForm.get('patient_last_name');
  }
  get patient_first_name(): AbstractControl{
    return this.professionalForm.get('patient_first_name');
  }
  get date(): AbstractControl{
    return this.professionalForm.get('date');
  }

  get professional_enrollment(): AbstractControl{
    return this.professionalForm.get('professional_enrollment');
  }

  get professional_first_name(): AbstractControl{
    return this.professionalForm.get('professional_first_name');
  }

  get professional_last_name(): AbstractControl{
    return this.professionalForm.get('professional_last_name');
  }

  get supply(): AbstractControl{
    return this.professionalForm.get('supply');
  }

}
