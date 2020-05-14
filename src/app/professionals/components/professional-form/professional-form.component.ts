import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators, FormArray, FormGroupDirective, FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { SuppliesService } from '@services/supplies.service'
import Supplies from '@interfaces/supplies';
import { PatientsService } from '@root/app/services/patients.service';
import { PrescriptionsService } from '@services/prescriptions.service';
import { AuthService } from '@auth/services/auth.service';
import { Patient } from '@interfaces/patients';
import {ThemePalette} from '@angular/material/core';
import { Prescriptions } from '@interfaces/prescriptions';
import { ProfessionalDialogComponent } from '@professionals/components/professional-dialog/professional-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { InteractionService } from '@professionals/interaction.service';

@Component({
  selector: 'app-professional-form',
  templateUrl: './professional-form.component.html',
  styleUrls: ['./professional-form.component.sass'],
})
export class ProfessionalFormComponent implements OnInit {
  @ViewChild('dni', {static: true}) dni:any;

  private supplyRequest: any = null;
  professionalForm: FormGroup;

  filteredOptions: Observable<string[]>;
  options: string[] = [];
  storedSupplies: Supplies[] = [];
  patientSearch: Patient;
  sex_options: string[] = ["Femenino", "Masculino", "Otro"];
  today = new Date((new Date()));
  professionalData: any;
  readonly maxQSupplies: number = 2;
  readonly spinnerColor: ThemePalette = 'primary';
  readonly spinnerDiameter: number = 30;
  isSubmit: boolean = false;
  dniShowSpinner: boolean = false;
  supplySpinner: { show: boolean}[] = [{show: false}, {show: false}];
  myPrescriptions: Prescriptions[] = [];
  isEdit: boolean = false;

  constructor(
    private suppliesService: SuppliesService,
    private fBuilder: FormBuilder,
    private apiPatients: PatientsService,
    private apiPrescriptions: PrescriptionsService,
    private authService: AuthService,
    public dialog: MatDialog,
    private _interactionService: InteractionService
  ){}

  ngOnInit(): void {
    this.initProfessionalForm();

    // On confirm delete prescription
    this._interactionService.deletePrescription$
      .subscribe(
        prescription => {
          this.deletePrescription(prescription);
        }
      );

    // on DNI changes
    this.patientDni.valueChanges.subscribe(
      dniValue => {
        this.getPatientByDni(dniValue);
      }
    );

    // subscribe to each supply field changes
    this.suppliesForm.controls.map((supplyControl, index) => {
      supplyControl.get('supply').valueChanges.subscribe((supply: string | {_id: string, name: string})  => {
        if(typeof(supply) === 'string' && supply.length > 3){
          if(this.supplyRequest !== null) this.supplyRequest.unsubscribe();

          this.supplySpinner[index] = {show: true};
          this.supplyRequest = this.suppliesService.getSupplyByTerm(encodeURIComponent(supply)).subscribe(
            res => {
              this.storedSupplies = res as Supplies[];
              this.supplySpinner[index] = {show: false};
            },
          );
        }else if(typeof(supply) === 'object' || (typeof(supply) === 'string' && supply.length == 0)){
          this.storedSupplies = [];
        }else{
          this.supplySpinner[index] = {show: false};
        }
        // add or remove closest quantity validation
        if(index > 0) this.onSuppliesAddControlQuantityValidators(index, (
          ((typeof(supply) === 'string' && supply.length > 0) ||
          (typeof(supply) === 'object')) &&
          (typeof(supply) !== 'undefined' && supply !== null))
        );
      });
    });

    // get prescriptions
    this.apiPrescriptions.getByUserId(this.authService.getLoggedUserId()).subscribe(
      res => {
        this.myPrescriptions = res;
      },
    );
  }

