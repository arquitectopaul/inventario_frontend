import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MarcaService } from 'src/app/modules/shared/services/marca.service';

@Component({
  selector: 'app-new-marca',
  templateUrl: './new-marca.component.html',
  styleUrls: ['./new-marca.component.css']
})
export class NewMarcaComponent implements OnInit{

  public marcaForm!: FormGroup;
  private fb = inject(FormBuilder);
  private marcaService= inject(MarcaService);
  private dialogRef= inject(MatDialogRef);
  public data = inject(MAT_DIALOG_DATA);
  estadoFormulario: string = "";

  ngOnInit(): void {

    console.log(this.data);
    this.estadoFormulario = "Agregar";
    
    this.marcaForm = this.fb.group({
      nombre: ['', Validators.required],
      descripcion: ['', Validators.required]
    })

    if (this.data != null ){
      this.updateForm(this.data);
      this.estadoFormulario = "Actualizar";
    }
  }

  onSave(){

    let data = {
      nombre: this.marcaForm.get('nombre')?.value,
      descripcion: this.marcaForm.get('descripcion')?.value
    }

    if (this.data != null ){
      //update registry
      this.marcaService.updateMarca(data, this.data.id)
              .subscribe( (data: any) =>{
                this.dialogRef.close(1);
              }, (error:any) =>{
                this.dialogRef.close(2);
              })
    } else {
      //create new registry
      this.marcaService.saveMarca(data)
          .subscribe( (data : any) => {
            console.log(data);
            this.dialogRef.close(1);
          }, (error: any) => {
            this.dialogRef.close(2);
          })
    }
  }

  onCancel(){
    this.dialogRef.close(3);
  }

  updateForm(data: any){
    this.marcaForm = this.fb.group( {
      nombre: [data.nombre, Validators.required],
      descripcion: [data.descripcion, Validators.required]
    });

  }

  convertirAMayusculas(event: any) {
    const input = event.target as HTMLInputElement;
    const valor = input.value.toUpperCase();
    input.value = valor;
  } 

}
