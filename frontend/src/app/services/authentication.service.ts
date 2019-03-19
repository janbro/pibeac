import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import config from '../helpers/config';
import { CookieService } from 'ngx-cookie-service';
import { Subject } from 'rxjs';

@Injectable()
export class AuthenticationService {// Observable string sources
    private emitLoginSource = new Subject<any>();
    // Observable string streams
    loginEmitted$ = this.emitLoginSource.asObservable();

    constructor(private http: HttpClient, private cookie: CookieService) { }

    login(username: string, password: string) {
        return this.http.post<any>(`${config.apiUrl}/users/login`, { username: username, password: password });
    }

    logout() {
        // remove user from local storage to log user out
        this.cookie.delete('token');
    }

    // Service message commands
    emitLogin(success: true) {
        this.emitLoginSource.next(success);
    }
}
