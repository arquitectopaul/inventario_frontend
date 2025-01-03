import { Component, inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProveedorService } from 'src/app/modules/shared/services/proveedor.service';
import { CustodioService } from 'src/app/modules/shared/services/custodio.service';

export interface Custodio{
  nombresyapellidos: string;
  id: number;
  arearesponsable: string;
}

@Component({
  selector: 'app-new-proveedor',
  templateUrl: './new-proveedor.component.html',
  styleUrls: ['./new-proveedor.component.css']
})
export class NewProveedorComponent implements OnInit{

  public proveedorForm!: FormGroup;
  private fb = inject(FormBuilder);
  private proveedorService= inject(ProveedorService);
  private custodioService=inject(CustodioService);
  private dialogRef= inject(MatDialogRef<NewProveedorComponent>);
  public data = inject(MAT_DIALOG_DATA);
  estadoFormulario: string = "";
  //idAlfanumerico: string = "";
  public isLoading = false;
  custodios: Custodio[] = [];

  ngOnInit(): void {
    this.initializeForm();
    this.muestraComboCustodios();
    if (this.data != null ){
      this.updateForm(this.data);
      this.estadoFormulario = "Actualizar";
    } else {
      //this.generateNewIdAlfanumerico();
      this.estadoFormulario = "Agregar";
    }
  }

  initializeForm() {
    this.proveedorForm = this.fb.group({
      //idAlfanumerico: [{ value: '', disabled: true }],
      /*ruc: ['', [Validators.required, Validators.pattern(/^\d{1,11}$/)]],
      razonsocial: ['', Validators.required],
      direccionfiscal: ['', Validators.required],
      contacto: ['', Validators.required],
      telefono: ['', Validators.required],
      correo: ['', Validators.required],*/

      ruc: [this.data?.ruc || '', [Validators.required, Validators.pattern(/^\d{1,11}$/)]],
      razonsocial: [this.data?.razonsocial || '', Validators.required],
      direccionfiscal: [this.data?.direccionfiscal || '', Validators.required],
      contacto: [this.data?.contacto || '', Validators.required],
      telefono: [this.data?.telefono || '', Validators.required],
      correo: [this.data?.correo || '', Validators.required],
    /////  custodios: this.fb.array([]),
    /////  custodio: [this.data?.custodio || '', Validators.required],
      //custodio: ['', Validators.required],
    /////
      custodioid: [this.data?.custodio?.id, Validators.required],
    /////  descripcion: [this.data?.descripcion || '', Validators.required],
      //custodios: this.fb.array(this.data?.custodios?.map((especifico: any) => this.createProveedorFormGroup(especifico)) || [])
    });
  }
/*
  async generateNewIdAlfanumerico() {
    this.isLoading = true;//this.toggleLoader(true);
    this.proveedorService.getProveedores().subscribe((response: any) => {
      if (response.metadata[0].code === "00") {
        const listGrupo = response.proveedorResponse.listaproveedores;
        cons-*+t newId = listGrupo.length + 1;
        this.idAlfanumerico = `PROV${newId}`;
        this.proveedorForm.get('idAlfanumerico')?.setValue(this.idAlfanumerico);
      } else {
        console.error('Error fetching proveedores to generate ID');
        this.idAlfanumerico = 'PROV1';
        this.proveedorForm.get('idAlfanumerico')?.setValue(this.idAlfanumerico);
      }
    }, error => {
      console.error('Error fetching proveedores to generate ID', error);
      this.idAlfanumerico = 'PROV1';
      this.proveedorForm.get('idAlfanumerico')?.setValue(this.idAlfanumerico);
    }).add(() => {
      this.isLoading = false;//this.toggleLoader(false); // Detener loader al finalizar
    });
  }*/

  onSave(){
    this.isLoading = true;//this.toggleLoader(true);
    if (this.proveedorForm.invalid) return;
    let data = {
      custodioId : this.proveedorForm.get('custodioid')?.value,
      ruc: this.proveedorForm.get('ruc')?.value,
      razonsocial: this.proveedorForm.get('razonsocial')?.value.toUpperCase(),
      direccionfiscal: this.proveedorForm.get('direccionfiscal')?.value.toUpperCase(),
      contacto: this.proveedorForm.get('contacto')?.value.toUpperCase(),
      telefono: this.proveedorForm.get('telefono')?.value.toUpperCase(),
      correo: this.proveedorForm.get('correo')?.value.toLowerCase()
    }
    if (this.data != null ){
      //update registry
      this.proveedorService.updateProveedor(data, this.data.id)
              .subscribe( (data: any) =>{
                this.dialogRef.close(1);
              }, (error:any) =>{
                this.dialogRef.close(2);
                this.isLoading = false;//this.toggleLoader(false);
              }).add(() => {
                this.isLoading = false;//this.toggleLoader(false);
              });
    } else {
      //create new registry
      this.proveedorService.saveProveedor(data)
          .subscribe( (data : any) => {
            console.log(data);
            this.dialogRef.close(1);
          }, (error: any) => {
            this.dialogRef.close(2);
            this.isLoading = false;//this.toggleLoader(false);
          }).add(() => {
            this.isLoading = false;//this.toggleLoader(false);
          });
    }
  }

  onCancel(){
    this.dialogRef.close(3);
  }

  get custodiosArray(): FormArray {
    return this.proveedorForm.get('custodios') as FormArray;
  }

  addCustodio(): void {
    ///
    const proveedorGroup = this.fb.group({
      arearesponsable: ['', Validators.required]
    });////
    this.custodiosArray.push(this.createProveedor());
    //this.atributoForm.markAsTouched();
  }

  createProveedor(): FormGroup {
    return this.fb.group({
      ///atributoid: ['', Validators.required],
      arearesponsable: ['', Validators.required],
    });
  }


  removeCustodio(index: number): void {
    this.custodiosArray.removeAt(index);
    //this.atributoForm.markAsTouched();
  }


/*  updateForm(data: any){
    this.proveedorForm = this.fb.group( {
      ruc: [data.ruc, Validators.required],
      razonsocial: [data.razonsocial, Validators.required]
    });

  }*/
  updateForm(data: any) {
    //this.idAlfanumerico = `PROV${data.id}`;
    this.proveedorForm.setValue({
      //idAlfanumerico: this.idAlfanumerico,
      ruc: data.ruc,
      razonsocial: data.razonsocial,
      direccionfiscal: data.direccionfiscal,
      contacto: data.contacto,
      telefono: data.telefono,
      correo: data.correo
    });
  }

  convertirAMayusculas(event: any) {
    const input = event.target as HTMLInputElement;
    const valor = input.value.toUpperCase();
    input.value = valor;
  }

  muestraComboCustodios(): void {
    this.custodioService.getResponsables()
      .subscribe(
        (data: any) => this.custodios = data.custodioResponse.listacustodios,
        (error: any) => console.error("Error al consultar custodios", error)
      );
  }  
}
