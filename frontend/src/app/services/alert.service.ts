import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class AlertService {
    /**
     * Contains the message text and status
     */
    private subject = new Subject<any>();

    /**
     * Determines whether to keep the notification after page navigation
     */
    private keepAfterNavigationChange = false;

    /**
     * Constructor
     *
     * @param router Helps navigate users
     */
    constructor(private router: Router) {
        // clear alert message on route change
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterNavigationChange) {
                    // only keep for a single location change
                    this.keepAfterNavigationChange = false;
                } else {
                    // clear alert
                    this.subject.next();
                }
            }
        });
    }

    /**
     * Updates the notification object with a success message
     *
     * @param message Message to show the user
     * @param keepAfterNavigationChange Keeps the notification after a navigation change
     */
    success(message: string, keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.subject.next({ type: 'success', text: message });
    }

    /**
     * Updates the notification object with an error message
     *
     * @param message Message to show the user
     * @param keepAfterNavigationChange Keeps the notification after a navigation change
     */
    error(message: string, keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        this.subject.next({ type: 'error', text: message });
    }

    /**
     * Clears the current alert
     */
    clear() {
        this.subject.next(undefined);
    }

    /**
     * Returns the subject as an Observable
     */
    getMessage(): Observable<any> {
        return this.subject.asObservable();
    }
}
