import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder } from '@angular/forms';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { ChartOptions, ChartType, ChartDataSets } from 'chart.js';
import { Label } from 'ng2-charts';

import { ActionPipe } from '../pipes/action.pipe';
import { AlertService } from '../services/alert.service';
import { BeaconService } from '../services/beacon.service';
import { UserService } from '../services/user.service';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { catchError } from 'rxjs/operators';

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
                opacity: 0,
                display: 'none'
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
                opacity: 0,
                display: 'none'
            })),
            transition('invisible => visible', [
              animate('0.2s')
            ])
        ])
    ]
})
export class BeaconManagerPageComponent implements OnInit {

    public chartOptions: ChartOptions = {
        responsive: true,
        // We use these empty structures as placeholders for dynamic theming.
        scales: { xAxes: [{}], yAxes: [{}] },
        plugins: {
            datalabels: {
                anchor: 'end',
                align: 'end',
            }
        }
    };

    public chartLabels: Label[] = [];
    public chartType: ChartType = 'line';
    public chartLegend = true;

    /**
     * Traffic data for each beacon
     */
    graphdata;

    /**
     * Currently showing graph data
     */
    graph;

    /**
     * Beacons owned by user
     */
    groups;

    /**
     * Currently displayed group
     */
    group;

    /**
     * Currently displayed beacons
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

    /**
     * Input form group name
     */
    groupname;

    /**
     * Used to determine whether to show input box for new group
     */
    addgroup = false;

    constructor(private alertService: AlertService,
                private beaconService: BeaconService,
                private userService: UserService,
                private formBuilder: FormBuilder,
                private router: Router) {

        beaconService.updated$.subscribe(_groups => {
            setTimeout(async () => {
                this.groups = _groups;
                this.graphdata = {};
                this.chartLabels = [];
                this.groups.forEach((group) => {
                    group.beacons.forEach((beacon) => {
                        const date = new Date();
                        date.setHours(date.getHours() - 1);
                        beaconService.getTrafficByMin(beacon.id, date.getTime()).subscribe(
                            data => {
                                let d: any;
                                d = data;
                                let time = 0;
                                this.chartLabels = [];
                                const traffic = d.reverse().map((tr) => {
                                    this.chartLabels.unshift(`${time}`);
                                    time += 1;
                                    return tr['detected_dev_dists']['length'];
                                });
                                if (traffic.length > 0) {
                                    while (traffic.length < 60) {
                                        this.chartLabels.unshift(`${time}`);
                                        time += 1;
                                        traffic.unshift(0);
                                    }
                                    this.graphdata[beacon.id] = {
                                        data: traffic,
                                        label: '# of devices'
                                    };
                                }
                            },
                            error => {
                                console.log(error);
                                this.alertService.error(error);
                            });
                    });
                });
                if (this.group === undefined || this.group.name === '') {
                    this.loadBeacons(this.groups[0]);
                } else {
                    await _groups.some(group => {
                        if (group.name === (this.group ? this.group.name : '')) {
                            this.group = group;
                        }
                    });
                    this.beacons = this.group && this.group.beacons.length > 0 ? this.group.beacons : undefined;
                }
                this.alertService.clear();
                this.loading = false;
                if (!this.groups) {
                    router.navigateByUrl('/');
                }
            }, 1000);
        });
    }

    ngOnInit() {
        this.beaconService.updateBeacons();
    }

    getData(beacon_id) {
        return [{ data: this.graphdata[beacon_id].map((tr) => {
            return tr.detected_dev_dists.length;
        }), label: 'minutes'}];
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
     * Loads all beacons in one page
     */
    loadAll() {
        this.beacons = [];
        this.group = {
            name: '',
            beacons: []
        };
        this.groups.forEach(group => {
            group.beacons.forEach(beacon => {
                this.beacons.push(beacon);
            }, this);
        }, this);
    }

    /**
     * Loads all beacons of specified group into page
     *
     * @param group Group of beacons to load
     */
    loadBeacons(group) {
        this.group = group;
        this.beacons = group && group.beacons.length > 0 ? group.beacons : undefined;
    }

    /**
     * Adds a new group of name from target form
     *
     * @param event Change event for group name form
     */
    addGroup(event) {
        this.loading = true;
        this.loading_id = 'addgroup';
        this.userService.addGroup(event.target.form[`groupName`].value).subscribe(
            data => {
                if (data) {
                    this.beaconService.updateBeacons();
                } else {
                    return false;
                }
            },
            error => {
                this.alertService.error(error);
                this.loading = false;
                return false;
            }
        );
        this.addgroup = false;
    }

    /**
     * Deletes the currently selected group if it has no beacons
     */
    deleteGroup() {
        if (this.beacons && this.beacons.length > 0) {
            this.alertService.error('There are still beacons in this group.');
        } else {
            this.loading = true;
            this.loading_id = this.group.name;
            this.userService.deleteGroup(this.group.name).subscribe(
                data => {
                    if (data) {
                        this.beaconService.updateBeacons();
                    } else {
                        return false;
                    }
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                    return false;
                }
            );
            this.group = this.loadBeacons(this.groups[0]);
        }
    }

    /**
     * Rearranges beacon in list
     *
     * @param event Drag event
     */
    drop(event: CdkDragDrop<string[]>) {
        const elements = document.querySelectorAll( ':hover' );
        const hoveredelement = elements[elements.length - 1];
        if (hoveredelement.id === 'group-tab') {
            const tgroupname = hoveredelement['innerText'];
            this.loading = true;
            this.loading_id = this.beacons[event.previousIndex].id;
            this.userService.updateBeaconGroup(this.beacons[event.previousIndex]._id, tgroupname, this.group.name).subscribe(
                data => {
                    this.beaconService.updateBeacons();
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                    return false;
                }
            );
        } else {
            moveItemInArray(this.beacons, event.previousIndex, event.currentIndex);
            const beacon_ids = this.beacons.map((beac) => {
                return beac._id;
            });
            const group = {
                'name': this.group.name,
                'beacon_ids': beacon_ids
            };
            this.userService.updateBeaconOrder(group).subscribe(
                data => {
                    if (data) {
                        // this.beaconService.updateBeacons();
                    } else {
                        return false;
                    }
                },
                error => {
                    this.alertService.error(error);
                    this.loading = false;
                    return false;
                }
            );
        }
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
