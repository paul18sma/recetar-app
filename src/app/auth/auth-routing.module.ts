import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// components
import { AuthComponent } from '@auth/auth.component';
import { LoginComponent } from '@auth/components/login/login.component';


const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent ,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routingComponents = [
  AuthComponent,
  LoginComponent
];


