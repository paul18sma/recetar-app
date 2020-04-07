import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Professionals } from '@root/app/interfaces/professionals';
import Patient from '@root/app/interfaces/patients';
import { PatientsService } from '@services/patients.service';
import { PrescriptionsService } from '@services/prescriptions.service';
import { Prescriptions } from '@interfaces/prescriptions';
import { InsurancesService } from '@services/insurance.service';
import { Insurances } from '@interfaces/insurances';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataSource } from '@angular/cdk/collections';
import { of } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';

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
})
export class PharmacistsFormComponent implements OnInit {

  title = 'preinscriptions-control';
  prescriptionForm: FormGroup;
  today;

  displayedColumns: string[] = ['user', 'date', 'status', 'supplies', 'print', 'dispense'];
  displayedInsColumns: string[] = ['codigoPuco', 'financiador'];
  options: string[] = [];
  professional: Professionals;
  patient: Patient;
  prescriptions: Prescriptions[] = [];
  prescription: Prescriptions;
  insurances: Insurances;
  filteredOptions: Observable<string[]>;
  dataSource: any = [];


  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  expandedElement: any;

  constructor(
    private fBuilder: FormBuilder,
    private apiPatients: PatientsService,
    private apiPrescriptions: PrescriptionsService,
    private apiInsurances: InsurancesService,
    private _snackBar: MatSnackBar
  ){}

  ngOnInit(): void{
    this.initFilterPrescriptionForm();
    this.today = new Date();

    this.prescriptionForm.get('patient_dni').valueChanges.subscribe(
      term => {
        this.getPatientByDni(term);
      }
    )

    this.prescriptionForm.get('dateFilter').valueChanges.subscribe(
      term => {
        if(this.patient)
          this.apiPrescriptions.getByPatientAndDate(this.patient._id, term).subscribe();
        else{
          this.openSnackBar("Seleccione un paciente.", "Cerrar");
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

  dispense(prescription: Prescriptions){
  this.apiPrescriptions.dispense(prescription).subscribe(
      res => {
        this.prescription = res;
      },
    );
    this.openSnackBar("Le prescripción se dispensó conrrectamente.", "Cerrar")
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 2000,
    });
  }

  // Return prescriptions related to a patient
  searchPrescriptions(patient: Patient):void{
    this.prescriptionForm.get('patient_dni').setValue(patient.dni+" "+patient.lastName+" "+patient.firstName);
    this.apiPrescriptions.getByPatientId(patient._id).subscribe(
      res => {
        this.dataSource = new ExampleDataSource(res);
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

export class ExampleDataSource extends DataSource<any> {

  constructor(private data: Prescriptions[]){
    super();
  }

  connect(): Observable<Element[]> {
    const rows: any = [];
    this.data.forEach(element => rows.push(element, { detailRow: true, element }));
    console.log(rows);
    return of(rows);
  }

  disconnect() { }
}
