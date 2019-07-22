import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  constructor(private http: HttpClient) { }
  GetUserCourses(email : string) {
    return this.http.get('http://jonathan-pc/ClassMatchAPI/api/class/GetUserCourses/' + email);
  }

  GetCourses() {
    return this.http.get('http://jonathan-pc/ClassMatchAPI/api/class/GetAll');
  }

  AddUser(firstName: string, lastName: string, email: string) {
    var newUser = {
      "firstName": firstName,
      "lastName": lastName,
      "email": email
    };

    var hdr = new HttpHeaders({ "Content-Type": "application/json" });

    var bodyString = JSON.stringify(newUser);
    console.log(bodyString);
    this.http.post('http://jonathan-pc/ClassMatchAPI/api/user/AddUser', bodyString, { headers: hdr }).subscribe();
  }

  GetUsers() {
    return this.http.get('http://jonathan-pc/ClassMatchAPI/api/user/Get');
  }

  CheckUser(email: string) {
    return this.http.get('http://jonathan-pc/ClassMatchAPI/api/user/CheckUser/' + email);
  }

  AddUserCourse(courseId: string, userEmail: string, boxId: Number) {
    var postBody = {
      "courseId" : courseId,
      "userEmail": userEmail,
      "boxId": boxId // 1,2,3,4,5,5,6,7,8 (S,F) + Period
    };

    var hdr = new HttpHeaders({ "Content-Type": "application/json" });

    var bodyString = JSON.stringify(postBody);
    console.log(bodyString);
    this.http.post('http://jonathan-pc/ClassMatchAPI/api/class/AddUserCourse', bodyString, { headers: hdr }).subscribe();
  }
  



}
