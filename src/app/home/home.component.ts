import { Component, OnInit } from '@angular/core';
import * as M from 'materialize-css';
import { WebSqlService } from '../web-sql.service';
import { FormBuilder } from '@angular/forms';

import { Setari } from '../setari';

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
	formData: object = {};
	// setari = new Setari('', '', '', '', '', 0, 0);

	submitted = false;
	formularSetari;

	constructor(private _websql: WebSqlService, private formBuilder: FormBuilder) {
		this.formularSetari = this.formBuilder.group({
			nume: 'nume',
			prenume: 'prenume',
			strada: 'strada',
			bloc: 'B1',
			scara: '1',
			etaj: '2',
			apartament: '3'
		});
	}

	ngOnInit(): void {
		// this._websql.createTable('LOGS', 'id unique, log');
		const test = this._websql.select('setari', 'rowid', '1');
		test.then(
			(data) => {
				this.formData = data.rows[0];
				// console.log(data.rows[0]);
			},
			(err) => {
				console.error(err);
			}
		);
	}

	onSubmit(data) {
		this.formularSetari.reset();

		const modalInst = M.Modal.getInstance(document.getElementById('setari'));
		modalInst.close();
		let insertData = [];
		let updateKeys = [];
		let updateValues = [];
		for (var i in data) {
			// insertData.push('"' + data[i] + '"');
			insertData.push("'" + data[i] + "'");
			updateValues.push(data[i]);
			updateKeys.push(i);
		}
		this.formData = data;
		const exist = this._websql.select('setari', 'rowid', '1');
		exist.then(
			(retData) => {
				if (retData.rows.length > 0) {
					this._websql.update('setari', updateKeys, updateValues, 'rowid', '1');
				} else {
					this._websql.insert('setari', insertData);
				}
				this.formData = data;
			},
			(err) => {
				console.error(err);
			}
		);
		// console.log('Form: ', data);
	}

	get diagnostic() {
		return JSON.stringify(this.formData);
	}
}
