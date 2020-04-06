import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, tap, map } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import Supplies from "../interfaces/supplies";

@Injectable({
  providedIn: 'root'
})
export class SuppliesService {

  constructor(private http: HttpClient) { }

  getSupplyByTerm(term: string): Observable<any>{
    const params = new HttpParams().set('supplyName', term);
    return this.http.get<any>(`${environment.API_END_POINT}/supplies/get-by-name`, {params});
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

}
