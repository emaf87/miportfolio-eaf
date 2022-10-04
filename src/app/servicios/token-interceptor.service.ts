import { HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TokenInterceptorService {

  constructor() { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (sessionStorage.getItem('token') != null) {
      let token = sessionStorage.getItem('token')
      let jwtToken = req.clone({
        setHeaders: {
          Authorization: 'Bearer ' + token,
        }
      });
      return next.handle(jwtToken);
    }
    else
      return next.handle(req);
  }
}
