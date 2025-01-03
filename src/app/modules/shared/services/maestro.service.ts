import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const base_url = "https://ityfo3a8cc.execute-api.eu-west-2.amazonaws.com/prod";

@Injectable({
  providedIn: 'root'
})
export class MaestroService {

  constructor(private http: HttpClient) { }
  
  /**
   * get all the responsables
   */
  getMaestros(){
    const endpoint = `${ base_url}/maestros`;
    return this.http.get(endpoint);
  }

  /**
   * save the responsable
   */
  /*saveMaestro(body: any){
    const endpoint = `${ base_url}/maestros`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };    
    //return this.http.post(endpoint, body, httpOptions);
    return this.http.post(endpoint, JSON.stringify(body), httpOptions);
  }*/

  /**
   * update responsable
   */
  /*updateMaestro(body: any, id: any){
    const endpoint = `${ base_url}/maestros/${id}`;
    return this.http.put(endpoint, body);
  }*/

  /**
   * delete responsable
   */
  /*deleteMaestro(id: any){
    const endpoint = `${ base_url}/maestros/${id}`;
    return this.http.delete(endpoint);
  }*/

  /**
   * search by modelo
   */
  /*getMaestroByModelo(modelo: any){
    const endpoint = `${ base_url}/maestros/filter/${modelo}`;
    return this.http.get(endpoint);
  }*/


  /**
   * export excel responsables
   */
  /*exportMaestro(){
    const endpoint = `${base_url}/maestros/export/excel`;
    return this.http.get(endpoint, {
      responseType: 'blob'
    });
  }*/
}
