import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ArticuloService } from '../../shared/services/articulo.service';
import { ActivoService } from '../../shared/services/activo.service';
import { EspecificacionesService } from '../../shared/services/especificaciones.service';
import { CategoriaService } from '../../shared/services/categoria.service';
import { CustodioService } from '../../shared/services/custodio.service';
import { TipoBienService } from '../../shared/services/tipobien.service';
import { ProveedorService } from '../../shared/services/proveedor.service';
import { AtributoService } from '../../shared/services/atributo.service';
import { MarcaService } from '../../shared/services/marca.service';
import { Subscription } from 'rxjs';

export interface Custodio{
  id: number;
  arearesponsable: string;
  nombresyapellidos: string;
}

export interface Articulo{
  id: number;
  nombrearticulo: string;
  descriparticulo: string;
}

export interface Categoria{
  id: number;
  nombregrupo: string;
  descripcategoria: string;  
}

export interface TipoBien{
  id: number;
  nombretipo: string;
  descriptipo: string;  
}

export interface Proveedor{
  id: number;
  ruc: string;
  razonsocial: string;
}

export interface Marca{
  id: number;
  nombre: string;
  descripcion: string;
}

@Component({
  selector: 'app-new-activo',
  templateUrl: './new-activo.component.html',
  styleUrls: ['./new-activo.component.css']
})
export class NewActivoComponent implements OnInit {

  private fb                = inject(FormBuilder);
  private dialogRef         = inject(MatDialogRef<NewActivoComponent>);
  public data               = inject(MAT_DIALOG_DATA);
  private activoService     = inject(ActivoService);
  private especificacionesService   = inject(EspecificacionesService);
  private atributoService   = inject(AtributoService);
  private custodioService   = inject(CustodioService);
  private articuloService   = inject(ArticuloService);
  private categoriaService  = inject(CategoriaService);
  private tipoService       = inject(TipoBienService);
  private proveedorService  = inject(ProveedorService);
  private marcaService      = inject(MarcaService);
  public activoForm!: FormGroup;
  estadoFormulario: string  = "";
  custodios     : Custodio  [] = [];
  articulos     : Articulo  [] = [];
  tipos         : TipoBien  [] = [];
  categorias    : Categoria [] = [];
  marcas        : Marca     [] = [];
  filteredMarcas: Marca     [] = [];
  proveedores   : Proveedor [] = [];
  atributos     : any       [] = [];
  private subscriptions: Subscription[] = [];

