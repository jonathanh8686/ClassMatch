import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-course-select',
  templateUrl: './course-select.component.html',
  styleUrls: ['./course-select.component.css']
})

export class CourseSelectComponent implements OnInit {

  constructor(private api: ApiService) { }

  courseData: any[] = [];
  dataSource = new MatTableDataSource(this.courseData);

  displayedColumns: string[] = ['select', 'courseId', 'courseName', 'period', 'term'];
  
  coursePeriods = {};


  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngOnInit() {
    this.api.GetCoursesID(3).subscribe
      (
        (data: any) => {
          console.log(data);

          data.forEach(element => {
            var temp = element;

            // if usercourse array is null, then there is no match between this user and that course (user is not enrolled)
            temp.courses['usercourse'] = temp.usercourse != null;
            this.courseData.push(temp.courses);
          });

          console.log(this.courseData)
        }, () => { },

        () => {
          console.log("test");
          this.dataSource = new MatTableDataSource(this.courseData);
        });
  }

  toggle(i) {
    console.log(this.courseData[i]);

    console.log(this.coursePeriods[this.courseData[i].courseId]);
  }

  onPeriodSelect(val, courseID)
  {
    this.coursePeriods[courseID] = val;
  }

}
