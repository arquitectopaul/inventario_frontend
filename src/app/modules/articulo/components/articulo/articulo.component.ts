import { Component, Inject, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmComponent } from 'src/app/modules/shared/components/confirm/confirm.component';
import { ArticuloService } from 'src/app/modules/shared/services/articulo.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { NewArticuloComponent } from '../new-articulo/new-articulo.component';

@Component({
  selector: 'app-articulo',
  templateUrl: './articulo.component.html',
  styleUrls: ['./articulo.component.css']
})
export class ArticuloComponent implements OnInit{

  isAdmin: any;
  private articuloService = inject(ArticuloService);
  private snackBar = inject(MatSnackBar);
  public dialog = inject(MatDialog);
  private util = inject (UtilService);
  public isLoading = false;

  ngOnInit(): void {
    this.muestraTabla();
    console.log(this.util.getRoles());
    this.isAdmin = this.util.isAdmin();
  }

  displayedColumns: string[] = ['id', 'nombrearticulo', 'descriparticulo', 'actions'];
  dataSource = new MatTableDataSource<ArticuloElement>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  muestraTabla(): void {
    this.isLoading = true;this.toggleLoader(true);
    this.articuloService.getArticulos()
      .subscribe( (data:any) => {
        console.log("respuesta articulos: ", data);
        this.processArticulosResponse(data);
        this.isLoading = true;this.toggleLoader(false);
      }, (error: any) => {
        console.log("error: ", error);
        this.isLoading = true;this.toggleLoader(false);
      });
  }

  toggleLoader(show: boolean): void {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.display = show ? 'flex' : 'none';
    }
  }  

  processArticulosResponse(resp: any){
    const dataArticulo: ArticuloElement[] = [];
    if( resp.metadata[0].code == "00") {
      let listArticulo = resp.articuloResponse.listaarticulos;
      listArticulo.forEach((element: ArticuloElement) => {
        dataArticulo.push(element);
      });
      this.dataSource = new MatTableDataSource<ArticuloElement>(dataArticulo);
      this.dataSource.paginator = this.paginator;
    }
  }

  openArticuloDialog(){
    const dialogRef = this.dialog.open(NewArticuloComponent , {
      width: '450px'
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if( result == 1){
        this.openSnackBar("Artículo agregado", "Exitosa");
        this.muestraTabla();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al guardar el artículo", "Error");
      }
    });
  }

  edit(id:number, nombrearticulo: string, descriparticulo: string){
    const dialogRef = this.dialog.open(NewArticuloComponent , {
      width: '450px',
      data: {id: id, nombrearticulo: nombrearticulo, descriparticulo: descriparticulo}
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if( result == 1){
        this.openSnackBar("Artículo Actualizado", "Exitosa");
        this.muestraTabla();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al actualizar artículo", "Error");
      }
    });
  }

  delete(id: any){
    const dialogRef = this.dialog.open(ConfirmComponent , {
      data: {id: id, module: "articulo"}
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      
      if( result == 1){
        this.openSnackBar("Artículo Eliminado", "Exitosa");
        this.muestraTabla();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al eliminar artículo", "Error");
      }
    });
  }

  buscar( termino: string){

    if( termino.length === 0){
      return this.muestraTabla();
    }

    this.articuloService.getArticuloById(termino)
            .subscribe( (resp: any) => {
              this.processArticulosResponse(resp);
            })
  }

  openSnackBar(message: string, action: string) : MatSnackBarRef<SimpleSnackBar>{
    return this.snackBar.open(message, action, {
      duration: 2000
    })

  }

  exportExcel(){

    this.articuloService.exportArticulos()
        .subscribe( (data: any) => {
          let file = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
          let fileUrl = URL.createObjectURL(file);
          var anchor = document.createElement("a");
          anchor.download = "Articulos.xlsx";
          anchor.href = fileUrl;
          anchor.click();
          this.openSnackBar("Archivo exportado correctamente", "Exitosa");
        }, (error: any) =>{
          this.openSnackBar("No se pudo exportar el archivo", "Error");
        })
  }
}

export interface ArticuloElement {
  id: number;
  nombrearticulo: string;
  descriparticulo: string;
}
