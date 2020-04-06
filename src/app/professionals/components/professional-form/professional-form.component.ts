import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators, FormControl, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { SuppliesService } from '@services/supplies.service'
import Supplies from '@interfaces/supplies';
import { PatientsService } from '@root/app/services/patients.service';
import { Patients } from '@root/app/interfaces/patients';
import { Prescriptions } from '@interfaces/prescriptions';
import { PrescriptionsService } from '@services/prescriptions.service';
import { AuthService } from '@auth/services/auth.service';
import { ProfessionalsService } from '@services/professionals.service';

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
  storedSupplies: Supplies[] = [];
  patient: Patients;
  sex_options: string[] = ["Femenino", "Masculino", "Otro"];
  today = new FormControl((new Date()).toISOString());
  professionalFullname: string;
  readonly maxQSupplies: number = 2;

  constructor(
    private suppliesService: SuppliesService,
    private fBuilder: FormBuilder,
    private apiPatients: PatientsService,
    private router: Router,
    private apiPrescriptions: PrescriptionsService,
    private authService: AuthService,
    private apiProfessionals: ProfessionalsService
  ){}

  ngOnInit(): void {
    this.initProfessionalForm();

    this.apiProfessionals.getProfessionalByDni(this.authService.getLoggedUsername()).subscribe(
      res => {
      this.professionalFullname = res[0].last_name+", "+res[0].first_name;
      },
    )

    this.addSupply(); //init atleast one supply

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
      ]],
      supplies: this.fBuilder.array([])
    });
  }

  getSupplies(term: string):void{
    if(term.length > 3){

      this.suppliesService.getSupplyByTerm(term).subscribe(
        res => {
          this.storedSupplies = res as Supplies[];
        },
      );
    }
  }

  getPatientByDni(term: string):void{
    if(term.length > 2){
      this.apiPatients.getPatientByDni(term).subscribe(
        res => {
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
    if(this.patient){
      let newPrescription: Prescriptions = new Prescriptions();
      newPrescription.user_id = this.authService.getLoggedUserId();
      newPrescription.professionalFullname = this.professionalFullname;
      newPrescription.patient_id = this.patient._id;
      newPrescription.date = this.professionalForm.get('date').value;
      newPrescription.supplies = this.professionalForm.get('supplies').value;
this.apiPrescriptions.newPrescription(newPrescription).subscribe((res: any) => {
  this.router.navigate(['/profesionales/recetas/nueva']);
}, (err: any) => {
  console.log(err);
});
}else{
  let newPatient: Patients = new Patients();
  newPatient.dni = this.professionalForm.get('patient_dni').value;
  newPatient.firstName = this.professionalForm.get('patient_first_name').value;
  newPatient.lastName = this.professionalForm.get('patient_last_name').value;
  newPatient.sex = this.professionalForm.get('patient_sex').value;
  this.apiPatients.newPatient(newPatient)
  .subscribe((res: any) => {
    let newPrescription: Prescriptions = new Prescriptions();
    newPrescription.user_id = this.authService.getLoggedUserId();
          newPrescription.professionalFullname = this.professionalFullname;
          newPrescription.patient_id = res["newPatient"]._id;
          newPrescription.date = this.professionalForm.get('date').value;
          newPrescription.supplies = this.professionalForm.get('supplies').value;
          this.apiPrescriptions.newPrescription(newPrescription).subscribe((res: any) => {
            this.router.navigate(['/profesionales/recetas/nueva']);
          }, (err: any) => {
            console.log(err);
          });;
          this.router.navigate(['/profesionales/recetas/nueva']);
        }, (err: any) => {
          console.log(err);
        });
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

  get suppliesForm(): FormArray{
    return this.professionalForm.get('supplies') as FormArray;
  }


  displayFn(supply: Supplies): string {
    return supply && supply.name ? supply.name : '';
  }


  addSupply() {
    if(this.suppliesForm.length < 2){
      const supplies = this.fBuilder.group({
        supply: ['', [Validators.required]]
      });
      this.suppliesForm.push(supplies);
    }
  }

  deleteSupply(i) {
    this.suppliesForm.removeAt(i);
  }
}
