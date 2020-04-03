import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
// components
import { AuthComponent } from '@auth/auth.component';
import { LoginComponent } from '@auth/components/login/login.component';
import { IsSignedInGuard } from '@auth/guards/is-signed-in.guard';


const routes: Routes = [
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent ,
        canActivate: [ IsSignedInGuard ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }

export const routingComponents = [
  AuthComponent,
  LoginComponent
];


