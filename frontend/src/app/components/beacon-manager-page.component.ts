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
    public chartLabels: Label[] = ['-59', '-58', '-57', '-56', '-55', '-54', '-53', '-52', '-51', '-50', '-49', '-48', '-47', '-46', '-45',
                                    '-44', '-43', '-42', '-41', '-40', '-39', '-38', '-37', '-36', '-35', '-34', '-33', '-32', '-31', '-30',
                                    '-29', '-28', '-27', '-26', '-25', '-24', '-23', '-22', '-21', '-20', '-19', '-18', '-17', '-16', '-15',
                                    '-14', '-13', '-12', '-11', '-10', '-9', '-8', '-7', '-6', '-5', '-4', '-3', '-2', '-1', '-0'];

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
                this.groups.forEach((group) => {
                    group.beacons.forEach((beacon) => {
                        this.getBeaconTraffic(beacon.id);
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

    /**
     * Populates the graphdata object with data for a specified beacon
     *
     * @param beacon_id The id of the beacon to update graph data for
     */
    getBeaconTraffic(beacon_id) {
        const date = new Date();
        date.setHours(date.getHours() - 1);
        if (!this.beacon_data_listener && this.beac_id === beacon_id) {
            this.beacon_data_listener = true;
            this.beaconService.getTrafficByMin(beacon_id, date.getTime()).subscribe(
                data => {
                    let d: any;
                    d = data;
                    let time = 0;
                    const traffic = d.slice(d.length - 60 > 0 ? d.length - 60 : 0, d.length).map((tr) => {
                        time += 1;
                        return tr['detected_dev_dists']['length'];
                    });
                    if (traffic.length > 0) {
                        if (JSON.stringify(this.prevdata) !== JSON.stringify(traffic) && this.graphdata[beacon_id]) {
                            this.prevdata = traffic;
                            while (traffic.length < 60) {
                                time += 1;
                                traffic.unshift(0);
                            }
                            this.graphdata[beacon_id] = {
                                data: traffic,
                                label: '# of devices'
                            };
                        } else if (!this.graphdata[beacon_id]) {
                            this.prevdata = traffic;
                            while (traffic.length < 60) {
                                time += 1;
                                traffic.unshift(0);
                            }
                            this.graphdata[beacon_id] = {
                                data: traffic,
                                label: '# of devices'
                            };
                        }
                        setTimeout(function() {
                            this.beacon_data_listener = false;
                            this.getBeaconTraffic(beacon_id);
                        }.bind(this), 1000 * 5);
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
