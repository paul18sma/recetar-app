import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '@auth/guards/auth.guard';
// components
import { ProfessionalsComponent } from '@professionals/professionals.component';
import { ProfessionalFormComponent } from '@professionals/components/professional-form/professional-form.component';


const routes: Routes = [
  {
    path: 'profesionales',
    component: ProfessionalsComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'recetas/nueva',
        component: ProfessionalFormComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfessionalsRoutingModule { }

export const routingComponents = [
  ProfessionalsComponent,
  ProfessionalFormComponent
]
