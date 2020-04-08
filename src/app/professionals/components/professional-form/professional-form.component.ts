import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators, FormArray, FormGroupDirective } from '@angular/forms';
import { Observable } from 'rxjs';
import { SuppliesService } from '@services/supplies.service'
import Supplies from '@interfaces/supplies';
import { PatientsService } from '@root/app/services/patients.service';
import { PrescriptionsService } from '@services/prescriptions.service';
import { AuthService } from '@auth/services/auth.service';
import { ProfessionalsService } from '@services/professionals.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Patient } from '@interfaces/patients';

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
  patientSearch: Patient = new Patient();
  sex_options: string[] = ["Femenino", "Masculino", "Otro"];
  today = new Date((new Date()));
  readonly maxQSupplies: number = 2;
  hide= true;

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
        this.professionalFullname.setValue(res[0].last_name+", "+res[0].first_name);
      },
    )
    // on DNI changes
    this.patientDni.valueChanges.subscribe(
      dniValue => {
        this.getPatientByDni(dniValue);
      }
    )
  }

  initProfessionalForm(){
    this.today = new Date((new Date()));
    this.professionalForm = this.fBuilder.group({
      user_id: [this.authService.getLoggedUserId()],
      professionalFullname: [''],
      patient: this.fBuilder.group({
        dni: ['', [
          Validators.required,
          Validators.minLength(8)
        ]],
        lastName: ['', [
          Validators.required
        ]],
        firstName: ['', [
          Validators.required
        ]],
        sex: ['', [
          Validators.required
        ]]
      }),
      date: [this.today, [
        Validators.required
      ]],
      observation: [''],
      supplies: this.fBuilder.array([])
    });
    this.addSupply(); //init atleast one supply
  }

  getSupplies(term: string):void{
    if(term !== null && term.length > 3){

      this.suppliesService.getSupplyByTerm(term).subscribe(
        res => {
          this.storedSupplies = res as Supplies[];
        },
      );
    }
  }

  getPatientByDni(dniValue: string | null):void{
    if(dniValue !== null && dniValue.length == 8){
      this.apiPatients.getPatientByDni(dniValue).subscribe(
        res => {
          this.patientSearch = res;
        },
      );
    }
  }

  completePatientInputs(patient: Patient):void{
    this.patientLastName.setValue(patient.lastName);
    this.patientFirstName.setValue(patient.firstName);
    this.patientSex.setValue(patient.sex);
  }

  // Create patient if doesn't exist and create prescription
  onSubmitProfessionalForm(professionalForm: FormGroup, professionalNgForm: FormGroupDirective):void {

    if(this.professionalForm.valid){
      const newPrescription = this.professionalForm.value;
      this.apiPrescriptions.newPrescription(newPrescription).subscribe(
        res => {
          // get defualt value before reset
          const userId = this.userId.value;
          const date = this.today;
          const professionalFullname = this.professionalFullname.value;
          professionalNgForm.resetForm();
          professionalForm.reset({
            user_id: userId,
            date: date,
            professionalFullname: professionalFullname
          });
          this.openSnackBar("La receta se ha creado correctamente.", "Cerrar");
          },
        err => {
          err.error.map(err => {
            // handle supplies error
            this.suppliesForm.controls.map(control => {
              if(control.get('supply').value == err.supply){
                control.get('supply').setErrors({ invalid: err.message});
              }
            });
          });
      });
    }
  }

  get userId(): AbstractControl{
    return this.professionalForm.get('user_id');
  }

  get date(): AbstractControl{
    return this.professionalForm.get('date');
  }

  get professionalFullname(): AbstractControl{
    return this.professionalForm.get('professionalFullname');
  }

  get suppliesForm(): FormArray{
    return this.professionalForm.get('supplies') as FormArray;
  }

  get patientDni(): AbstractControl {
    const patient = this.professionalForm.get('patient');
    return patient.get('dni');
  }

  get patientLastName(): AbstractControl{
    const patient = this.professionalForm.get('patient');
    return patient.get('lastName');
  }

  get patientFirstName(): AbstractControl{
    const patient = this.professionalForm.get('patient');
    return patient.get('firstName');
  }

  get patientSex(): AbstractControl{
    const patient = this.professionalForm.get('patient');
    return patient.get('sex');
  }

  displayFn(supply: Supplies): string {
    return supply && supply.name ? supply.name : '';
  }

  addSupply() {
    if(this.suppliesForm.length < 2){
      const supplies = this.fBuilder.group({
        supply: ['', [Validators.required]],
        quantity: ['1', [
          Validators.required,
          Validators.min(1),
        ]]
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
