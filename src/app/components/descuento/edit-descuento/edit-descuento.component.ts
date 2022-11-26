import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { DescuentoService } from 'src/app/services/descuento.service';
import { GLOBAL } from 'src/app/services/GLOBAL';
declare var iziToast: any;
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-edit-descuento',
  templateUrl: './edit-descuento.component.html',
  styleUrls: ['./edit-descuento.component.css'],
})
export class EditDescuentoComponent implements OnInit {
  public descuento: any = {};
  public file: any = undefined;
  public imgSelect: any | ArrayBuffer = 'assets/img/default.jpg';
  public config: any = {};
  public token;
  public load_btn = false;
  public id: any;
  public url = GLOBAL.url;

  public load_data = true;

  constructor(
    private _adminService: AdminService,
    private _router: Router,
    private _route: ActivatedRoute,
    private _descuentoService: DescuentoService
  ) {
    this.token = this._adminService.getToken();
  }

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      console.log(this.id);

      this._descuentoService
        .obtener_descuento_admin(this.id, this.token)
        .subscribe(
          (res) => {
            console.log(res);
            if (res.data == undefined) {
              this.descuento = undefined;
              this.load_data = false;
            } else {
              this.descuento = res.data;
              this.imgSelect =
                this.url + 'obtener_banner_descuento/' + this.descuento.banner;
              this.load_data = false;
            }
          },
          (err) => {
            console.log(err);
          }
        );
    });
  }

  actualizar(actualizarForm: any) {
    if (actualizarForm.valid) {
      if (this.descuento.descuento >= 1 && this.descuento.descuento <= 100) {
        var data: any = {};

        if (this.file != undefined) {
          data.banner = this.file;
        }

        data.titulo = this.descuento.titulo;
        data.descuento = this.descuento.descuento;
        data.fecha_inicio = this.descuento.fecha_inicio;
        data.fecha_fin = this.descuento.fecha_fin;

        this.load_btn = true;
        this._descuentoService
          .actulizar_descuento_admin(data, this.id, this.token)
          .subscribe(
            (res) => {
              console.log(res);
              iziToast.show({
                title: 'Éxito',
                class: 'text-success',
                titleColor: '#1DC74C',
                position: 'topRight',
                message: 'Se actualizó correctamente el descuento.',
              });
              this.load_btn = false;

              this._router.navigate(['/panel/descuentos']);
            },
            (err) => {
              console.log(err);
              this.load_btn = false;
            }
          );
      } else {
        iziToast.show({
          title: 'ERROR',
          class: 'text-danger',
          titleColor: '#ff0000',
          position: 'topRight',
          message: 'El descuento debe ser en  0% al 100%.',
        });
      }
    } else {
      iziToast.show({
        title: 'ERROR',
        class: 'text-danger',
        titleColor: '#ff0000',
        position: 'topRight',
        message: 'Los datos del formulario no son validos.',
      });
      this.load_btn = false;
    }
  }

  fileChangeEvent(event: any): void {
    var file;
    if (event.target.files && event.target.files[0]) {
      file = <File>event.target.files[0];
      console.log(file);
    } else {
      iziToast.show({
        title: 'ERROR',
        class: 'text-danger',
        titleColor: '#ff0000',
        position: 'topRight',
        message: 'No hay una imagen de envio.',
      });
      $('#input-portada').text('Seleccionar imagen');
      this.imgSelect = 'assets/img/01.jpg';
      this.file = undefined;
    }
    if (file?.size) {
      if (
        file.type == 'image/png' ||
        file.type == 'image/webp' ||
        file.type == 'image/jpg' ||
        file.type == 'image/gif' ||
        file.type == 'image/jpeg'
      ) {
        const reader = new FileReader();
        reader.onload = (e) => (this.imgSelect = reader.result);
        console.log(this.imgSelect);

        reader.readAsDataURL(file);
        $('#input-portada').text(file.name);
        this.file = file;
      } else {
        iziToast.show({
          title: 'ERROR',
          class: 'text-danger',
          titleColor: '#ff0000',
          position: 'topRight',
          message: 'El archivo debe de ser imagen.',
        });
        $('#input-portada').text('Seleccionar imagen');
        this.imgSelect = 'assets/img/01.jpg';
        this.file = undefined;
      }
    } else {
      iziToast.show({
        title: 'ERROR',
        class: 'text-danger',
        titleColor: '#ff0000',
        position: 'topRight',
        message: 'La imagen no puede superar los 4MB.',
      });
      $('#input-portada').text('Seleccionar imagen');
      this.imgSelect = 'assets/img/01.jpg';
      this.file = undefined;
    }
    console.log(this.file);
  }
}
