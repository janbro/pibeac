import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AlertService } from '../services/alert.service';

@Component({
    selector: 'app-alert',
    templateUrl: 'alert.component.html'
})
export class AlertComponent implements OnInit, OnDestroy {
    private subscription: Subscription;
    message: any;

    /**
     * Constructor
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
