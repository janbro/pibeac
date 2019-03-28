import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Beacon } from '../models/beacon.model';
import config from '../helpers/config';

@Injectable()
export class BeaconService {
    /**
     * List of owned beacons
     */
    beacons: Subject<any> = new Subject<any>();

    /**
     * Observable stream of change
     */
    updated$ = this.beacons.asObservable();

    constructor(private http: HttpClient) { }

    /**
     * Sets the beacons object and triggers the update event
     */
    setBeacons(user) {
        this.beacons.next(user);
    }

    /**
     * Returns the beacons list value
     */
    getBeacons() {
        return this.beacons;
    }

    /**
     * Updates the beacons object with result from backend
     */
    updateBeacons() {
        return this.http.get(`${config.apiUrl}/beacons/`)
            .subscribe(
                data => {
                    this.setBeacons(data);
                },
                error => {
                    console.log(error);
                }
            );
    }

    /**
     * Returns the beacon information for passed id
     *
     * @param id Beacon id
     */
    getById(id: number) {
        return this.http.get(`${config.apiUrl}/beacons/` + id);
    }

    /**
     * Sends a request to the backend to register beacon
     */
    register(beacon: Beacon) {
        return this.http.post(`${config.apiUrl}/beacons/`, beacon);
    }

    /**
     * Sends a request to the backend to update beacon
     */
    update(beacon: Beacon) {
        return this.http.patch(`${config.apiUrl}/beacons/` + beacon.id, beacon);
    }

    /**
     * Sends a request to the backend to delete beacon
     *
     * @param id Beacon id
     */
    delete(id: number) {
        return this.http.delete(`${config.apiUrl}/beacons/` + id);
    }
}
