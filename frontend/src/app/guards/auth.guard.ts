import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

/**
 * Authentication guard
 */
@Injectable()
export class AuthGuard implements CanActivate {

    /**
     * Constructor
     *
     * @param router Helps navigate users
     * @param cookieService Used to retrieve and set cookies
     */
    constructor(private router: Router, private cookieService: CookieService) { }

    /**
     * Guard for checking a users token is valid
     */
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (this.cookieService.get('token')) {
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], { queryParams: { returnUrl: state.url }});
        return false;
    }
}
