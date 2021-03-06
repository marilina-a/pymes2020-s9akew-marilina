import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { RouterModule } from '@angular/router';
import { APP_BASE_HREF} from '@angular/common';  
import { ReactiveFormsModule } from "@angular/forms";

import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { MyInterceptor } from "./shared/my-interceptor";

import {
  NgbPaginationModule,
  NgbModalModule
} from "@ng-bootstrap/ng-bootstrap";

import { AppComponent } from "./app.component";
import { MenuComponent } from "./components/menu/menu.component";
import { InicioComponent } from "./components/inicio/inicio.component";
import { ArticulosComponent } from "./components/articulos/articulos.component";
import { ArticulosFamiliasComponent } from "./components/articulos-familias/articulos-familias.component";
import { ModalDialogComponent } from "./components/modal-dialog/modal-dialog.component";
import { ArticulosFamilias2Component } from './components/articulos-familias2/articulos-familias2.component';
import { MockArticulosFamilias2Service } from './services/mock-articulos-familias2.service';
import { ContratosComponent } from './components/contratos/contratos.component';
import { ContratosService } from './services/contratos.service';
import { ServiciosComponent } from './components/servicios/servicios.component';
import { ServiciosService } from './services/servicios.service';

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    InicioComponent,
    ArticulosComponent,
    ArticulosFamiliasComponent,
    ModalDialogComponent,
    ArticulosFamilias2Component,
    ContratosComponent,
    ServiciosComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', redirectTo: '/inicio', pathMatch: 'full' },
      { path: 'inicio', component: InicioComponent },
      { path: 'articulos', component: ArticulosComponent },
      { path: 'articulosfamilias', component: ArticulosFamiliasComponent },
      { path: 'articulosfamilias2', component: ArticulosFamilias2Component },
      { path: 'contrato', component: ContratosComponent },
      { path: 'servicio', component: ServiciosComponent }

    ]),
    NgbPaginationModule,
    NgbModalModule,
  ],
  entryComponents: [ModalDialogComponent],
  providers: [
     {provide: APP_BASE_HREF, useValue : '/' },
    { provide: HTTP_INTERCEPTORS, useClass: MyInterceptor, multi: true, providers: [MockArticulosFamilias2Service], providers: [ContratosService], providers: [ServiciosService] }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
