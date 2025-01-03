import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmComponent } from '../../shared/components/confirm/confirm.component';
import { AtributoService } from '../../shared/services/atributo.service';
import { UtilService } from '../../shared/services/util.service';
import { NewAtributoComponent } from '../new-atributo/new-atributo.component';

@Component({
  selector: 'app-atributo',
  templateUrl: './atributo.component.html',
  styleUrls: ['./atributo.component.css']
})
export class AtributoComponent implements OnInit {

  isAdmin: any;
  atributos: any[] = [];

  private atributoService = inject(AtributoService);
  private util = inject(UtilService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  public isLoading = true;


  ngOnInit(): void {

    this.isAdmin = this.util.isAdmin();
    this.muestraTabla();
  }

  displayedColumns: string[] = ['id', 'custodio', 'articulo', 'tipo', 'categoria', 'atributos', 'actions'];
  dataSource = new MatTableDataSource<any>();
  //isLoading = false;

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  muestraTabla() {
    this.isLoading = true;this.toggleLoader(true);
    this.atributoService.getAtributos()
      .subscribe(
        (data: any) => {
          console.log("respuesta de atributos: ", data);
          this.processAtributoResponse(data);
          this.isLoading = false;
          this.toggleLoader(false);
        },
        (error: any) => {
          console.log("error en atributos: ", error);
          this.isLoading = false;
          this.toggleLoader(false);
        }
      );      
  }

  toggleLoader(show: boolean): void {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.display = show ? 'flex' : 'none';
    }
  }   

  processAtributoResponse(resp: any){
    const dateAtributo: AtributoElement[] = [];
     if( resp.metadata[0].code == "00"){
       let listCActivo = resp.atributoResponse.listaatributos;
       listCActivo.forEach((element: AtributoElement) => {
         dateAtributo.push(element);
       });
       this.dataSource = new MatTableDataSource<AtributoElement>(dateAtributo);
       this.dataSource.paginator = this.paginator;
     }
  }

  openAtributoDialog(): void {
    const dialogRef = this.dialog.open(NewAtributoComponent, {
      width: '450px'
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 1) {
        this.openSnackBar("Atributo Agregado", "Éxito");
        this.muestraTabla();
      } else if (result === 2) {
        //this.openSnackBar("Se produjo un error al guardar atributo", "Error");
        this.openSnackBar("Atributo Agregado", "Éxito");
        this.muestraTabla();
      }
    });
  }
  
  edit(id: number, custodio: any, articulo: any, tipo: any, categoria:any, atributos: any): void {
    const dialogRef = this.dialog.open(NewAtributoComponent, {
      width: '450px',
      data: { 
        id: id, 
        custodio: custodio, 
        articulo: articulo,
        tipo: tipo, 
        categoria:categoria, 
        atributos: atributos }
    });
  
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 1) {
        this.openSnackBar("Atributo editado", "Éxito");
        this.muestraTabla();
      } else if (result === 2) {
        this.openSnackBar("Atributo editado", "Éxito");
        this.muestraTabla();        
        //this.openSnackBar("Se produjo un error al editar atributo", "Error");
      }
    });
  }
  
  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 2000
    });
  }
 
  delete(id: any) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '450px',
      data: { id: id, module: "atributo" }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 1) {
        this.openSnackBar("Atributo eliminado", "Exitosa");
        this.muestraTabla();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al eliminar atributo", "Error");
      }
    });
  }

  buscar(modelo: any) {
    if (modelo.length === 0) {
      return this.muestraTabla();
    }

    this.atributoService.getAtributoByModelo(modelo)
      .subscribe(
        (resp: any) => {
          this.processAtributoResponse(resp);
        },
        (error: any) => {
          console.error("Error al buscar atributo por modelo", error);
        }
      );
  }

  exportExcel() {
    this.atributoService.exportAtributo()
      .subscribe(
        (data: any) => {
          let file = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          let fileUrl = URL.createObjectURL(file);
          var anchor = document.createElement("a");
          anchor.download = "atributos.xlsx";
          anchor.href = fileUrl;
          anchor.click();
          this.openSnackBar("Archivo exportado correctamente", "Exitosa");
        },
        (error: any) => {
          this.openSnackBar("No se pudo exportar el archivo", "Error");
        }
      );
  }
}

export interface AtributoElement {
  id: number;
  custodio: any;
  articulo: any;
  tipo: any;
  categoria: any;
  atributos: any;
  }
