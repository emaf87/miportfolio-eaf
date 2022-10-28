import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class AutenticacionService {
  url = "https://stormy-sea-00314.herokuapp.com/auth";
  //url = "http://localhost:8080/auth";

  constructor(private http: HttpClient) {
    
  }

  iniciarSesion(info: any) {
    return this.http.post(this.url + "/login", info);
  }
}
