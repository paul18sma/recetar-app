import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import Supplies from "../interfaces/supplies";

@Injectable({
  providedIn: 'root'
})
export class SuppliesService {

  constructor(private http: HttpClient) { }

  getSupplyByTerm(term: string): Observable<Supplies[]>{
    const params = new HttpParams().set('supplyName', term);
    return this.http.get<Supplies[]>(`${environment.API_END_POINT}/supplies/get-by-name`, {params});
  }


}
