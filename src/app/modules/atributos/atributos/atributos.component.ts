import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmComponent } from '../../shared/components/confirm/confirm.component';
import { AtributosService } from '../../shared/services/atributos.service';
import { UtilService } from '../../shared/services/util.service';
import { NewAtributosComponent } from '../new-atributos/new-atributos.component';

@Component({
  selector: 'app-atributos',
  templateUrl: './atributos.component.html',
  styleUrls: ['./atributos.component.css']
})
export class AtributosComponent implements OnInit{
  isAdmin: any;
  private atributosService = inject(AtributosService);
  private snackBar = inject(MatSnackBar);
  public dialog = inject(MatDialog);
  private util = inject(UtilService);
  public isLoading = true;

  ngOnInit(): void {
    this.muestraTabla();
    this.isAdmin = this.util.isAdmin();
  }

  displayedColumns: string[] = ['id', 'nombreatributo', 'atributoid', 'actions'];
  dataSource = new MatTableDataSource<AtributosElement>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  muestraTabla(){
    this.isLoading = true;this.toggleLoader(true);
    this.atributosService.getAtributoss()
        .subscribe( (data:any) => {
          console.log("respuesta de atributoss: ", data);
          this.processAtributosResponse(data);
          this.isLoading = false;
          this.toggleLoader(false);
        }, (error: any) => {
          console.log("error: ", error);
          this.isLoading = false;
          this.toggleLoader(false);
        });
  }

  toggleLoader(show: boolean): void {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.display = show ? 'flex' : 'none';
    }
  } 

  processAtributosResponse(resp: any){
    const dateAtributos: AtributosElement[] = [];
     if( resp.metadata[0].code == "00"){
       let listCAtributos = resp.atributosResponse.listaatributoss;

       listCAtributos.forEach((element: AtributosElement) => {
         ///element.atributo = element.atributo.name;
         //element.picture = 'data:image/jpeg;base64,'+element.picture;
         dateAtributos.push(element);
       });
       //set the datasource
       this.dataSource = new MatTableDataSource<AtributosElement>(dateAtributos);
       this.dataSource.paginator = this.paginator;
     }
  }

  openAtributosDialog(){
    const dialogRef = this.dialog.open(NewAtributosComponent , {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      if( result == 1){
        this.openSnackBar("Atributos Agregado", "Éxito");
        this.muestraTabla();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al guardar atributos", "Error");
      }
    });
  }

  openSnackBar(message: string, action: string) : MatSnackBarRef<SimpleSnackBar>{
    return this.snackBar.open(message, action, {
      duration: 2000
    })
  }

  edit(id:number, atributoid:number, nombreatributo:string){
    const dialogRef = this.dialog.open(NewAtributosComponent , {
      width: '450px', 
      data: {id: id, nombreatributo: nombreatributo, atributoid: atributoid}
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      if( result == 1){
        this.openSnackBar("Atributos editado", "Éxito");
        this.muestraTabla();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al editar atributos", "Error");
      }
    });
  }

  delete(id: any){
    const dialogRef = this.dialog.open(ConfirmComponent , {
      width: '450px', 
      data: {id: id, module: "atributos"}
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      
      if( result == 1){
        this.openSnackBar("Atributos eliminado", "Exitosa");
        this.muestraTabla();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al eliminar atributos", "Error");
      }
    });
  }

  buscar(modelo: any){
    if ( modelo.length === 0){
      return this.muestraTabla();
    }

    this.atributosService.getAtributosByModelo(modelo)
        .subscribe( (resp: any) =>{
          this.processAtributosResponse(resp);
        })
  }

  exportExcel(){

    this.atributosService.exportAtributos()
        .subscribe( (data: any) => {
          let file = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
          let fileUrl = URL.createObjectURL(file);
          var anchor = document.createElement("a");
          anchor.download = "atributoss.xlsx";
          anchor.href = fileUrl;
          anchor.click();

          this.openSnackBar("Archivo exportado correctamente", "Exitosa");
        }, (error: any) =>{
          this.openSnackBar("No se pudo exportar el archivo", "Error");
        })
  }
}

export interface AtributosElement {
  id: number;
  atributoid: number;  
  nombreatributo: string;
  ///atributo: any;
}