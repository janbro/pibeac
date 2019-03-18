import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Components
import { AlertComponent } from './directives/alert.component';
import { BeaconManagerPageComponent } from './components/beacon-manager-page.component';
import { LandingPageComponent } from './components/landing-page.component';
import { LoginComponent } from './components/login.component';
import { LoginPageComponent } from './components/login-page.component';
import { PageNotFoundComponent } from './components/page-not-found.component';
import { ProfilePageComponent } from './components/profile-page.component';
import { RegisterComponent } from './components/register.component';
import { RegisterPageComponent } from './components/register-page.component';

// Services
import { AlertService } from './services/alert.service';
import { AuthenticationService } from './services/authentication.service';
import { UserService } from './services/user.service';

// Guards
import { AuthGuard } from './guards/auth.guard';

// Helpers
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { ErrorInterceptor } from './helpers/error.interceptor';

import { AppComponent } from './app.component';

const appRoutes: Routes = [
  { path: 'beacon', component: BeaconManagerPageComponent },
  { path: 'profile', component: ProfilePageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: '', component: LandingPageComponent, pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    AppComponent,
    AlertComponent,
    BeaconManagerPageComponent,
    LandingPageComponent,
    LoginComponent,
    LoginPageComponent,
    PageNotFoundComponent,
    ProfilePageComponent,
    RegisterComponent,
    RegisterPageComponent
  ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        NgbModule,
        ReactiveFormsModule,
        RouterModule.forRoot(appRoutes)
    ],
    providers: [
        AuthGuard,
        AlertService,
        AuthenticationService,
        UserService,
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
