import { Injectable } from "@angular/core";
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
  HttpParams
} from "@angular/common/http";
import { of } from "rxjs";
import { Materia } from "../models/materia";

@Injectable({
  providedIn: "root"
})
export class MateriasSService {
  resourceUrl: string;

  constructor(private httpCliente: HttpClient) {
    this.resourceUrl = "https://pavii.ddns.net/api/Materias";
  }
  get() {
    return this.httpCliente.get(this.resourceUrl);
  }

  post(obj: Materia) {
    return this.httpCliente.post(this.resourceUrl, obj);
  }

  put(Id: number, obj: Materia) {
    return this.httpCliente.put(this.resourceUrl + Id, obj);
  }

  delete(Id) {
    return this.httpCliente.delete(this.resourceUrl + Id);
  }
}
