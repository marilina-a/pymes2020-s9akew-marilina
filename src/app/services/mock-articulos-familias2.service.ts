import { Injectable } from '@angular/core';
import { of } from "rxjs";
import { ArticuloFamilia2, ArticulosFamilias } from "../models/articulo-familia2";
 
@Injectable({
  providedIn: 'root'
})
export class MockArticulosFamilias2Service {
  constructor() {}
  get(Nombre: string, Activo: boolean, pagina: number): any {
    var Lista = ArticulosFamilias.filter(
      item =>
        // Nombre == null  chequea por null y undefined
        // Nombre === null  chequea solo por null
        (Nombre == null ||
          Nombre == "" ||
          item.Nombre.toUpperCase().includes(Nombre.toUpperCase())) &&
        (Activo == null || item.Activo == Activo)
    );
    // paginar con slice
    var RegistrosTotal = Lista.length;
    var RegistroDesde = (pagina - 1) * 10;
    Lista = Lista.slice(RegistroDesde, RegistroDesde + 10);
    return of({ Lista: Lista, RegistrosTotal: RegistrosTotal });
  }
  // no usamos get con parametros porque javascript no soporta sobrecarga de metodos!
  getById(Id: number) {
    var items: ArticuloFamilia2 = ArticulosFamilias.filter(x => x.IdArticuloFamilia === Id)[0];
    return of(items);
  }

  post(obj: ArticuloFamilia2) {
    obj.IdArticuloFamilia = new Date().getTime();
    
    obj.IdArticuloFamilia = +obj.IdArticuloFamilia;   // INVENTO
 
    ArticulosFamilias.push(obj);
    return of(obj);
  }

  put(Id: number, obj: ArticuloFamilia2) {
    var indice;
    var items = ArticulosFamilias.filter(function(item, index) {
      if (item.IdArticuloFamilia === Id) {
        indice = index;
      }
    });
    ArticulosFamilias[indice] = obj;
    return of(obj);
  }

  delete(Id: number) {
    var items = ArticulosFamilias.filter(x => x.IdArticuloFamilia === Id);
    items[0].Activo = !items[0].Activo;
    return of(items[0]);
  }
}
