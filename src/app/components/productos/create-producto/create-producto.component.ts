import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';
import { ProductoService } from 'src/app/services/producto.service';
declare var iziToast: any;
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-create-producto',
  templateUrl: './create-producto.component.html',
  styleUrls: ['./create-producto.component.css'],
})
export class CreateProductoComponent implements OnInit {
  public producto: any = {
    categoria: '',
  };
  public file: any = undefined;
  public imgSelect: any | ArrayBuffer = 'assets/img/default.jpg';
  public config: any = {};
  public token;
  public load_btn = false;
  public config_global: any = {};

  constructor(
    private _productoService: ProductoService,
    private _adminService: AdminService,
    private _router: Router
  ) {
    this.config = {
      height: 500,
    };
    this.token = this._adminService.getToken();
    this._adminService.obtener_config_public().subscribe(
      (res) => {
        this.config_global = res.data;
      },
      (err) => {}
    );
  }

  ngOnInit(): void {}

  registro(registroForm: any) {
    if (registroForm.valid) {
      if (this.file == undefined) {
        iziToast.show({
          title: 'ERROR',
          class: 'text-danger',
          titleColor: '#ff0000',
          position: 'topRight',
          message: 'Debes subir una portada para registrar.',
        });
      } else {
        console.log(this.producto);
        console.log(this.file);
        this.load_btn = true;
        this._productoService
          .registro_producto_admin(this.producto, this.file, this.token)
          .subscribe(
            (res) => {
              iziToast.show({
                title: 'SUCCESS',
                class: 'text-success',
                titleColor: '#1DC74C',
                position: 'topRight',
                message: 'Se registro correctamente el nuevo producto.',
              });
              this.load_btn = false;
              this._router.navigate(['/panel/productos']);
            },
            (err) => {
              console.log(err);
              this.load_btn = false;
            }
          );
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

      $('#input-portada').text('Seleccionar imagen');
      this.imgSelect = 'assets/img/default.jpg';
      this.file = undefined;
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
      this.imgSelect = 'assets/img/default.jpg';
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
        this.imgSelect = 'assets/img/default.jpg';
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
      this.imgSelect = 'assets/img/default.jpg';
      this.file = undefined;
    }
    console.log(this.file);
  }
}
