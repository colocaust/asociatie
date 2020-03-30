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
		document.addEventListener('DOMContentLoaded', function() {
			var elems = document.querySelectorAll('.sidenav');
			var instances = M.Sidenav.init(elems, {});
		});
	}
}
