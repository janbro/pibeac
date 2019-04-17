import { Component, OnInit } from '@angular/core';

/**
 * Component which user is redirected to when page does not exist
 */
@Component({
    selector: 'app-page-not-found',
    templateUrl: './page-not-found.component.html'
})
export class PageNotFoundComponent implements OnInit {

    /**
     * Constructor
     */
    constructor() { }

    /**
     * Runs on page load
     */
    ngOnInit() {

    }
}
