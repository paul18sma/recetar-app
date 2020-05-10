import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DataSource } from '@angular/cdk/collections';
import { of, Observable } from 'rxjs';
import { Prescriptions } from '@interfaces/prescriptions';
import { PrescriptionsService } from '@services/prescriptions.service';
import { MatDialog } from '@angular/material/dialog';
import { DialogComponent } from '@pharmacists/components/dialog/dialog.component';
import { AuthService } from '@auth/services/auth.service';
import { PrescriptionPrinterComponent } from '@pharmacists/components/prescription-printer/prescription-printer.component';

@Component({
  selector: 'app-prescription-list',
  templateUrl: './prescription-list.component.html',
  styleUrls: ['./prescription-list.component.sass'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  providers: [PrescriptionPrinterComponent]
})
export class PrescriptionListComponent implements OnChanges, OnInit {

  @Input() prescriptions: Prescriptions[];

  displayedColumns: string[] = ['user', 'date', 'status', 'supplies', 'action'];
  dataSource: any = [];
  private dsData: any;

  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  expandedElement: any;

  constructor(
    private authService: AuthService,
    private prescriptionService: PrescriptionsService,
    private prescriptionPrinter: PrescriptionPrinterComponent,
    public dialog: MatDialog,) { }

  ngOnChanges(changes: SimpleChanges){
    this.dataSource = new ExampleDataSource(changes.prescriptions.currentValue);
  }

  ngOnInit(): void {
  }

  // Dispense prescription, but if was, update table with the correct status.
  dispense(prescription: Prescriptions){
    this.prescriptionService.dispense(prescription._id).subscribe(
      res => {
        this.updateDataTable(res);
        this.openDialog("dispensed", res, res.professional.businessName);
      },
      err => {
        this.prescriptionService.getById(prescription._id).subscribe(
          res => {
            this.updateDataTable(res);
            this.openDialog("", undefined, err.error);
          }
        );
      }
    );
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

  // Return true if was dispensed and is seeing who dispensed the prescription
  canPrint(prescription: Prescriptions){
    return (prescription.status === "Dispensada") && (prescription.dispensedBy?.userId === this.authService.getLoggedUserId());
  }

  printPrescription(prescription: Prescriptions){
    this.prescriptionPrinter.print(prescription);
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

}

export class ExampleDataSource extends DataSource<any> {

  constructor(private data: Prescriptions[]){
    super();
  }

  connect(): Observable<Element[]> {
    const rows: any = [];
    this.data.forEach((element: Prescriptions) => rows.push(element, { detailRow: true, element }));
    return of(rows);
  }

  disconnect() { }
}
