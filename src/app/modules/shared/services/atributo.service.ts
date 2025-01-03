import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
//import { catchError } from 'rxjs/operators';

const base_url = "https://ityfo3a8cc.execute-api.eu-west-2.amazonaws.com/prod";

@Injectable({
  providedIn: 'root'
})
export class AtributoService {

  constructor(private http: HttpClient) { }
  
  /**
   * get all the atributos
   */
  getAtributos(){
    const endpoint = `${ base_url}/atributo`;
    return this.http.get(endpoint);
  }
  /*getAtributos(): Observable<any[]> {
    const endpoint = `${base_url}/atributo`;
    return this.http.get<any[]>(endpoint);
  }*/

  getAtributoByArticuloId(articuloId: number): Observable<any> {
    const endpoint = `${ base_url}/atributo/${articuloId}`;
    return this.http.get<any>(endpoint);
  }

  /**
   * save the atributo
   */
  saveAtributo(body: any){
    const endpoint = `${ base_url}/atributo`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    console.log(JSON.stringify(body));
    return this.http.post(endpoint, body, httpOptions);
    //return this.http.post(endpoint, JSON.stringify(body), httpOptions);
  }

  /*saveAtributo(data: any): Observable<any> {
    const endpoint = `${base_url}/atributo`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<any>(endpoint, data, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }*/

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
  /*crearAtributo(data: any): Observable<any> {
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
   * update atributo
   */
  updateAtributo (body: any, id: any){
    const endpoint = `${ base_url}/atributo/${id}`;
    return this.http.put(endpoint, body);
  }

  /**
   * delete atributo
   */
  deleteAtributo(id: any){
    const endpoint = `${ base_url}/atributo/${id}`;
    return this.http.delete(endpoint);
  }

  /**
   * search by modelo
   */
  getAtributoByModelo(modelo: any){
    const endpoint = `${ base_url}/atributo/${modelo}`;
    return this.http.get(endpoint);
  }


  /**
   * export excel atributos
   */
  exportAtributo(){
    const endpoint = `${base_url}/atributo/export/excel`;
    return this.http.get(endpoint, {
      responseType: 'blob'
    });
  }
}
