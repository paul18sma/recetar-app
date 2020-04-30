import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Prescriptions } from '@interfaces/prescriptions';
import { DataSource } from '@angular/cdk/table';
import { Observable, of } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';

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
  ]
})

export class ProfessionalListComponent implements OnChanges, OnInit {
  @Input() myPrescriptions: Prescriptions[];

  displayedColumns: string[] = ['user', 'date', 'status', 'supplies'];
  displayedInsColumns: string[] = ['codigoPuco', 'financiador'];
  options: string[] = [];
  prescriptions: Prescriptions[] = [];
  dataSource: any = [];
  
  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  expandedElement: any;

  constructor(
  ) { }

  ngOnChanges(changes: SimpleChanges){
    this.dataSource = new ExampleDataSource(changes.myPrescriptions.currentValue);
  }

  ngOnInit(): void {}
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
