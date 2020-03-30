import { Component, OnInit } from '@angular/core';
import * as M from 'materialize-css';

declare var $: any;

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls:
		[
			'./home.component.scss'
		]
})
export class HomeComponent implements OnInit {
	constructor() {}

	ngOnInit(): void {}
}
