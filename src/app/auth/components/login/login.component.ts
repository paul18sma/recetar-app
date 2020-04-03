import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormGroupDirective } from '@angular/forms';
import { AuthService } from '@auth/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  hide: boolean = true;
  error: string;

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
    this.authService.login(this.loginForm.value).subscribe(
      res => {
        this.router.navigate(['prescriptions/form']);
      },
      err => {
        loginNgForm.resetForm();
        loginForm.reset();
        this.error = err;
      }
    );
  }

  get identifier(): AbstractControl{
    return this.loginForm.get('identifier');
  }

  get password(): AbstractControl{
    return this.loginForm.get('password');
  }
}
