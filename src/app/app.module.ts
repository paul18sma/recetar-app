import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule, routingComponents } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';

import { PatientsService } from './services/patients.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
// moduules
import { AuthModule } from '@auth/auth.module';
// flex-layout
import { FlexLayoutModule } from '@angular/flex-layout';
// material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
// components

import { ProfessionalFormComponent } from './components/prescriptions/professional-form/professional-form.component';
import { HeaderComponent } from './components/layouts/header/header.component';


@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    ProfessionalFormComponent,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AuthModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatAutocompleteModule,
    MatMenuModule,
    MatToolbarModule
  ],
  providers: [
    PatientsService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
