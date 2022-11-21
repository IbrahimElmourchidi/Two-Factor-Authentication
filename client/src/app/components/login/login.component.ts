import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidationErrors,
} from '@angular/forms';

import { environment as env } from 'src/environments/environment';
import { HttpService } from 'src/app/http.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  active = 'login';
  LoginForm!: FormGroup;
  SingupForm!: FormGroup;
  Email!: FormControl;
  Password!: FormControl;
  ConfirmPassword!: FormControl;
  constructor(private http: HttpService, private router: Router) {
    this.initFormControls();
    this.initFormGroups();
  }

  ngOnInit(): void {}

  initFormControls() {
    this.Email = new FormControl(null, Validators.required);
    this.Password = new FormControl(null, Validators.required);
    this.ConfirmPassword = new FormControl(null, Validators.required);
  }

  initFormGroups() {
    this.LoginForm = new FormGroup({
      Email: this.Email,
      Password: this.Password,
    });

    this.SingupForm = new FormGroup({
      Email: this.Email,
      Password: this.Password,
      ConfirmPassword: this.ConfirmPassword,
    });
  }
  signup() {
    console.log('start signup');

    if (this.Password.value !== this.ConfirmPassword.value)
      this.SingupForm.setErrors({ equality: true });
    if (this.SingupForm.valid) {
      let body = {
        email: this.Email.value,
        password: this.Password.value,
      };
      this.http.doPost(env.authUrl + '/signup', body, {
        withCredentials: true
      }).subscribe(
        (res) => {
          sessionStorage.setItem('profile', JSON.stringify(res))
          this.router.navigate(['profile']);
        },
        (err) => {
          console.log(err);
        }
      );
    }
  }

  login() {
    console.log('start login');
    let body = {
      email: this.Email.value,
      password: this.Password.value,
    };
    this.http.doPost(env.authUrl + '/signin', body, {
      withCredentials: true
    }).subscribe(
      (res:any) => {
        sessionStorage.setItem('profile', JSON.stringify(res))
        if(res.multiFactor == true){
          this.router.navigate(['tfa']);
        }else {
          this.router.navigate(['profile']);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
