import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EncabezadoComponent } from './componentes/encabezado/encabezado.component';
import { BienvenidaComponent } from './componentes/bienvenida/bienvenida.component';
import { DatosComponent } from './componentes/datos/datos.component';
import { ProyectosComponent } from './componentes/proyectos/proyectos.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { IniciarSesionComponent } from './componentes/iniciar-sesion/iniciar-sesion.component';
import { PortfolioComponent } from './componentes/portfolio/portfolio.component'  
import { ReactiveFormsModule } from '@angular/forms';
import { SkillsComponent } from './componentes/skills/skills.component';
import { TokenInterceptorService } from './servicios/token-interceptor.service';
import { CuerpoPortfolioComponent } from './componentes/cuerpo-portfolio/cuerpo-portfolio.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {DragDropModule} from '@angular/cdk/drag-drop'




@NgModule({
  declarations: [
    AppComponent,
    EncabezadoComponent,
    BienvenidaComponent,
    DatosComponent,
    ProyectosComponent,
    IniciarSesionComponent,
    PortfolioComponent,
    SkillsComponent,
    CuerpoPortfolioComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    DragDropModule
   ],
  providers: [{provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi:true}],
  bootstrap: [AppComponent]
})
export class AppModule { }
