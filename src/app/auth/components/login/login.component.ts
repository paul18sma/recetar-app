import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormGroupDirective } from '@angular/forms';
import { AuthService } from '@auth/services/auth.service';
import { Router } from '@angular/router';
import {ThemePalette} from '@angular/material/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  hide: boolean = true;
  error: string;
  readonly spinnerColor: ThemePalette = 'primary';
  readonly spinnerDiameter: number = 30;
  showSubmit: boolean = false;

  constructor(private fBuilder: FormBuilder, private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
    this.initLoginForm();
  }

  initLoginForm(): void{
    this.loginForm = this.fBuilder.group({
      identifier: ['', [
        Validators.required
      ]],
      password: ['', [
        Validators.required
      ]]
    });
  }

  onSubmitEvent(loginForm: FormGroup, loginNgForm: FormGroupDirective): void{
    if(this.loginForm.valid){

      this.showSubmit = true;
      this.authService.login(this.loginForm.value).subscribe(
        res => {
          if(this.authService.isPharmacistsRole()){
            this.router.navigate(['/farmacias/recetas/dispensar']);
          } else if(this.authService.isProfessionalRole()){
            this.router.navigate(['/profesionales/recetas/nueva']);
          }
          this.showSubmit = false;
        },
        err => {
          loginNgForm.resetForm();
          loginForm.reset();
          this.error = err;
          this.showSubmit = false;
      });
    }
  }

  get identifier(): AbstractControl{
    return this.loginForm.get('identifier');
  }

  get password(): AbstractControl{
    return this.loginForm.get('password');
  }
}
