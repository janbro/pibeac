import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Beacon } from '../models/beacon.model';
import config from '../helpers/config';

/**
 * Service which handles beacon data requests
 */
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

    /**
     * Constructor
     *
     * @param http Http client for sending requests
     */
    constructor(private http: HttpClient) { }

    /**
     * Sets the beacons object and triggers the update event
     */
    setBeacons(beacons) {
        this.beacons.next(beacons);
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
     * Returns promise to traffic data by id
     *
     * @param id Beacon id
     */
    getTrafficById(id) {
        return this.http.get(`${config.apiUrl}/traffic/${id}`);
    }

    /**
     * Returns promise to traffic data by id and time period type
     *
     * @param id Beacon id
     * @param type The time period type
     */
    getTrafficByIdAndType(id, type) {
        return this.http.get(`${config.apiUrl}/traffic/${id}?type=${type}`);
    }

    /**
     * Returns promise to traffic data by minimum time
     *
     * @param id Beacon id
     * @param min Minimum time traffic data must be in UTC ms since Epoch
     */
    getTrafficByMin(id, min) {
        return this.http.get(`${config.apiUrl}/traffic/${id}?min=${min}`);
    }

    /**
     * Returns promise to traffic data within time zone
     *
     * @param id Beacon id
     * @param min Minimum time traffic data must be in UTC ms since Epoch
     * @param min Maximum time traffic data must be in UTC ms since Epoch
     */
    getTrafficByMinMax(id, min, max) {
        return this.http.get(`${config.apiUrl}/traffic/${id}?min=${min}&max=${max}`);
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
