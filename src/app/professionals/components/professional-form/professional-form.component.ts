import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
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

  filteredOptions: Observable<string[]>;
  options: string[] = [];
  drugs: Drugs[] = [];
  patient: Patients;
  sex_options: string[] = ["Femenino", "Masculino", "Otro"];
  today = new FormControl((new Date()).toISOString());  

  constructor(private drugsService: DrugsService, private fBuilder: FormBuilder, private apiPatients: PatientsService, private router: Router){}

  ngOnInit(): void {
    this.initProfessionalForm();

    // this.professionalForm.get('supply').valueChanges.subscribe(
    //   term => {
    //     this.getDrugs(term);
    //   }
    // )

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
      patient_sex: ['', [
        Validators.required
      ]],
      date: [this.today, [
        Validators.required
      ]]
      // supply: ['', [
      //   Validators.required
      // ]],
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
      this.apiPatients.getPatientByDni(term).subscribe(
        res => {
          console.log(res);
          this.patient = res;
        },
      );
    }
  }

  completePatientInputs(patient: Patients):void{
    this.professionalForm.get('patient_dni').setValue(patient.dni); 
    this.professionalForm.get('patient_last_name').setValue(patient.lastName); 
    this.professionalForm.get('patient_first_name').setValue(patient.firstName);
    this.professionalForm.get('patient_sex').setValue(patient.sex);
  }

  onSubmitProfessionalForm() {
    console.log("Hola");
    console.log(this.patient._id);
    if(this.patient._id){
      this.router.navigate(['/recetas/nueva']);
    }else{
      console.log(this.patient_dni.value)


    }
  }

  get patient_dni(): AbstractControl{
    return this.professionalForm.get('patient_dni');
  }

  get patient_first_name(): AbstractControl{
    return this.professionalForm.get('patient_first_name');
  }

  get patient_last_name(): AbstractControl{
    return this.professionalForm.get('patient_last_name');
  }

  get patient_sex(): AbstractControl{
    return this.professionalForm.get('patient_sex');
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
