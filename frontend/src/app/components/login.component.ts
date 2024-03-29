import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { AlertService } from '../services/alert.service';
import { AuthenticationService } from '../services/authentication.service';

/**
 * Component which contains login form
 */
@Component({
    selector: 'app-login',
    templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {

    /**
     * Variable containing form values
     */
    loginForm: FormGroup;

    /**
     * Shows spinner when true
     */
    loading = false;

    /**
     * Activates input validation
     */
    submitted = false;

    /**
     * URL to redirect to after successful login
     */
    returnUrl: string;

    /**
     * Constructor
     *
     * @param formBuilder The login form for the page
     * @param route Helps pull url parameters
     * @param router Helps navigate users
     * @param authenticationService Authenticates users tokens
     * @param alertService Displays notifications for the page
     */
    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService) { }

    /**
     * Runs on page load
     */
    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        if (this.route.snapshot.queryParams['username']) {
            this.f.username.setValue(this.route.snapshot.queryParams['username']);
            this.alertService.success('Registration successful', true);
        }

        // reset login status
        this.authenticationService.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    /**
     * Convenience getter for easy access to form fields
     */
    get f() { return this.loginForm.controls; }

    /**
     * Run when login button is clicked. Redirects to returnUrl on success.
     */
    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.login(this.f.username.value, this.f.password.value)
            .subscribe(
                data => {
                    this.authenticationService.emitLogin(true);
                    this.router.navigate([this.returnUrl], { relativeTo: this.route });
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                });
    }

}
