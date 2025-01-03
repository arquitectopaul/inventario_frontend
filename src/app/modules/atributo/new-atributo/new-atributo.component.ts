import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ArticuloService } from '../../shared/services/articulo.service';
import { AtributoService } from '../../shared/services/atributo.service';
import { CategoriaService } from '../../shared/services/categoria.service';
import { CustodioService } from '../../shared/services/custodio.service';
import { TipoBienService } from '../../shared/services/tipobien.service';
import { ParametroService } from '../../shared/services/parametro.service';

export interface Custodio{
  nombresyapellidos: string;
  id: number;
  arearesponsable: string;
}

export interface Articulo{
  descriparticulo: string;
  id: number;
  nombrearticulo: string;
}

export interface Categoria{
  descripcategoria: string;
  id: number;
  nombregrupo: string;
}

export interface TipoBien{
  descriptipo: string;
  id: number;
  nombretipo: string;
}

export interface ParametroElement {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface Parametro {
  id: number;
  nombre: string;
  descripcion: string;
}

@Component({
  selector: 'app-new-atributo',
  templateUrl: './new-atributo.component.html',
  styleUrls: ['./new-atributo.component.css']
})
export class NewAtributoComponent implements OnInit {
  public atributoForm!: FormGroup;
  private custodioService=inject(CustodioService);
  private articuloService=inject(ArticuloService);
  private categoriaService= inject(CategoriaService);
  private tipoService=inject(TipoBienService);
  private parametroService=inject(ParametroService);

  estadoFormulario: string = "";
  custodios: Custodio[] = [];
  articulos: Articulo[] = [];
  tipos: TipoBien[]=[];
  categorias: Categoria[]=[];
  //parametros: ParametroElement Parametro[];
  parametros: Parametro[]=[];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewAtributoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private atributoService: AtributoService
  ) {
    //this.parametros = data.parametros;
    /*this.atributoForm = this.fb.group({
      nombreatributo: ['', Validators.required]
    });*/
  }
  idAlfanumerico: string = "";
  public isLoading = false;

  ngOnInit(): void {
    this.muestraComboCustodios();
    this.muestraComboArticulos();
    this.muestraComboCategorias();
    this.muestraComboTipos();
    this.muestraComboParametros();
    this.initForm();
    this.initializeFormData();
    if (this.data != null) {
      this.estadoFormulario = "Actualizar";
    } else {
      this.estadoFormulario = "Agregar";
    }   
  }

  private initForm(): void {
    this.atributoForm = this.fb.group({
      id: [this.data?.id],
      custodioid: [this.data?.custodio?.id, Validators.required],
      articuloid: [this.data?.articulo?.id, Validators.required],
      categoriaid: [this.data?.categoria?.id, Validators.required],
      tipoid: [this.data?.tipo?.id, Validators.required],
      //parametroid: [this.data?.parametro?.id, Validators.required],///nuevo
      atributos: this.fb.array([]),
    });
  }
/*
  async generateNewIdAlfanumerico() {
    this.isLoading = true;//this.toggleLoader(true);
    this.atributoService.getAtributos().subscribe((response: any) => {
      if (response.metadata[0].code === "00") {
        const listArticulo = response.articuloResponse.listaarticulos;
        const newId = listArticulo.length + 1;
        this.idAlfanumerico = `ATR${newId}`;
        this.atributoForm.get('idAlfanumerico')?.setValue(this.idAlfanumerico);
      } else {
        console.error('Error fetching atributos to generate ID');
        this.idAlfanumerico = 'ATR1';
        this.atributoForm.get('idAlfanumerico')?.setValue(this.idAlfanumerico);
      }
    }, error => {
      console.error('Error fetching atributos to generate ID', error);
      this.idAlfanumerico = 'ATR1';
      this.atributoForm.get('idAlfanumerico')?.setValue(this.idAlfanumerico);
    }).add(() => {
      this.isLoading = true;//this.toggleLoader(false); // Detener loader al finalizar
    });
  }
*/
  onSave(): void {
    this.isLoading = true;//this.toggleLoader(true);
    if (this.atributoForm.valid) {
      const formData = this.atributoForm.value;

      let data = {
        //Conflicto custodioid vs custodio, graba bien
        custodioId : this.atributoForm.get('custodioid')?.value,
        articuloId    : this.atributoForm.get('articuloid')?.value,
        tipoId    : this.atributoForm.get('tipoid')?.value,  
        categoriaId    : this.atributoForm.get('categoriaid')?.value,
        //custodioId: formData.custodioid,
        //articuloId: formData.articuloid,
        atributos: formData.atributos
      }
      if (formData.id) {
        this.updateAtributo(data, formData.id);
      } else {
        this.saveAtributo(data);
        //getAtributos()
      }
    } else {
      this.markFormGroupTouched(this.atributoForm);
    }
  } 

