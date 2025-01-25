import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoaderComponent } from "../../components/loader/loader.component";
import { AuthService } from '../../services/auth.service';
import { IAuth } from '../../interfaces/auth.interface';
import { filter } from 'rxjs';
import { TokenService } from '../../services/utils/token.service';
import { LoaderService } from '../../services/utils/loader.service';
import { ToastComponent } from "../../components/toast/toast.component";
import { ToastService } from '../../services/utils/toast.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule, LoaderComponent, ToastComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);  
  private tokenService = inject(TokenService);
  private loaderService = inject(LoaderService);
  private toastService = inject(ToastService);

  authForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  auth() {
    if(this.authForm.valid){
      this.validateCredentials();
    }
  }

  get getEmail(): string {
    return this.authForm.value.email ?? '';
  }

  validateCredentials() {
    this.loaderService.show(true);
    this.authService.auth(this.authForm.getRawValue() as IAuth)
    .pipe(
      filter(result => {
        if(result!.token) {
          localStorage.setItem('email', this.getEmail);
          this.tokenService.handleToken(result.token);

          this.router.navigate(['']);
          return true;
        } else {
          return false;
        }
      })
    )
    .subscribe();
    this.loaderService.show(false);

  }

  ngOnInit(): void {
    if(this.tokenService.isAuthenticated()) {
      this.router.navigate(['']);
    }
  }

}