import { Directive, ElementRef } from '@angular/core';
import * as M from 'materialize-css';

@Directive({
	selector: '[appDropDownMenu]',
	exportAs: 'appDropDownMenu'
})
export class DropDownMenuDirective {
	constructor(private el: ElementRef) {}

	ngAfterViewInit(): void {
		M.Dropdown.init(this.el.nativeElement, {
			coverTrigger: false,
			constrainWidth: false
		});
	}
}
