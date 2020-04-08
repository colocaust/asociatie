import { Component, OnInit } from '@angular/core';
import * as M from 'materialize-css';
import { WebSqlService } from '../web-sql.service';
import { FormBuilder } from '@angular/forms';
import { runInThisContext } from 'vm';

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
		luna: '',
		anul: 0,
		consum_timestamp: 0
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

	listaAnilor = [];

	maxConsum: any[] = [];

	indexBucatarie: number = 0;
	indexBaie: number = 0;

	listaConsum: any[] = [];
	consumTotalM3: number = 0;

	consumChecked = -1;

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

		let date = new Date();
		let anulCurent = date.getFullYear();
		this.consumData['anul'] = anulCurent;
		for (let i = anulCurent - 2; i < anulCurent + 6; i++) {
			this.listaAnilor.push(i);
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

		this.colecteazaSiAfiseazaConsum();

		this.initDom();
	}

	saveleazaConsum(data: any) {
		let indexLuna = this.lunileAnului.indexOf(data.luna) + 1;
		let valoareAn = data.anul;
		let valoareZi = 1;
		let calculData = new Date(`${indexLuna}/${valoareZi}/${valoareAn}`);
		data.consum_timestamp = calculData.getTime();

		const modalInst = M.Modal.getInstance(document.getElementById('adaugaConsum'));

		let existaConsum = this._websql.selectWhere('consum', { luna: data.luna, anul: data.anul });

		existaConsum.then(
			(retData: any) => {
				if (retData.rows.length > 0) {
					// Exista ( Eroare )
					this.displayMessage('error', 'Acest consum este deja adaugat!');
				} else {
					this._websql.insert('consum', data);
					this.colecteazaSiAfiseazaConsum();
					this.formularContor.reset();

					let date = new Date();
					let anulCurent = date.getFullYear();
					this.consumData['anul'] = anulCurent;
					this.indexBucatarie = 0;
					this.indexBaie = 0;
					let zi_citire_pick: any = document.getElementById('zi_citire_pick');
					zi_citire_pick.value = '';
					this.displayMessage('success', 'Indexul a fost adaugat cu succes!');
				}
				modalInst.close();
			},
			(err) => {
				this.displayMessage('error-server', err);
			}
		);
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
					this.displayMessage('success', 'Setarile au fost modificate cu succes!');
				} else {
					this._websql.insert('setari', data);
					this.displayMessage('success', 'Setarile au fost adaugate cu succes!');
				}
				this.formData = { ...this.formData, ...data };
			},
			(err) => {
				this.displayMessage('error-server', err);
				this.formularSetari.reset();
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

	consumPentruRaport(value: number, event: any) {
		if (event.toElement.checked) {
			this.consumChecked = value;
		} else {
			this.consumChecked = -1;
		}
	}

	checkPentruConsum(currentValue: number) {
		if (this.consumChecked != -1) {
			if (this.consumChecked != currentValue) {
				return true;
			}
		}
		return false;
	}

	afiseazaRaport(currentValue: number) {
		if (this.consumChecked == -1) {
			return true;
		}
		if (this.consumChecked != currentValue) {
			return true;
		}
		return false;
	}

	stergeConsum(index: number, rowid: number) {
		this._websql.remove('consum', 'rowid', rowid);
		document.querySelector(`[data-index="${index}"`).remove();

		this.colecteazaSiAfiseazaConsum();
		this.displayMessage('info', 'Indexul a fost sters cu succes!');
	}

	colecteazaSiAfiseazaConsum() {
		const selectConsum = this._websql.selectAllWithOrder('consum', 'consum_timestamp', 'ASC');
		selectConsum.then(
			(retData: any) => {
				if (retData.rows.length > 0) {
					retData.rows.forEach((row, index) => {
						let consumPrecedent = [];
						let totalConsum = 0;
						if (index > 0) {
							consumPrecedent = retData.rows[index - 1];
							for (let i = 0; i < this.formData.nr_bucatarii; i++) {
								let indexCurent = parseInt(row[`bucatarie_${i}`]);
								let indexPrecedent = parseInt(consumPrecedent[`bucatarie_${i}`]);
								totalConsum += indexCurent - indexPrecedent;
							}
							for (let i = 0; i < this.formData.nr_bai; i++) {
								let indexCurent = parseInt(row[`baie_${i}`]);
								let indexPrecedent = parseInt(consumPrecedent[`baie_${i}`]);
								totalConsum += indexCurent - indexPrecedent;
							}
						}
						row['total_consum'] = totalConsum;
						this.consumTotalM3 += totalConsum;
						this.listaConsum.push(row);
					});
				}
			},
			(err) => {
				this.displayMessage('error-server', err);
			}
		);
	}

	displayMessage(type: string, msg: string) {
		let classes = '';
		if (type === 'error') {
			classes = 'red lighten-2';
		} else if (type === 'error-server') {
			classes = 'red darken-4';
		} else if (type === 'info') {
			classes = 'light-blue darken-1';
		} else if (type === 'success') {
			classes = 'green lighten-2';
		}

		M.toast({ html: msg, classes: classes });
		let toatsContainer = document.getElementById('toast-container');
		toatsContainer.style.right = 'inherit';
		toatsContainer.style.left = '7%';
	}

	initDom() {
		let self = this;
		document.addEventListener('DOMContentLoaded', function() {
			const setariInit = M.Modal.init(document.getElementById('setari'), {
				dismissible: false,
				onOpenStart:
					() => {
						M.updateTextFields();
						// document.getElementById('setari').style.overflowY = 'visible';
						// document.getElementById('setari').style.maxHeight = 'inherit';
					}
			});

			const consumInit = M.Modal.init(document.getElementById('adaugaConsum'), {
				dismissible: false,
				onOpenStart:
					() => {
						M.updateTextFields();
						// document.getElementById('adaugaConsum').style.overflowY = 'visible';
						// document.getElementById('adaugaConsum').style.maxHeight = 'inherit';
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

						M.FormSelect.init(document.querySelectorAll('.matSelect'), {
							dropdownOptions: { container: document.body }
						});
					}
			});
		});
	}
}
