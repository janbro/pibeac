import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import { UserService } from './services/user.service';
import { AuthenticationService } from './services/authentication.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    /**
     * Title of the web page
     */
    title = 'pibeac';

    /**
     * User token
     */
    token: any;

    constructor(private cookie: CookieService,
        private userService: UserService,
        private authenticationService: AuthenticationService) {

        authenticationService.loginEmitted$.subscribe(success => {
            if (success) {
                this.ngOnInit();
            }
        });

        authenticationService.logoutEmitted$.subscribe(success => {
            if (success) {
                this.userService.clearUser();
            }
        });
    }

    /**
     * Runs on initialization of page
     */
    ngOnInit() {
        try {
            this.token = JSON.parse(this.cookie.get('token'));
            this.userService.updateUser(this.token.id);
        } catch (err) {
            this.userService.clearUser();
        }
    }

    /**
     * Returns the currently logged in user
     */
    getUser() {
        return this.userService.getUser();
    }

    /**
     * Logs out the user and clears the user object
     */
    logout() {
        this.authenticationService.logout();
    }
}
