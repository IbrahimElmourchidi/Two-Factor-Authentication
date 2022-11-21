import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from 'src/app/http.service';
import { environment as env } from 'src/environments/environment';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  isChecked = false;
  constructor(private http: HttpService, private router: Router) {}

  ngOnInit(): void {
    let user = JSON.parse(sessionStorage.getItem('profile') || '');
    this.isChecked = user.multiFactor;
  }

  onCheck() {
    this.http
      .doPost(
        env.authUrl + '/tfa/' + this.isChecked,
        {},
        {
          withCredentials: true,
        }
      )
      .subscribe(
        (res: any) => {
          if (res) {
            let result = res as string;
            Swal.fire({
              title: 'Scan!',
              text: 'please scann the QRcode',
              imageUrl: res,
              imageWidth: 400,
              imageHeight: 400,
              imageAlt: 'Custom image',
            });
          }
        },
        (err) => {
          console.log(err);
        }
      );
  }

  logout() {
    this.http.doPost(env.authUrl + '/signout', {}, {}).subscribe(
      (res) => {
        this.router.navigate(['/']);
      },
      (err) => {
        console.log(err);
      }
    );
  }
}
