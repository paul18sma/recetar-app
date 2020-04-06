import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Professionals } from '@root/app/interfaces/professionals';
import { Patients } from '@root/app/interfaces/patients';
import { PatientsService } from '@services/patients.service';
import { PrescriptionsService } from '@services/prescriptions.service';
import { Prescriptions } from '@interfaces/prescriptions';
import { InsurancesService } from '@services/insurance.service';
import { Insurances } from '@interfaces/insurances';

@Component({
  selector: 'app-pharmacists-form',
  templateUrl: './pharmacists-form.component.html',
  styleUrls: ['./pharmacists-form.component.sass']
})
export class PharmacistsFormComponent implements OnInit {

  title = 'preinscriptions-control';
  prescriptionForm: FormGroup;
  today;

  displayedColumns: string[] = ['user', 'date', 'status', 'supplies', 'buttons'];
  displayedInsColumns: string[] = ['codigoPuco', 'financiador'];
  options: string[] = [];
  professional: Professionals;
  patient: Patients;
  prescriptions: Prescriptions;
  insurances: Insurances;
  filteredOptions: Observable<string[]>;

  constructor(
    private fBuilder: FormBuilder, 
    private apiPatients: PatientsService,
    private apiPrescriptions: PrescriptionsService,
    private apiInsurances: InsurancesService
  ){}

  ngOnInit(): void{
    this.initPrescriptionForm();
    this.today = new Date();

    this.prescriptionForm.get('patient_dni').valueChanges.subscribe(
      term => {
        this.getPatientByDni(term);
      }
    )
  }

  initPrescriptionForm(){
    this.prescriptionForm = this.fBuilder.group({
      patient_dni: ['', [
        Validators.required,
        Validators.minLength(8)
      ]],
      date: ['', [
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

  searchPrescriptions(patient: Patients):void{
    this.prescriptionForm.get('patient_dni').setValue(patient.dni+" "+patient.lastName+" "+patient.firstName);
    this.apiPrescriptions.getByPatientId(patient._id).subscribe(
      res => {
        this.prescriptions = res;
      },
    );
    this.apiInsurances.getInsuranceByPatientDni(patient.dni).subscribe(
      res => {
        console.log("")
        this.insurances = res;
      },
    );
  }

  get patient_dni(): AbstractControl{
    return this.prescriptionForm.get('patient_dni');
  }

  get date(): AbstractControl{
    return this.prescriptionForm.get('date');
  }
}
