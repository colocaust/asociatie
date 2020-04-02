import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

import * as M from 'materialize-css';

declare var $: any;
@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls:
		[
			'./app.component.scss'
		]
})
export class AppComponent implements OnInit {
	showNav: boolean = true;

	constructor(private router: Router) {
		router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe((event) => {
			if (event.url.indexOf('/print') !== -1) {
				this.showNav = false;
			}
		});
	}

	ngOnInit(): void {
		// console.log(this.router.url);
		let self = this;
		document.addEventListener('DOMContentLoaded', function() {
			M.AutoInit();
		});
	}
}
