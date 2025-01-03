import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const base_url = "https://ityfo3a8cc.execute-api.eu-west-2.amazonaws.com/prod";

@Injectable({
  providedIn: 'root'
})
export class MarcaService {

  constructor(private http: HttpClient) { }
  
  /**
   * get all the marcas
   */
  getMarcas(){
    const endpoint = `${ base_url}/marcas`;
    return this.http.get(endpoint);
  }

  /**
   * save the marca
   */
  saveMarca(body: any){
    const endpoint = `${ base_url}/marcas`;
    return this.http.post(endpoint, body);
    /*const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    console.log(JSON.stringify(body));    
    return this.http.post(endpoint, body, httpOptions);*/
    //return this.http.post(endpoint, JSON.stringify(body), httpOptions);
  }

  updateMarca (body: any, id: any){
    const endpoint = `${ base_url}/marcas/${id}`;
    body.id = id;
    return this.http.put(endpoint, body);
  }

  deleteMarca(id: any){
    const endpoint = `${ base_url}/marcas/${id}`;
    //body.id = id;
    console.log(JSON.stringify(id)); 
    return this.http.delete(endpoint);
  }

  /**
   * search by descripcion
   */
  getMarcaByDescrip(descripcion: any){
    const endpoint = `${ base_url}/marcas/filter/${descripcion}`;
    return this.http.get(endpoint);
  }


  /**
   * export excel marcas
   */
  exportMarca(){
    const endpoint = `${base_url}/marcas/export/excel`;
    return this.http.get(endpoint, {
      responseType: 'blob'
    });
  }
}
