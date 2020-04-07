import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { WebSqlService } from '../web-sql.service';

@Component({
	selector: 'app-print',
	templateUrl: './print.component.html',
	styleUrls:
		[
			'./print.component.scss'
		]
})
export class PrintComponent implements OnInit {
	private routeSub: Subscription;

	formData: any;
	consumData: any;
	nrBucatarii: any[] = [];
	nrBai: any[] = [];
	selectedId: number;
	totalConsum: number;

	constructor(private route: ActivatedRoute, private _websql: WebSqlService) {
		this.formData = {
			nume: '',
			prenume: '',
			strada: '',
			bloc: '',
			scara: '',
			etaj: '',
			apartament: '',
			asociatie_nr: '',
			localitate: '',
			nr_camere: '',
			nr_persoane: '',
			nr_bucatarii: '',
			nr_bai: ''
		};
		this.consumData = {
			zi_citire: '',
			luna: []
		};

		for (let i = 0; i < 10; i++) {
			let key = 'bucatarie_' + i;
			this.consumData[key] = '';
		}
		for (let i = 0; i < 10; i++) {
			let key = 'baie_' + i;
			this.consumData[key] = '';
		}

		this.routeSub = this.route.params.subscribe((params) => {
			this.selectedId = params['id'];
		});
	}

	ngOnInit(): void {
		console.log(this.selectedId);

		const selectSetari = this._websql.select('setari', 'rowid', '1');
		selectSetari.then(
			(retData: any) => {
				let formDataLocal: any = this.formData;
				if (retData.rows.length > 0) {
					formDataLocal = { ...formDataLocal, ...retData.rows[0] };
				}
				for (let i = 0; i < formDataLocal.nr_bucatarii; i++) {
					this.nrBucatarii.push(i);
				}
				for (let i = 0; i < formDataLocal.nr_bai; i++) {
					this.nrBai.push(i);
				}
				this.formData = formDataLocal;
			},
			(err) => {
				//
			}
		);

		const selectConsum = this._websql.select('consum', 'rowid', this.selectedId);
		selectConsum.then(
			(retData: any) => {
				let formDataLocal: any = this.consumData;
				if (retData.rows.length > 0) {
					formDataLocal = { ...formDataLocal, ...retData.rows[0] };
				}
				this.consumData = formDataLocal;
				this.totalConsum = 0;
				for (let i = 0; i < this.formData.nr_bucatarii; i++) {
					this.totalConsum = this.totalConsum + parseFloat(formDataLocal['bucatarie_' + i]);
				}
				for (let i = 0; i < this.formData.nr_bai; i++) {
					this.totalConsum = this.totalConsum + parseFloat(formDataLocal['baie_' + i]);
				}
			},
			(err) => {
				//
			}
		);
	}

	ngOnDestroy() {
		this.routeSub.unsubscribe();
	}
}
