import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { appRoutes } from './app.routers';
import {UserDetailService} from './user-detail.service';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { HomepageComponent } from './components/dashboard/homepage/homepage.component';
import { HeaderbarComponent } from './components/dashboard/headerbar/headerbar.component';
import { BreadcrumbComponent } from './components/dashboard/breadcrumb/breadcrumb.component';
import { FooterbarComponent } from './components/dashboard/footerbar/footerbar.component';
import { NavibarComponent } from './components/dashboard/navibar/navibar.component';
import { ContentareaComponent } from './components/dashboard/contentarea/contentarea.component';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomepageComponent,
    HeaderbarComponent,
    BreadcrumbComponent,
    FooterbarComponent,
    NavibarComponent,
    ContentareaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule.forRoot (appRoutes),
    HttpClientModule
  ],
  providers: [UserDetailService],
  bootstrap: [AppComponent]
})
export class AppModule { }
