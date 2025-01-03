import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const base_url = "https://ityfo3a8cc.execute-api.eu-west-2.amazonaws.com/prod";

@Injectable({
  providedIn: 'root'
})
export class CustodioService {

  constructor(private http: HttpClient) { }

  /**
   * get all responsables
   */
  getResponsables(){
    const endpoint = `${base_url}/custodios`;
    return this.http.get(endpoint);
  }

  /**
   * save the responsables
   */
  saveResponsable(body: any) {
    const endpoint = `${base_url}/custodios`;
    return this.http.post(endpoint, body);
  }

  /**
   * update responsable
   */
  updateResponsable(body: any, id: any){
    const endpoint = `${base_url}/custodios/${id}`;
    return this.http.put(endpoint, body);
  }

  /**
   * update responsables
   */
  deleteResponsable(id: any){
    const endpoint = `${base_url}/custodios/${id}`;
    return this.http.delete(endpoint);
  }

  /**
   * update responsable
   */
  getResponsableById(id: any){
    const endpoint = `${base_url}/custodios/${id}`;
    return this.http.get(endpoint);
  }


  /**
   * export excel responsables
   */
  exportResponsables(){
    const endpoint = `${base_url}/custodios/export/excel`;
    return this.http.get(endpoint, {
      responseType: 'blob'
    });
  }
}
