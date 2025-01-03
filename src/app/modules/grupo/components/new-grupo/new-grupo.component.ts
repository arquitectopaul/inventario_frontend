import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoriaService } from 'src/app/modules/shared/services/categoria.service';

@Component({
  selector: 'app-new-grupo',
  templateUrl: './new-grupo.component.html',
  styleUrls: ['./new-grupo.component.css']
})
export class NewGrupoComponent implements OnInit{

  public grupoForm!: FormGroup;
  private fb = inject(FormBuilder);
  private categoriaService= inject(CategoriaService);
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
    this.grupoForm = this.fb.group({
      nombregrupo: ['', Validators.required],
      descripgrupo: ['', Validators.required]
    });
  }

  onSave(){
    this.isLoading = true;//this.toggleLoader(true);
    let data = {
      nombregrupo: this.grupoForm.get('nombregrupo')?.value,
      descripgrupo: this.grupoForm.get('descripgrupo')?.value
    }

    if (this.data != null ){
      //update registry
      this.categoriaService.updateGrupo(data, this.data.id)
              .subscribe( (data: any) =>{
                this.dialogRef.close(1);
              }, (error:any) =>{
                this.dialogRef.close(2);
              }).add(() => {
                this.isLoading = false;//this.toggleLoader(false);
              });
    } else {
      //create new registry
      this.categoriaService.saveGrupo(data)
          .subscribe( (data : any) => {
            console.log(data);
            this.dialogRef.close(1);
          }, (error: any) => {
            this.dialogRef.close(2);
          }).add(() => {
            this.isLoading = false;//this.toggleLoader(false);
          });
    }
  }

  onCancel(){
    this.dialogRef.close(3);
  }

  updateForm(data: any){
    this.grupoForm = this.fb.group( {
      nombregrupo: [data.nombregrupo, Validators.required],
      descripgrupo: [data.descripgrupo, Validators.required]
    });

  }
  /*updateForm(data: any) {
    //this.idAlfanumerico = `GRU${data.id}`;
    this.grupoForm.setValue({
      //idAlfanumerico: this.idAlfanumerico,
      nombregrupo: data.nombregrupo,
      descripgrupo: data.descripgrupo
    });
  }*/

  convertirAMayusculas(event: any) {
    const input = event.target as HTMLInputElement;
    const valor = input.value.toUpperCase();
    input.value = valor;
  } 
}
