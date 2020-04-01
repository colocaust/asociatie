import { Component, OnInit } from '@angular/core';
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
	title = 'asociatie';

	ngOnInit(): void {
		let self = this;
		document.addEventListener('DOMContentLoaded', function() {
			M.AutoInit();
		});
	}
}
