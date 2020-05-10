import { Component, OnInit, Input, OnChanges, SimpleChanges, ɵChangeDetectorStatus, EventEmitter, Output } from '@angular/core';
import { Prescriptions } from '@interfaces/prescriptions';
import { DataSource } from '@angular/cdk/table';
import { Observable, of } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { AuthService } from '@auth/services/auth.service';
import { PrescriptionPrinterComponent } from '@professionals/components/prescription-printer/prescription-printer.component';
import { PrescriptionsService } from '@services/prescriptions.service';
import { ProfessionalDialogComponent } from '@professionals/components/professional-dialog/professional-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-professional-list',
  templateUrl: './professional-list.component.html',
  styleUrls: ['./professional-list.component.sass'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  providers: [PrescriptionPrinterComponent]
})

export class ProfessionalListComponent implements OnChanges, OnInit {
  @Output() deletePrescriptionEvent = new EventEmitter<Prescriptions>();
  @Input() myPrescriptions: Prescriptions[];

  displayedColumns: string[] = ['user', 'date', 'status', 'supplies', 'action'];
  displayedInsColumns: string[] = ['codigoPuco', 'financiador'];
  options: string[] = [];
  prescriptions: Prescriptions[] = [];
  dataSource: any = [];

  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  expandedElement: any;

  constructor(
    private authService: AuthService,
    private prescriptionPrinter: PrescriptionPrinterComponent,
    public dialog: MatDialog,
    private apiPrescription: PrescriptionsService
  ) { }

  ngOnChanges(changes: SimpleChanges){
    this.dataSource = new ExampleDataSource(changes.myPrescriptions.currentValue);
    console.log("Datasource: ", this.dataSource);
  }

  canPrint(prescription: Prescriptions){
    return (prescription.professional.userId === this.authService.getLoggedUserId())
  }

  canDelete(prescription: Prescriptions){
    return prescription.status === "Pendiente"
  }

  printPrescription(prescription: Prescriptions){
    this.prescriptionPrinter.print(prescription);
  }

  deleteDialogPrescription(prescription: Prescriptions){
    this.openDialog("delete", prescription);
  }

  deletePrescription(prescription: Prescriptions){
    this.deletePrescriptionEvent.emit(prescription);
  }

  ngOnInit(): void {}

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
