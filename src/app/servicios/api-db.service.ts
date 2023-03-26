import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiDbService {

urls = {
  urlDatos: "https://portfolio-backend-production-9b8b.up.railway.app/api/personaldetails", urlEdu: "https://portfolio-backend-production-9b8b.up.railway.app/api/education",
  urlExp: "https://portfolio-backend-production-9b8b.up.railway.app/api/experience", urlSkills: "https://portfolio-backend-production-9b8b.up.railway.app/api/skills",
  urlProy: "https://portfolio-backend-production-9b8b.up.railway.app/api/proyect", dbTest: "https://portfolio-backend-production-9b8b.up.railway.app/api/auth/test"
}
  constructor(private http: HttpClient) { }

  //-------------------DATABASE CONNECTION TEST---------------------

  dbTest(){
    
    return this.http.get<String>(Object.values(this.urls)[5], { responseType: 'text' as 'json' });
  }

  /*---------------LECTURA DE DATOS--------------------------*/

  readDataBase(urlId: number): Observable<any> {
    return this.http.get<any>(Object.values(this.urls)[urlId]);
  }

  /*----------------------EDICION DE DATOS-----------------*/

  editInformation(form: any, urlId: number, id: number) {
    return this.http.put(Object.values(this.urls)[urlId] + "/" + id, form)
  }

  /*-------------------AGREGAR DATOS---------------------*/

  newInformation(form: any, urlId: number): Observable<any> {
    return this.http.post<any>(Object.values(this.urls)[urlId], form, { responseType: 'text' as 'json' });
  }

  /*--------------------ELIMINAR DATO-------------------------*/

  deleteInformation(id: number, urlId: number) {
    return this.http.delete<any>(Object.values(this.urls)[urlId] + "/" + id, { responseType: 'text' as 'json' });
  }

  //--------------------GUARDAR LISTA COMPLETA------------------------

  saveCompleteList(urlId:number, list:any){
    return this.http.put<any>(Object.values(this.urls)[urlId] + "/savelist", list, { responseType: 'text' as 'json' });
  }
}
