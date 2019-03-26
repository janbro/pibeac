import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { BeaconService } from '../services/beacon.service';
import { ActionPipe } from '../pipes/action.pipe';

@Component({
    selector: 'app-beacon-page',
    templateUrl: './beacon-manager-page.component.html',
    styleUrls: ['./beacon-manager-page.component.css']
})
export class BeaconManagerPageComponent implements OnInit {

    beacons;

    constructor(private beaconService: BeaconService,
                private router: Router) {

        beaconService.updated$.subscribe(_beacons => {
            this.beacons = _beacons;
            if (!this.beacons) {
                router.navigateByUrl('/');
            }
        });
    }

    ngOnInit() {
        this.beaconService.updateBeacons();
    }

    filter(arr, kind) {
        return arr.filter((item, index) => {
            return kind !== index;
        });
    }

    actions() {
        return ActionPipe.actions;
    }
}
