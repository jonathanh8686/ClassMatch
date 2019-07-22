import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { FormControl, Validators } from '@angular/forms'
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-userinfo',
  templateUrl: './userinfo.component.html',
  styleUrls: ['./userinfo.component.css']
})

export class UserinfoComponent implements OnInit {
  emailExists = false;
  userEmail = "";

  fnFormControl = new FormControl('', [Validators.required]);
  lnFormControl = new FormControl('', [Validators.required]);

  constructor(private api: ApiService, public auth: AuthService, private router: Router) { auth.handleAuthentication(); }

  ngOnInit() {
    if (this.auth.isAuthenticated() == false) {
      this.auth.login();
    }

    console.log(this.auth.accessToken.toString());
    this.auth.auth0.client.userInfo(this.auth.accessToken.toString(),  (err, user) => {
      this.api.CheckUser(user.email).subscribe(
        (data: any) => { this.emailExists = data }, () => { }, () => {
          console.log(user.email);
          this.userEmail = user.email;
          if (this.emailExists) {
            this.router.navigate(["/courseselect"]);
          }
        });
    });
  }

  addUser() {
    this.fnFormControl.markAllAsTouched();
    this.lnFormControl.markAllAsTouched();

    if (this.fnFormControl.hasError('required') == false && this.lnFormControl.hasError('required') == false)
    {
      this.api.AddUser(this.fnFormControl.value, this.lnFormControl.value, this.userEmail);
      this.router.navigate(["/courseselect"]);
    }
  }

}
