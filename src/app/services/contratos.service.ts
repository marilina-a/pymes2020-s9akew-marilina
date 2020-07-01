import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams
} from "@angular/common/http";
import { of } from "rxjs";
import { Contrato } from "../models/contrato";

@Injectable({
  providedIn: 'root'
})

export class ContratosService {
resourceUrl: string;
  constructor(private httpCliente: HttpClient) { 
     this.resourceUrl = "https://pavii.ddns.net/api/Contratos"
  }
 get(){
     return this.httpCliente.get(this.resourceUrl)
   }

  post(obj:Contrato) {
    return this.httpCliente.post(this.resourceUrl, obj);
  }
delete(Id){
    return this.httpCliente.delete(this.resourceUrl + Id);
  }
}