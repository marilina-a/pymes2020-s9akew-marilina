import { Component, OnInit } from '@angular/core';
import { ServiciosService } from '../../services/servicios.service';
import {Servicio} from '../../models/servicio'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalDialogService } from "../../services/modal-dialog.service";

@Component({
  selector: 'app-servicios',
  templateUrl: './servicios.component.html',
  styleUrls: ['./servicios.component.css']
})
export class ServiciosComponent implements OnInit {
  Titulo = "Servicios";
  Items: Servicio[] = [];
  EstadoForm: string;
  FormReg: FormGroup;

  submitted = false;

  constructor(private serviciosService: ServiciosService, private formBuilder: FormBuilder,) { }

ngOnInit() {
        this.EstadoForm = 'L';
        this.submitted = false;
        this.getServicio();
        this.FormReg = this.formBuilder.group({
         IdServicio:[0],
         ServicioNombre: ['',[Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
         ServicioImporte: ['',[Validators.required, Validators.pattern("[0-9]{1,7}")]],
    });
  }
  getServicio(){
     this.serviciosService.get()
    .subscribe((res:Servicio[])=>{
      this.Items = res;

  });
  }
  Alta(){
    window.scroll(0, 0);
    this.EstadoForm = 'A';
    this.submitted = false;
  }

  Grabar() {
    this.submitted = true;
    // verificar que los validadores esten OK
     if (this.FormReg.invalid)
     {
      return;
      }
  
  
  
    //hacemos una copia de los datos del formulario, para modificar la fecha y luego enviarlo al servidor
    const itemCopy = { ...this.FormReg.value };

    // agregar post
    itemCopy.IdContrato= 0;
    this.serviciosService.post(itemCopy).subscribe((res: any) => {
        this.getServicio();
        this.Volver();

     });
    }
 
 Eliminar(IdServicio){
    this.serviciosService.delete(IdServicio).subscribe((res: string) =>{
      this.Volver();
      this.getServicio();
      window.alert("registro eliminado");
    });
  }



  Volver() {
    this.EstadoForm = "L";
    this.FormReg.reset();

  };



}