  ngOnInit(): void {
    //this.estadoFormulario = this.data ? "Actualización" : "Registro";
    this.muestraComboCustodios();
    this.muestraComboArticulos();
    this.muestraComboCategorias();
    this.muestraComboTipos();
    this.muestraComboProveedores();
    this.initForm();
    this.initializeFormData();
    this.muestraAutocompletadoMarcas();
    //this.initializeForm();//
    if (this.data != null) {
      //this.muestraComboProveedoresPorCustodio(this.getCustodioNombre());
      //this.updateForm(this.data);
      this.estadoFormulario = "Actualizar";
      //this.isEditMode = true;
    } else {
      //this.generateNewIdAlfanumerico();
      this.estadoFormulario = "Agregar";
      //this.isEditMode = false;
    }
    
    //this.estadoFormulario = this.data ? "Actualizar" : "Agregar";
    this.setupValueChanges(); 

/*
  initializeActivoForm() {
    this.activoForm = this.fb.group({
      custodioid: ['', Validators.required],
      articuloid: ['', Validators.required],
      especificaciones: this.fb.array([
        this.fb.group({
          especificoid: '',
          nombreatributo: '',
        }),
      ]),
      //especificaciones: this.fb.array([]) // Inicializa el FormArray vacío al inicio
    });
  }*/
  }
  private initForm(): void {
    this.activoForm = this.fb.group({
      id: [this.data?.id],
      /*
      proveedorid: [this.data?.proveedor?.id, Validators.required],*/
 
      custodioid: [this.data?.custodio?.id , Validators.required],
      articuloid: [this.data?.articulo?.id, Validators.required],
      categoriaid: [this.data?.categoria?.id, Validators.required],
      tipoid: [this.data?.tipo?.id, Validators.required],
      ///codinventario: [this.data?.codinventario || '', Validators.required],
      codinventario: [this.data?.codinventario || ''],
      modelo: [this.data?.modelo || '', Validators.required],
      marcaId: [this.data?.marcaId || '', Validators.required],
      nroserie: [this.data?.nroserie || '', Validators.required],
      //fechaingreso: [this.data?.fechaingreso || '', Validators.required],  
      fechaingreso: [this.data?.fechaingreso ? new Date(this.data.fechaingreso).toISOString().split('T')[0] : '', Validators.required],
    
      importe: [this.data?.importe || '', Validators.required],
      moneda: [this.data?.moneda || 'S/', Validators.required],
      
      proveedorid: [this.data?.proveedor?.id || '', Validators.required],
      /////proveedorid: [this.data?.proveedor?.id, Validators.required],
      ///proveedorid: [this.data?.proveedor?.id || ''],  // Permitir que sea opcional
      descripcion: [this.data?.descripcion || '', Validators.required],
                ///      atributoid: [this.data?.atributo?.id, Validators.required], 
                ///     atributo: ['', Validators.required],  // Añade este campo para el atributo
     
      especificaciones: this.fb.array(this.data?.especificaciones?.map((activo: any) => this.createActivoFormGroup(activo)) || [])
    });
    this.activoForm.get('marcaId')?.valueChanges.subscribe(value => {
      this.filterMarcas(value);
    });
    this.activoForm.get('proveedorId')?.valueChanges.subscribe(value => {
      this.filterProveedores(value);
    });    
  }
  private filterProveedoresz(value: string): Proveedor[] {
    const filterValue = value.toUpperCase();
    return this.proveedores.filter(proveedor => proveedor.razonsocial.toUpperCase().includes(filterValue));
  }
  private filterProveedores(value: string): void {
    // Verificar si el valor es un string antes de intentar convertirlo
    if (typeof value === 'string') {
      const filterValue = value.toUpperCase();
      this.proveedores = this.proveedores.filter(proveedor =>
        proveedor.razonsocial.toUpperCase().includes(filterValue)
      );
    }
  }  

private initializeFormData(): void {
  if (this.data) {
    this.activoForm.patchValue({
      custodioid: this.data.custodio.id,
      articuloid: this.data.articulo.id,
      categoriaid: this.data.categoria.id,
      tipoid: this.data.tipo.id,
      proveedorid: this.data.proveedorid.id,
      ///proveedorId: this.data.proveedorId || ''///
    });
    // Maneja específicos si los tienes en data
    if (this.data.especificaciones) {
      const especificacionesFormArray = this.activoForm.get('especificaciones') as FormArray;
      this.data.especificaciones.forEach((especifico: any) => {
        especificacionesFormArray.push(this.createActivoFormGroup(especifico));
      });
      this.updateAtributos();
    }
  ///} else {
  ///  this.addEspecifico(); // Agrega un campo de especifico por defecto al iniciar
  }
}
/*
  private initializeFormDatOK(): void {
    if (this.data?.especificaciones) {
      this.data.especificaciones.forEach((especifico: any) => {
        this.especificacionesArray.push(this.fb.group({
          id: [especifico.id],
          especificoid: [especifico.especificoid],
          nombreatributo: [especifico.nombreatributo]
        }));
      });
    } else {
      this.addEspecifico(); // Agrega un campo de especifico por defecto al iniciar
    }

  }*/

  createActivoFormGroup(especifico: any = {}): FormGroup {
    return this.fb.group({
      nombreatributo: [especifico.nombreatributo || '', Validators.required],
      descripcionatributo: [especifico.descripcionatributo || '', Validators.required]
    });
  }

  get especificacionesArray(): FormArray {
    return this.activoForm.get('especificaciones') as FormArray;
  }

