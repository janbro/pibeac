import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AlertService } from '../services/alert.service';

/**
 * Alert message component to inject into pages
 */
@Component({
    selector: 'app-alert',
    templateUrl: 'alert.component.html'
})
export class AlertComponent implements OnInit, OnDestroy {
    /**
     * Subscribes to alert messages
     */
    private subscription: Subscription;
    /**
     * Current message to display
     */
    message: any;

    /**
     * Constructor
     *
     * @param alertService Displays notifications for the page
     */
    constructor(private alertService: AlertService) { }

    /**
     * Subscribe to alert service messages
     */
    ngOnInit() {
        this.subscription = this.alertService.getMessage().subscribe(message => {
            this.message = message;
        });
    }

    /**
     * Unsubscribe to alertService
     */
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
