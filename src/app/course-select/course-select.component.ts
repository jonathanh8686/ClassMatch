import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { MatAutocompleteModule, MatAutocompleteOrigin, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../auth.service'
import { Router } from '@angular/router'


@Component({
  selector: 'app-course-select',
  templateUrl: './course-select.component.html',
  styleUrls: ['./course-select.component.css']
})

export class CourseSelectComponent implements OnInit {

  constructor(private api: ApiService, public auth: AuthService, private router: Router) { auth.handleAuthentication(); }

  myControl = new FormControl();

  

  courses: any[] = [];
  userCourses: any[] = [];
  filteredOptions: Observable<any[]>;

  userEmail = "";
  emailExists = false;

  ngOnInit() {

    if (this.auth.isAuthenticated() == false) {
      this.auth.login();
    }

    this.auth.auth0.client.userInfo(this.auth.accessToken.toString(), (err, user) => {
      var nameAuth = false;
      this.userEmail = user.email;
      this.api.CheckUser(user.email).subscribe(
        (data: any) => { this.emailExists = data }, () => { }, () => {

          if (!this.emailExists) {
            this.router.navigate(['/userinfo']);
          }
          else {
            this.api.GetCourses().subscribe(
              (data: any) => { this.courses = data }, () => { }, () => {

                this.filteredOptions = this.myControl.valueChanges
                  .pipe(
                    startWith(''),
                    map(value => typeof value === 'string' ? value : value.courseName),
                    map(courseName => courseName ? this._filter(courseName) : this.courses.slice())
                  );
              });

            this.api.GetUserCourses(this.userEmail).subscribe(
              (data: any) => { this.userCourses = data }, () => { }, () => {
                this.userCourses.forEach(course => {
                  
                });
              }
            )

          }
        });
    });



  }

  displayFn(course?: any): string | undefined {
    return course ? course.courseName : undefined;
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.courses.filter(course => course.courseName.toLowerCase().indexOf(filterValue) === 0);
  }


  classSelected(a: any, boxId: Number) {
    this.filteredOptions = this.myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.courseName),
        map(courseName => courseName ? this._filter(courseName) : this.courses.slice())
      );

    console.log(a);
    console.log(boxId);
    this.api.AddUserCourse(a.option.value.courseId, this.userEmail, boxId);
  }

}
