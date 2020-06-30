import { Component, OnInit } from '@angular/core';
import { ContratosService } from '../../services/contratos.service';
import {Contrato} from '../../models/contrato'
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ModalDialogService } from "../../services/modal-dialog.service";

@Component({
  selector: 'app-contratos',
  templateUrl: './contratos.component.html',
  styleUrls: ['./contratos.component.css']
})
export class ContratosComponent implements OnInit {
Titulo = "Contratos";
  Items: Contrato[] = [];
  EstadoForm: string;
  FormReg: FormGroup;

  submitted = false;

  constructor(private contratosService: ContratosService, private formBuilder: FormBuilder) { }
ngOnInit() {
        this.EstadoForm = 'L';
        this.submitted = false;
        this.getContrato();
        this.FormReg = this.formBuilder.group({
         IdContrato:[0],
         ContratoDescripcion: ['',[Validators.required, Validators.minLength(4), Validators.maxLength(50)]],
         ContratoImporte: ['',[Validators.required, Validators.pattern("[0-9]{1,7}")]],
    });
  }
  getContrato(){
     this.contratosService.get()
    .subscribe((res:Contrato[])=>{
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
    this.contratosService.post(itemCopy).subscribe((res: any) => {
        this.getContrato();
        this.Volver();

     });
    }
  

  Volver() {
    this.EstadoForm = "L";
    this.FormReg.reset();

  };



}

