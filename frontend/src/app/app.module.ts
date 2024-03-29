import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { ChartsModule } from 'ng2-charts';

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
import { BeaconService } from './services/beacon.service';
import { UserService } from './services/user.service';

// Guards
import { AuthGuard } from './guards/auth.guard';

// Helpers
import { JwtInterceptor } from './helpers/jwt.interceptor';
import { ErrorInterceptor } from './helpers/error.interceptor';

// Pipes
import { ActionPipe } from './pipes/action.pipe';

import { AppComponent } from './app.component';

/**
 * App routes
 */
const appRoutes: Routes = [
  { path: 'beacons', component: BeaconManagerPageComponent },
  { path: 'profile/:id',  component: ProfilePageComponent },
  { path: 'login', component: LoginPageComponent },
  { path: 'register', component: RegisterPageComponent },
  { path: 'notfound', component: PageNotFoundComponent},
  { path: '', component: LandingPageComponent, pathMatch: 'full' }
//   { path: '**', redirectTo: 'notfound', pathMatch: 'full' }
];

/**
 * App module of pibeac web application
 */
@NgModule({
    declarations: [
        AppComponent,
        ActionPipe,
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
        BrowserAnimationsModule,
        ChartsModule,
        DragDropModule,
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
        BeaconService,
        CookieService,
        UserService,
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
