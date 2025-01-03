import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivoService } from '../../shared/services/activo.service';
import { EspecificacionesService } from '../../shared/services/especificaciones.service';

/*export interface Especifico{
  especificoid: string;
  id: number;
  nombreatributo: string;
}*/

export interface Especificaciones {
  id: number;
  especificacionid: number;
  nombreatributo: string;
  descripcionatributo: string;
}

@Component({
  selector: 'app-new-especificaciones',
  templateUrl: './new-especificaciones.component.html',
  styleUrls: ['./new-especificaciones.component.css']
})
export class NewEspecificacionesComponent implements OnInit{
  
  private fb = inject(FormBuilder);
  private activoService= inject(ActivoService);
  
  private dialogRef= inject(MatDialogRef);
  public data = inject(MAT_DIALOG_DATA);

  private especificacionesService = inject(EspecificacionesService);

  public especificacionesForm!: FormGroup;

  estadoFormulario: string = "";

  especificaciones: Especificaciones[]=[];

  //selectedFile: any;
  //nameImg: string ="";

  ngOnInit(): void {
    this.getEspecificaciones();
    this.estadoFormulario = "Agregar";
    this.especificacionesForm = this.fb.group( {
      nombreatributo: ['', Validators.required],
      especificoid: ['', Validators.required],
      especifico: ['', Validators.required]
      //picture: ['', Validators.required]
    })

    if (this.data != null ){
      this.updateForm(this.data);
      this.estadoFormulario = "Actualizar";
    }
  }

  onSave(){
    let data = {
      nombreatributo: this.especificacionesForm.get('nombreatributo')?.value,
      especificoid: this.especificacionesForm.get('especificoid')?.value,
      especificoId: this.especificacionesForm.get('especifico')?.value

      ///especifico: this.especificacionesForm.get('especifico')?.value
      ///especifico: this.especificacionesForm.get('especifico')?.value
      //picture: this.selectedFile
    }
/*
    const uploadImageData = new FormData();
    //uploadImageData.append('picture', data.picture, data.picture.name);
    uploadImageData.append('modelo', data.modelo);
    uploadImageData.append('marca', data.marca);
    uploadImageData.append('nroserie', data.nroserie);
    uploadImageData.append('nombreatributo', data.nombreatributo);
    uploadImageData.append('especificoid', data.especificoid);
    uploadImageData.append('moneda', data.moneda);
    uploadImageData.append('especificoId', data.especifico);

    if (this.data != null){
      //update the especificaciones
      this.especificacionesService.updateEspecificaciones(uploadImageData, this.data.id)
                .subscribe( (data: any) =>{
                  this.dialogRef.close(1);
                }, (error: any) => {
                  this.dialogRef.close(2);
                })
    } else {
      //call the service to save a especificaciones
      this.especificacionesService.saveEspecificaciones(uploadImageData)
              .subscribe( (data: any) =>{
                this.dialogRef.close(1);
              }, (error: any) => {
                this.dialogRef.close(2);
              })
    }*/
    if (this.data != null) {
      // Actualizar el especificaciones
      this.especificacionesService.updateEspecificaciones(data, this.data.id).subscribe(
        (data: any) => {
          this.dialogRef.close(1);
        },
        (error: any) => {
          this.dialogRef.close(2);
        }
      );
    } else {
      // Guardar un nuevo especificaciones
      this.especificacionesService.saveEspecificaciones(data).subscribe(
        (data: any) => {
          this.dialogRef.close(1);
        },
        (error: any) => {
          this.dialogRef.close(2);
        }
      );
    }    

  }

  onCancel(){
    this.dialogRef.close(3);
  }

 
  getEspecificaciones(){
    this.especificacionesService.getEspecificaciones()
        .subscribe( (data: any) =>{
          this.especificaciones = data.especificacionesResponse.listaespecificacioness;
        }, (error: any) =>{
          console.log("error al consultar especificaciones");
        })
  }


  /*onFileChanged(event: any){

    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);

    this.nameImg = event.target.files[0].name;


  }*/

  updateForm(data: any){
    this.especificacionesForm = this.fb.group( {
      nombreatributo: [data.nombreatributo, Validators.required],
      especificoid: [data.especificoid, Validators.required],
      especifico: [data.especifico.id, Validators.required]
      //picture: ['', Validators.required]
    })
  }

}