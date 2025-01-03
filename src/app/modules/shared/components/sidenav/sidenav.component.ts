import { MediaMatcher } from '@angular/cdk/layout';
import { Component, inject, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { KeycloakProfile } from 'keycloak-js';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  firstName: string = 'Guest';
  email: string = 'No email';
  roles: string[] = [];
  mobileQuery: MediaQueryList;
  private keycloakService = inject(KeycloakService);
  private userProfile: KeycloakProfile | null = null;

  menuNav = [
    {name: "Home", route: "home", icon: "home"},
    {name: "Maestro de tablas", route: "maestro", icon: "tablet"},
    {name: "Activos", route: "activo", icon: "bookmark"}
  /*  {name: "Responsable", route: "responsable", icon: "moneda_box"},
    {name: "Tipo de Bien", route: "tipobien", icon: "desktop"},
    {name: "Articulos", route: "articulo", icon: "assessments"},
    {name: "Grupos", route: "grupo", icon: "tablet"},
    {name: "Activos", route: "activo", icon: "card_travel"},
    {name: "Proveedores", route: "proveedor", icon: "assignment"},
    {name: "Comunes", route: "comun", icon: "wallet"},
    {name: "Atributo", route: "atributo", icon: "bookmark"},
    {name: "Atributos", route: "atributos", icon: "bookmark"} */   
  ]

  constructor(media: MediaMatcher) {
    
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    //this.nombre = this.util.nombre();
    /*this.keycloakService.getUserRoles().filter(user => {
      this.agentProfile = user;
    })*/
  }

  async ngOnInit() {
    try {
      this.userProfile = await this.keycloakService.loadUserProfile();
      this.firstName = this.userProfile.firstName ?? 'Guest';
      this.email = this.userProfile.email ?? 'No email';
      const token = await this.keycloakService.getToken();
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      const client = 'inventario';  // Cambia esto según tu necesidad
      const resourceRoles = decodedToken.resource_access?.[client]?.roles || [];
      //const resourceRoles = decodedToken.resource_access?.inventario?.roles || [];
      this.roles = resourceRoles;
      //this.roles = this.keycloakService.getUserRoles();
    } catch (e) {
      console.error('Failed to load user profile', e);
      this.firstName = 'Guest';
      this.email = 'No email';
      this.roles = [];
    }
  }

  nombre(){//this.nombre = this.util.nombre();
    return this.firstName = this.keycloakService.getUsername();
  }
  /*nombre(){
    return this.keycloakService.getUsername();
  }*/

  getRoles(){
    return this.keycloakService.getUserRoles();
  }

  isAdmin(){
    let roles = this.keycloakService.getUserRoles().filter( role => role == "admin");

    if (roles.length > 0) 
      return true;
    else 
      return false;
  }
  foto(){
    return this.keycloakService.getKeycloakInstance().clientId;
  }
  logout(){
    this.keycloakService.logout();

  }
  getToken(): Promise<string> {
    return this.keycloakService.getToken();
  }
}
