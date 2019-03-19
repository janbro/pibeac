import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import { UserService } from '../services/user.service';

@Component({
    selector: 'app-profile-page',
    templateUrl: './profile-page.component.html'
})
export class ProfilePageComponent implements OnInit {

    constructor(
        private cookie: CookieService,
        private userService: UserService) { }

    ngOnInit() {
        try {
            this.userService.updateUser(JSON.parse(this.cookie.get('token')).id);
        } catch (err) { console.log(err); }
    }

    getUser() {
        return this.userService.getUser();
    }
}
