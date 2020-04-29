import { Component, OnInit, Input } from '@angular/core';
import { Prescriptions } from '@interfaces/prescriptions';
import { DataSource } from '@angular/cdk/table';
import { Observable, of } from 'rxjs';
// Services
import { PrescriptionsService } from '@services/prescriptions.service';
import { AuthService } from '@auth/services/auth.service';
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

export class ProfessionalListComponent implements OnInit {
  displayedColumns: string[] = ['user', 'date', 'status', 'supplies'];
  displayedInsColumns: string[] = ['codigoPuco', 'financiador'];
  options: string[] = [];
  prescriptions: Prescriptions[] = [];
  dataSource: any = [];
  private dsData: any;

  isExpansionDetailRow = (i: number, row: Object) => row.hasOwnProperty('detailRow');
  expandedElement: any;

  constructor(
    private apiPrescriptions: PrescriptionsService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.apiPrescriptions.getByUserId(this.authService.getLoggedUserId()).subscribe(
      res => {
        if(!res.length){
          
        }else{
          this.dataSource = new ExampleDataSource(res);
        }
      },
    );
  }

  /**
   * addPrescription
   */
  public addPrescription(prescription: Prescriptions) {
    console.log("Datesource before add", this.dataSource);
    this.dataSource.data.push(prescription);
    console.log("Datasource after add", this.dataSource);
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
