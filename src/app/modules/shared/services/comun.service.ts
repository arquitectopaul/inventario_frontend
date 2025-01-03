import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

const base_url = "https://ityfo3a8cc.execute-api.eu-west-2.amazonaws.com/prod";

@Injectable({
  providedIn: 'root'
})
export class ComunService {

  constructor(private http: HttpClient) { }
  
  /**
   * get all the comunes
   */
  getComunes(){
    const endpoint = `${ base_url}/comunes`;
    return this.http.get(endpoint);
  }

  /**
   * save the comun
   */
  saveComun(body: any){
    const endpoint = `${ base_url}/comunes`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };    
    return this.http.post(endpoint, body, httpOptions);
    //return this.http.post(endpoint, JSON.stringify(body), httpOptions);
  }

  /**
   * update comun
   */
  updateComun (body: any, id: any){
    const endpoint = `${ base_url}/comunes/${id}`;
    return this.http.put(endpoint, body);
  }

  /**
   * delete comun
   */
  deleteComun(id: any){
    const endpoint = `${ base_url}/comunes/${id}`;
    return this.http.delete(endpoint);
  }

  /**
   * search by descripcomun
   */
  getComunByDescrip(descripcomun: any){
    const endpoint = `${ base_url}/comunes/filter/${descripcomun}`;
    return this.http.get(endpoint);
  }


  /**
   * export excel comunes
   */
  exportComun(){
    const endpoint = `${base_url}/comunes/export/excel`;
    return this.http.get(endpoint, {
      responseType: 'blob'
    });
  }
}
