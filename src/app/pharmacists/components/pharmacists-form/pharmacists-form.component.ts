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

import { DataSource } from '@angular/cdk/collections';
import { of } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AuthService } from '@auth/services/auth.service';
import { DialogComponent } from '@pharmacists/components/dialog/dialog.component';
import { PrescriptionPrinterComponent } from '@pharmacists/components/prescription-printer/prescription-printer.component';


@Component({
  selector: 'app-pharmacists-form',
  templateUrl: './pharmacists-form.component.html',
  styleUrls: ['./pharmacists-form.component.sass'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  providers: [PrescriptionPrinterComponent]
})
export class PharmacistsFormComponent implements OnInit {

  title = 'preinscriptions-control';
  prescriptionForm: FormGroup;

  displayedColumns: string[] = ['user', 'date', 'status', 'supplies', 'action'];
  displayedInsColumns: string[] = ['codigoPuco', 'financiador'];
  options: string[] = [];
  professional: Professionals;
  patient: Patient;
  prescriptions: Prescriptions[] = [];
  prescription: Prescriptions;
  insurances: Insurances;
  filteredOptions: Observable<string[]>;
  dataSource: any = [];
  private dsData: any;

  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  expandedElement: any;

  constructor(
    private fBuilder: FormBuilder,
    private apiPatients: PatientsService,
    private apiPrescriptions: PrescriptionsService,
    private apiInsurances: InsurancesService,
    private authService: AuthService,
    public dialog: MatDialog,
    private prescriptionPrinter: PrescriptionPrinterComponent
  ){}

  ngOnInit(): void{
    this.initFilterPrescriptionForm();

    // Find patient by dni
    this.prescriptionForm.get('patient_dni').valueChanges.subscribe(
      term => {
        this.getPatientByDni(term);
      }
    )

    // Get prescriptions by date and patient dni
    this.prescriptionForm.get('dateFilter').valueChanges.subscribe(
      term => {
        if(this.patient)
          this.apiPrescriptions.getByPatientAndDate(this.patient._id, term).subscribe(
            res => {
              if(!res.length){
                this.openDialog("noPrescriptionsDate", undefined, term);
              }else{
                this.dataSource = new ExampleDataSource(res);
              }
            }
          );
        else{
          this.openDialog("selectPatient");
        }
      }
    )
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
    if(term.length > 2){
      this.apiPatients.getPatientByDni(term).subscribe(
        res => {
          this.patient = res;
        },
      );
    }
  }

  // Dispense prescription, but if was, update table with the correct status.
  dispense(prescription: Prescriptions){
    this.apiPrescriptions.dispense(prescription).subscribe(
      res => {
        this.updateDataTable(res);
        this.openDialog("dispensed", res);
      },
      err => {
        this.apiPrescriptions.getById(prescription._id).subscribe(
          res => {
            this.updateDataTable(res);
            this.openDialog("", undefined, err.error);
          }
        );
      }
    );
  }

  // Update the row table with the prescription
  private updateDataTable (prescription: Prescriptions) {
    this.dsData = this.dataSource.data;
    if (this.dsData.length > 0) {
      for (let i = 0; i < this.dsData.length; i++ ) {
        if (this.dsData[i]._id === prescription._id) {
          this.dsData[i] = prescription; // Assign the new prescription
          this.dataSource = new ExampleDataSource(this.dsData); // Create new dataSource
        }
      }
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
    this.prescriptionForm.get('patient_dni').setValue(patient.dni+" "+patient.lastName+" "+patient.firstName);
    this.apiPrescriptions.getByPatientId(patient._id).subscribe(
      res => {
        if(!res.length){
          this.openDialog("noPrescriptions");
        }else{
          this.dataSource = new ExampleDataSource(res);
        }
      },
    );
    this.apiInsurances.getInsuranceByPatientDni(patient.dni).subscribe(
      res => {
        this.insurances = res;
      },
    );
  }

  // Return true if was dispensed and is seeing who dispensed the prescription 
  canPrint(prescription: Prescriptions){
    return (prescription.status === "Dispensada") && (prescription.dispensedBy === this.authService.getLoggedUserId())
  }

  printPrescription(prescription: Prescriptions){
    this.prescriptionPrinter.print(prescription);
  }

  get patient_dni(): AbstractControl{
    return this.prescriptionForm.get('patient_dni');
  }

  get dateFilter(): AbstractControl{
    return this.prescriptionForm.get('dateFilter');
  }
}

export class ExampleDataSource extends DataSource<any> {

  constructor(private data: Prescriptions[]){
    super();
  }

  connect(): Observable<Element[]> {
    const rows: any = [];
    this.data.forEach(element => rows.push(element, { detailRow: true, element }));
    return of(rows);
  }

  disconnect() { }
}
