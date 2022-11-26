import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';
declare var iziToast: any;
declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-update-producto',
  templateUrl: './update-producto.component.html',
  styleUrls: ['./update-producto.component.css'],
})
export class UpdateProductoComponent implements OnInit {
  public producto: any = {
    categoria: '',
  };
  public file: any = undefined;
  public config: any = {};
  public imgSelect: String | ArrayBuffer | any;
  public load_btn = false;
  public id: any;
  public token;
  public load_data = true;
  public url: any;
  public config_global: any = {};

  constructor(
    private _route: ActivatedRoute,
    private _productoService: ProductoService,
    private _adminService: AdminService,
    private _router: Router
  ) {
    this.config = {
      height: 500,
    };
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
    this._adminService.obtener_config_public().subscribe(
      (res) => {
        this.config_global = res.data;
      },
      (err) => {}
    );
  }

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      console.log(this.id);

      this._productoService
        .obtener_producto_admin(this.id, this.token)
        .subscribe(
          (res) => {
            console.log(res);
            if (res.data == undefined) {
              this.producto = undefined;
              this.load_data = false;
            } else {
              this.producto = res.data;
              this.imgSelect =
                this.url + 'obtener_portada/' + this.producto.portada;
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
      var data: any = {};

      if (this.file != undefined) {
        data.portada = this.file;
      }

      data.titulo = this.producto.titulo;
      data.stock = this.producto.stock;
      data.precio = this.producto.precio;
      data.categoria = this.producto.categoria;
      data.descripcion = this.producto.descripcion;
      data.contenido = this.producto.contenido;
      this.load_btn = true;
      this._productoService
        .actulizar_producto_admin(data, this.id, this.token)
        .subscribe(
          (res) => {
            console.log(res);
            iziToast.show({
              title: 'Éxito',
              class: 'text-success',
              titleColor: '#1DC74C',
              position: 'topRight',
              message: 'Se actualizó correctamente el producto.',
            });
            this.load_btn = false;

            this._router.navigate(['/panel/productos']);
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
