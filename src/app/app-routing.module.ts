import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { PrintComponent } from './print/print.component';

const routes: Routes = [
	{
		path: '',
		component: HomeComponent
	},
	{
		path: 'print/:id',
		component: PrintComponent
	}
];

@NgModule({
	imports:
		[
			RouterModule.forRoot(routes)
		],
	exports:
		[
			RouterModule
		]
})
export class AppRoutingModule {}
