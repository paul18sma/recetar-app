import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PharmacistsFormComponent } from './pharmacists/components/pharmacists-form/pharmacists-form.component';
import { AuthGuard } from '@auth/guards/auth.guard';
import { NotFoundComponent } from './shared/not-found/not-found.component';
import { ProfessionalFormComponent } from './professionals/components/professional-form/professional-form.component';


const routes: Routes = [
  {
    path: '',
    canActivate: [ AuthGuard ],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'recetas/dispensar',
      },
      {
        path: 'recetas/dispensar',
        component: PharmacistsFormComponent
      },
      {
        path: 'recetas/nueva',
        component: ProfessionalFormComponent
      }
    ]
  },
  {path: '404', component: NotFoundComponent},
  {path: '**', redirectTo: '/404'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [
  PharmacistsFormComponent,
  NotFoundComponent
]
