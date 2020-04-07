import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators, FormControl, FormArray } from '@angular/forms';
import { Observable } from 'rxjs';
import { SuppliesService } from '@services/supplies.service'
import Supplies from '@interfaces/supplies';
import { PatientsService } from '@root/app/services/patients.service';
import { Patients } from '@root/app/interfaces/patients';
import { Prescriptions } from '@interfaces/prescriptions';
import { PrescriptionsService } from '@services/prescriptions.service';
import { AuthService } from '@auth/services/auth.service';
import { ProfessionalsService } from '@services/professionals.service';
import { MatSnackBar } from '@angular/material/snack-bar';

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
  today = new Date((new Date()));
  professionalFullname: string;
  readonly maxQSupplies: number = 2;

  constructor(
    private suppliesService: SuppliesService,
    private fBuilder: FormBuilder,
    private apiPatients: PatientsService,
    private apiPrescriptions: PrescriptionsService,
    private authService: AuthService,
    private apiProfessionals: ProfessionalsService,
    private _snackBar: MatSnackBar
  ){}

  ngOnInit(): void {
    this.initProfessionalForm();

    this.apiProfessionals.getProfessionalByDni(this.authService.getLoggedUsername()).subscribe(
      res => {
        this.professionalFullname = res[0].last_name+", "+res[0].first_name;
      },
    )
    

    this.professionalForm.get('patient_dni').valueChanges.subscribe(
      term => {
        this.getPatientByDni(term);
      }
    )
  }

  initProfessionalForm(){
    this.today = new Date((new Date()));
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
    this.addSupply(); //init atleast one supply
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
    this.apiPatients.getPatientByDni(term).subscribe(
      res => {
        this.patient = res;
      },
    );
  }

  completePatientInputs(patient: Patients):void{
    this.professionalForm.get('patient_dni').setValue(patient.dni)
    this.professionalForm.get('patient_last_name').setValue(patient.lastName);
    this.professionalForm.get('patient_first_name').setValue(patient.firstName);
    this.professionalForm.get('patient_sex').setValue(patient.sex);
  }

  async onSubmitProfessionalForm() {
    console.log("Paciente: ", this.patient);
    if(this.patient){
      let newPrescription: Prescriptions = new Prescriptions();
      newPrescription.user_id = this.authService.getLoggedUserId();
      newPrescription.professionalFullname = this.professionalFullname;
      newPrescription.patientId = this.patient._id;
      newPrescription.date = this.professionalForm.get('date').value;
      newPrescription.supplies = this.professionalForm.get('supplies').value;
      this.apiPrescriptions.newPrescription(newPrescription).subscribe((res: any) => {
        this.initProfessionalForm();
        this.professionalForm.markAsPristine();
        this.professionalForm.markAsUntouched();
        this.professionalForm.updateValueAndValidity();
        this.openSnackBar("La receta se ha creado correctamente.", "Cerrar");
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
        newPrescription.patientId = res["newPatient"]._id;
        newPrescription.date = this.professionalForm.get('date').value;
        newPrescription.supplies = this.professionalForm.get('supplies').value;
        this.apiPrescriptions.newPrescription(newPrescription).subscribe((res: any) => {
          this.initProfessionalForm();
          this.professionalForm.markAsPristine();
          this.professionalForm.markAsUntouched();
          this.professionalForm.updateValueAndValidity();
          this.openSnackBar("La receta se ha creado correctamente.", "Cerrar");
        }, (err: any) => {
          console.log(err);
        });;
        }, (err: any) => {
          console.log(err);
        }
      );
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

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
