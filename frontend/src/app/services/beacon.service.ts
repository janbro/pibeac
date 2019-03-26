import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Beacon } from '../models/beacon.model';
import config from '../helpers/config';

@Injectable()
export class BeaconService {
    change: Subject<any> = new Subject<any>();
    updated$ = this.change.asObservable();
    beacons;

    constructor(private http: HttpClient) {
        this.change.subscribe((value) => {
            this.beacons = value;
        });
    }

    setBeacons(user) {
        this.beacons.next(user);
    }

    getBeacons() {
        return this.beacons;
    }

    updateBeacons() {
        return this.http.get(`${config.apiUrl}/beacons/`)
            .subscribe(
                data => {
                    this.change.next(data);
                },
                error => {
                    console.log(error);
                }
            );
    }

    getById(id: number) {
        return this.http.get(`${config.apiUrl}/beacons/` + id);
    }

    register(beacon: Beacon) {
        return this.http.post(`${config.apiUrl}/beacons/`, beacon);
    }

    update(beacon: Beacon) {
        return this.http.put(`${config.apiUrl}/beacons/` + beacon.id, beacon);
    }

    delete(id: number) {
        return this.http.delete(`${config.apiUrl}/beacons/` + id);
    }
}
