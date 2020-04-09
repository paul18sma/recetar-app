import { Component, OnInit, ViewChild } from '@angular/core';
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
import {ThemePalette} from '@angular/material/core';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-professional-form',
  templateUrl: './professional-form.component.html',
  styleUrls: ['./professional-form.component.sass']
})
export class ProfessionalFormComponent implements OnInit {
  @ViewChild('dni', {static: true}) dni:any;

  private supplyRequest: any = null;
  professionalForm: FormGroup;

  filteredOptions: Observable<string[]>;
  options: string[] = [];
  storedSupplies: Supplies[] = [];
  patientSearch: Patient = new Patient();
  sex_options: string[] = ["Femenino", "Masculino", "Otro"];
  today = new Date((new Date()));
  readonly maxQSupplies: number = 2;
  readonly spinnerColor: ThemePalette = 'accent';
  readonly spinnerDiameter: number = 30;
  showDiameter: boolean = false;
  dniShowSpinner: boolean = false;
  supplySpinner: { show: boolean}[] = [{show: false}, {show: false}];

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

    // get professionals
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
    this.addSupply(); //init atleast one supply
    this.dni.nativeElement.focus();
  }

  // on before fetch supplies data, it checks if we had a previous request,
  // so this will be canceled and then re call a new one with updated params
  public getSupplies(term: string, index: number):void{
    if(this.supplyRequest){
      this.supplyRequest.unsubscribe();
      this.fetchSupplies(term, index);
    } else {
      this.fetchSupplies(term, index);
    }
  }

  private fetchSupplies(term: string, index: number):void{
    if(term !== null && term.length > 3){

      this.supplySpinner[index] = {show: true};
      this.supplyRequest = this.suppliesService.getSupplyByTerm(term).subscribe(
        res => {
          this.storedSupplies = res as Supplies[];
          this.supplySpinner[index] = {show: false};
        },
      );
    }
  }

  getPatientByDni(dniValue: string | null):void{
    if(dniValue !== null && dniValue.length == 8 && this.patientSearch?.dni != dniValue  ){
      this.dniShowSpinner = true;
      this.apiPatients.getPatientByDni(dniValue).subscribe(
        res => {
          this.patientSearch = res;
          this.dniShowSpinner = false;
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
      this.showDiameter = !this.showDiameter;
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

          this.showDiameter = !this.showDiameter;
          this.openSnackBar("La receta se ha creado correctamente.", "Cerrar");
          this.dni.nativeElement.focus();
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
          this.showDiameter = !this.showDiameter;
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
