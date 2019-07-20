import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApiService } from './api.service';
import { HttpClientModule } from '@angular/common/http';
import { CourseComponent } from './course/course.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MaterialModule } from '../material/material.module';

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { MenuComponent } from './menu/menu.component';

import {FlexLayoutModule} from '@angular/flex-layout';
import { WelcomeComponent } from './welcome/welcome.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { CourseSelectComponent } from './course-select/course-select.component';


@NgModule({
  declarations: [
    AppComponent,
    CourseComponent,
    LoginComponent,
    SignupComponent,
    MenuComponent,
    WelcomeComponent,
    DashboardComponent,
    CourseSelectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule
  ],
  providers: [ApiService],
  bootstrap: [AppComponent]
})

export class AppModule { }
