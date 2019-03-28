import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private authenticationService: AuthenticationService,
                private router: Router) { }

    /**
     * Intercepts all incoming http responses and packages error for user notifications
     *
     * 0: Connection refused
     * 400: Server error, logout and redirect
     * 403: Forbidden, logout and redirect
     *
     * @param request Http Request Object
     * @param next Next http target
     */
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(error => {
            console.log(error);
            if (error.error instanceof ErrorEvent) {
                // A client-side or network error occurred. Handle it accordingly.
                return throwError(error.error);
            } else if (error.status === 0) {
                return throwError('Connection refused! Check your internet connection.');
            } else if (error.status === 400) {
                this.authenticationService.logout();
                this.router.navigate(['/']);
                return throwError('Something went wrong!');
            } else if (error.status === 401) {
                // auto logout if 401 response returned from api
                // this.authenticationService.logout();
                // location.reload(true);
                return throwError(error.error);
            } else if (error.status === 403) {
                this.authenticationService.logout();
                this.router.navigate(['/']);
                return throwError('Not authenticated!');
            } else {
                // The backend returned an unsuccessful response code.
                // The response body may contain clues as to what went wrong,
                console.error(
                    `Backend returned code ${error.status}, ` +
                    `body was: ${error.error}`);
                return throwError(error.error);
            }
        }));
    }
}
