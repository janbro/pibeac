import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { User } from '../models/user.model';
import config from '../helpers/config';

@Injectable()
export class UserService {
    user: Subject<any> = new Subject<any>();
    userChanged$ = this.user.asObservable();

    constructor(private http: HttpClient) { }

    /**
     * Sets the beacons object and triggers the change event
     *
     * @param user New user object
     */
    setUser(user) {
        this.user.next(user);
    }

    /**
     * Returns the currently set user
     */
    getUser() {
        return this.user;
    }

    /**
     * Sets the user to undefined
     */
    clearUser() {
        this.user.next(undefined);
    }

    /**
     * Retrieves the users properties
     * See user.model.ts
     *
     * @param id User id
     */
    updateUser(id) {
        this.http.get(`${config.apiUrl}/users/` + id)
            .subscribe(
                data => {
                    if (data) {
                        this.setUser(data);
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

    /**
     * Returns all users
     */
    getAll() {
        return this.http.get<User[]>(`${config.apiUrl}/users`);
    }

    /**
     * Returns user specified by id
     */
    getById(id: number) {
        return this.http.get(`${config.apiUrl}/users/` + id);
    }

    /**
     * Sends a registration request to the backend
     *
     * @param user The user properties
     */
    register(user: User) {
        return this.http.post(`${config.apiUrl}/users/register`, user);
    }

    /**
     * Updates a users settings
     *
     * @param user The user properties
     */
    update(user: User) {
        return this.http.put(`${config.apiUrl}/users/` + user.id, user);
    }

    /**
     * Sends a delete request for the user
     */
    delete(id: number) {
        return this.http.delete(`${config.apiUrl}/users/` + id);
    }
}
