import { Component, inject, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { ConfirmComponent } from '../../shared/components/confirm/confirm.component';
import { ActivoService } from '../../shared/services/activo.service';
import { CustodioService } from '../../shared/services/custodio.service';
import { UtilService } from '../../shared/services/util.service';
import { NewActivoComponent } from '../new-activo/new-activo.component';
import { ProveedorService } from '../../shared/services/proveedor.service';
import { formatDate } from '@angular/common';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
/*npm install xlsx file-saver --save
npm i --save-dev @types/file-saver
*/
export interface Custodio{
  id: number;
  arearesponsable: string;
  nombresyapellidos: string;
}

export interface Proveedor{
  id: number;
  ruc: string;
  razonsocial: string;
}

@Component({
  selector: 'app-activo',
  templateUrl: './activo.component.html',
  styleUrls: ['./activo.component.css']
})
export class ActivoComponent implements OnInit {
  isLoading = false;
  isAdmin: any;
  especificaciones: any[] = [];
  ///activoForm: FormGroup;
  public custodios: Custodio[]=[];
  public proveedores: Proveedor[]=[];
  //public myFormGroup!: FormGroup;
  //myFormGroup: FormGroup;
  //private formBuilder = inject(FormBuilder);///
  //private fb = inject(FormBuilder);
  private activoService = inject(ActivoService);
  private util = inject(UtilService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private custodioService=inject(CustodioService);
  private proveedorService=inject(ProveedorService);
  /*
  constructor(
    private fb: FormBuilder,
    private especificacioneservice: Especificacioneservice,
    private util: UtilService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.activoForm = this.fb.group({
      especificaciones: new FormControl(''),
      custodio: [''],
      articulo: [''],      
    });
  }*/

  ngOnInit(): void {
    /*this.activoForm = this.fb.group({
      custodio: [''],
      articulo: [''],
    });*/
    this.isAdmin = this.util.isAdmin();
    this.muestraTabla();
    this.muestraComboCustodio();
    this.muestraComboProveedores();
  }

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('table') table!: ElementRef;

  @ViewChild('custodioSelect') custodioSelect!: ElementRef;
  @ViewChild('inputCodinventario') inputCodinventario!: ElementRef;
  @ViewChild('inputModelo') inputModelo!: ElementRef;
  @ViewChild('inputMarca') inputMarca!: ElementRef;
  @ViewChild('nroserie') nroserie!: ElementRef;
  @ViewChild('fechaingresodesde') fechaingresodesde!: ElementRef;
  @ViewChild('fechaingresohasta') fechaingresohasta!: ElementRef;

  displayedColumns: string[] = ['id', 'custodio', 
    'proveedor', 
    'categoria', 'articulo', 'codinventario', 
    'modelo', 'marca', 'nroserie', 
    'fechaingresostr', 
    'moneda', 'importe', 'especificaciones', 'actions'];
    
  dataSource = new MatTableDataSource<any>();

  ngAfterViewInit(): void {
    // Aquí puedes verificar si el ViewChild 'table' está disponible
    console.log('ViewChild table:', this.table);
  }

  muestraTabla() {
    this.isLoading = true;
    this.activoService.getActivos()
      .subscribe(
        (data: any) => {
          console.log("respuesta de activos: ", data);
          this.processActivoResponse(data);
          this.isLoading = false;
        },
        (error: any) => {
          console.log("error en activos: ", error);
          this.isLoading = false;
        }
      );
  }

  processActivoResponse(resp: any){
    const dateActivo: ActivoElement[] = [];
     if( resp.metadata[0].code == "00"){
       let listCActivo = resp.activoResponse.listaactivos;
       listCActivo.forEach((element: ActivoElement) => {
         ///element.categoria = element.categoria.name;
         //element.picture = 'data:image/jpeg;base64,'+element.picture;
         dateActivo.push(element);
       });
       //set the datasource
       this.dataSource = new MatTableDataSource<ActivoElement>(dateActivo);
       this.dataSource.paginator = this.paginator;
     }
  }

/*
  processEspecificoResponseSB(resp: any) {
    if (resp.metadata[0].code == "00") {
      const dataEspecifico = resp.especificoResponse.listaespecificaciones.map((element: any) => ({
        id: element.id,
        custodio: element.custodio.areacustodio,
        articulo: element.articulo.nombrearticulo,
        especificaciones: element.especificaciones.map((attr: any) => ({
          id: attr.id,
          nombreatributo: attr.nombreatributo
        }))
      }));

      this.especificaciones = dataEspecifico;
      this.dataSource.data = dataEspecifico;
      this.dataSource.paginator = this.paginator;
    }
  }*/

  openActivoDialog(): void {
    const dialogRef = this.dialog.open(NewActivoComponent, {
      width: '900px'
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 1) {
        this.openSnackBar("Activo agregado", "Éxito");
        this.muestraTabla();
      } else if (result === 2) {
        //this.openSnackBar("Se produjo un error al guardar activo", "Error");
        this.openSnackBar("Activo agregado", "Éxito");
        this.muestraTabla();        
      }
    });
  }

  edit(id: number, custodio: any, articulo: any, tipo: any, categoria:any, 
    codinventario:string, 
    modelo:string, 
    //marca:string, 
    marcaId: number,
    nroserie:string, 
    fechaingreso:Date, moneda: string, importe:number, 
    //proveedor: any,
    proveedorId: number, // Cambiado para recibir el ID del proveedor
    especificaciones: any, descripcion: string): void {
    const dialogRef = this.dialog.open(NewActivoComponent, {
      width: '900px',
      data: { 
        id: id, 
        custodio: custodio, 
        articulo: articulo,
        tipo: tipo, 
        categoria:categoria,
        codinventario: codinventario, 
        modelo: modelo, 
        marcaId: marcaId, 
        nroserie: nroserie, 
        fechaingreso: fechaingreso, 
        moneda: moneda, 
        importe: importe,     
        proveedorId: proveedorId,
        especificaciones: especificaciones,
      descripcion: descripcion }
    });
  
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result === 1) {
        this.openSnackBar("Activo editado", "Éxito");
        this.muestraTabla();
      } else if (result === 2) {
        this.openSnackBar("Se produjo un error al editar activo", "Error");
      }
    });
  }
  
  openSnackBar(message: string, action: string): MatSnackBarRef<SimpleSnackBar> {
    return this.snackBar.open(message, action, {
      duration: 2000
    });
  }
  /*
  edit(id: number, custodio: any, articulo: any, especificaciones: any) {
    const dialogRef = this.dialog.open(NewEspecificoComponent, {
      width: '450px',
      data: { id: id, custodio: custodio, articulo: articulo, especificaciones: especificaciones }
    });

    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 1) {
        this.openSnackBar("Especifico editado", "Éxito");
        this.getEspecificoMaestro();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al editar especifico", "Error");
      }
    });
  }*/

  delete(id: any) {
    const dialogRef = this.dialog.open(ConfirmComponent, {
      width: '450px',
      data: { id: id, module: "activo" }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result == 1) {
        this.openSnackBar("Activo eliminado", "Exito");
        this.muestraTabla();
      } else if (result == 2) {
        this.openSnackBar("Se produjo un error al eliminar activo", "Error");
      }
    });
  }

  /*buscar(modelo: any) {
    if (modelo.length === 0) {
      return this.muestraTabla();
    }

    this.activoService.getActivoByModelo(modelo)
      .subscribe(
        (resp: any) => {
          this.processActivoResponse(resp);
        },
        (error: any) => {
          console.error("Error al buscar activo por modelo", error);
        }
      );
  }*/

      limpiarCampos() {
        //this.loading = true;
        this.custodioSelect.nativeElement.value = null;
        this.inputCodinventario.nativeElement.value = '';
        this.inputModelo.nativeElement.value = '';
        this.inputMarca.nativeElement.value = '';
        this.nroserie.nativeElement.value = '';
        this.fechaingresodesde.nativeElement.value = '';
        this.fechaingresohasta.nativeElement.value = '';
        this.muestraTabla();
        /*setTimeout(() => {
          // Finaliza la carga después de la operación (ejemplo)
          this.loading = false;
        }, 1000); */
      }
    

      buscar(
        custodioId: string, 
        codinventario: string, 
        modelo: string, 
        marca: string, 
        nroserie: string,
        fechaingresoDesde: string, 
        fechaingresoHasta: string,
        proveedorId: string
      ) {
        this.isLoading = true;
      
        // Validar y limpiar los valores de los parámetros
        ///responsable = responsable ? responsable.trim() : '';
        ///proveedor = proveedor ? proveedor.trim() : '';
        codinventario = codinventario ? codinventario.trim() : '';
        modelo = modelo ? modelo.trim() : '';
        marca = marca ? marca.trim() : '';
        nroserie = nroserie ? nroserie.trim() : '';
      
        // Si todos los campos están vacíos, recuperar todos los activos
        /*if (!responsable && !proveedor && !codinventario && !modelo && !marca && !nroserie && !fechaingresoDesde && !fechaingresoHasta) {
          return this.getActivos();
        }*/
      
        let fechaDesdeFormatted: string | null = null;
        let fechaHastaFormatted: string | null = null;
      
        // Formatear fechas si están presentes
        if (fechaingresoDesde) {
          const fechaDesdeDate = new Date(fechaingresoDesde);
          if (!isNaN(fechaDesdeDate.getTime())) {
            fechaDesdeFormatted = formatDate(fechaDesdeDate, 'yyyy-MM-dd', 'en-US');
          }
        }
        if (fechaingresoHasta) {
          const fechaHastaDate = new Date(fechaingresoHasta);
          if (!isNaN(fechaHastaDate.getTime())) {
            fechaHastaFormatted = formatDate(fechaHastaDate, 'yyyy-MM-dd', 'en-US');
          }
        }
      
        // Llamar al servicio para realizar la búsqueda
        this.activoService.getActivoBusqueda( custodioId, codinventario, modelo, marca, nroserie, fechaingresoDesde, fechaingresoHasta, proveedorId)
          .subscribe((resp: any) => {
            this.processActivoResponse(resp);
            console.log(resp);
            this.isLoading = false;
          }, error => {
            // Manejar el error
            console.error(error);
            this.isLoading = false;
          }); 
          /*setTimeout(() => {
            // Finaliza la carga después de la operación (ejemplo)
            this.loading = false;
          }, 2000);*/  
      }

  /*exportExcel() {
    this.activoService.exportActivo()
      .subscribe(
        (data: any) => {
          let file = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          let fileUrl = URL.createObjectURL(file);
          var anchor = document.createElement("a");
          anchor.download = "especificaciones.xlsx";
          anchor.href = fileUrl;
          anchor.click();
          this.openSnackBar("Archivo exportado correctamente", "Exitosa");
        },
        (error: any) => {
          this.openSnackBar("No se pudo exportar el archivo", "Error");
        }
      );
  }*/

  /*onEspecificoChange(newEspecifico: number, element: any) {
    // Implementar servicio para actualizar el especifico en el backend si es necesario
  }*/

  exportExcel(): void {
    this.isLoading = true;
    this.activoService.exportActivo()
      .subscribe(
        (data: any) => {
          // Crear un Blob a partir de los datos recibidos
          const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          
          // Crear una URL para el Blob y generar un enlace de descarga
          const fileUrl = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = fileUrl;
          a.download = 'activos.xlsx';
          document.body.appendChild(a);
          a.click();
          
          // Limpiar y liberar recursos
          document.body.removeChild(a);
          URL.revokeObjectURL(fileUrl);
          
          // Mostrar mensaje de éxito
          this.openSnackBar('Archivo exportado correctamente', 'Éxito');
          this.isLoading = false;
        },
        (error: any) => {
          // Mostrar mensaje de error en caso de falla
          console.error('Error al exportar activos', error);
          this.openSnackBar('No se pudo exportar el archivo', 'Error');
          this.isLoading = false;
        }
      );
    }
