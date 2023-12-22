import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { JuegoVidaRoutingModule } from './juego-vida-routing.module';
import { BaseJuegoVidaComponent } from './pages/base-juego-vida/base-juego-vida.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';

@NgModule({
  declarations: [
    BaseJuegoVidaComponent
  ],
  imports: [
    CommonModule,
    JuegoVidaRoutingModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [BaseJuegoVidaComponent]
})
export class JuegoVidaModule { }
