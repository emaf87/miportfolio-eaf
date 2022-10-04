import { Component, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Observable } from 'rxjs';
import { AutenticacionService } from 'src/app/servicios/autenticacion.service';

@Component({
  selector: 'app-iniciar-sesion',
  templateUrl: './iniciar-sesion.component.html',
  styleUrls: ['./iniciar-sesion.component.css']
})
export class IniciarSesionComponent implements OnInit {

  @Input() isUserLogin!: boolean;
  @Output() loginStatus!: boolean;
  public mensajeObservable!: Observable<boolean>;
  valor: any;
  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private authService: AutenticacionService,
    private ruta: Router) {

    this.loginForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
      })
  }

  ngOnInit(): void {
    if (sessionStorage.getItem('token') != null) {
      this.onReturn();
    }
  }

  get Email() {
    return this.loginForm.get('email');
  }

  get Password() {
    return this.loginForm.get('password');
  }

  onEnviar(event: Event) {
    event.preventDefault;
    this.authService.iniciarSesion(this.loginForm.value).subscribe({
      next: (data) => {
        this.valor = Object.values(data)[0];
        sessionStorage.setItem('token', this.valor);
        this.ruta.navigate(['portfolio']);
      },
      error: () => alert("El usuario y/o la contraseña son incorrectas")
    })
  }

  onReturn() {
    this.ruta.navigate(['portfolio']);
  }
}