  initProfessionalForm(){
    this.today = new Date((new Date()));
    this.professionalData = this.authService.getLoggedUserId();
    this.professionalForm = this.fBuilder.group({
      _id: [''],
      professional: [this.professionalData],
      patient: this.fBuilder.group({
        dni: ['', [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern("^[0-9]*$")
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
      supplies: this.fBuilder.array([
        this.fBuilder.group({
          supply: ['', Validators.required],
          quantity: ['', [
            Validators.required,
            Validators.min(1)
          ]]
        }),
        this.fBuilder.group({
          supply: [''],
          quantity: ['']
        }),
      ])
    });
    this.dni.nativeElement.focus();
  }


  onSuppliesAddControlQuantityValidators(index: number, add: boolean){
    const quantity = this.suppliesForm.controls[index].get('quantity');
    if(add && !quantity.validator){
      quantity.setValidators([
        Validators.required,
        Validators.min(1)
      ]);
    }else if(!add && !!quantity.validator){
      quantity.clearValidators();
    }
    quantity.updateValueAndValidity();
  }

  getPatientByDni(dniValue: string | null):void{
    if(dniValue !== null && dniValue.length == 8 && this.patientSearch?.dni != dniValue  ){
      this.dniShowSpinner = true;
      this.apiPatients.getPatientByDni(dniValue).subscribe(
        res => {
          if(res !== null){
            this.patientSearch = res;
          }else if(this.patientSearch?._id){
            // clean fields
            this.patientSearch = { firstName: '', lastName: '', sex: ''};
            this.patientLastName.setValue(this.patientSearch.lastName);
            this.patientFirstName.setValue(this.patientSearch.firstName);
            this.patientSex.setValue(this.patientSearch.sex);
          }
          this.dniShowSpinner = false;
      });
    }else{
      this.dniShowSpinner = false;
    }
  }

  completePatientInputs(patient: Patient): void {
    this.patientLastName.setValue(patient.lastName);
    this.patientFirstName.setValue(patient.firstName);
    this.patientSex.setValue(patient.sex);
  }

  // Create patient if doesn't exist and create prescription
  onSubmitProfessionalForm(professionalForm: FormGroup, professionalNgForm: FormGroupDirective): void {

    if(this.professionalForm.valid){
      const newPrescription = this.professionalForm.value;
      this.isSubmit = true;
      if(!this.isEdit){
        // create
        this.apiPrescriptions.newPrescription(newPrescription).subscribe(
          res => {
            this.formReset(professionalNgForm);
            this.myPrescriptions = [...this.myPrescriptions, res];
          },
          err => {
            this.handleSupplyError(err);
          });

      } else {
        // edit
        this.apiPrescriptions.editPrescription(newPrescription).subscribe(
          res => {
            this.formReset(professionalNgForm);
            const prescription: Prescriptions = res;
            this.myPrescriptions.forEach( (item, index) => {
              if(item._id === prescription._id) {
                this.myPrescriptions[index] = prescription;
              }
            });
            this.myPrescriptions = [...this.myPrescriptions]; // trick to catch the value change
          },
          err => {
            this.handleSupplyError(err);
        });
      }
    }
  }

  private handleSupplyError(err){
    if(err.error.length > 0){
      err.error.map(err => {
        // handle supplies error
        this.suppliesForm.controls.map(control => {
          if(control.get('supply').value == err.supply){
            control.get('supply').setErrors({ invalid: err.message});
          }
        });
      });
    }
    this.isSubmit = false;
    this.isEdit = false;
  }

  private formReset(professionalNgForm: FormGroupDirective){
    professionalNgForm.resetForm();
    this.isEdit ? this.openDialog("updated") : this.openDialog("created");
    this.clearForm();
    this.isSubmit = false;
    this.dni.nativeElement.focus();
  }

  deletePrescription(prescription: Prescriptions){
    console.log("Prescriptions: ", prescription);
    this.apiPrescriptions.deletePrescription(prescription._id).subscribe(
      res => {
        this.myPrescriptions.forEach( (item, index) => {
          if(item._id === res._id) this.myPrescriptions.splice(index,1);
        });
        this.myPrescriptions = [...this.myPrescriptions];
      },
      err => {
        this.openDialog("error-dispensed")
      }
    );
  }

  // Show a dialog
  openDialog(aDialogType: string, aPrescription?: Prescriptions, aText?: string): void {
    const dialogRef = this.dialog.open(ProfessionalDialogComponent, {
      width: '400px',
      data: {dialogType: aDialogType, prescription: aPrescription, text: aText }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  get professional(): AbstractControl{
    return this.professionalForm.get('professional');
  }

  get date(): AbstractControl{
    return this.professionalForm.get('date');
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
        supply: [''],
        quantity: ['']
      });
      this.suppliesForm.push(supplies);
    }
  }

  deleteSupply(i) {
    this.suppliesForm.removeAt(i);
  }

  // set form with prescriptions values and disabled npt editable fields
  editPrescription(e){
    this.professionalForm.reset({
      _id: e._id,
      date: e.date,
      observation: e.observation,
      patient: {
        dni: {value: e.patient.dni, disabled: true},
        sex: {value: e.patient.sex, disabled: true},
        lastName: {value: e.patient.lastName, disabled: true},
        firstName: {value: e.patient.firstName, disabled: true}
      },
      supplies: e.supplies
    });
    this.isEdit = true;
  }

  // reset the form as intial values
  clearForm(){
    this.professionalForm.reset({
      _id: '',
      professional: this.professionalData,
      date: this.today,
      patient: {
        dni: {value: '', disabled: false},
        sex: {value: '', disabled: false},
        lastName: {value: '', disabled: false},
        firstName: {value: '', disabled: false}
      },
    });
    this.isEdit = false;
  }
}
