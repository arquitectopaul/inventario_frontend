import { Component, inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivoService } from '../../services/activo.service';
import { CategoriaService } from '../../services/categoria.service';
import { MarcaService } from '../../services/marca.service';
import { ParametroService } from '../../services/parametro.service';
import { CustodioService } from '../../services/custodio.service';
import { ProveedorService } from '../../services/proveedor.service';
import { TipoBienService } from '../../services/tipobien.service';
import { ArticuloService } from '../../services/articulo.service';
import { AtributoService } from '../../services/atributo.service';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.css']
})
export class ConfirmComponent {
  private categoriaService= inject(CategoriaService);
  private dialogRef= inject(MatDialogRef);
  public data = inject(MAT_DIALOG_DATA);
  private activoService= inject(ActivoService);
  private marcaService = inject(MarcaService);
  private parametroService = inject(ParametroService);
  private custodioService = inject(CustodioService);
  private proveedorService = inject(ProveedorService);
  private tipoBienService = inject(TipoBienService);
  private articuloService = inject(ArticuloService);
  private atributoservice = inject(AtributoService);

  onNoClick(){
    this.dialogRef.close(3)
  }

  delete(){
    if (this.data != null){
      if (this.data.module == "grupo") {
        this.categoriaService.deleteGrupo(this.data.id).
              subscribe( (data:any) =>{
                this.dialogRef.close(1);
              }, (error: any) => {
                this.dialogRef.close(2);
              })
      } else if ( this.data.module == "activo" )  {
            this.activoService.deleteActivo(this.data.id).
              subscribe( (data:any) =>{
                this.dialogRef.close(1);
              }, (error: any) => {
                this.dialogRef.close(2);
              })
      } else if(this.data.module == "marca"){
          this.marcaService.deleteMarca(this.data.id).
          subscribe( (data:any) =>{
            this.dialogRef.close(1);
          }, (error: any) => {
            this.dialogRef.close(2);
          })
      } else if(this.data.module == "parametro"){
          this.parametroService.deleteParametro(this.data.id).
          subscribe( (data:any) =>{
            this.dialogRef.close(1);
          }, (error: any) => {
            this.dialogRef.close(2);
          })
        } else if(this.data.module == "custodio"){
          this.custodioService.deleteResponsable(this.data.id).
          subscribe( (data:any) =>{
            this.dialogRef.close(1);
          }, (error: any) => {
            this.dialogRef.close(2);
          })
        } else if(this.data.module == "proveedor"){
          this.proveedorService.deleteProveedor(this.data.id).
          subscribe( (data:any) =>{
            this.dialogRef.close(1);
          }, (error: any) => {
            this.dialogRef.close(2);
          })
        } else if(this.data.module == "tipobien"){
          this.tipoBienService.deleteTipoBien(this.data.id).
          subscribe( (data:any) =>{
            this.dialogRef.close(1);
          }, (error: any) => {
            this.dialogRef.close(2);
          })
        } else if(this.data.module == "articulo"){
          this.articuloService.deleteArticulo(this.data.id).
          subscribe( (data:any) =>{
            this.dialogRef.close(1);
          }, (error: any) => {
            this.dialogRef.close(2);
          })
        } else if(this.data.module == "atributo"){
          this.atributoservice.deleteAtributo(this.data.id).
          subscribe( (data:any) =>{
            this.dialogRef.close(1);
          }, (error: any) => {
            this.dialogRef.close(2);
          })
      }      
    } else {
      this.dialogRef.close(2);
    }
  }
}