import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

import { UserService } from '../services/user.service';

@Component({
    selector: 'app-profile-page',
    templateUrl: './profile-page.component.html'
})
export class ProfilePageComponent implements OnInit {

    constructor(
        private cookie: CookieService,
        private router: Router,
        private userService: UserService) {

        userService.userChanged$.subscribe(success => {
            if (!success) {
                router.navigateByUrl('/');
            }
        });
    }

    async ngOnInit() {
        try {
            this.userService.updateUser(JSON.parse(this.cookie.get('token')).id);
        } catch (err) { this.router.navigateByUrl('/'); }
    }

    getUser() {
        return this.userService.getUser();
    }
}
