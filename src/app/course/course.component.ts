import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {

  constructor(private api : ApiService) { }
  courses: any[] = [];

  ngOnInit() {
      this.api.GetCourses().subscribe(
          (data: any) => { this.courses = data }, () => {}, () => {console.log("test")});
  }

}