  onArticuloChange(articuloId: number) {
    this.atributoService.getAtributoByArticuloId(articuloId).subscribe(data => {
      const atributo = data.atributoResponse.listaatributos[0];
      this.activoForm.patchValue({
        articuloid: articuloId,
        custodioid: atributo.custodio.id,
        categoriaid: atributo.categoria.id,
        tipoid: atributo.tipo.id,
        proveedorid: atributo.custodio.proveedores[0].id
      });
      this.proveedores = atributo.custodio.proveedores;
      /*this.cargarProveedoresPorCustodio(atributo.custodio.id); de esta forma llama al endpoint de provedoresxid*/
      this.updateAtributos();
    });
    
  }

/*
  onArticuloChange1(articuloId: number): void {
    console.log("onArticuloChange called with:", articuloId);
    if (this.isEditMode) {
      this.editArticulo(articuloId);
    } else {    
      this.atributoService.getAtributoByArticuloId(articuloId).subscribe(data => {
        const atributo = data.atributoResponse.listaatributos[0];
        this.activoForm.patchValue({
          articuloid: articuloId,
          custodioid: atributo.custodio.id,
          categoriaid: atributo.categoria.id,
          tipoid: atributo.tipo.id,
          proveedorid: atributo.custodio.proveedores[0].id
        });
        this.proveedores = atributo.custodio.proveedores;
        /*if (atributo.custodio.nombre) {
          this.getProveedoresPorCustodio(atributo.custodio.nombre);
        }* /
        ///this.muestraComboProveedoresPorCustodio0("TEC");
        /*this.cargarProveedoresPorCustodio(atributo.custodio.id); de esta forma llama al endpoint de provedoresxid* /
        this.updateAtributos();
      }); 
    }
  }*/
/*
  editArticulo(articuloId: number): void {
    this.isEditMode = true; // Indica que estamos en modo edición
    console.log("================================================");
    this.atributoService.getAtributoByArticuloId(articuloId).subscribe(data => {
      const atributo = data.atributoResponse.listaatributos[0];
      this.activoForm.patchValue({
        articuloid: articuloId,
        custodioid: atributo.custodio.id,
        categoriaid: atributo.categoria.id,
        tipoid: atributo.tipo.id,
        proveedorid: atributo.custodio.proveedores[0].id
      });
      this.getProveedoresPorCustodio(atributo.custodio.nombre); // Llama al método para cargar proveedores filtrados
    });
  }*/

  /* getProveedoresPorCustodio(custodioNombre: string): void {
    this.activoService.getProveedoresPorCustodio(custodioNombre).subscribe(
      (data: any[]) => {
        this.proveedores = data;
        // Opcional: Si deseas seleccionar un proveedor por defecto
        // this.myForm.get('proveedorid')?.setValue(this.proveedores[0]?.id || '');
      },
      (error: any) => {
        console.error('Error fetching proveedores', error);
      }
    );
  } */ 
  
    //PONE LOS VALORES
  private setupValueChanges(): void {
    // Desuscribirse de las suscripciones anteriores
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];

    // Función auxiliar para suscribirse y agregar a las suscripciones
    const subscribeToControl = (controlName: string) => {
      const control = this.activoForm.get(controlName);
      if (control) {
        const subscription = control.valueChanges.subscribe(() => this.updateAtributos());
        this.subscriptions.push(subscription);
      }
    };

