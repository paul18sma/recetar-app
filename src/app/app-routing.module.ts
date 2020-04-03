import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ValidatorFormComponent } from './components/prescriptions/validator-form/validator-form.component';
import { AuthGuard } from '@auth/guards/auth.guard';
import { AppComponent } from './app.component';
import { NotFoundComponent } from './components/not-found/not-found.component';


const routes: Routes = [
  {
    path: '',
    canActivate: [ AuthGuard ],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'prescriptions/form',
      },
      {
        path: 'prescriptions/form',
        component: ValidatorFormComponent
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
  ValidatorFormComponent,
  NotFoundComponent
]
