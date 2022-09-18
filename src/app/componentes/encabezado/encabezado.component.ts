import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ApiDbService } from 'src/app/servicios/api-db.service';
import { AutenticacionService } from 'src/app/servicios/autenticacion.service';

@Component({
  selector: 'app-encabezado',
  templateUrl: './encabezado.component.html',
  styleUrls: ['./encabezado.component.css']
})
export class EncabezadoComponent implements OnInit {
  @Input() isUserLogin!: boolean;
  constructor(private authService: AutenticacionService,
    private apiDbService:ApiDbService,
    private ruta: Router) { }

  ngOnInit(): void {
  }

  onLogOut() {
    sessionStorage.clear();
    this.ngOnInit();
    //this.apiDbService.reloadComponent(this.ruta.url);
    window.location.reload();
    //this.ruta.navigate(['']);
  }

}
