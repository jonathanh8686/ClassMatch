import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CourseComponent } from './course/course.component';
import { MenuComponent } from './menu/menu.component';
import {WelcomeComponent} from './welcome/welcome.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {CourseSelectComponent} from './course-select/course-select.component';


const routes: Routes = [ 
    {path: "course",  component: CourseComponent},
    {path: "home", component: MenuComponent},
    {path: '', component: WelcomeComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: 'courseselect', component: CourseSelectComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
