import { Component, Inject, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmComponent } from 'src/app/modules/shared/components/confirm/confirm.component';
import { CustodioService } from 'src/app/modules/shared/services/custodio.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { NewResponsableComponent } from '../new-responsable/new-responsable.component';

@Component({
  selector: 'app-responsable',
  templateUrl: './responsable.component.html',
  styleUrls: ['./responsable.component.css']
})
export class ResponsableComponent implements OnInit{

  isAdmin: any;
  private custodioService = inject(CustodioService);
  private snackBar = inject(MatSnackBar);
  public dialog = inject(MatDialog);
  private util = inject (UtilService);
  public isLoading = true;

  ngOnInit(): void {
    this.muestraTabla();
    console.log(this.util.getRoles());
    this.isAdmin = this.util.isAdmin();
  }

  displayedColumns: string[] = ['id', 'arearesponsable', 'nombresyapellidos', 'actions'];
  dataSource = new MatTableDataSource<ResponsableElement>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  muestraTabla(): void {
    this.isLoading = true;
    this.toggleLoader(true);
    this.custodioService.getResponsables()
      .subscribe( (data:any) => {
        console.log("respuesta Responsables: ", data);
        this.processResponsablesResponse(data);
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

  processResponsablesResponse(resp: any){
    const dataResponsable: ResponsableElement[] = [];
    if( resp.metadata[0].code == "00") {
      let listResponsable = resp.custodioResponse.listacustodios;
      listResponsable.forEach((element: ResponsableElement) => {
        dataResponsable.push(element);
      });
      this.dataSource = new MatTableDataSource<ResponsableElement>(dataResponsable);
      this.dataSource.paginator = this.paginator;
    }

  }

  openResponsableDialog(){
    const dialogRef = this.dialog.open(NewResponsableComponent , {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      
      if( result == 1){
        this.openSnackBar("Custodio agregado", "Éxito");
        this.muestraTabla();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al guardar categoria", "Error");
      }
    });
  }

  edit(id:number, arearesponsable: string, nombresyapellidos: string){
    const dialogRef = this.dialog.open(NewResponsableComponent , {
      width: '450px',
      data: {id: id, arearesponsable: arearesponsable, nombresyapellidos: nombresyapellidos}
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if( result == 1){
        this.openSnackBar("Custodio actualizado", "Éxito");
        this.muestraTabla();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al actualizar el Custodio", "Error");
      }
    });
  }

  delete(id: any){
    const dialogRef = this.dialog.open(ConfirmComponent , {
      data: {id: id, module: "custodio"}
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      
      if( result == 1){
        this.openSnackBar("Custodio eliminado", "Éxito");
        this.muestraTabla();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al eliminar categoria", "Error");
      }
    });
  }

  buscar( termino: string){

    if( termino.length === 0){
      return this.muestraTabla();
    }

    this.custodioService.getResponsableById(termino)
            .subscribe( (resp: any) => {
              this.processResponsablesResponse(resp);
            })
  }

  openSnackBar(message: string, action: string) : MatSnackBarRef<SimpleSnackBar>{
    return this.snackBar.open(message, action, {
      duration: 2000
    })

  }

  exportExcel(){
    this.custodioService.exportResponsables()
        .subscribe( (data: any) => {
          let file = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
          let fileUrl = URL.createObjectURL(file);
          var anchor = document.createElement("a");
          anchor.download = "Responsables.xlsx";
          anchor.href = fileUrl;
          anchor.click();

          this.openSnackBar("Archivo exportado correctamente", "Exitosa");
        }, (error: any) =>{
          this.openSnackBar("No se pudo exportar el archivo", "Error");
        })
  }

}

export interface ResponsableElement {
  id: number;
  nombresyapellidos: string;
  arearesponsable: string;
}
