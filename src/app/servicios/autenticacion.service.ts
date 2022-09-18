import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AutenticacionService {
  //url = "https://stormy-sea-00314.herokuapp.com/user";
  url = "http://localhost:8080/auth";

  constructor(private http: HttpClient) {
     console.log("El servicio de autenticacion esta corriendo");
  }


  iniciarSesion(info: any) {
    return this.http.post(this.url + "/login", info);
  }

  registrarNuevoUser(user:any){
    return this.http.post(this.url, user);
  }

}
