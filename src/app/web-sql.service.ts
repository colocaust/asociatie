import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class WebSqlService {
	db: any;

	constructor() {
		this.db = (<any>window).openDatabase('asociatie', '1.0', 'Consum Asociatie', 2 * 1024 * 1024);
		this.db.transaction(async function(tx) {
			await tx.executeSql(
				`CREATE TABLE IF NOT EXISTS setari (nume, prenume, strada, bloc, scara, etaj, apartament)`
			);
		});
	}

	createTable(tableName, columns) {
		this.db.transaction(async function(tx) {
			await tx.executeSql(`CREATE TABLE IF NOT EXISTS ${tableName} (${columns})`);
		});
	}

	select(tableName, keyName, valueKey) {
		var self = this;
		return new Promise(function(resolve, reject) {
			self.db.transaction(function(tx) {
				tx.executeSql(
					`SELECT * FROM ${tableName} WHERE ${keyName} = ?`,
					[
						valueKey
					],
					function(tx, res) {
						var rows = [];
						for (var i = res.rows.length; i; i--) {
							rows.unshift(res.rows.item(i - 1));
						}
						var out = { rows: rows, rowsAffected: res.rowsAffected };
						resolve(out);
					},
					function(tx, err) {
						reject(err.message);
					}
				);
			});
		});
	}

	update(tableName, setKeys, setValues, keyNameWhere, valueKeyWhere) {
		var self = this;
		var setQeury = [];
		for (var i in setKeys) {
			setQeury.push(`${setKeys[i]} = ?`);
		}
		setQeury = setQeury.join(', ');
		return new Promise(function(resolve, reject) {
			self.db.transaction(function(tx) {
				tx.executeSql(
					`UPDATE ${tableName} SET ${setQeury} WHERE ${keyNameWhere} = ?`,
					[
						setValues[0],
						setValues[1],
						setValues[2],
						setValues[3],
						setValues[4],
						setValues[5],
						setValues[6],
						valueKeyWhere
					],
					function(tx, res) {
						var rows = [];
						for (var i = res.rows.length; i; i--) {
							rows.unshift(res.rows.item(i - 1));
						}
						var out = { rows: rows, rowsAffected: res.rowsAffected };
						resolve(out);
					},
					function(tx, err) {
						reject(err.message);
					}
				);
			});
		});
	}

	insert(tableName, data) {
		// console.log(`INSERT INTO ${tableName} VALUES (${data})`);
		this.db.transaction(async function(tx) {
			await tx.executeSql(`INSERT INTO ${tableName} VALUES (${data})`);
		});
	}
}
