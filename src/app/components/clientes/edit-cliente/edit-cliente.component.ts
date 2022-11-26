import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { ClienteService } from 'src/app/services/cliente.service';
declare var iziToast: any;

@Component({
  selector: 'app-edit-cliente',
  templateUrl: './edit-cliente.component.html',
  styleUrls: ['./edit-cliente.component.css'],
})
export class EditClienteComponent implements OnInit {
  public cliente: any = {};
  public id: any;
  public token: any;
  public load_btn = false;
  public load_data = true;
  constructor(
    private _route: ActivatedRoute,
    private _router: Router,
    private _clienteService: ClienteService,
    private _adminService: AdminService
  ) {
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.id = params['id'];

      this._clienteService.obtener_cliente_admin(this.id, this.token).subscribe(
        (res) => {
          console.log(res);
          if (res.data == undefined) {
            this.cliente = undefined;
            this.load_data = false;
          } else {
            this.cliente = res.data;
            this.load_data = false;
          }
        },
        (err) => {}
      );
    });
  }
  actualizar(updateForm: any) {
    if (updateForm.valid) {
      this.load_btn = true;
      this._clienteService
        .actualizar_cliente_admin(this.id, this.cliente, this.token)
        .subscribe(
          (res) => {
            iziToast.show({
              title: 'Éxito',
              class: 'text-success',
              titleColor: '#1DC74C',
              position: 'topRight',
              message: 'Se actulizó correctamente el cliente.',
            });
            this.load_btn = false;
            this._router.navigate(['panel/clientes']);
          },
          (err) => {
            console.log(err);
          }
        );
    } else {
      iziToast.show({
        title: 'ERROR',
        class: 'text-danger',
        titleColor: '#ff0000',
        position: 'topRight',
        message: 'Los datos del formulario no son validos.',
      });
    }
  }
}
