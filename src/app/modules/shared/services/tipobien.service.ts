import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const base_url = "https://ityfo3a8cc.execute-api.eu-west-2.amazonaws.com/prod";

@Injectable({
  providedIn: 'root'
})
export class TipoBienService {

  constructor(private http: HttpClient) { }

  /**
   * get all tipobienes
   */
  getTipoBienes(){

    const endpoint = `${base_url}/tipobienes`;
    return this.http.get(endpoint);

  }

  /**
   * save the tipobienes
   */
  saveTipoBien(body: any) {
    const endpoint = `${base_url}/tipobienes`;
    return this.http.post(endpoint, body);
  }

  /**
   * update tipobien
   */
  updateTipoBien(body: any, id: any){
    const endpoint = `${base_url}/tipobienes/${id}`;
    return this.http.put(endpoint, body);
  }

  /**
   * update tipobien
   */
  deleteTipoBien(id: any){
    const endpoint = `${base_url}/tipobienes/${id}`;
    return this.http.delete(endpoint);
  }

  /**
   * update tipobien
   */
  getTipoBienesById(id: any){
    const endpoint = `${base_url}/tipobienes/${id}`;
    return this.http.get(endpoint);
  }


  /**
   * export excel tipobienes
   */
  exportTipoBienes(){
    const endpoint = `${base_url}/tipobienes/export/excel`;
    return this.http.get(endpoint, {
      responseType: 'blob'
    });
  }
}
