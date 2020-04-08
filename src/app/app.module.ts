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
import { PharmacistsModule } from '@pharmacists/pharmacists.module';
import { ProfessionalsModule } from '@professionals/professionals.module';
// flex-layout
import { FlexLayoutModule } from '@angular/flex-layout';
// material
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
// component
import { HeaderComponent } from '@shared/layouts/header/header.component';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    routingComponents,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    AuthModule,
    PharmacistsModule,
    ProfessionalsModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatToolbarModule,
    MatButtonModule
  ],
  providers: [
    PatientsService,
    DatePipe,
    {provide: MAT_DATE_LOCALE, useValue: 'es-AR'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
