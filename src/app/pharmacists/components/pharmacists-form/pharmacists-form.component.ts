import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';

// Services
import { PatientsService } from '@services/patients.service';
import { PrescriptionsService } from '@services/prescriptions.service';
import { InsurancesService } from '@services/insurance.service';

// Interfaces
import { Patient } from '@interfaces/patients';
import { Prescriptions } from '@interfaces/prescriptions';
import { Insurances } from '@interfaces/insurances';
import { Professionals } from '@root/app/interfaces/professionals';

// Material
import { MatDialog } from '@angular/material/dialog';

import { DialogComponent } from '@pharmacists/components/dialog/dialog.component';

import { DatePipe } from '@angular/common'


@Component({
  selector: 'app-pharmacists-form',
  templateUrl: './pharmacists-form.component.html',
  styleUrls: ['./pharmacists-form.component.sass'],
})
export class PharmacistsFormComponent implements OnInit {

  title = 'preinscriptions-control';
  prescriptionForm: FormGroup;
  displayedInsColumns: string[] = ['codigoPuco', 'financiador'];
  options: string[] = [];
  professional: Professionals;
  patient: Patient;
  prescriptions: Prescriptions[] = [];
  prescription: Prescriptions;
  insurances: Insurances;
  filteredOptions: Observable<string[]>;

  constructor(
    private fBuilder: FormBuilder,
    private apiPatients: PatientsService,
    private apiPrescriptions: PrescriptionsService,
    private apiInsurances: InsurancesService,
    public dialog: MatDialog,
    public datepipe: DatePipe
  ){}

  ngOnInit(): void{
    this.initFilterPrescriptionForm();

    this.prescriptionForm.valueChanges.subscribe(
      values => {
        if(typeof(values.patient_dni) !== 'undefined' && values.patient_dni.length === 8){


          this.apiPrescriptions.getFromDniAndDate(values).subscribe(
            res => {
              console.log(res, 'from res');
              this.prescriptions = res;
            }
          );
        } else{
          // this.openDialog("selectPatient");
        }
      }
    )
    // Find patient by dni
    // this.prescriptionForm.get('patient_dni').valueChanges.subscribe(
    //   term => {
    //     this.getPatientByDni(term);
    //   }
    // )

    // Get prescriptions by date and patient dni
    // this.prescriptionForm.get('dateFilter').valueChanges.subscribe(
    //   term => {

    //   }
    // )
  }

  initFilterPrescriptionForm(){
    this.prescriptionForm = this.fBuilder.group({
      patient_dni: ['', [
        Validators.required,
        Validators.minLength(8)
      ]],
      dateFilter: ['', [
      ]],
    });
  }

  getPatientByDni(term: string):void{
    if(term.length > 7){
      this.apiPatients.getPatientByDni(term).subscribe(
        res => {
          if(res){
            this.patient = res;
          }else{
            this.openDialog("patientNotFound", undefined, term);
          }
        },
      );
    }
  }

  // Show a dialog
  openDialog(aDialogType: string, aPrescription?: Prescriptions, aText?: string): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '400px',
      data: {dialogType: aDialogType, prescription: aPrescription, text: aText }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  // Return prescriptions related to a patient
  searchPrescriptions(patient: Patient):void{
    this.apiPrescriptions.getByPatientId(patient._id).subscribe(
      res => {
        if(!res.length){
          this.openDialog("noPrescriptions");
        }
        this.prescriptions = res;
      },
    );
    this.apiInsurances.getInsuranceByPatientDni(patient.dni).subscribe(
      res => {
        this.insurances = res;
      },
    );
  }


  get patient_dni(): AbstractControl{
    return this.prescriptionForm.get('patient_dni');
  }

  get dateFilter(): AbstractControl{
    return this.prescriptionForm.get('dateFilter');
  }
}


