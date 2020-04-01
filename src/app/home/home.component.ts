import { Component, OnInit } from '@angular/core';
import * as M from 'materialize-css';
import { WebSqlService } from '../web-sql.service';
import { FormBuilder } from '@angular/forms';

// import { Setari } from '../setari';

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
	formData: object = {
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
	consumData: object = {
		zi_citire: '',
		luna: []
	};
	formularSetari;
	formularContor;
	nrBucatarii = [];
	nrBai = [];

	lunileAnului = [
		'Ianuarie',
		'Februarie',
		'Martie',
		'Aprilie',
		'Mai',
		'Iunie',
		'Iulie',
		'August',
		'Septembrie',
		'Octombrie',
		'Noiembrie',
		'Decembrie'
	];

	maxConsum: any[] = [];

	indexBucatarie: number = 0;
	indexBaie: number = 0;

	listaConsum: any[] = [];

	constructor(private _websql: WebSqlService, private formBuilder: FormBuilder) {
		for (let i = 0; i < 10; i++) {
			let key = 'bucatarie_' + i;
			this.consumData[key] = '';
		}
		for (let i = 0; i < 10; i++) {
			let key = 'baie_' + i;
			this.consumData[key] = '';
			this.maxConsum.push(i);
		}
		this.formularSetari = this.formBuilder.group(this.formData);
		this.formularContor = this.formBuilder.group(this.consumData);
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
				this.formularSetari = this.formBuilder.group(this.formData);
			},
			(err) => {
				//
			}
		);
		const selectConsum = this._websql.selectAllWithOrder(
			'consum',
			'substr(zi_citire,7)||substr(zi_citire,4,2)||substr(zi_citire,1,2)',
			'ASC'
		);
		selectConsum.then(
			(retData: any) => {
				if (retData.rows.length > 0) {
					this.listaConsum = retData.rows;
				}
			},
			(err) => {
				console.log(err);
			}
		);
		this.initDom();
	}

	saveleazaConsum(data) {
		const modalInst = M.Modal.getInstance(document.getElementById('adaugaConsum'));
		modalInst.close();
		this._websql.insert('consum', data);

		const selectConsum = this._websql.selectAllWithOrder(
			'consum',
			'substr(zi_citire,7)||substr(zi_citire,4,2)||substr(zi_citire,1,2)',
			'ASC'
		);
		selectConsum.then(
			(retData: any) => {
				if (retData.rows.length > 0) {
					this.listaConsum = retData.rows;
				}
			},
			(err) => {
				console.log(err);
			}
		);

		this.formularContor.reset();
	}

	onSubmit(data) {
		const modalInst = M.Modal.getInstance(document.getElementById('setari'));
		modalInst.close();

		this.formData = data;
		const exist = this._websql.select('setari', 'rowid', '1');
		exist.then(
			(retData: any) => {
				if (retData.rows.length > 0) {
					this._websql.update('setari', data, 'rowid', '1');
				} else {
					this._websql.insert('setari', data);
				}
				this.formData = { ...this.formData, ...data };
			},
			(err) => {
				this.formularSetari.reset();
				console.error(err);
			}
		);
	}

	adaugaBucatarie() {
		if (this.indexBucatarie < this.nrBucatarii.length) {
			this.indexBucatarie += 1;
		}
	}

	adaugaBaie() {
		if (this.indexBaie < this.nrBai.length) {
			this.indexBaie += 1;
		}
	}

	initDom() {
		let self = this;
		document.addEventListener('DOMContentLoaded', function() {
			const setariInit = M.Modal.init(document.getElementById('setari'), {
				dismissible: false,
				onOpenStart:
					() => {
						M.updateTextFields();
					}
			});

			const consumInit = M.Modal.init(document.getElementById('adaugaConsum'), {
				dismissible: false,
				onOpenStart:
					() => {
						M.updateTextFields();
						document.getElementById('adaugaConsum').style.overflowY = 'visible';
						let alegeLuna = M.Datepicker.init(document.querySelector('.monthPicker'), {
							autoClose: true,
							format: 'dd.mm.yyyy',
							defaultDate: new Date().getDate(),
							setDefaultDate: true,
							firstDay: 1,
							i18n:
								{
									months:
										[
											'Ianuarie',
											'Februarie',
											'Martie',
											'Aprilie',
											'Mai',
											'Iunie',
											'Iulie',
											'August',
											'Septembrie',
											'Octombrie',
											'Noiembrie',
											'Decembrie'
										],
									monthsShort:
										[
											'Ian',
											'Feb',
											'Mar',
											'Apr',
											'Mai',
											'Iun',
											'Iul',
											'Aug',
											'Sept',
											'Oct',
											'Noi',
											'Dec'
										],
									weekdays:
										[
											'Duminica',
											'Luni',
											'Marti',
											'Miercuri',
											'Joi',
											'Vineri',
											'Sambata'
										],
									weekdaysShort:
										[
											'Dum',
											'Lun',
											'Mar',
											'Mie',
											'Joi',
											'Vin',
											'Sam'
										],
									weekdaysAbbrev:
										[
											'D',
											'L',
											'M',
											'Mi',
											'J',
											'V',
											'S'
										]
								},
							showDaysInNextAndPreviousMonths: true,
							container: document.querySelector('.picker_container'),
							parse:
								(data) => {
									console.log(data);
								},
							onDraw:
								() => {
									let inputMonthField: any;
									inputMonthField = document.querySelector(
										'.datepicker-controls .select-month input'
									);
									inputMonthField.style.width = '80px';
								},
							onClose:
								() => {
									let inst = M.Datepicker.getInstance(document.querySelector('.monthPicker'));
									// self.formularContor.controls['zi_citire'].setValue(inst.date);
									self.formularContor.controls['zi_citire'].setValue(inst.toString());
								}
						});
					}
			});
		});
	}
}
