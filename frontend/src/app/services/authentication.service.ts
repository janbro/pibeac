import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import config from '../helpers/config';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';

@Injectable()
export class AuthenticationService {
    /**
     * Login event source
     */
    private emitLoginSource = new Subject<any>();

    /**
     * Login observable
     */
    loginEmitted$ = this.emitLoginSource.asObservable();

    /**
     * Logout event source
     */
    private emitLogoutSource = new Subject<any>();

    /**
     * Logout observable
     */
    logoutEmitted$ = this.emitLogoutSource.asObservable();

    constructor(private http: HttpClient, private cookie: CookieService) { }

    /**
     * Sends the user credentials to the backend
     *
     * @param username Username
     * @param password Plaintext password
     */
    login(username: string, password: string) {
        return this.http.post<any>(`${config.apiUrl}/users/login`, { username: username, password: password }, { observe: 'response' });
    }

    /**
     * Removes the user token and emits a logout event
     */
    logout() {
        this.cookie.delete('token');
        this.emitLogoutSource.next(true);
    }

    /**
     * Emits a login event with whether or not the login was successful
     *
     * @param success If the login was successful
     */
    emitLogin(success: true) {
        this.emitLoginSource.next(success);
    }
}
