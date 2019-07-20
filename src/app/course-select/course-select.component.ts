import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { ApiService } from '../api.service';
import { MatAutocompleteModule, MatAutocompleteOrigin, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-course-select',
  templateUrl: './course-select.component.html',
  styleUrls: ['./course-select.component.css']
})

export class CourseSelectComponent implements OnInit {

  constructor(private api: ApiService) { }

  myControl = new FormControl();
  courses: any[] = [];
  filteredOptions: Observable<any[]>;

  ngOnInit() {

    this.api.GetCourses().subscribe(
      (data: any) => { this.courses = data }, () => { }, () => {

        this.filteredOptions = this.myControl.valueChanges
          .pipe(
            startWith(''),
            map(value => typeof value === 'string' ? value : value.courseName),
            map(courseName => courseName ? this._filter(courseName) : this.courses.slice())
          );
      });


  }

  displayFn(course?: any): string | undefined {
    return course ? course.courseName : undefined;
  }

  private _filter(name: string): any[] {
    const filterValue = name.toLowerCase();
    
    return this.courses.filter(course => course.courseName.toLowerCase().indexOf(filterValue) === 0);
  }


  getPosts(a : any) {
    console.log("test");
    this.filteredOptions = this.myControl.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.courseName),
      map(courseName => courseName ? this._filter(courseName) : this.courses.slice())
    );
  }

}
