import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ParametroService } from '../../shared/services/parametro.service';


@Component({
  selector: 'app-new-parametro',
  templateUrl:'./new-parametro.component.html',
  styleUrls: ['./new-parametro.component.css']
})
export class NewParametroComponent implements OnInit{
  
  public parametroForm!: FormGroup;
  private fb = inject(FormBuilder);
  private parametroService = inject(ParametroService);
  
  private dialogRef= inject(MatDialogRef);
  public data = inject(MAT_DIALOG_DATA);

  estadoFormulario: string = "";
  public isLoading = false;

  ngOnInit(): void {    
    this.initializeForm();
    if (this.data != null) {
      this.updateForm(this.data);
      this.estadoFormulario = "Actualizar";
    } else {
      this.estadoFormulario = "Agregar";
    }
  }

  initializeForm() {
    this.parametroForm = this.fb.group( {
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required]
    });
  }

  onSave(){
    this.isLoading = true;
    //this.toggleLoader(true);
    let data = {
      id: this.data?.id,
      nombre: this.parametroForm.get('nombre')?.value,
      descripcion: this.parametroForm.get('descripcion')?.value
    }
    if (this.data != null ){
      this.parametroService.updateParametro(data, this.data.id)
              .subscribe( (data: any) =>{
                this.dialogRef.close(1);
              }, (error:any) =>{
                this.dialogRef.close(2);
                this.isLoading = false;
              }).add(() => {
                this.isLoading = false;
                //this.toggleLoader(false);
              });
    } else {
      //create new registry
      this.parametroService.saveParametro(data)
          .subscribe( (data : any) => {
            console.log(data);
            this.dialogRef.close(1);
          }, (error: any) => {
            this.dialogRef.close(2);
          }).add(() => {
            this.isLoading = false;//this.toggleLoader(false); // Detener loader al finalizar
          });
    }
  }  

  onCancel(){
    this.dialogRef.close(3);
  }


  /*onFileChanged(event: any){

    this.selectedFile = event.target.files[0];
    console.log(this.selectedFile);

    this.nameImg = event.target.files[0].name;


  }*/

  updateForm(data: any){
    this.parametroForm = this.fb.group( {
      nombre: [data.nombre, Validators.required],
      //tipo: [data.tipo.id, Validators.required],
      ///grupo: [data.grupo.id, Validators.required],
      descripcion: [data.descripcion, Validators.required],
      ///descripcortaparametro: [data.descripcortaparametro.id, Validators.required]
      //picture: ['', Validators.required]
    })
  }
/*
  updateForm(data: any) {
    //this.idAlfanumerico = `PAR${data.id}`;
    this.parametroForm.setValue({
      //idAlfanumerico: this.idAlfanumerico,
      nombre: [data.nombre.id, Validators.required],
      descripcion: [data.descripcion, Validators.required]
    });
  }*/

  convertirAMayusculas(event: any) {
    const input = event.target as HTMLInputElement;
    const valor = input.value.toUpperCase();
    input.value = valor;
  } 


}
