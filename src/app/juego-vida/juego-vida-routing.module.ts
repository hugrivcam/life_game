import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BaseJuegoVidaComponent } from './pages/base-juego-vida/base-juego-vida.component';

const routes: Routes = [
  {
    path:'', component:BaseJuegoVidaComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JuegoVidaRoutingModule { }
