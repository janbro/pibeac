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
    title = 'pibeac';
    token: any;

    constructor(private cookie: CookieService,
        private userService: UserService,
        private authenticationService: AuthenticationService) {

        authenticationService.loginEmitted$.subscribe(success => {
            if (success) {
                this.ngOnInit();
            }
        });
    }

    ngOnInit() {
        try {
            this.token = JSON.parse(this.cookie.get('token'));
            this.userService.updateUser(this.token.id);
        } catch (err) { }
    }

    getUser() {
        return this.userService.getUser();
    }

    logout() {
        this.authenticationService.logout();
    }
}
