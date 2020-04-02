import { Component, OnInit } from '@angular/core';
import { DrugsService } from './services/drugs.service';
import { FormBuilder, FormGroup, AbstractControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent implements OnInit {

  title = 'preinscriptions-control';
  prescriptionForm: FormGroup;
  today;

  options: string[] = ['One', 'Two', 'Three'];
  filteredOptions: Observable<string[]>;

  constructor(private drugsService: DrugsService, private fBuilder: FormBuilder){}

  ngOnInit(){
    this.initPrescriptionForm();
    this.today = new Date();

    this.drugsService.getDrugByName('ibuprofeno').subscribe(
      res => console.log('res', res),
      err => console.log('err', err)
    )

    this.filteredOptions = this.prescriptionForm.get('supply').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(value))
      );
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

  onSubmitPrescriptionForm(){

  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
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
