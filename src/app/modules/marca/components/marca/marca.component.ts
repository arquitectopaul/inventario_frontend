import { Component, Inject, inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MarcaService } from 'src/app/modules/shared/services/marca.service';
import { ConfirmComponent } from 'src/app/modules/shared/components/confirm/confirm.component';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { NewMarcaComponent } from '../new-marca/new-marca.component';


@Component({
  selector: 'app-marca',
  templateUrl: './marca.component.html',
  styleUrls: ['./marca.component.css']
})
export class MarcaComponent implements OnInit{

  isAdmin: any;
  private marcaService = inject(MarcaService);
  private snackBar = inject(MatSnackBar);
  public dialog = inject(MatDialog);
  private util = inject (UtilService);

  ngOnInit(): void {
    this.muestraTabla();
    console.log(this.util.getRoles());
    this.isAdmin = this.util.isAdmin();
  }

  displayedColumns: string[] = ['id', 'nombre', 'descripcion', 'actions'];
  dataSource = new MatTableDataSource<MarcaElement>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  muestraTabla(): void {
    this.marcaService.getMarcas()
      .subscribe( (data:any) => {
        console.log("respuesta marcas: ", data);
        this.processMarcaResponse(data);
      }, (error: any) => {
        console.log("error: ", error);
      })
  }

  processMarcaResponse(resp: any){
    const dataMarca: MarcaElement[] = [];
    if( resp.metadata[0].code == "00") {
      let listmarca = resp.marcaResponse.listamarcas;
      listmarca.forEach((element: MarcaElement) => {
        dataMarca.push(element);
      });
      this.dataSource = new MatTableDataSource<MarcaElement>(dataMarca);
      this.dataSource.paginator = this.paginator;
    }
  }

  openMarcaDialog(){
    const dialogRef = this.dialog.open(NewMarcaComponent , {
      width: '450px'
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if( result == 1){
        this.openSnackBar("Marca Agregada", "Éxito");
        this.muestraTabla();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al guardar la marca", "Error");
      }
    });
  }

  edit(id:number, nombre: string, descripcion: string){
    const dialogRef = this.dialog.open(NewMarcaComponent , {
      width: '450px',
      data: {id: id, nombre: nombre, descripcion: descripcion}
    });
    dialogRef.afterClosed().subscribe((result:any) => {
      if( result == 1){
        this.openSnackBar("Marca Actualizada", "Éxito");
        this.muestraTabla();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al actualizar la marca", "Error");
      }
    });
  }

  delete(id: any){
    console.log('Delete called with id:', id);
    const dialogRef = this.dialog.open(ConfirmComponent , {
      data: {id: id, module: "marca"}
    });
    console.log('dialogRef:', dialogRef);
    dialogRef.afterClosed().subscribe((result:any) => {
      if( result == 1){
        this.openSnackBar("Marca Eliminada", "Éxito");
        this.muestraTabla();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al eliminar la marca", "Error");
      }
    });
  }

  buscar( termino: string){
    if( termino.length === 0){
      return this.muestraTabla();
    }
    this.marcaService.getMarcaByDescrip(termino)
            .subscribe( (resp: any) => {
              this.processMarcaResponse(resp);
            })
  }

  openSnackBar(message: string, action: string) : MatSnackBarRef<SimpleSnackBar>{
    return this.snackBar.open(message, action, {
      duration: 2000
    })
  }

  exportExcel(){
    this.marcaService.exportMarca()
        .subscribe( (data: any) => {
          let file = new Blob([data], {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'});
          let fileUrl = URL.createObjectURL(file);
          var anchor = document.createElement("a");
          anchor.download = "marcas.xlsx";
          anchor.href = fileUrl;
          anchor.click();
          this.openSnackBar("Archivo exportado correctamente", "Exitosa");
        }, (error: any) =>{
          this.openSnackBar("No se pudo exportar el archivo", "Error");
        })
  }
}

export interface MarcaElement {
  id: number;
  nombre: string;
  descripcion: string;
}
