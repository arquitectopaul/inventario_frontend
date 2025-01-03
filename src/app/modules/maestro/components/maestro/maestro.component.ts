import { Component, Inject, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmComponent } from 'src/app/modules/shared/components/confirm/confirm.component';
import { MaestroService } from 'src/app/modules/shared/services/maestro.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { Router } from '@angular/router'; // Importa Router
import { MatDialogModule } from '@angular/material/dialog';
import { ResponsableComponent } from './../../../responsable/components/responsable/responsable.component';
import { TipoBienComponent } from './../../../tipobien/components/tipobien/tipobien.component';
import { GrupoComponent } from './../../../grupo/components/grupo/grupo.component';
import { ArticuloComponent } from './../../../articulo/components/articulo/articulo.component';
import { ActivoComponent } from './../../../activo/activo/activo.component';
import { ProveedorComponent } from './../../../proveedor/components/proveedor/proveedor.component';
import { AtributoComponent } from './../../../atributo/atributo/atributo.component';
import { AtributosComponent } from './../../../atributos/atributos/atributos.component';
//import { EspecificoComponent } from 'src/app/modules/especifico/especifico/especifico.component';
import { EspecificacionesComponent } from 'src/app/modules/especificaciones/especificaciones/especificaciones.component';
import { ParametroComponent } from 'src/app/modules/parametro/parametro/parametro.component';
import { MarcaComponent } from 'src/app/modules/marca/components/marca/marca.component';

@Component({
  selector: 'app-maestro',
  templateUrl: './maestro.component.html',
  styleUrls: ['./maestro.component.css']
})
export class MaestroComponent implements OnInit{

  isAdmin: any;
  private router = inject(Router);
  private maestroService = inject(MaestroService);
  private snackBar = inject(MatSnackBar);
  public dialog = inject(MatDialog);
  private util = inject (UtilService);

  menuNav = [
    { name: "MARCA", route: "marca", icon: "bookmark" },
    { name: "PARÁMETROS", route: "parametro", icon: "bookmark" },
//    { name: "ACTIVOS", route: "especifico", icon: "bookmark" },
//    { name: "ESPECÍFICOS", route: "especificaciones", icon: "bookmark" },
    { name: "CUSTODIO", route: "responsable", icon: "moneda_box" },
    { name: "PROVEEDORES", route: "proveedor", icon: "assignment" },
    { name: "TIPO DE BIEN", route: "tipobien", icon: "desktop" },
    { name: "ARTÍCULOS", route: "articulo", icon: "assessments" },
    { name: "CATEGORÍAS", route: "grupo", icon: "tablet" },
    { name: "ATRIBUTOS", route: "atributo", icon: "bookmark" },
//    { name: "Activos", route: "activo", icon: "card_travel" },

//    { name: "Maestros", route: "maestro", icon: "assignment" },
//    { name: "COMUNES", route: "comun", icon: "wallet" },

//    { name: "ATRIBUTOS", route: "atributos", icon: "bookmark" },
  ];

  selectedComponent: any;

  ngOnInit(): void {
    console.log(this.util.getRoles());
    this.isAdmin = this.util.isAdmin();
  }

  dataSource = new MatTableDataSource<MaestroElement>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  processMaestrosResponse(resp: any){

    const dataMaestro: MaestroElement[] = [];

    if( resp.metadata[0].code == "00") {

      let listMaestro = resp.maestroResponse.listamaestros;

      listMaestro.forEach((element: MaestroElement) => {
        dataMaestro.push(element);
      });

      this.dataSource = new MatTableDataSource<MaestroElement>(dataMaestro);
      this.dataSource.paginator = this.paginator;
      
    }

  }

  
  navigateTo(route: string) {
    //this.router.navigate([route]);
    this.selectedComponent = this.getComponentByRoute(route);
  }

  getComponentByRoute(route: string) {
    switch(route) {
      case 'responsable': return ResponsableComponent;
      case 'tipobien': return TipoBienComponent;
      case 'articulo': return ArticuloComponent;
      case 'grupo': return GrupoComponent;
      case 'activo': return ActivoComponent;
      case 'proveedor': return ProveedorComponent;
      case 'marca': return MarcaComponent;
      case 'atributo': return AtributoComponent;
      case 'atributos': return AtributosComponent;
      case 'activo': return ActivoComponent;
      case 'especificaciones': return EspecificacionesComponent;
      case 'parametro': return ParametroComponent;
      default: return null;
    }
  }
}

export interface MaestroElement {
  descripmaestro: string;
  id: number;
  nombremaestro: string;
  
}
