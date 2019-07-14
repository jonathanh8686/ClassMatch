import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CourseComponent } from './course/course.component';
import { MenuComponent } from './menu/menu.component';

const routes: Routes = [ 
    {path: "course",  component: CourseComponent},
    {path: "home", component: MenuComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
