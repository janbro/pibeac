import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

import { ChartOptions, ChartType } from 'chart.js';
import { Label } from 'ng2-charts';

import { ActionPipe } from '../pipes/action.pipe';
import { AlertService } from '../services/alert.service';
import { BeaconService } from '../services/beacon.service';
import { Beacon } from '../models/beacon.model';
import { UserService } from '../services/user.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

/**
 * Management page for beacons a user owns
 */
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

    /**
     * Chart options for traffic data
     */
    public chartOptions: ChartOptions = {
        responsive: true,
        // We use these empty structures as placeholders for dynamic theming.
        scales: { xAxes: [{}], yAxes: [{}] },
        plugins: {
            datalabels: {
                anchor: 'end',
                align: 'end',
            }
        },
        animation: {
            duration: 0 // general animation time
        }
    };

    /**
     * Chart labels for traffic data
     */
    public chartLabels: Label[];

    /**
     * Chart type
     */
    public chartType: ChartType = 'line';

    /**
     * Determines whether or not to show the legend
     */
    public chartLegend = true;

    /**
     * Traffic data for each beacon
     */
    graphdata = {};

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
     * Currently displayed graph beacon id
     */
    beac_id;

    /**
     * Used to determine if the graph data event listener is running
     */
    beacon_data_listener;

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
     * Loading beacon graph data
     */
    loading_beacon_data = false;

    /**
     * Used to determine which spinner to use
     */
    loading_beacon_data_id;

    /**
     * Input form group name
     */
    groupname;

    /**
     * Used to determine whether to show input box for new group
     */
    addgroup = false;

    /**
     * Previously displayed graph data
     */
    prevdata;

    /**
     * Distance options
     */
    distances = [{name: 'Immediate (< 0.5 m)', value: 0.5 }, { name: 'Near (< 3 m)', value: 3 }, { name: 'Far (> 3 m)', value: 99 }];

    /**
     * Graph data time period option
     */
    time_periods = [{name: 'minutes', value: 'minute'}, {name: 'hours', value: 'hour'}, {name: 'days', value: 'day'}];

    getNameByProperty(obj, key, value) {
        if (key == null || value == null) {
            return undefined;
        }
        return obj.find((o) => o[key] === value).name;
    }

    getNameFromDistance(dist) {
        if (dist == null) {
            return undefined;
        }
        return this.distances.find((obj) => dist <= obj.value ).name;
    }

    onChangeCategory(event, beacon: Beacon) {
      beacon.collect_data = event.target.checked;
    }

    /**
     * Subscribe to beaconService updates for beacon data and populate graph data
     *
     * @param alertService Displays notifications for the page
     * @param beaconService Updates data on owned beacons
     * @param userService Updates data of currently logged in user
     * @param router Helps navigate users
     */
    constructor(private alertService: AlertService,
                private beaconService: BeaconService,
                private userService: UserService,
                private router: Router) {

        beaconService.updated$.subscribe(_groups => {
            setTimeout(async () => {
                this.groups = _groups;
                if (this.group === undefined || this.group.name === '') {
                    await this.loadBeacons(this.groups[0]);
                } else {
                    await _groups.some(group => {
                        if (group.name === (this.group ? this.group.name : '')) {
                            this.group = group;
                        }
                    });
                    this.beacons = this.group && this.group.beacons.length > 0 ? this.group.beacons : undefined;
                }
                this.groups.forEach((group) => {
                    this.loading_beacon_data_id = this.beac_id;
                    this.loading_beacon_data = true;
                    group.beacons.forEach((beacon) => {
                        this.getBeaconTraffic(beacon.id);
                    });
                });
                this.alertService.clear();
                this.loading = false;
                if (!this.groups) {
                    router.navigateByUrl('/');
                }
            }, 1000);
        });
    }

    /**
     * Runs on page load
     */
    ngOnInit() {
        this.beaconService.updateBeacons();
    }

    /**
     * Sets the beacon id of the currently open beacon context
     *
     * @param beacon_id The id of the currently open beacon
     */
    setOpenBeacon(beacon_id) {
        if (beacon_id !== this.beac_id) { this.beacon_data_listener = false; }
        this.beac_id = beacon_id;
    }

    timeToNumber(type) {
        switch (type) {
            case 'minute':
                {
                    return 60;
                }
            case 'hour':
                {
                    return 24;
                }
            case 'day':
                {
                    return 7;
                }
            default:
                {
                    return 60;
                }
        }
    }

    /**
     * Populates the graphdata object with data for a specified beacon
     *
     * @param beacon_id The id of the beacon to update graph data for
     */
    getBeaconTraffic(beacon_id) {
        let beacon = this.beacons.find((beac) => beac.id === beacon_id);
        if (!this.beacon_data_listener && this.beac_id === beacon_id && (!beacon || beacon.collect_data)) {
            this.beacon_data_listener = true;
            this.beaconService.getTrafficByIdAndType(beacon_id, beacon ? beacon.graph_time_period : 'minute').subscribe(
                data => {
                    if (data === null) {
                        this.loading_beacon_data = false;
                        return;
                    }
                    let d: any;
                    d = data;
                    const traffic = d.map((tr) => {
                        return tr['detected_dev_dists']['length'];
                    });
                    beacon = this.beacons.find((beac) => beac.id === beacon_id);

                    this.chartLabels = Array.from({length: traffic.length}, (v, k) => '-' + (k)).reverse();
                    if (traffic.length > 0 && (beacon && traffic.length === this.timeToNumber(beacon.graph_time_period)) ) {
                        if (JSON.stringify(this.prevdata) !== JSON.stringify(traffic) && this.graphdata[beacon_id]) {
                            this.prevdata = traffic;
                            this.graphdata[beacon_id] = {
                                data: traffic,
                                label: '# of devices'
                            };
                        } else if (!this.graphdata[beacon_id]) {
                            this.prevdata = traffic;
                            this.graphdata[beacon_id] = {
                                data: traffic,
                                label: '# of devices'
                            };
                        }
                        this.loading_beacon_data = false;
                        setTimeout(function() {
                            this.beacon_data_listener = false;
                            this.getBeaconTraffic(beacon_id, true);
                        }.bind(this), 1000 * 5);
                    } else if (beacon && traffic.length !== this.timeToNumber(beacon.graph_time_period)) {
                        setTimeout(function() {
                            this.beacon_data_listener = false;
                            this.getBeaconTraffic(beacon_id);
                        }.bind(this), 0);
                    }
                },
                error => {
                    console.log(error);
                    this.alertService.error(error);
                });
        }
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
            collect_data: event.target.form[event.target.form[`inputId`].value].checked,
            distance: event.target.form[`distance`].value,
            action: {
                kind: event.target.form[`action_kind`].value,
                value: event.target.form[`action_value`].value
            }
        };
        if (event.target.form[`graph_time_period`]) {
            beacon['graph_time_period'] = event.target.form[`graph_time_period`].value;
        }
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
        return new Promise(() => {
            this.group = group;
            this.beacons = group && group.beacons.length > 0 ? group.beacons : undefined;
        });
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
