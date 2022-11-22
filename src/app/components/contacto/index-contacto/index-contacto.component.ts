import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
declare var iziToast: any;
declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-index-contacto',
  templateUrl: './index-contacto.component.html',
  styleUrls: ['./index-contacto.component.css'],
})
export class IndexContactoComponent implements OnInit {
  public mensajes: Array<any> = [];
  public load_data = true;
  public page = 1;
  public pageSize = 10;
  public filtro = '';
  public token;
  public load_btn = false;

  constructor(private _adminService: AdminService) {
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
    this.init_data();
  }

  init_data() {
    this._adminService.obtener_mensajes_admin(this.token).subscribe((res) => {
      this.mensajes = res.data;
      this.load_data = false;
    });
  }

  cerrar(id: any) {
    this.load_btn = true;
    this._adminService
      .cerrar_mensajes_admin(id, { data: undefined }, this.token)
      .subscribe(
        (res) => {
          iziToast.show({
            title: 'SUCCESS',
            class: 'text-success',
            titleColor: '#1DC74C',
            position: 'topRight',
            message: 'Se cerro correctamente la solicitud.',
          });
          $('#estadoModal-' + id).modal('hide');
          $('.modal-backdrop').removeClass('show');
          this.load_btn = false;

          this.init_data();
        },
        (err) => {
          iziToast.show({
            title: 'SUCCESS',
            class: 'text-success',
            titleColor: '#1DC74C',
            position: 'topRight',
            message: 'Ocurrio un error en el servidor.',
          });
          console.log(err);
          this.load_btn = false;
        }
      );
  }
}
