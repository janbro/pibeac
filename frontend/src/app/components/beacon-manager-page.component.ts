import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';

import { ActionPipe } from '../pipes/action.pipe';
import { AlertService } from '../services/alert.service';
import { BeaconService } from '../services/beacon.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
    selector: 'app-beacon-page',
    templateUrl: './beacon-manager-page.component.html',
    styleUrls: ['./beacon-manager-page.component.css'],
    animations: [
        trigger('fade-out', [
            state('visible', style({
                opacity: 1
            })),
            state('invisible', style({
                opacity: 0
            })),
            transition('visible => invisible', [
              animate('0.2s')
            ])
        ]),
        trigger('fade-in', [
            state('visible', style({
                opacity: 1
            })),
            state('invisible', style({
                opacity: 0
            })),
            transition('invisible => visible', [
              animate('0.2s')
            ])
        ])
    ]
})
export class BeaconManagerPageComponent implements OnInit {

    /**
     * Beacons owned by user
     */
    beacons;

    /**
     * Activates input validation
     */
    submitted = false;

    /**
     * Used to determine when loading content
     */
    loading = false;

    /**
     * Used to determine which spinner to use
     */
    loading_id;

    constructor(private alertService: AlertService,
                private beaconService: BeaconService,
                private formBuilder: FormBuilder,
                private router: Router) {

        beaconService.updated$.subscribe(_beacons => {
            setTimeout(() => {
                this.beacons = _beacons;
                this.loading = false;
                if (!this.beacons) {
                    router.navigateByUrl('/');
                }
            }, 1000);
        });
    }

    ngOnInit() {
        this.beaconService.updateBeacons();
    }

    /**
     * Sends a patch request to the back end with the events form data
     *
     * @param event Event
     */
    updateBeacon(event) {
        const beacon = {
            id: event.target.form[`inputId`].value,
            name: event.target.form[`inputName`].value,
            action: {
                kind: event.target.form[`action_kind`].value,
                value: event.target.form[`action_value`].value
            }
        };
        this.loading = true;
        this.loading_id = beacon.id;
        this.alertService.clear();
        this.beaconService.update(beacon).subscribe(
            data => {
                this.beaconService.updateBeacons();
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
            });
    }

    /**
     * Filters the actions of the currently selected action
     *
     * @param arr The actions list
     * @param kind The value of unwanted action
     */
    filter(arr, kind) {
        return arr.filter((item, index) => {
            return kind !== item.id;
        });
    }

    /**
     * Gets a list of the possible actions
     */
    actions() {
        return ActionPipe.actions;
    }
}
