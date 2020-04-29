import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, FormGroupDirective } from '@angular/forms';
import { AuthService } from '@auth/services/auth.service';
import { Router } from '@angular/router';
import { DialogComponent } from '@auth/components/dialog/dialog.component';
// Material
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  hide: boolean = true;
  error: string;

  constructor(
    private fBuilder: FormBuilder, 
    private authService: AuthService, 
    private router: Router,
    public dialog: MatDialog
  ) { }

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
        if(this.authService.isPharmacistsRole()){
          this.router.navigate(['/farmacias/recetas/dispensar']);
        } else if(this.authService.isProfessionalRole()){
          this.router.navigate(['/profesionales/recetas/nueva']);
        }
      },
      err => {
        loginNgForm.resetForm();
        loginForm.reset();
        this.error = err;
      }
    );
  }

  // Show a dialog
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogComponent, {
      width: '500px'
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  showInformation(): void{
    this.openDialog();
  }

  get identifier(): AbstractControl{
    return this.loginForm.get('identifier');
  }

  get password(): AbstractControl{
    return this.loginForm.get('password');
  }
}
