import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { User } from '../models/user.model';
import config from '../helpers/config';

@Injectable()
export class UserService {
    userChange: Subject<any> = new Subject<any>();
    userChanged$ = this.userChange.asObservable();
    user;

    constructor(private http: HttpClient) {
        this.userChange.subscribe((value) => {
            this.user = value;
        });
    }

    setUser(user) {
        this.userChange.next(user);
    }

    getUser() {
        return this.user;
    }

    updateUser(id) {
        this.http.get(`${config.apiUrl}/users/` + id)
            .subscribe(
                data => {
                    if (data) {
                        this.userChange.next(data);
                    } else {
                        return false;
                    }
                },
                error => {
                    console.log(error);
                    return false;
                }
            );
    }

    getAll() {
        return this.http.get<User[]>(`${config.apiUrl}/users`);
    }

    getById(id: number) {
        return this.http.get(`${config.apiUrl}/users/` + id);
    }

    register(user: User) {
        return this.http.post(`${config.apiUrl}/users/register`, user);
    }

    update(user: User) {
        return this.http.put(`${config.apiUrl}/users/` + user.id, user);
    }

    delete(id: number) {
        return this.http.delete(`${config.apiUrl}/users/` + id);
    }
}
