import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams
} from "@angular/common/http";
import { of } from "rxjs";
import { Servicio } from "../models/servicio";

@Injectable({
  providedIn: 'root'
})

export class ServiciosService {
resourceUrl: string;
  constructor(private httpCliente: HttpClient) {
     this.resourceUrl = "https://pavii.ddns.net/api/Servicios"
   }
   get(){
     return this.httpCliente.get(this.resourceUrl)
   }
   post(obj:Servicio) {
    return this.httpCliente.post(this.resourceUrl, obj);
  }
  delete(Id){
    return this.httpCliente.delete(this.resourceUrl +'/' + Id);
  }




}