  initializeForm(): void {
    this.atributoForm = this.fb.group({
      custodio: ['', Validators.required],
      articulo: ['', Validators.required],
      tipo: ['', Validators.required],
      categoria: ['', Validators.required],
      atributos: this.fb.array([
        this.fb.group({
          atributoid: '',
          nombreatributo: '',
        }),
      ]),      
    });
  }

  private initializeFormData(): void {
    if (this.data?.atributos) {
      this.data.atributos.forEach((atributo: any) => {
        this.atributosArray.push(this.fb.group({
          id: [atributo.id],
          atributoid: [atributo.atributoid],
          nombreatributo: [atributo.nombreatributo]
        }));
      });
    } else {
      this.addAtributo(); // Agrega un campo de atributo por defecto al iniciar
    }

    // Inicializar custodioid y articuloid si están disponibles en los datos
    if (this.data?.custodio) {
      this.atributoForm.patchValue({
        custodioid: this.data.custodio.id
      });
    }

    if (this.data?.articulo) {
      this.atributoForm.patchValue({
        //articulo: [this.data.articulo.id, Validators.required],
        articuloid: this.data.articulo.id
      });
    }

    if (this.data?.tipo) {
      this.atributoForm.patchValue({
        tipoid: this.data.tipo.id
      });
    }

    if (this.data?.categoria) {
      this.atributoForm.patchValue({
        categoriaid: this.data.categoria.id
      });
    }

    if (this.data?.parametro) {
      this.atributoForm.patchValue({
        parametroid: this.data.parametro.id
      });
    }    
  }

  get atributosArray(): FormArray {
    return this.atributoForm.get('atributos') as FormArray;
  }

  addAtributo(): void {
    ///
    const atributoGroup = this.fb.group({
      nombreatributo: ['', Validators.required]
    });////
    this.atributosArray.push(this.createAtributo());
    //this.atributoForm.markAsTouched();
  }

  removeAtributo(index: number): void {
    this.atributosArray.removeAt(index);
    //this.atributoForm.markAsTouched();
  }

  saveAtributo(data: any): void {
    this.atributoService.saveAtributo(data)
        .subscribe( (data : any) => {
          console.log(data);
          this.dialogRef.close(1);
        }, (error: any) => {
          this.dialogRef.close(2);
        }).add(() => {
          this.isLoading = true;//this.toggleLoader(false); // Detener loader al finalizar
        });
  }

  updateAtributo(data: any, id: number): void {
      this.atributoService.updateAtributo(data, this.data.id)
      .subscribe( (data: any) =>{
        this.dialogRef.close(1);
      }, (error:any) =>{
        this.dialogRef.close(2);
      }).add(() => {
        this.isLoading = true;//this.toggleLoader(false); // Detener loader al finalizar
      });      
  }

  markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  createAtributo(): FormGroup {
    return this.fb.group({
      ///atributoid: ['', Validators.required],
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

  muestraComboParametros(): void {
    this.parametroService.getParametros().subscribe(
      (data: any) => {
        this.parametros = data.parametroResponse.listaparametros;
      },
      (error: any) => {
        console.error('Error fetching parametros', error);
      }
    );
  }

  convertirAMayusculas(event: any) {
    const input = event.target as HTMLInputElement;
    const valor = input.value.toUpperCase();
    input.value = valor;
  }

  onCancel(): void {
    this.dialogRef.close(3);
  }

  updateForm(data: any){
    this.idAlfanumerico = `ATR${data.id}`;
    this.atributoForm = this.fb.group( {
      custodio: [data.custodio.id, Validators.required],
      articulo: [data.articulo.id, Validators.required],
      tipo: [data.tipo.id, Validators.required],
      categoria: [data.categoria.id, Validators.required],
      atributos: [data.atributos, Validators.required]
    })
  }

}