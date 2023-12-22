import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { MaterialModule } from './material/material.module';
import { JuegoVidaModule } from './juego-vida/juego-vida.module';
//import { BaseJuegoVidaComponent } from './juego-vida/pages/base-juego-vida/base-juego-vida.component';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    JuegoVidaModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
