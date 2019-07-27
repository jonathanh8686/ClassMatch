import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms'
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { AuthService } from '../auth.service'
import { Router } from '@angular/router'


@Component({
  selector: 'app-course-select',
  templateUrl: './course-select.component.html',
  styleUrls: ['./course-select.component.css']
})

export class CourseSelectComponent implements OnInit {

  constructor(private api: ApiService, public auth: AuthService, private router: Router) { auth.handleAuthentication(); }

  forIndex = [0, 1, 2, 3];

  displayedColumns: string[] = ['firstName', 'lastName'];
  tableData = [];

  classControls: FormControl[] = []; // controllers for the class selection autoselects
  classFilteredOptions: Observable<any[]>[] = []; // the options (after filter) for each of the autoselects

  teacherControls: FormControl[] = []; // controllers for teacher selection
  teacherFilteredOptions: Observable<any[]>[] = []; // options for teacher autoselect

  courses: any[] = []; // list of all the courses
  userCourses: any[] = []; // usercourse object of all the courses that the student in is
  teachers: any[] = []; // list of all the teachers


  userEmail = "";
  emailExists = false;

  ngOnInit() {
    for (var i = 0; i < 8; i++) { // initalize all controls and filteredOptions
      this.classControls[i] = new FormControl('', [Validators.required]);
      this.classFilteredOptions[i] = new Observable<any[]>();

      this.teacherControls[i] = new FormControl('', [Validators.required]);
      this.teacherFilteredOptions[i] = new Observable<any[]>();
    }

    if (this.auth.isAuthenticated() == false) {
      this.auth.login(); // if the user is not authenticated force login
    }

    this.auth.auth0.client.userInfo(this.auth.accessToken.toString(), (err, user) => {
      var nameAuth = false;
      this.userEmail = user.email;
      this.api.CheckUser(user.email).subscribe(
        (data: any) => { this.emailExists = data }, () => { }, () => {

          if (!this.emailExists) { // if this email does not have an entry in the database
            this.router.navigate(['/userinfo']); // send to userinfo page
          }
          else {
            this.api.GetCourses().subscribe(
              (data: any) => { this.courses = data }, () => { }, () => {

                this.classControls.forEach((control, i) => { // bind each filteredOption with the valueChange event
                  this.classFilteredOptions[i] = control.valueChanges
                    .pipe(
                      startWith(''),
                      map(value => typeof value === 'string' ? value : value.courseName),
                      map(courseName => courseName ? this._classFilter(courseName) : this.courses.slice())
                    );
                });
              });

            this.api.GetAllTeachers().subscribe(
              (data: any) => { this.teachers = data }, () => { }, () => {
                this.teacherControls.forEach((control, i) => {
                  this.teacherFilteredOptions[i] = control.valueChanges
                    .pipe(
                      startWith(''),
                      map(value => typeof value === 'string' ? value : value.LastName),
                      map(lastName => lastName ? this._teacherFilter(lastName) : this.teachers.slice())
                    );
                })
              }
            );

            this.api.GetUserCourses(this.userEmail).subscribe(
              (data: any) => { this.userCourses = data }, () => { }, () => {
                this.userCourses.forEach(course => {
                  var boxNum = course['period'] + (course['term'] == "F" ? 0 : 4);
                  this.classControls[boxNum - 1].setValue({ "courseID": course['courseID'], "courseName": course['courseName'] });

                });
              }
            )

          }
        });
    });
  }

  courseDisplay(course?: any): string | undefined {
    return course ? course.courseName : undefined;
  }

  teacherDisplay(teacher?: any): string | undefined {
    return teacher ? teacher.firstName + " " + teacher.lastName : undefined;
  }

  private _classFilter(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.courses.filter(course => course.courseName.toLowerCase().indexOf(filterValue) !== -1);
  }

  private _teacherFilter(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.teachers.filter(teacher => teacher.lastName.toLowerCase().indexOf(filterValue) !== -1);
  }

  showSelected(a: any) {
    this.api.GetCourseUsers(a.value).subscribe((data: any) => { this.tableData = data }, () => { }, () => {
      console.log(this.tableData);
    });
  }


  classSelected(a: any, boxId: Number) {
    this.classFilteredOptions[boxId.valueOf() - 1] = this.classControls[boxId.valueOf() - 1].valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.courseName),
        map(courseName => courseName ? this._classFilter(courseName) : this.courses.slice())
      );

    console.log(a);
    console.log(boxId);

    // only send post request to api if both teacher and class are filled
    if (this.teacherControls[boxId.valueOf() - 1].value != "")
    {
      var teacherVal = this.teacherControls[boxId.valueOf() - 1].value;
      console.log(teacherVal);
      console.log(this.classControls[boxId.valueOf() - 1]);
      this.api.AddUserCourse(this.classControls[boxId.valueOf() - 1].value.courseId, this.userEmail, boxId, teacherVal['firstName'] + " " + teacherVal['lastName']);
    }
    else
      this.teacherControls[boxId.valueOf() - 1].markAllAsTouched();
  }

  teacherSelected(a: any, boxId: Number) {
    this.teacherFilteredOptions[boxId.valueOf() - 1] = this.teacherControls[boxId.valueOf() - 1].valueChanges
      .pipe(
        startWith(''),
        map(value => typeof value === 'string' ? value : value.lastName),
        map(lastName => lastName ? this._teacherFilter(lastName) : this.teacherControls.slice())
      );

    // only send post request to api if both teacher and class are filled
    if (this.classControls[boxId.valueOf() - 1].value != "")
    {
      var selectedCourseName = this.classControls[boxId.valueOf() - 1].value["courseName"];
      var selectedCourseID = "";
      
      this.courses.forEach(course => {
        if(course["courseName"] == selectedCourseName)
          selectedCourseID = course['courseId'];
      });

      // need to get the courseID from only the name
      console.log(a);
      this.api.AddUserCourse(selectedCourseID, this.userEmail, boxId, a.option.value['firstName'] + " " + a.option.value['lastName']);
    }
    else
      this.classControls[boxId.valueOf() - 1].markAllAsTouched();
  }

}