    // Suscribirse a los cambios de valor
    subscribeToControl('custodioid');
    subscribeToControl('articuloid');
    subscribeToControl('tipoid');
    subscribeToControl('categoriaid');
  }

  updateAtributos(): void {
    const custodioId = this.activoForm.get('custodioid')?.value;
    const articuloId = this.activoForm.get('articuloid')?.value;
    const tipoId = this.activoForm.get('tipoid')?.value;
    const categoriaId = this.activoForm.get('categoriaid')?.value;

    /*const especificacionesFormArray = this.activoForm.get('especificaciones') as FormArray;
    especificacionesFormArray.controls.forEach((control: AbstractControl, index: number) => {
      control.get('atributo')?.setValue(this.atributos[index]?.atributo);
      //control.get('nombreatributo')?.setValue(this.atributos[index]?.nombreatributo);
    });*/

    // Verificar que todos los campos tengan valores antes de llamar al servicio
    if (custodioId !== null && articuloId !== null && tipoId !== null && categoriaId !== null) {
      //ESTE ES EL PROGRAMA QUE CONTINUA LUEGO DE TRAER LOS VALORES
      this.especificacionesService.getAtributosEspecificaciones(custodioId, articuloId, tipoId, categoriaId).subscribe(
        (data: any) => {
          if (data && data.atributosResponse && data.atributosResponse.listaatributoss) {
            this.atributos = data.atributosResponse.listaatributoss; // Asignar los atributos obtenidos del servicio
            this.populateEspecificaciones();
          } else {
            this.atributos = []; // Si no hay atributos devueltos, asignar un array vacío
          }
        },
        (error: any) => {
          console.error('Error fetching atributos', error);
          this.atributos = []; // Manejar el error asignando un array vacío
        }
      );
    } else {
      this.atributos = []; // Si alguno de los campos es null, asignar un array vacío (opcional, depende de tu lógica)
    }

    // Resetear el campo 'atributo' después de cada actualización de atributos
    ///this.activoForm.get('atributo')?.setValue('');
  }

  populateEspecificaciones(): void {
    const especificacionesFormArray = this.especificacionesArray;
    especificacionesFormArray.clear();

    this.atributos.forEach(atributo => {
      especificacionesFormArray.push(this.fb.group({
        nombreatributo: new FormControl(atributo.nombreatributo), // Agregar el valor del atributo al control
        descripcionatributo: new FormControl(atributo.descripcionatributo)
        ///descripcionatributo: [''] // Inicializar nombreatributo como vacío o con un valor predeterminado si es necesario
      }));
    });
  }

  onSave(): void {
    if (this.activoForm.valid) {
      const formData = this.activoForm.value;
      let fechaingreso = this.activoForm.get('fechaingreso')?.value;
      if (fechaingreso) {
        fechaingreso = fechaingreso.toISOString().substring(0, 10);
      } else {
        fechaingreso = null;
      }
      let data = {
        //Conflicto custodioid vs custodio, graba bien
        custodioId      : this.activoForm.get('custodioid')?.value,
        articuloId      : this.activoForm.get('articuloid')?.value,
        tipoId          : this.activoForm.get('tipoid')?.value,  
        categoriaId     : this.activoForm.get('categoriaid')?.value,
        codinventario   : this.activoForm.get('codinventario')?.value,
        modelo          : this.activoForm.get('modelo')?.value,
        marcaId         : this.activoForm.value.marcaId,
        nroserie        : this.activoForm.get('nroserie')?.value,
        fechaingreso    : fechaingreso,
        fechaingresostr : fechaingreso,
        //fechaingreso  : this.activoForm.get('fechaingreso')?.value,
        importe         : this.activoForm.get('importe')?.value,//numericValue,
        moneda          : this.activoForm.get('moneda')?.value, 
        descripcion     : this.activoForm.get('descripcion')?.value,
        ///custodioId: formData.custodioid,
        ///articuloId: formData.articuloid,
        /////
/////        proveedorId   : this.activoForm.get('proveedorid')?.value,
        ///proveedorId   : this.activoForm.value.proveedorId, 
        especificaciones: formData.especificaciones
      };
      console.log(formData);
      if (formData.id) {
        this.updateEspecifico(data, formData.id);
      } else {
        this.saveEspecifico(data);
      }
    } else {
      this.markFormGroupTouched(this.activoForm);
    }
  }

  saveEspecifico(data: any): void {
    this.activoService.saveActivo(data)
      .subscribe(
        () => this.dialogRef.close(1), // Éxito
        () => this.dialogRef.close(2) // Error
      );
  }

  updateEspecifico(data: any, id: number): void {
    this.activoService.updateActivo(data, data.id)
      .subscribe(
        () => this.dialogRef.close(1), // Éxito
        () => this.dialogRef.close(2) // Error
      );
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  createEspecificaciones(): FormGroup {
    return this.fb.group({
      ///especificoid: ['', Validators.required],
      nombreatributo: ['', Validators.required],
    });
  }

  muestraComboCustodios(): void {
    this.custodioService.getResponsables()
      .subscribe(
        (data: any) => this.custodios = data.custodioResponse.listacustodios,
        (error: any) => console.error("Error al consultar custodios", error)
      );
  }

  muestraComboArticulos(): void {
    this.articuloService.getArticulos()
      .subscribe(
        (data: any) => this.articulos = data.articuloResponse.listaarticulos,
        (error: any) => console.error("Error al consultar artículos", error)
      );
  }

  muestraComboCategorias(): void {
    this.categoriaService.getGrupos().subscribe(
      (data: any) => {
        this.categorias = data.categoriaResponse.listacategorias;
      },
      (error: any) => {
        console.error('Error fetching categorias', error);
      }
    );
  }

  muestraComboTipos(): void {
    this.tipoService.getTipoBienes().subscribe(
      (data: any) => {
        this.tipos = data.tipoResponse.listatipos;
      },
      (error: any) => {
        console.error('Error fetching tipos', error);
      }
    );
  }

  muestraAutocompletadoMarcas(): void {
      this.marcaService.getMarcas().subscribe(
        (data: any) => {
          this.marcas = data.marcaResponse.listamarcas;
          console.log(this.marcas);
          this.filteredMarcas = this.marcas;
          console.log(this.filteredMarcas);
        },
        (error: any) => console.error('Error al obtener marcas:', error)
      )
  }

  filterMarcas(value: string): void {
    const filterValue = value.toUpperCase();
    this.filteredMarcas = this.marcas.filter(marca =>
      marca.nombre.toUpperCase().includes(filterValue)
    );
  }

  muestraComboProveedores(): void {
    this.proveedorService.getProveedores().subscribe(
      (data: any) => {
        this.proveedores = data.proveedorResponse.listaproveedores;
      },
      (error: any) => {
        console.error('Error fetching proveedores', error);
      }
    );
  }  

  /*muestraComboProveedoresPorCustodio0( termino: string){
    this.proveedorService.getProveedorById(termino).subscribe(
      (data: any) => {
        this.proveedores = data.proveedorResponse.listaproveedores;
      },
      (error: any) => {
        console.error('Error fetching proveedores', error);
      }
    );
  }*/

  convertirAMayusculas(event: any) {
    const input = event.target as HTMLInputElement;
    const valor = input.value.toUpperCase();
    input.value = valor;
  }

  onCancel(): void {
    this.dialogRef.close(3);
  }

  updateForm(data: any){
    this.activoForm = this.fb.group( {
      custodio: [data.custodio.id, Validators.required],
      articulo: [data.articulo.id, Validators.required],
      tipo: [data.tipo.id, Validators.required],
      categoria: [data.categoria.id, Validators.required],
      especificaciones: [data.especificaciones, Validators.required]
    })
  }

  getTipoNombre() {
    const tipoId = this.activoForm.get('tipoid')?.value;
    const tipo = this.tipos.find(t => t.id === tipoId);
    return tipo ? tipo.nombretipo : '';
  }
  
  getCustodioNombre() {
    const custodioId = this.activoForm.get('custodioid')?.value;
    const custodio = this.custodios.find(c => c.id === custodioId);
    return custodio ? custodio.arearesponsable : '';
  }
  
  getCategoriaNombre() {
    const categoriaId = this.activoForm.get('categoriaid')?.value;
    const categoria = this.categorias.find(c => c.id === categoriaId);
    return categoria ? categoria.nombregrupo : '';
  }
  ngOnDestroy(): void {
    // Desuscribirse de todas las suscripciones para evitar memory leaks
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

}