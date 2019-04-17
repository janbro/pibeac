import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';

import { UserService } from '../services/user.service';

@Component({
    selector: 'app-profile-page',
    templateUrl: './profile-page.component.html',
    styleUrls: ['./profile-page.component.css'],
    animations: [
        trigger('fade-out', [
            state('visible', style({
                opacity: 1
            })),
            state('invisible', style({
                opacity: 0,
                display: 'none'
            })),
            transition('visible => invisible', [
              animate('0.2s')
            ])
        ]),
        trigger('fade-in', [
            state('visible', style({
                opacity: 1
            })),
            state('invisible', style({
                opacity: 0,
                display: 'none'
            })),
            transition('invisible => visible', [
              animate('0.2s')
            ])
        ])
    ]
})
export class ProfilePageComponent implements OnInit {

    /**
     * The currently logged in user
     */
    user;

    /**
     * The password to change to
     */
    pswd;

    /**
     * The password again to verify
     */
    pswdr;

    /**
     * Subscribe to userService updates
     *
     * @param cookie Used to retrieve and set cookies
     * @param router Helps navigate users
     * @param userService Updates information for logged in user
     */
    constructor(
        private cookie: CookieService,
        private router: Router,
        private userService: UserService) {

        userService.updated$.subscribe(success => {
            if (!success) {
                router.navigateByUrl('/');
            } else {
                setTimeout(() => {
                    this.user = userService.getUser();
                    console.log(this.user);
                }, 1000);
            }
        });
    }

    /**
     * Runs on page load
     */
    ngOnInit() {
        try {
            this.userService.updateUser(JSON.parse(this.cookie.get('token')).id);
        } catch (err) { this.router.navigateByUrl('/'); }
    }

    /**
     * Returns the currently logged in user
     */
    getUser() {
        return this.userService.getUser();
    }
}
