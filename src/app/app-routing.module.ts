import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {WelcomeComponent} from './welcome/welcome.component';
import {CourseSelectComponent} from './course-select/course-select.component';
import {UserinfoComponent} from './userinfo/userinfo.component';


const routes: Routes = [ 
    {path: '', component: WelcomeComponent},
    {path: 'courseselect', component: CourseSelectComponent},
    {path: 'userinfo', component: UserinfoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
