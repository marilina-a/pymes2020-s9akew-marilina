import { Component, OnInit } from "@angular/core";
import { ArticuloFamilia2 } from "../../models/articulo-familia2";
import { MockArticulosFamilias2Service } from "../../services/mock-articulos-familias2.service";
import { ModalDialogService } from "../../services/modal-dialog.service";

// NUEVO
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-articulos-familias2",
  templateUrl: "./articulos-familias2.component.html",
  styleUrls: ["./articulos-familias2.component.css"]
})
export class ArticulosFamilias2Component implements OnInit {
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

  Lista: ArticuloFamilia2[] = [];
  RegistrosTotal: number;
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
    private articulosFamiliasService: MockArticulosFamilias2Service,
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
      Nombre: [
        null,
        [Validators.required, Validators.minLength(4), Validators.maxLength(55)]
      ],
      Activo: [false]
    });
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
    this.articulosFamiliasService
      .get(
        this.FormFiltro.value.Nombre,
        this.FormFiltro.value.Activo,
        this.Pagina
      )
      .subscribe((res: any) => {
        this.Lista = res.Lista;
        this.RegistrosTotal = res.RegistrosTotal;
        this.modalDialogService.DesbloquearPantalla();
      });
  }

// Obtengo un registro especifico según el Id
BuscarPorId(Dto, AccionABMC) {
  window.scroll(0, 0); // ir al incio del scroll

  this.articulosFamiliasService.getById(Dto.IdArticuloFamilia).subscribe((res: any) => {
    this.FormReg.patchValue(res);

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
      this.modalDialogService.Alert(
        "No puede modificarse un registro Inactivo."
      );
      return;
    }
    this.BuscarPorId(Dto, "M");
  }

  // grabar tanto altas como modificaciones
Grabar() { 


  //hacemos una copia de los datos del formulario, para modificar la fecha y luego enviarlo al servidor
  const itemCopy = { ...this.FormReg.value };

  // agregar post
  if (itemCopy.IdArticuloFamilia == 0 || itemCopy.IdArticuloFamilia == null) {
    this.articulosFamiliasService.post(itemCopy).subscribe((res: any) => {
      this.Volver();
      alert('Registro agregado correctamente.');
      // grilla se vuelve a cargar
      this.Buscar();
    });
  } else {
    // modificar put
    this.articulosFamiliasService
      .put(itemCopy.IdArticuloFamilia, itemCopy)
      .subscribe((res: any) => {
        this.Volver();
        alert('Registro modificado correctamente.');
        this.Buscar();
      });
  }
}

// representa la baja logica 
ActivarDesactivar(Dto) {
  var resp = confirm(
    "Esta seguro de " +
      (Dto.Activo ? "desactivar" : "activar") +
      " este registro?");
  if (resp === true)
  {
   this.articulosFamiliasService  
        .delete(Dto.IdArticuloFamilia)
        .subscribe((res: any) => 
          this.Buscar()
        );
  }
}

  // Volver desde Agregar/Modificar
  Volver() {
    this.AccionABMC = "L";
  }

  ImprimirListado() {
    this.modalDialogService.Alert("No puede modificarse un registro Inactivo.");
  }
}
