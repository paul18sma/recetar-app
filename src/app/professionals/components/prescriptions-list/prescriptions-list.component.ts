import { Component, OnInit, ViewChild, AfterContentInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { PrescriptionsService } from '@services/prescriptions.service';
import { Prescriptions } from '@interfaces/prescriptions';
import * as moment from 'moment';

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
    ])
  ]
})
export class PrescriptionsListComponent implements OnInit, AfterContentInit {


  displayedColumns: string[] = ['patient', 'prescription_date', 'status', 'star'];
  dataSource = new MatTableDataSource<Prescriptions>([]);
  expandedElement: Prescriptions | null;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private prescriptionService: PrescriptionsService){}



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

}
