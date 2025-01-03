import { Component, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmComponent } from '../../shared/components/confirm/confirm.component';
import { ParametroService } from '../../shared/services/parametro.service';
import { UtilService } from '../../shared/services/util.service';
import { NewParametroComponent } from '../new-parametro/new-parametro.component';

@Component({
  selector: 'app-parametro',
  templateUrl: './parametro.component.html',
  styleUrls: ['./parametro.component.css']
})
export class ParametroComponent implements OnInit{
  
  isAdmin: any;
  private parametroService = inject(ParametroService);
  private snackBar = inject(MatSnackBar);
  public dialog = inject(MatDialog);
  private util = inject(UtilService);
  public isLoading = true;

  ngOnInit(): void {
    this.muestraTabla();
    console.log(this.util.getRoles());
    this.isAdmin = this.util.isAdmin();
  }

  displayedColumns: string[] = ['id', 'nombre', 'descripcion',  'actions'];
  dataSource = new MatTableDataSource<ParametroElement>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  parametros: ParametroElement[] = [];

  muestraTabla(){
    this.isLoading = true;
    this.toggleLoader(true);
    this.parametroService.getParametros()
        .subscribe( (data:any) => {
          console.log("respuesta de parametros: ", data);
          this.processParametroResponse(data);
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

  processParametroResponse(resp: any){
    const dateParametro: ParametroElement[] = [];
     if( resp.metadata[0].code == "00"){
       let listaParametro = resp.parametroResponse.listaparametros;
       listaParametro.forEach((element: ParametroElement) => {
          //element.id = element.id
          element.nombre = element.nombre
          element.descripcion = element.descripcion
         dateParametro.push(element);
       });
       this.dataSource = new MatTableDataSource<ParametroElement>(dateParametro);
       this.dataSource.paginator = this.paginator;
       this.parametros = dateParametro;       
     }
  }

  openParametroDialog(){
    const dialogRef = this.dialog.open(NewParametroComponent , {
      width: '450px'
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if( result == 1){
        this.openSnackBar("Parametro Agregado", "Éxito");
        this.muestraTabla();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al guardar parametro", "Error");
      }
    });
  }

  openSnackBar(message: string, action: string) : MatSnackBarRef<SimpleSnackBar>{
    return this.snackBar.open(message, action, {
      duration: 2000
    })

  }

  edit(id:number, nombre:string, descripcion:string){
    const dialogRef = this.dialog.open(NewParametroComponent , {
      width: '450px', 
      data: {id: id, nombre: nombre, descripcion: descripcion}
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if( result == 1){
        this.openSnackBar("Parametro editado", "Éxito");
        this.muestraTabla();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al editar parametro", "Error");
      }
    });
  }

  delete(id: any){
    const dialogRef = this.dialog.open(ConfirmComponent , {
      data: {id: id, module: "parametro"}
    });
    dialogRef.afterClosed().subscribe((result:any) => {      
      if( result == 1){
        this.openSnackBar("Parametro eliminado", "Éxito");
        this.muestraTabla();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al eliminar parámetro", "Error");
      }
    });
  }


  /*buscar(modelo: any){
    if ( modelo.length === 0){
      return this.getParametross();
    }
    this.parametroService.getParametroByModelo(modelo)
        .subscribe( (resp: any) =>{
          this.processParametroResponse(resp);
        })
  }*/
  buscar( descripcion: string){

    if( descripcion.length === 0){
      return this.muestraTabla();
    }

    this.parametroService.getParametroByDescrip(descripcion)
            .subscribe( (resp: any) => {
              this.processParametroResponse(resp);
            })
  }
  exportExcel(){
    this.parametroService.exportParametro()
        .subscribe( (data: any) => {
          let file = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
          let fileUrl = URL.createObjectURL(file);
          var anchor = document.createElement("a");
          anchor.download = "parametros.xlsx";
          anchor.href = fileUrl;
          anchor.click();

          this.openSnackBar("Archivo exportado correctamente", "Exitosa");
        }, (error: any) =>{
          this.openSnackBar("No se pudo exportar el archivo", "Error");
        })
  }
}

export interface ParametroElement {
  id: number;
  nombre: string;
  descripcion: string;
}
