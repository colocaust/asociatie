import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class WebSqlService {
	db: any;

	setari: any[] = [
		'nume',
		'prenume',
		'strada',
		'bloc',
		'scara',
		'etaj',
		'apartament',
		'asociatie_nr',
		'localitate',
		'nr_camere',
		'nr_persoane',
		'nr_bucatarii',
		'nr_bai'
	];
	consum: any[] = [
		'zi_citire',
		'luna',
		'anul',
		'consum_timestamp'
	];

	constructor() {
		const seatariColoane = this.setari.join(', ');

		for (let i = 0; i < 10; i++) {
			this.consum.push('bucatarie_' + i);
		}
		for (let i = 0; i < 10; i++) {
			this.consum.push('baie_' + i);
		}
		const consumColoane = this.consum.join(', ');

		this.db = (<any>window).openDatabase('asociatie', '1.0', 'Consum Asociatie', 2 * 1024 * 1024);
		this.db.transaction(async function(tx) {
			await tx.executeSql(`CREATE TABLE IF NOT EXISTS setari (${seatariColoane})`);
		});
		this.db.transaction(async function(tx) {
			await tx.executeSql(`CREATE TABLE IF NOT EXISTS consum (${consumColoane})`);
		});
	}

	createTable(tableName, columns) {
		this.db.transaction(async function(tx) {
			await tx.executeSql(`CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`);
		});
	}

	select(tableName, keyName, valueKey) {
		let self = this;
		return new Promise(function(resolve, reject) {
			self.db.transaction(function(tx) {
				tx.executeSql(
					`SELECT rowid, * FROM ${tableName} WHERE ${keyName} = ?`,
					[
						valueKey
					],
					function(tx, res) {
						let rows = [];
						for (let i = 0; i < res.rows.length; i++) {
							rows.push(res.rows.item(i));
						}
						let out = { rows: rows, rowsAffected: res.rowsAffected };
						resolve(out);
					},
					function(tx, err) {
						reject(err.message);
					}
				);
			});
		});
	}

	selectWhere(tableName: string, where: any) {
		let self = this;
		let whereString = '';
		let whereArray = [];
		let whereValues = [];
		for (let key in where) {
			whereValues.push(where[key]);
			whereArray.push(`${key} = ?`);
		}
		whereString = whereArray.join(' AND ');
		return new Promise(function(resolve, reject) {
			self.db.transaction(function(tx) {
				tx.executeSql(
					`SELECT rowid, * FROM ${tableName} WHERE ${whereString}`,
					whereValues,
					(tx, res) => {
						let rows = [];
						for (let i = 0; i < res.rows.length; i++) {
							rows.push(res.rows.item(i));
						}
						let out = { rows: rows, rowsAffected: res.rowsAffected };
						resolve(out);
					},
					(tx, err) => {
						reject(err.message);
					}
				);
			});
		});
	}

	selectAll(tableName) {
		let self = this;
		return new Promise(function(resolve, reject) {
			self.db.transaction(function(tx) {
				tx.executeSql(
					`SELECT rowid, * FROM ${tableName}`,
					[],
					(tx, res) => {
						let rows = [];
						for (let i = 0; i < res.rows.length; i++) {
							rows.push(res.rows.item(i));
						}
						let out = { rows: rows, rowsAffected: res.rowsAffected };
						resolve(out);
					},
					(tx, err) => {
						reject(err.message);
					}
				);
			});
		});
	}

	selectAllWithOrder(tableName, orderBy, type) {
		let self = this;
		return new Promise(function(resolve, reject) {
			self.db.transaction(function(tx) {
				tx.executeSql(
					`SELECT rowid, * FROM ${tableName} ORDER BY ${orderBy} ${type}`,
					[],
					(tx, res) => {
						let rows = [];
						for (let i = 0; i < res.rows.length; i++) {
							rows.push(res.rows.item(i));
						}
						let out = { rows: rows, rowsAffected: res.rowsAffected };
						resolve(out);
					},
					(tx, err) => {
						reject(err.message);
					}
				);
			});
		});
	}

	selectByWithOrderAndLimit(tableName, keyName, operand, valueKey, orderBy, type, offset, limit) {
		let self = this;
		return new Promise(function(resolve, reject) {
			self.db.transaction(function(tx) {
				tx.executeSql(
					`SELECT rowid, * FROM ${tableName} WHERE ${keyName} ${operand} ? ORDER BY ${orderBy} ${type} LIMIT ${offset}, ${limit}`,
					[
						valueKey
					],
					(tx, res) => {
						let rows = [];
						for (let i = 0; i < res.rows.length; i++) {
							rows.push(res.rows.item(i));
						}
						let out = { rows: rows, rowsAffected: res.rowsAffected };
						resolve(out);
					},
					(tx, err) => {
						reject(err.message);
					}
				);
			});
		});
	}

	update(tableName, data, keyNameWhere, valueKeyWhere) {
		let self = this;
		let keys = [];
		let setQueryValues: string;
		let values = [];
		for (var i in data) {
			keys.push(`${i} = ?`);
			values.push(data[i]);
		}
		values.push(valueKeyWhere);

		setQueryValues = keys.join(', ');
		return new Promise(function(resolve, reject) {
			self.db.transaction(function(tx) {
				tx.executeSql(
					`UPDATE ${tableName} SET ${setQueryValues} WHERE ${keyNameWhere} = ?`,
					values,
					(tx, res) => {
						var rows = [];
						for (var i = res.rows.length; i; i--) {
							rows.unshift(res.rows.item(i - 1));
						}
						var out = { rows: rows, rowsAffected: res.rowsAffected };
						resolve(out);
					},
					(tx, err) => {
						reject(err.message);
					}
				);
			});
		});
	}

	insert(tableName, data) {
		let keys = [];
		let setQueryValues: string;
		let values = [];
		for (var i in data) {
			keys.push(`?`);
			values.push(data[i]);
		}
		setQueryValues = keys.join(', ');
		this.db.transaction(async function(tx) {
			await tx.executeSql(`INSERT INTO ${tableName} VALUES (${setQueryValues})`, values);
		});
	}

	remove(tableName, keyName, keyValue) {
		let self = this;

		let values = [];
		values.push(keyValue);

		return new Promise(function(resolve, reject) {
			self.db.transaction(function(tx) {
				tx.executeSql(`DELETE FROM ${tableName} WHERE ${keyName} = ?`, values);
			});
		});
	}
}
