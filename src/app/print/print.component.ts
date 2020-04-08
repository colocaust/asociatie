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
	consumDataPrecedent: any;
	nrBucatarii: any[] = [];
	nrBai: any[] = [];
	selectedId: number;
	totalConsum: number = 0;

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
			luna: '',
			anul: 0,
			consum_timestamp: 0
		};

		this.consumDataPrecedent = {
			zi_citire: '',
			luna: '',
			anul: 0,
			consum_timestamp: 0
		};

		for (let i = 0; i < 10; i++) {
			let key = 'bucatarie_' + i;
			this.consumData[key] = '';
			this.consumDataPrecedent[key] = 0;
		}
		for (let i = 0; i < 10; i++) {
			let key = 'baie_' + i;
			this.consumData[key] = '';
			this.consumDataPrecedent[key] = 0;
		}

		this.routeSub = this.route.params.subscribe((params) => {
			this.selectedId = params['id'];
		});
	}

	ngOnInit(): void {
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
				// this.totalConsum = 0;
				// for (let i = 0; i < this.formData.nr_bucatarii; i++) {
				// 	this.totalConsum += indexCurent - indexPrecedent;
				// }
				// for (let i = 0; i < this.formData.nr_bai; i++) {
				// 	this.totalConsum = this.totalConsum + parseFloat(formDataLocal['baie_' + i]);
				// }

				this.selecteazaValoareaPrecedenta(this.consumData.consum_timestamp);
			},
			(err) => {
				//
			}
		);
	}

	selecteazaValoareaPrecedenta(consum_timestamp: number) {
		const selectConsum = this._websql.selectByWithOrderAndLimit(
			'consum',
			'consum_timestamp',
			'<=',
			consum_timestamp,
			'consum_timestamp',
			'DESC',
			'0',
			'2'
		);
		selectConsum.then(
			(retData: any) => {
				let formDataLocal: any = this.consumDataPrecedent;
				if (retData.rows.length > 1) {
					formDataLocal = { ...formDataLocal, ...retData.rows[1] };
				}
				for (let i = 0; i < this.formData.nr_bucatarii; i++) {
					let indexCurent = this.consumData[`bucatarie_${i}`];
					let indexPrecedent = formDataLocal[`bucatarie_${i}`];
					this.totalConsum += indexCurent - indexPrecedent;
				}
				for (let i = 0; i < this.formData.nr_bai; i++) {
					let indexCurent = this.consumData[`baie_${i}`];
					let indexPrecedent = formDataLocal[`baie_${i}`];
					this.totalConsum += indexCurent - indexPrecedent;
					// this.totalConsum = this.totalConsum + parseFloat(formDataLocal['baie_' + i]);
				}
				this.consumDataPrecedent = formDataLocal;
			},
			(err) => {
				// console.log(err);
			}
		);
	}

	ngOnDestroy() {
		this.routeSub.unsubscribe();
	}
}
