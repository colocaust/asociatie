import { Injectable } from '@angular/core';

@Injectable({
	// we declare that this service should be created
	// by the root application injector.
	providedIn: 'root'
})
export class Setari {
	consumChecked: number = -1;

	getConsumChecked() {
		return this.consumChecked;
	}

	setConsumChecked(value) {
		this.consumChecked = value;
	}
}
