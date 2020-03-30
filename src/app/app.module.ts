import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';

@NgModule({
	declarations:
		[
			AppComponent,
			HomeComponent
		],
	imports:
		[
			BrowserModule,
			FormsModule,
			ReactiveFormsModule,
			AppRoutingModule
		],
	providers: [],
	bootstrap:
		[
			AppComponent
		]
})
export class AppModule {}
