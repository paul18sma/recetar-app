import { Component, OnInit, ViewChild, AfterContentInit, Output, EventEmitter} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { PrescriptionsService } from '@services/prescriptions.service';
import { Prescriptions } from '@interfaces/prescriptions';
import * as moment from 'moment';
import { AuthService } from '@auth/services/auth.service';
import { PrescriptionPrinterComponent } from '@professionals/components/prescription-printer/prescription-printer.component';
import { ProfessionalDialogComponent } from '@professionals/components/professional-dialog/professional-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-prescriptions-list',
  templateUrl: './prescriptions-list.component.html',
  styleUrls: ['./prescriptions-list.component.sass'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('expanded <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ]),
    trigger('arrowDirection', [
      state('down', style({ transform: "rotate(0deg)" })),
      state('up, void', style({ transform: "rotate(180deg)" })),
      transition('down <=> up', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
      transition('down <=> void', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'))
    ])
  ],
  providers: [PrescriptionPrinterComponent]
})
export class PrescriptionsListComponent implements OnInit, AfterContentInit {
  @Output() editPrescriptionEvent = new EventEmitter();

  displayedColumns: string[] = ['patient', 'prescription_date', 'status', 'supply_count', 'action', 'arrow'];
  dataSource = new MatTableDataSource<Prescriptions>([]);
  expandedElement: Prescriptions | null;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(
    private prescriptionService: PrescriptionsService,
    private authService: AuthService,
    private prescriptionPrinter: PrescriptionPrinterComponent,
    public dialog: MatDialog){}



  ngOnInit() {
    this.prescriptionService.prescriptions.subscribe((prescriptions: Prescriptions[]) => {
      this.dataSource = new MatTableDataSource<Prescriptions>(prescriptions);
      // sort after populate dataSource
      this.dataSource.sortingDataAccessor = (item, property) => {
        switch(property) {
          case 'patient': return item.patient.lastName + item.patient.firstName;
          case 'prescription_date': return new Date(item.date).getTime();
          default: return item[property];
        }
      };
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;
    });

  }

  ngAfterContentInit(){
    this.paginator._intl.itemsPerPageLabel = "Prescripciones por página";
    this.paginator._intl.firstPageLabel = "Primer página";
    this.paginator._intl.lastPageLabel = "Última página";
    this.paginator._intl.nextPageLabel = "Siguiente";
    this.paginator._intl.previousPageLabel = "Anterior";
    this.paginator._intl.getRangeLabel = (page: number, pageSize: number, length: number): string => {
      if (length == 0 || pageSize == 0)
      {
        return `0 de ${length}`;
      }
      length = Math.max(length, 0);
      const startIndex = page * pageSize;
      const endIndex = startIndex < length ? Math.min(startIndex + pageSize, length) : startIndex + pageSize;
      return `${startIndex + 1} – ${endIndex} de ${length}`;
    }
  }


  applyFilter(filterValue: string) {
    this.dataSource.filterPredicate = (data: Prescriptions, filter: string)  => {
      const accumulator = (currentTerm, key) => {
        // enable filter by lastName / firstName / date
        return currentTerm + data.patient.lastName + data.patient.firstName + moment(data.date, 'YYYY-MM-DD').format('DD/MM/YYY').toString()
      };

      const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
      // Transform the filter by converting it to lowercase and removing whitespace.
      const transformedFilter = filter.trim().toLowerCase();
      return dataStr.indexOf(transformedFilter) !== -1;
    };
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  canPrint(prescription: Prescriptions): Boolean{
    return (prescription.professional.userId === this.authService.getLoggedUserId());
  }

  canEdit(prescription: Prescriptions): Boolean{
    return prescription.status === "Pendiente";
  }

  canDelete(prescription: Prescriptions): Boolean{
    return (prescription.professional.userId === this.authService.getLoggedUserId() && prescription.status === "Pendiente");
  }

  printPrescription(prescription: Prescriptions){
    this.prescriptionPrinter.print(prescription);
  }

  editPrescription(prescription: Prescriptions){
    this.editPrescriptionEvent.emit(prescription);
  }

  deleteDialogPrescription(prescription: Prescriptions){
    this.openDialog("delete", prescription);
  }

   // Show a dialog
  private openDialog(aDialogType: string, aPrescription?: Prescriptions, aText?: string): void {
    const dialogRef = this.dialog.open(ProfessionalDialogComponent, {
      width: '400px',
      data: {dialogType: aDialogType, prescription: aPrescription, text: aText }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }
}
