import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmComponent } from '../../shared/components/confirm/confirm.component';
import { EspecificacionesService } from '../../shared/services/especificaciones.service';
import { UtilService } from '../../shared/services/util.service';
import { NewEspecificacionesComponent } from '../new-especificaciones/new-especificaciones.component';

@Component({
  selector: 'app-especificaciones',
  templateUrl: './especificaciones.component.html',
  styleUrls: ['./especificaciones.component.css']
})
export class EspecificacionesComponent implements OnInit{  
  isAdmin: any;
  private especificacionesService = inject(EspecificacionesService);
  private snackBar = inject(MatSnackBar);
  public dialog = inject(MatDialog);
  private util = inject(UtilService);

  ngOnInit(): void {
    this.muestraTabla();
    this.isAdmin = this.util.isAdmin();
  }

  displayedColumns: string[] = ['id', 'especificacionid', 'nombreatributo', 'descripcionatributo', 'actions'];
  dataSource = new MatTableDataSource<EspecificacionesElement>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  muestraTabla(){
    this.especificacionesService.getEspecificaciones()//getEspecificacioness()
        .subscribe( (data:any) => {
          console.log("respuesta de especificacioness: ", data);
          this.processEspecificacionesResponse(data);
        }, (error: any) => {
          console.log("error en especificacioness: ", error);
        }) 
  }

  processEspecificacionesResponse(resp: any){
    const dateEspecificaciones: EspecificacionesElement[] = [];
     if( resp.metadata[0].code == "00"){
       let listCEspecificaciones = resp.especificacionesResponse.listaespecificacioness;

       listCEspecificaciones.forEach((element: EspecificacionesElement) => {
         ///element.especifico = element.especifico.name;
         //element.picture = 'data:image/jpeg;base64,'+element.picture;
         dateEspecificaciones.push(element);
       });

       //set the datasource
       this.dataSource = new MatTableDataSource<EspecificacionesElement>(dateEspecificaciones);
       this.dataSource.paginator = this.paginator;
     }
  }

  openEspecificacionesDialog(){
    const dialogRef = this.dialog.open(NewEspecificacionesComponent , {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe((result:any) => {      
      if( result == 1){
        this.openSnackBar("Especificaciones Agregado", "Éxito");
        this.muestraTabla();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al guardar especificaciones", "Error");
      }
    });
  }

  openSnackBar(message: string, action: string) : MatSnackBarRef<SimpleSnackBar>{
    return this.snackBar.open(message, action, {
      duration: 2000
    })
  }

  edit(id:number, especificoid:number, nombreatributo:string, descripcionatributo:string){
    const dialogRef = this.dialog.open(NewEspecificacionesComponent , {
      width: '450px', 
      data: {id: id, especificoid: especificoid, nombreatributo: nombreatributo, descripcionatributo: descripcionatributo}
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      if( result == 1){
        this.openSnackBar("Especificaciones editado", "Éxito");
        this.muestraTabla();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al editar especificaciones", "Error");
      }
    });
  }

  delete(id: any){
    const dialogRef = this.dialog.open(ConfirmComponent , {
      width: '450px', 
      data: {id: id, module: "especificaciones"}
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      
      if( result == 1){
        this.openSnackBar("Especificaciones eliminado", "Exitosa");
        this.muestraTabla();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al eliminar especificaciones", "Error");
      }
    });
  }

  buscar(modelo: any){
    if ( modelo.length === 0){
      return this.muestraTabla();
    }

    this.especificacionesService.getEspecificacionesByModelo(modelo)
        .subscribe( (resp: any) =>{
          this.processEspecificacionesResponse(resp);
        })
  }

  exportExcel(){

    this.especificacionesService.exportEspecificaciones()
        .subscribe( (data: any) => {
          let file = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
          let fileUrl = URL.createObjectURL(file);
          var anchor = document.createElement("a");
          anchor.download = "especificacioness.xlsx";
          anchor.href = fileUrl;
          anchor.click();

          this.openSnackBar("Archivo exportado correctamente", "Exitosa");
        }, (error: any) =>{
          this.openSnackBar("No se pudo exportar el archivo", "Error");
        })

  }

}

export interface EspecificacionesElement {
  id: number;
  especificacionid: number; //especificoid: number;  
  nombreatributo: string;
  descripcionatributo: string;
  ///especifico: any;
}