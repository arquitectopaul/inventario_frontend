import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const base_url = "https://ityfo3a8cc.execute-api.eu-west-2.amazonaws.com/prod";

@Injectable({
  providedIn: 'root'
})
export class EspecificacionesService {

  constructor(private http: HttpClient) { }
  
  /**
   * get all the especificacioness
   */
  getEspecificaciones(){
    const endpoint = `${ base_url}/especificaciones`;
    return this.http.get(endpoint);
  }

  getAtributosEspecificaciones(custodioId: number, articuloId: number, tipoId: number, categoriaId: number): Observable<any> {
    const url = `${base_url}/especificaciones`;
    const params = { custodioId, articuloId, tipoId, categoriaId };
    return this.http.get<any>(url, { params });
  }   

  /**
   * save the especificaciones
   */
  /*saveEspecificaciones(body: any){
    const endpoint = `${ base_url}/especificaciones`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };    
    //return this.http.post(endpoint, body, httpOptions);
    return this.http.post(endpoint, JSON.stringify(body), httpOptions);
  }*/
  saveEspecificaciones(data: any): Observable<any> {
    const endpoint = `${base_url}/especificaciones`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<any>(endpoint, data, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }
  private handleError(error: HttpErrorResponse): Observable<any> {
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      console.error('Ocurrió un error:', error.error.message);
    } else {
      // El servidor devolvió un código de estado fallido.
      console.error(
        `El servidor devolvió el código de estado ${error.status}, ` +
        `con el mensaje de error: ${error.error}`);
    }
    // Devuelve un observable con un mensaje de error adecuado para el usuario
    return throwError('Algo malo ocurrió; por favor, inténtalo de nuevo más tarde.');
  }
  /*crearEspecificaciones(data: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('Error en la solicitud:', error);
    throw error;
  }  */

  /**
   * update especificaciones
   */
  updateEspecificaciones (body: any, id: any){
    const endpoint = `${ base_url}/especificaciones/${id}`;
    return this.http.put(endpoint, body);
  }

  /**
   * delete especificaciones
   */
  deleteEspecificaciones(id: any){
    const endpoint = `${ base_url}/especificaciones/${id}`;
    return this.http.delete(endpoint);
  }

  /**
   * search by modelo
   */
  getEspecificacionesByModelo(modelo: any){
    const endpoint = `${ base_url}/especificaciones/filter/${modelo}`;
    return this.http.get(endpoint);
  }


  /**
   * export excel especificacioness
   */
  exportEspecificaciones(){
    const endpoint = `${base_url}/especificaciones/export/excel`;
    return this.http.get(endpoint, {
      responseType: 'blob'
    });
  }
}
