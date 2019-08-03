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

                  // setting the classSelections to the value stored in database
                  this.classControls[boxNum - 1].setValue({ "courseID": course['courseID'], "courseName": course['courseName'] });


                  // setting the teacherSelections to the value in the database
                  var teacherFirstName = course['teacher'].split(" ")[0]; // teacherName from userCourse object is a full name so we need to split into first and last
                  var teacherLastName = course['teacher'].split(" ")[1];

                  this.teacherControls[boxNum - 1].setValue({ "firstName": teacherFirstName, "lastName": teacherLastName });
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

    // var filtered = [];
    // var splitValues = filterValue.split(" ");
    // for (var i = 0; i < this.teachers.length; i++) {
    //   var checkValue = (this.courses[i]['courseId'] + " " + this.courses[i]['courseName']).toLowerCase();
    //   for (var j = 0; j < splitValues.length; j++) {
    //     if (checkValue.indexOf(splitValues[j]) != -1 && splitValues[j] != "") {
    //       filtered.push(this.courses[i]);
    //       break;
    //     }
    //   }
    // }

    return this.courses.filter(x => x.courseName.toLowerCase().indexOf(filterValue) != -1);
  }

  private _teacherFilter(name: string): any[] {
    const filterValue = name.toLowerCase();

    var filtered = [];
    var splitValues = filterValue.split(" ");
    for (var i = 0; i < this.teachers.length; i++) {
      var checkValue = (this.teachers[i]['firstName'] + " " + this.teachers[i]['lastName']).toLowerCase();
      for (var j = 0; j < splitValues.length; j++) {
        if (checkValue.indexOf(splitValues[j]) != -1) {
          filtered.push(this.teachers[i]);
          break;
        }
      }
    }

    return filtered;
  }

  showSelected(a: any) {

    this.api.GetCourseUsers(a.value['courseId'], a.value['period'], a.value['teacher'], a.value['term']).subscribe((data: any) => { this.tableData = data }, () => { }, () => {
    });
  }


  classSelected(a: any, boxId: Number) {

    // only send post request to api if both teacher and class are filled
    if (this.teacherControls[boxId.valueOf() - 1].value != "") {
      var teacherVal = this.teacherControls[boxId.valueOf() - 1].value;
      this.api.AddUserCourse(this.classControls[boxId.valueOf() - 1].value.courseId, this.userEmail, boxId, teacherVal['firstName'] + " " + teacherVal['lastName']).subscribe(
        (data: any) => { }, () => { }, () => { this.api.GetUserCourses(this.userEmail).subscribe((data: any) => { this.userCourses = data }, () => { }, () => { }); }
      );
    }
    else
      this.teacherControls[boxId.valueOf() - 1].markAllAsTouched();


  }

  teacherSelected(a: any, boxId: Number) {
    console.log(this.teacherFilteredOptions);

    // only send post request to api if both teacher and class are filled
    if (this.classControls[boxId.valueOf() - 1].value != "") {
      var selectedCourseName = this.classControls[boxId.valueOf() - 1].value["courseName"];
      var selectedCourseID = "";

      this.courses.forEach(course => {
        if (course["courseName"] == selectedCourseName)
          selectedCourseID = course['courseId'];
      });

      // need to get the courseID from only the name
      this.api.AddUserCourse(selectedCourseID, this.userEmail, boxId, a.option.value['firstName'] + " " + a.option.value['lastName']).subscribe(
        (data: any) => { }, () => { }, () => { this.api.GetUserCourses(this.userEmail).subscribe((data: any) => { this.userCourses = data }, () => { }, () => { }); }
      );
    }
    else {
      this.classControls[boxId.valueOf() - 1].markAllAsTouched();
    }


  }

}
