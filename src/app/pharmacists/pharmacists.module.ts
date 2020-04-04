import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { PharmacistsRoutingModule, routingComponent } from './pharmacists-routing.module';
// flex-layout
import { FlexLayoutModule } from '@angular/flex-layout';
// material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  declarations: [
    routingComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    PharmacistsRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FlexLayoutModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatMenuModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ]
})
export class PharmacistsModule { }
