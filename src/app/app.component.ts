import { Component, OnInit } from '@angular/core';
import { DrugsService } from './services/drugs.service';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map, tap } from 'rxjs/operators';
import Drugs from './interfaces/drugs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

  title = 'preinscriptions-control';
  prescriptionForm: FormGroup;
  today;

  options: string[] = [];
  drugs: Drugs[] = [];
  filteredOptions: Observable<string[]>;

  constructor(private drugsService: DrugsService, private fBuilder: FormBuilder){}

  ngOnInit(){
    this.initPrescriptionForm();
    this.today = new Date();

    this.prescriptionForm.get('supply').valueChanges.subscribe(
      term => {
        this.getDrugs(term);
      }
    )

  }

  initPrescriptionForm(){
    this.prescriptionForm = this.fBuilder.group({
      dni: ['', [
        Validators.required,
        Validators.minLength(8)
      ]],
      date: ['', [
        Validators.required
      ]],
      professional: ['', [
        Validators.required
      ]],
      supply: ['', [
        Validators.required
      ]],
    });
  }

  getDrugs(term: string):void{
    if(term.length > 2){

      this.drugsService.getDrugByTerm(term).subscribe(
        res => {
          this.drugs = res.items;
        },
      );
    }
  }

  onSubmitPrescriptionForm(){
    console.log('page under construction');
  }


  get dni(): AbstractControl{
    return this.prescriptionForm.get('dni');
  }

  get date(): AbstractControl{
    return this.prescriptionForm.get('date');
  }

  get professional(): AbstractControl{
    return this.prescriptionForm.get('professional');
  }

  get supply(): AbstractControl{
    return this.prescriptionForm.get('supply');
  }
}
