import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ApiService } from './api.service';
import { HttpClientModule } from '@angular/common/http';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MaterialModule } from '../material/material.module';

import {FlexLayoutModule} from '@angular/flex-layout';
import { WelcomeComponent } from './welcome/welcome.component';
import { CourseSelectComponent } from './course-select/course-select.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AuthService } from './auth.service';
import { UserinfoComponent } from './userinfo/userinfo.component'


@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    CourseSelectComponent,
    UserinfoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [ApiService, AuthService],
  bootstrap: [AppComponent]
})

export class AppModule { }
