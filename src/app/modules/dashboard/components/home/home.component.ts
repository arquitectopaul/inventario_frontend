import { Component, inject, OnInit } from '@angular/core';
import { Chart } from 'chart.js';
import { ActivoElement } from 'src/app/modules/activo/activo/activo.component';
import { ActivoService } from 'src/app/modules/shared/services/activo.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  chartBar:any;
  chartdoughnut: any;
  private activoService = inject(ActivoService);

  ngOnInit(): void {
    this.getActivos();
  }

  getActivos(){
    this.activoService.getActivos()
        .subscribe( (data:any) => {
          console.log("respuesta de activos: ", data);
          this.processActivoResponse(data);
        }, (error: any) => {
          console.log("error en activos: ", error);
        }) 
  }

  processActivoResponse(resp: any){
    
    const nameActivo: String [] = [];
    //const importe: number [] = [];
    const importe: String [] = [];

     if( resp.metadata[0].code == "00"){
       let listCActivo = resp.activoResponse.listaactivos;

       listCActivo.forEach((element: ActivoElement) => {
         
           nameActivo.push(element.custodio.arearesponsable);
           importe.push(element.articulo.nombrearticulo);
       });

       //nuestro gráfico de barras
       this.chartBar = new Chart('canvas-bar', {
         type: 'bar',
         data: {
           labels: nameActivo,
           datasets: [
             { label: 'Activos', data: importe}
           ]
         }
       });

       //nuestro gráfico de doughnut
       this.chartdoughnut = new Chart('canvas-doughnut', {
        type: 'doughnut',
        data: {
          labels: nameActivo,
          datasets: [
            { label: 'Activos', data: importe}
          ]
        }
      });

       
     }
  }

}
