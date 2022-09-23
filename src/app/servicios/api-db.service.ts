import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class ApiDbService {

  requestOptions: any;
  
    urls = {
      urlDatos: "https://stormy-sea-00314.herokuapp.com/api/personaldetails", urlEdu: "https://stormy-sea-00314.herokuapp.com/api/education",
      urlExp: "https://stormy-sea-00314.herokuapp.com/api/experience", urlSkills: "https://stormy-sea-00314.herokuapp.com/api/skills",
      urlProy: "https://stormy-sea-00314.herokuapp.com/api/proyect"
    }

 /* urls = {
    urlDatos: "http://localhost:8080/api/personaldetails", urlEdu: "http://localhost:8080/api/education",
    urlExp: "http://localhost:8080/api/experience", urlSkills: "http://localhost:8080/api/skills",
    urlProy: "http://localhost:8080/api/proyect"
  }*/

  constructor(private http: HttpClient) { }

  /*---------------LECTURA DE DATOS--------------------------*/

  readDataBase(urlId:number): Observable<any> {
    console.log("urls")
    
    console.log(Object.values(this.urls)[urlId])
    return this.http.get<any>(Object.values(this.urls)[urlId]);
  }


  /*----------------------EDICION DE DATOS-----------------*/

  editInformation(form: any, urlId: number, id: number) {
    return this.http.put(Object.values(this.urls)[urlId] + "/" + id, form)
  }


  /*-------------------AGREGAR DATOS---------------------*/

  newInformation(form: any, urlId: number): Observable<any> {
    return this.http.post<any>(Object.values(this.urls)[urlId], form, {responseType: 'text' as 'json' });
  }


  /*--------------------ELIMINAR DATO-------------------------*/

  deleteInformation(id: number, urlId: number) {
    return this.http.delete<any>(Object.values(this.urls)[urlId] + "/" + id, { responseType: 'text' as 'json' });
  }

}
