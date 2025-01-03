import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable, from } from 'rxjs'; // Asegúrate de importar 'from'
import { KeycloakService } from 'keycloak-angular';

@Injectable()
export class KeycloakHttpInterceptor implements HttpInterceptor {

  constructor(private keycloakService: KeycloakService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.handleAccess(req, next));
  }

  private async handleAccess(req: HttpRequest<any>, next: HttpHandler): Promise<HttpEvent<any>> {
    const token = await this.keycloakService.getToken();

    if (token) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Manejo del tipo para asegurar que siempre se devuelva un HttpEvent<any>
    return next.handle(req).toPromise() as Promise<HttpEvent<any>>;
  }
}
