import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ValidatorFormComponent } from './components/prescriptions/validator-form/validator-form.component';


const routes: Routes = [
  {
    path: '',
    component:  ValidatorFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [
  ValidatorFormComponent
]
