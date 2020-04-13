import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Professionals } from '@root/app/interfaces/professionals';
import { Patient } from '@interfaces/patients';
import { PatientsService } from '@services/patients.service';
import { PrescriptionsService } from '@services/prescriptions.service';
import { Prescriptions } from '@interfaces/prescriptions';
import { InsurancesService } from '@services/insurance.service';
import { Insurances } from '@interfaces/insurances';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DataSource } from '@angular/cdk/collections';
import { of } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import * as pdfFontsX from 'pdfmake-unicode/dist/pdfmake-unicode.js';
import { PdfMakeWrapper, Txt, Canvas, Line, Img } from 'pdfmake-wrapper';
import { DatePipe } from '@angular/common';
import { AuthService } from '@auth/services/auth.service';

PdfMakeWrapper.setFonts(pdfFontsX);

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
    private _snackBar: MatSnackBar,
    private authService: AuthService,
    private datePipe: DatePipe
  ){}

  ngOnInit(): void{
    this.initFilterPrescriptionForm();

    this.prescriptionForm.get('patient_dni').valueChanges.subscribe(
      term => {
        this.getPatientByDni(term);
      }
    )

    this.prescriptionForm.get('dateFilter').valueChanges.subscribe(
      term => {
        if(this.patient)
          this.apiPrescriptions.getByPatientAndDate(this.patient._id, term).subscribe(
            res => {
              console.log("RES:", res);
              this.dataSource = new ExampleDataSource(res);
            },
          );
        else{
          this.openSnackBar("Seleccione un paciente.", "Cerrar");
        }
      }
    )
  }

  // Print a prescription as PDF
  async printPrescription(prescription: Prescriptions){
    const pdf: PdfMakeWrapper = new PdfMakeWrapper();
    console.log(prescription);
    pdf.info({
      title: "Receta digital "+prescription.professionalFullname,
      author: 'RecetAR'
    });
    
    pdf.add(await new Img('assets/img/LogoPdf.jpg').fit([60, 60]).build());
    pdf.add(new Txt('RECETA DIGITAL').bold().alignment('center').end);
    pdf.add(pdf.ln(2));
    pdf.add(new Txt(""+this.datePipe.transform(prescription.date, 'dd/MM/yyyy')).alignment('right').end);
    pdf.add(new Txt("Profesional").bold().end);
    pdf.add(new Txt(""+prescription.professionalFullname).end);
    pdf.add(pdf.ln(1));
    pdf.add(new Txt("Paciente").bold().end);
    pdf.add(new Txt(""+prescription.patient.lastName.toUpperCase()+", "+prescription.patient.firstName.toUpperCase()).end);
    pdf.add(
      new Canvas([
          new Line(10, [500, 10]).end
      ]).end
    );
    pdf.add(pdf.ln(1));
    console.log("Supplies:", prescription.supplies);
    prescription.supplies.forEach(supply => {
      console.log("Supply:", supply);

      pdf.add(new Txt(""+supply.supply.name+", cantidad: "+supply.quantity).end); // Marca error pero funciona bien
      pdf.add(pdf.ln(1));
    });
    pdf.add(
      new Canvas([
          new Line(10, [500, 10]).end
      ]).end
    );
    pdf.add(pdf.ln(1));
    pdf.add(new Txt("Observaciones").bold().end);
    pdf.add(new Txt(""+prescription.observation).end);
    pdf.footer(new Txt("Esta receta se registró en recetar.andes.gob.ar").italics().alignment('center').end);

    pdf.create().open();
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

  // Dispense prescription, but if was, update table.
  dispense(prescription: Prescriptions){
    this.apiPrescriptions.dispense(prescription).subscribe(
      res => {
        this.updateDataTable(res);
        this.openSnackBar("Le prescripción se dispensó correctamente.", "Cerrar");
      },
      err => {
        this.apiPrescriptions.getById(prescription._id).subscribe(
          res => {
            this.updateDataTable(res);
            this.openSnackBar(err.error, "Cerrar");
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

  // Show a notification
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000
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

  // Return true if was dispensed and is seeing who dispensed the prescription 
  canPrint(prescription: Prescriptions){
    return (prescription.status === "Dispensada") && (prescription.dispensedBy === this.authService.getLoggedUserId())
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
