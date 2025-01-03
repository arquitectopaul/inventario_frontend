import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AtributoService } from '../../shared/services/atributo.service';
import { AtributosService } from '../../shared/services/atributos.service';

export interface Atributos{
  id: number;
  atributoid: string;
  nombreatributo: string;
}

@Component({
  selector: 'app-new-atributos',
  templateUrl: './new-atributos.component.html',
  styleUrls: ['./new-atributos.component.css']
})
export class NewAtributosComponent implements OnInit{
  
  private fb = inject(FormBuilder);
  private atributoService= inject(AtributoService);
  
  private dialogRef= inject(MatDialogRef);
  public data = inject(MAT_DIALOG_DATA);

  private atributosService = inject(AtributosService);

  public atributosForm!: FormGroup;

  estadoFormulario: string = "";

  atributos: Atributos[]=[];

  //selectedFile: any;
  //nameImg: string ="";

  ngOnInit(): void {
    this.getCategories();

    this.estadoFormulario = "Agregar";
    this.atributosForm = this.fb.group( {
      nombreatributo: ['', Validators.required],
      atributoid: ['', Validators.required],
      atributo: ['', Validators.required]
      //picture: ['', Validators.required]
    })

    if (this.data != null ){
      this.updateForm(this.data);
      this.estadoFormulario = "Actualizar";
    }
  }

  onSave(){
    let data = {
      nombreatributo: this.atributosForm.get('nombreatributo')?.value,
      atributoid: this.atributosForm.get('atributoid')?.value,
      atributoId: this.atributosForm.get('atributo')?.value
      ///atributo: this.atributosForm.get('atributo')?.value
      ///atributo: this.atributosForm.get('atributo')?.value
      //picture: this.selectedFile
    }
/*
    const uploadImageData = new FormData();
    //uploadImageData.append('picture', data.picture, data.picture.name);
    uploadImageData.append('modelo', data.modelo);
    uploadImageData.append('marca', data.marca);
    uploadImageData.append('nroserie', data.nroserie);
    uploadImageData.append('nombreatributo', data.nombreatributo);
    uploadImageData.append('atributoid', data.atributoid);
    uploadImageData.append('moneda', data.moneda);
    uploadImageData.append('atributoId', data.atributo);

    if (this.data != null){
      //update the atributos
      this.atributosService.updateAtributos(uploadImageData, this.data.id)
                .subscribe( (data: any) =>{
                  this.dialogRef.close(1);
                }, (error: any) => {
                  this.dialogRef.close(2);
                })
    } else {
      //call the service to save a atributos
      this.atributosService.saveAtributos(uploadImageData)
              .subscribe( (data: any) =>{
                this.dialogRef.close(1);
              }, (error: any) => {
                this.dialogRef.close(2);
              })
    }*/
    if (this.data != null) {
      // Actualizar el atributos
      this.atributosService.updateAtributos(data, this.data.id)
      .subscribe(
        (data: any) => {
          this.dialogRef.close(1);
        },
        (error: any) => {
          this.dialogRef.close(2);
        }
      );
    } else {
      // Guardar un nuevo atributos
      this.atributosService.saveAtributos(data)
      .subscribe(
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
 

  getCategories(){
    this.atributoService.getAtributos()
        .subscribe( (data: any) =>{
          this.atributos = data.atributoResponse.listaatributos;
        }, (error: any) =>{
          console.log("error al consultar atributos");
        })
  }


  /*onFileChanged(event: any){

    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);

    this.nameImg = event.target.files[0].name;


  }*/

  updateForm(data: any){
    this.atributosForm = this.fb.group( {
      nombreatributo: [data.nombreatributo, Validators.required],
      atributoid: [data.atributoid, Validators.required],
      atributo: [data.atributo.id, Validators.required]
      //picture: ['', Validators.required]
    })
  }

}
