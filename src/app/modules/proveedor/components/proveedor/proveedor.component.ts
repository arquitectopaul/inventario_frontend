import { Component, inject, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmComponent } from 'src/app/modules/shared/components/confirm/confirm.component';
import { ProveedorService } from 'src/app/modules/shared/services/proveedor.service';
import { UtilService } from 'src/app/modules/shared/services/util.service';
import { NewProveedorComponent } from '../new-proveedor/new-proveedor.component';
import { LoaderService } from 'src/app/modules/shared/services/loader.service';

@Component({
  selector: 'app-proveedor',
  templateUrl: './proveedor.component.html',
  styleUrls: ['./proveedor.component.css']
})
export class ProveedorComponent implements OnInit{//, OnDestroy{
  loaderVisible = false;
  isAdmin: any;
  private proveedorService = inject(ProveedorService);
  private snackBar = inject(MatSnackBar);
  public dialog = inject(MatDialog);
  private util = inject (UtilService);
  //
  public isLoading = true;
  private loaderService = inject(LoaderService);
  private loaderSubscription: Subscription | undefined;

  ngOnInit(): void {
    this.isAdmin = this.util.isAdmin();
    this.loaderSubscription = this.loaderService.loaderState.subscribe((state: boolean) => {
      this.loaderVisible = state;
    });
    this.muestraTabla();
    ///console.log(this.util.getRoles());
    
    /*this.loaderService.loaderState.subscribe((state: boolean) => {
      this.loaderVisible = state;
    });   */ 
  }
/*
  ngOnDestroy(): void {
    if (this.loaderSubscription) {
      this.loaderSubscription.unsubscribe();
    }
  }*/

  displayedColumns: string[] = ['id', 'ruc', 'razonsocial', 'direccionfiscal', 'contacto', 'telefono', 'correo', 'custodio', 'actions'];
  dataSource = new MatTableDataSource<ProveedorElement>();

  @ViewChild(MatPaginator)
  paginator!: MatPaginator;

  muestraTabla(): void {
    this.isLoading = true;
    this.toggleLoader(true);
    this.loaderService.showLoader();
    this.proveedorService.getProveedores().subscribe(
      (data: any) => {
        console.log("respuesta proveedores: ", data);
        this.processProveedoresResponse(data);
        this.isLoading = false;
        this.toggleLoader(false);
        this.loaderService.hideLoader();
      },
      (error: any) => {
        console.log("error: ", error);
        this.isLoading = false;
        this.toggleLoader(false);
        this.loaderService.hideLoader();
      }
    );   
    /*this.proveedorService.getProveedores()
      .subscribe( (data:any) => {
        console.log("respuesta proveedors: ", data);
        this.processProveedoresResponse(data);
        //this.isLoading = true;
        //this.toggleLoader(false);
        this.loaderService.hideLoader();
      }, (error: any) => {
        console.log("error: ", error);
        //this.isLoading = true;
        //this.toggleLoader(false);
        this.loaderService.hideLoader();
      });*/
  }

  toggleLoader(show: boolean): void {
    const loader = document.getElementById('loader');
    if (loader) {
      loader.style.display = show ? 'flex' : 'none';
    }
  }

  processProveedoresResponse(resp: any){
    const dataProveedor: ProveedorElement[] = [];
    if( resp.metadata[0].code == "00") {
      let listProveedor = resp.proveedorResponse.listaproveedores;
      listProveedor.forEach((element: ProveedorElement) => {
        dataProveedor.push(element);
      });
      this.dataSource = new MatTableDataSource<ProveedorElement>(dataProveedor);
      this.dataSource.paginator = this.paginator;
    }
  }

  openProveedorDialog(){
    const dialogRef = this.dialog.open(NewProveedorComponent , {
      width: '800px'
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      
      if( result == 1){
        this.openSnackBar("Proveedor Agregado", "Éxito");
        this.muestraTabla();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al guardar el proveedor", "Error");
      }
    });
  }

  edit(id:number, ruc: string, razonsocial: string, direccionfiscal: string, contacto: string, telefono: string, correo: string,
    custodio: any
  ){
    const dialogRef = this.dialog.open(NewProveedorComponent , {
      width: '800px',
      data: {id: id, ruc: ruc, razonsocial: razonsocial, direccionfiscal: direccionfiscal, contacto: contacto, telefono: telefono,
         correo: correo, custodio: custodio}
    });
    dialogRef.afterClosed().subscribe((result:any) => {      
      if( result == 1){
        this.openSnackBar("Proveedor Actualizado", "Éxito");
        this.muestraTabla();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al actualizar el proveedor", "Error");
      }
    });
  }

  delete(id: any){
    const dialogRef = this.dialog.open(ConfirmComponent , {
      data: {id: id, module: "proveedor"}
    });

    dialogRef.afterClosed().subscribe((result:any) => {
      
      if( result == 1){
        this.openSnackBar("Proveedor Eliminado", "Éxito");
        this.muestraTabla();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al eliminar el proveedor", "Error");
      }
    });
  }

  buscar( termino: string){

    if( termino.length === 0){
      return this.muestraTabla();
    }

    this.proveedorService.getProveedorById(termino)
            .subscribe( (resp: any) => {
              this.processProveedoresResponse(resp);
            })
  }

  openSnackBar(message: string, action: string) : MatSnackBarRef<SimpleSnackBar>{
    return this.snackBar.open(message, action, {
      duration: 2000
    })

  }

  exportExcel() {
    this.loaderService.showLoader();
    this.proveedorService.exportProveedores().subscribe(
      (data: any) => {
        let file = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        let fileUrl = URL.createObjectURL(file);
        var anchor = document.createElement("a");
        anchor.download = "proveedores.xlsx";
        anchor.href = fileUrl;
        anchor.click();

        this.loaderService.hideLoader();
        this.openSnackBar("Archivo exportado correctamente", "Exitosa");
      },
      (error: any) => {
        this.loaderService.hideLoader();
        this.openSnackBar("No se pudo exportar el archivo", "Error");
      }
    );
  }

  convertirAMayusculas(event: any) {
    const input = event.target as HTMLInputElement;
    const valor = input.value.toUpperCase();
    input.value = valor;
  }


}

export interface ProveedorElement {
  razonsocial: string;
  id: number;
  ruc: string;
  direccionfiscal: string;
  contacto: string;
  telefono: string;
  correo: string;
  custodio: any;
}
