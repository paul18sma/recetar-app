import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { DrugsService } from '@root/app/services/drugs.service'
import Drugs from '@root/app/interfaces/drugs';
import { ProfessionalsService } from '@root/app/services/professionals.service';
import { Professionals } from '@root/app/interfaces/professionals';
import { Patients } from '@root/app/interfaces/patients';

@Component({
  selector: 'app-validator-form',
  templateUrl: './validator-form.component.html',
  styleUrls: ['./validator-form.component.sass']
})
export class ValidatorFormComponent implements OnInit {

  title = 'preinscriptions-control';
  prescriptionForm: FormGroup;
  today;

  options: string[] = [];
  drugs: Drugs[] = [];
  professional: Professionals;
  patient: Patients;
  professionals: Professionals[] = [];
  filteredOptions: Observable<string[]>;

  constructor(private drugsService: DrugsService, private fBuilder: FormBuilder, private professionalsService: ProfessionalsService){}

  ngOnInit(): void{
    this.initPrescriptionForm();
    this.today = new Date();

    this.prescriptionForm.get('supply').valueChanges.subscribe(
      term => {
        this.getDrugs(term);
      }
    )

    this.prescriptionForm.get('professional_enrollment').valueChanges.subscribe(
      term => {
        this.getProfessionalByEnrollment(term);
      }
    )

    this.prescriptionForm.get('professional_last_name').valueChanges.subscribe(
      term => {
        this.getProfessionalByLastName(term);
      }
    )

    this.prescriptionForm.get('professional_first_name').valueChanges.subscribe(
      term => {
        this.getProfessionalByFirstName(term);
      }
    )
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

  getProfessionalByEnrollment(term: string):void{
    if(term.length > 2){

      this.professionalsService.getProfessionalByEnrollment(term).subscribe(
        res => {
          this.professional = res;
        },
      );
    }
  }

  getProfessionalByLastName(term: string):void{
    if(term.length > 3){

      this.professionalsService.getProfessionalByLastName(term).subscribe(
        res => {
          this.professional = res;
        },
      );
    }
  }

  getProfessionalByFirstName(term: string):void{
    if(term.length > 3){

      this.professionalsService.getProfessionalByFirstName(term).subscribe(
        res => {
          this.professional = res;
        },
      );
    }
  }

  completeProfessionalInputs(professional: Professionals):void{
    this.prescriptionForm.get('professional_enrollment').setValue(professional.enrollment); 
    this.prescriptionForm.get('professional_last_name').setValue(professional.last_name); 
    this.prescriptionForm.get('professional_first_name').setValue(professional.first_name);
  }

  completePatientInputs(patient: Patients):void{
    this.prescriptionForm.get('patient_dni').setValue(patient.dni); 
    this.prescriptionForm.get('patient_last_name').setValue(patient.last_name); 
    this.prescriptionForm.get('patient_first_name').setValue(patient.first_name);
  }

  onSubmitPrescriptionForm(){
    console.log('page under construction');
  }


  get dni(): AbstractControl{
    return this.prescriptionForm.get('dni');
  }

  get date(): AbstractControl{
    return this.prescriptionForm.get('date');
  }

  get professional_enrollment(): AbstractControl{
    return this.prescriptionForm.get('professional_enrollment');
  }

  get professional_first_name(): AbstractControl{
    return this.prescriptionForm.get('professional_first_name');
  }

  get professional_last_name(): AbstractControl{
    return this.prescriptionForm.get('professional_last_name');
  }

  get supply(): AbstractControl{
    return this.prescriptionForm.get('supply');
  }

}

