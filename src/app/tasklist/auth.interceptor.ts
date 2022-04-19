import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpHandler, HttpRequest, HttpEvent, HttpParams }
  from '@angular/common/http';
import { Observable } from 'rxjs';
import { TasklistService } from './services/tasklist.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor (private taskListService: TasklistService) { }

  intercept(req : HttpRequest<any>, next : HttpHandler) : Observable<HttpEvent<any>> {
    // Para esta aplicación queremos que sólo se ejecute en las peticiones a Firebase (ñapa)
    if (!req.url.includes('firebase')) return next.handle(req);
   
    // Si no tenemos token, no modificamos la petición
    if (!this.taskListService.userAccessToken) return next.handle(req);

    // Si en cambio sí que tenemos token, modificamos la petición
    const modifiedReq = req.clone({ 
      params: new HttpParams().set('auth', this.taskListService.userAccessToken) 
    });

    return next.handle(modifiedReq);
  }
}