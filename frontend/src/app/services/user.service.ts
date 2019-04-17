import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { User } from '../models/user.model';
import config from '../helpers/config';

/**
 * Service which handles user requests
 */
@Injectable()
export class UserService {
    /**
     * Change object to detect changes to user data
     */
    change: Subject<any> = new Subject<any>();
    /**
     * Observable of change detector
     */
    updated$ = this.change.asObservable();
    /**
     * User data
     */
    user;

    /**
     * Constructor
     *
     * @param http Http client for sending requests
     */
    constructor(private http: HttpClient) {
        this.change.subscribe((value) => {
            this.user = value;
        });
    }

    /**
     * Sets the beacons object and triggers the change event
     *
     * @param user New user object
     */
    setUser(user) {
        this.change.next(user);
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
        this.change.next(undefined);
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
                        this.clearUser();
                        return false;
                    }
                },
                error => {
                    console.log(error);
                    this.clearUser();
                    return false;
                }
            );
    }

    /**
     * Sends a new order for owned beacons within a group
     *
     * @param group The group in the intended order
     */
    updateBeaconOrder(group) {
        return this.http.put(`${config.apiUrl}/users/beacons/` + group.name, group);
    }

    /**
     * Updates which group a beacon belongs to
     *
     * @param beacon_id The UID of the target beacon
     * @param groupname The group name to add to
     * @param oldgroupname The old group the beacon was in
     */
    updateBeaconGroup(beacon_id, groupname, oldgroupname) {
        return this.http.put(`${config.apiUrl}/users/beacons/` + groupname + '/' + beacon_id,
            { 'beacon_id': beacon_id, 'groupname': groupname, 'oldgroupname': oldgroupname });
    }

    /**
     * Adds a new empty group
     *
     * @param groupname The name for the new group
     */
    addGroup(groupname) {
        return this.http.post(`${config.apiUrl}/users/beacons/` + groupname, { name: groupname });
    }

    /**
     * Removes a group if its empty
     *
     * @param groupname Group name
     */
    deleteGroup(groupname) {
        return this.http.delete(`${config.apiUrl}/users/beacons/` + groupname);
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
