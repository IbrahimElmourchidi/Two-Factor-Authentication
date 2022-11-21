import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/http.service';
import { environment as env } from 'src/environments/environment';
@Component({
  selector: 'app-tfa',
  templateUrl: './tfa.component.html',
  styleUrls: ['./tfa.component.scss'],
})
export class TfaComponent implements OnInit {
  constructor(private http: HttpService, private router: Router) {}

  ngOnInit(): void {}
  checkOTP(val: string) {
    this.http
      .doPost(
        env.authUrl + '/otp/' + val,
        {},
        {
          withCredentials: true
        }
      )
      .subscribe(
        (res) => {
          if(res){
            this.router.navigate(['profile'])
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }
}