/*
    exportExcel(): void {
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      this.saveAsExcelFile(excelBuffer, 'activos');
    }
  
    private saveAsExcelFile(buffer: any, fileName: string): void {
      const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(data, fileName + '_export_' + new Date().getTime() + '.xlsx');
    }*/

  exportExcelz(): void {
    // Verifica que this.table y this.table.nativeElement existan y no sean undefined
    if (this.table && this.table.nativeElement) {
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(this.table.nativeElement);
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');
      XLSX.writeFile(wb, 'activos.xlsx');
    } else {
      console.error('Elemento table no encontrado o no accesible.');
    }
  }
  
  
    private saveAsExcelFile(buffer: any, fileName: string): void {
      const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(data, fileName + '_export_' + new Date().getTime() + '.xlsx');
    }    
      

    muestraComboCustodio(){
      this.custodioService.getResponsables()
          .subscribe( (data: any) =>{
            this.custodios = data.custodioResponse.listacustodios;
          }, (error: any) =>{
            console.log("error al consultar custodios");
          })
    }    

    muestraComboProveedores(){
      this.proveedorService.getProveedores()
        .subscribe((data: any)=>{
          this.proveedores = data.proveedorResponse.listaproveedores;
        }, (error: any)=>{
          console.log("error al consultar proveedores");
        })
    }

    convertirAMayusculas(event: any) {
      const input = event.target as HTMLInputElement;
      const valor = input.value.toUpperCase();
      input.value = valor;
    }
  
}
export interface ActivoElement {
  id: number;
  custodio: any;
  articulo: any;
  tipo: any;
  categoria: any;
  proveedor:any,
  proveedorId: number,
  codinventario: string,
  modelo: string;
  marcaId: number;
  marca: string;
  nroserie: string;
  fechaingresostr: string;
  fechaingreso: Date;
  importe: number;  
  moneda: string;  
  especificaciones: any;
  descripcion: string;
  }
