import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class ApiService {
  constructor(private http: HttpClient) { }
  GetCoursesID(id : number) {
      return this.http.get('http://jonathan-pc/ClassMatchAPI/api/class/' + id);
  }

  GetCourses()
  {
    return this.http.get('http://jonathan-pc/ClassMatchAPI/api/class');
  }


}
