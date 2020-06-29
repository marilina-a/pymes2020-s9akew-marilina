import { Component, OnInit } from "@angular/core";
import { Articulo, Articulos } from "../../models/articulo";
import { ArticuloFamilia, ArticulosFamilias } from "../../models/articulo-familia";
import { MockArticulosService } from "../../services/mock-articulos.service";
import { MockArticulosFamiliasService } from "../../services/mock-articulos-familias.service";
import { ModalDialogService } from "../../services/modal-dialog.service";

// NUEVO
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-articulos",
  templateUrl: "./articulos.component.html",
  styleUrls: ["./articulos.component.css"]
})
export class ArticulosComponent implements OnInit {
  Titulo = "Articulos";
  TituloAccionABMC = {
    A: "(Agregar)",
    B: "(Eliminar)",
    M: "(Modificar)",
    C: "(Consultar)",
    L: "(Listado)"
  };
  AccionABMC = "L"; // inicialmente inicia en el listado de articulos (buscar con parametros)
  Mensajes = {
    SD: " No se encontraron registros...",
    RD: " Revisar los datos ingresados..."
  };

  Lista: Articulo[] = [];
  RegistrosTotal: number;
  Familias: ArticuloFamilia[] = [];
  SinBusquedasRealizadas = true;
  Pagina = 1; // inicia pagina 1
  submitted;

  // opciones del combo activo
  OpcionesActivo = [
    { Id: null, Nombre: "" },
    { Id: true, Nombre: "SI" },
    { Id: false, Nombre: "NO" }
  ];


constructor(
    public formBuilder: FormBuilder,
    private articulosService: MockArticulosService,
    private articulosFamiliasService: MockArticulosFamiliasService,
    private modalDialogService: ModalDialogService
  ) {}


  FormFiltro: FormGroup;
  FormReg: FormGroup;
 
 // Creamos los objetos formularios
  ngOnInit() {
    this.FormFiltro = this.formBuilder.group({
      Nombre: [null],
      Activo: [null]
    });
    this.FormReg = this.formBuilder.group({
      IdArticulo: [null],
      Nombre: [ null,[Validators.required, Validators.minLength(4), Validators.maxLength(55)]],
      Precio: [null, [Validators.required, Validators.pattern("[0-9]{1,7}")]],
      Stock: [null, [Validators.required, Validators.pattern("[0-9]{1,10}")]],
      CodigoDeBarra: [null, [Validators.required, Validators.pattern("[0-9]{13}")]],
      IdArticuloFamilia: [null, [Validators.required] ],
      FechaAlta: [ null,[ Validators.required, Validators.pattern("(0[1-9]|[12][0-9]|3[01])[-/](0[1-9]|1[012])[-/](19|20)[0-9]{2}")]],
      Activo: [false]
    });

 
    this.GetFamiliasArticulos();
  }

  GetFamiliasArticulos() {
    
      this.Familias = ArticulosFamilias;
    
  }

// Accedemos a los valores cargados en los controles html
// Resetear todos los campos del formulario a su valor por defecto para dejarlo listo para el alta
  Agregar() {
    this.submitted = false;
    this.FormReg.markAsUntouched();
    this.AccionABMC = "A";
    this.FormReg.reset(this.FormReg.value);
  }


 // Buscar segun los filtros, establecidos en FormReg
 Buscar() {
    this.SinBusquedasRealizadas = false;
    this.modalDialogService.BloquearPantalla();
    this.articulosService
      .get(this.FormFiltro.value.Nombre, this.FormFiltro.value.Activo, this.Pagina)
      .subscribe((res: any) => {
        this.Lista = res.Lista;
        this.RegistrosTotal = res.RegistrosTotal;
        this.modalDialogService.DesbloquearPantalla();
      });
  }


  // Obtengo un registro especifico según el Id
  BuscarPorId(Dto, AccionABMC) {
    window.scroll(0, 0); // ir al incio del scroll
 
    this.articulosService.getById(Dto.IdArticulo).subscribe((res: any) => {
  
      const itemCopy = { ...res };  // hacemos copia para no modificar el array original del mock
      
      //formatear fecha de  ISO 8061 a string dd/MM/yyyy
      var arrFecha = itemCopy.FechaAlta.substr(0, 10).split("-");
      itemCopy.FechaAlta = arrFecha[2] + "/" + arrFecha[1] + "/" + arrFecha[0];
 
      this.FormReg.patchValue(itemCopy);
      this.AccionABMC = AccionABMC;
    });
  }


  Consultar(Dto) {
    this.BuscarPorId(Dto, "C");
  }

  // comienza la modificacion, luego la confirma con el metodo Grabar
  Modificar(Dto) {
    this.submitted = false;
    this.FormReg.markAsUntouched();
    if (!Dto.Activo) {
      this.modalDialogService.Alert("No puede modificarse un registro Inactivo.");
      return;
    }
    this.BuscarPorId(Dto, "M");
  }

// grabar tanto altas como modificaciones
Grabar() {

  this.submitted = true;
 
  // Preguntamos por el estado del formulario, si es invalido no se lleva a cabo lo demas, impide que los datos pasen al backend
  if (this.FormReg.invalid) {return};

  //hacemos una copia de los datos del formulario, para modificar la fecha y luego enviarlo al servidor
  const itemCopy = { ...this.FormReg.value };

  //convertir fecha de string dd/MM/yyyy a ISO para que la entienda webapi
  var arrFecha = itemCopy.FechaAlta.substr(0, 10).split("/");
  if (arrFecha.length == 3)
    itemCopy.FechaAlta = 
        new Date(
          arrFecha[2],
          arrFecha[1] - 1,
          arrFecha[0]
        ).toISOString();

  // agregar post
  if (itemCopy.IdArticulo == 0 || itemCopy.IdArticulo == null) {
    this.articulosService.post(itemCopy).subscribe((res: any) => {
      this.Volver();
      this.modalDialogService.Alert("No puede modificarse un registro Inactivo.");
      this.Buscar();
    });
  } else {
    // modificar put
    this.articulosService
      .put(itemCopy.IdArticulo, itemCopy)
      .subscribe((res: any) => {
        this.Volver();
        this.modalDialogService.Alert("No puede modificarse un registro Inactivo.");
        this.Buscar();
      });
  }
}


// representa la baja logica 
  ActivarDesactivar(Dto) {
    this.modalDialogService.Confirm(
      "Esta seguro de " +
        (Dto.Activo ? "desactivar" : "activar") +
        " este registro?",
      undefined,
      undefined,
      undefined,
      () =>
        this.articulosService  
          .delete(Dto.IdArticulo)
          .subscribe((res: any) => 
            this.Buscar()
          ),
      null
    );
  }


  // Volver desde Agregar/Modificar
  Volver() {
    this.AccionABMC = "L";
  }

  ImprimirListado() {
    this.modalDialogService.Alert("No puede modificarse un registro Inactivo.");
  }

   GetArticuloFamiliaNombre(Id){
    var Nombre = this.Familias.filter(x => x.IdArticuloFamilia === Id)[0].Nombre;
    return Nombre;
  }

}
