import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { ClienteService } from 'src/app/services/cliente.service';
declare var iziToast: any;

@Component({
  selector: 'app-create-cliente',
  templateUrl: './create-cliente.component.html',
  styleUrls: ['./create-cliente.component.css'],
})
export class CreateClienteComponent implements OnInit {
  public cliente: any = {
    genero: '',
  };
  public token;
  public load_btn = false;
  public fechamin: Date | any;
  public fechamax: Date | any;
  public fechaStrMinima: String | any;
  public fechaStrMaxima: String | any;

  constructor(
    private _clienteService: ClienteService,
    private _adminService: AdminService,
    private _router: Router,
    private _datePipe: DatePipe
  ) {
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
    this.fechamax = new Date(
      new Date().getFullYear(),
      new Date().getMonth() - 6,
      new Date().getDate()
    );
    this.fechaStrMaxima = this._datePipe.transform(this.fechamax, 'yyyy-MM-dd');

    this.fechamin = new Date(
      new Date().getFullYear() - 100,
      new Date().getMonth(),
      new Date().getDate()
    );
    this.fechaStrMinima = this._datePipe.transform(
      this.fechaStrMinima,
      'yyyy-MM-dd'
    );

    this.token;
  }

  registro(registroForm: any) {
    if (registroForm.valid) {
      console.log(this.cliente);
      this.load_btn = true;
      this._clienteService
        .registro_cliente_admin(this.cliente, this.token)
        .subscribe(
          (res) => {
            iziToast.show({
              title: 'Éxito',
              class: 'text-success',
              titleColor: '#1DC74C',
              position: 'topRight',
              message: "Se registró correctamente",
            });
            this.cliente = {
              genero: '',
              nombres: '',
              apellidos: '',
              f_nacimiento: '',
              telefono: '',
              dni: '',
              email: '',
            };
            this.load_btn = false;
            this._router.navigate(['panel/clientes']);
          },
          (err) => {
            iziToast.show({
              title: 'ERROR',
              class: 'text-danger',
              titleColor: '#ff0000',
              position: 'topRight',
              message: err.error.message,
            });
          }
        );
    } else {
      iziToast.show({
        title: 'ERROR',
        class: 'text-danger',
        titleColor: '#ff0000',
        position: 'topRight',
        message: 'Los datos del formulario no son válidos.',
      });
    }
  }
}
