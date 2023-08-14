import { Component, OnInit } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { HotToastService } from '@ngneat/hot-toast';
import { AuthService } from 'src/app/services/auth.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit {
  signUpForm = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
  });

  passwordsMatchValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let password = this.signUpForm.get('password')?.value;
      let confirmPassword = control.value;

      if (password !== confirmPassword) {
        return { passwordsDontMatch: true };
      } else {
        return null;
      }
    };
  }

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: HotToastService,
    private usersService: UsersService,
    private fb: NonNullableFormBuilder
  ) {}

  ngOnInit(): void {
    this.signUpForm
      .get('confirmPassword')
      ?.setValidators(this.passwordsMatchValidator());
    this.signUpForm.get('confirmPassword')?.updateValueAndValidity();
  }

  get email() {
    return this.signUpForm.get('email');
  }

  get password() {
    return this.signUpForm.get('password');
  }

  get confirmPassword() {
    return this.signUpForm.get('confirmPassword');
  }

  get name() {
    return this.signUpForm.get('name');
  }

  submit() {
    const { name, email, password } = this.signUpForm.value;
    if (!this.signUpForm.valid || !name || !password || !email) {
      return;
    }
    this.authService.signUp(email, password, name);
  }
}
