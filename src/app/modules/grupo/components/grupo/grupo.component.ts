import { Component, Inject, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { CategoriaService } from 'src/app/modules/shared/services/categoria.service';
import { ConfirmComponent } from 'src/app/modules/shared/components/confirm/confirm.component';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { NewGrupoComponent } from '../new-grupo/new-grupo.component';

@Component({
  selector: 'app-grupo',
  templateUrl: './grupo.component.html',
  styleUrls: ['./grupo.component.css']
})
export class GrupoComponent implements OnInit{

  isAdmin: any;
  private categoriaService = inject(CategoriaService);
  private snackBar = inject(MatSnackBar);
  public dialog = inject(MatDialog);
  private util = inject (UtilService);
  public isLoading = true;

  ngOnInit(): void {
    this.muestraTabla();
    console.log(this.util.getRoles());
    this.isAdmin = this.util.isAdmin();
  }

  displayedColumns: string[] = ['id', 'nombregrupo', 'descripgrupo', 'actions'];
  dataSource = new MatTableDataSource<GrupoElement>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  muestraTabla(): void {
    this.isLoading = true;this.toggleLoader(true);
    this.categoriaService.getGrupos()
      .subscribe( (data:any) => {
        console.log("respuesta grupos: ", data);
        this.processGruposResponse(data);
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

  processGruposResponse(resp: any){
    const dataGrupo: GrupoElement[] = [];
    if( resp.metadata[0].code == "00") {
      let listGrupo = resp.categoriaResponse.listacategorias;
      listGrupo.forEach((element: GrupoElement) => {
        dataGrupo.push(element);
      });
      this.dataSource = new MatTableDataSource<GrupoElement>(dataGrupo);
      this.dataSource.paginator = this.paginator;
    }
  }

  openGrupoDialog(){
    const dialogRef = this.dialog.open(NewGrupoComponent , {
      width: '450px'
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      
      if( result == 1){
        this.openSnackBar("Categoría Agregada", "Éxito");
        this.muestraTabla();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al guardar la categoría", "Error");
      }
    });
  }

  edit(id:number, nombregrupo: string, descripgrupo: string){
    const dialogRef = this.dialog.open(NewGrupoComponent , {
      width: '450px',
      data: {id: id, nombregrupo: nombregrupo, descripgrupo: descripgrupo}
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      
      if( result == 1){
        this.openSnackBar("Categoría Actualizada", "Éxito");
        this.muestraTabla();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al actualizar la categoría", "Error");
      }
    });
  }

  delete(id: any){
    const dialogRef = this.dialog.open(ConfirmComponent , {
      data: {id: id, module: "grupo"}
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      
      if( result == 1){
        this.openSnackBar("Categoría Eliminada", "Exitosa");
        this.muestraTabla();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al eliminar la categoría", "Error");
      }
    });
  }

  buscar( termino: string){

    if( termino.length === 0){
      return this.muestraTabla();
    }

    this.categoriaService.getGrupoById(termino)
            .subscribe( (resp: any) => {
              this.processGruposResponse(resp);
            })
  }

  openSnackBar(message: string, action: string) : MatSnackBarRef<SimpleSnackBar>{
    return this.snackBar.open(message, action, {
      duration: 2000
    })
  }

  exportExcel(){
    this.categoriaService.exportGrupos()
        .subscribe( (data: any) => {
          let file = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
          let fileUrl = URL.createObjectURL(file);
          var anchor = document.createElement("a");
          anchor.download = "grupos.xlsx";
          anchor.href = fileUrl;
          anchor.click();

          this.openSnackBar("Archivo exportado correctamente", "Éxito");
        }, (error: any) =>{
          this.openSnackBar("No se pudo exportar el archivo", "Error");
        })

  }

}

export interface GrupoElement {
  id: number;
  nombregrupo: string;
  descripgrupo: string;
}
