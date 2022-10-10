import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';
import { v4 as uuidv4 } from 'uuid';

declare var iziToast: any;
declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-galeria-producto',
  templateUrl: './galeria-producto.component.html',
  styleUrls: ['./galeria-producto.component.css'],
})
export class GaleriaProductoComponent implements OnInit {
  public producto: any = {};
  public id: any;
  public token;
  public url;
  public file: File | undefined;
  public load_btn_eliminar = false;
  public load_btn = false;

  constructor(
    private _route: ActivatedRoute,
    private _productoService: ProductoService
  ) {
    this.url = GLOBAL.url;
    this.token = localStorage.getItem('token');
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      console.log(this.id);

      this.init_data();
    });
  }

  init_data() {
    this._productoService.obtener_producto_admin(this.id, this.token).subscribe(
      (res) => {
        console.log(res);
        if (res.data == undefined) {
          this.producto = undefined;
        } else {
          this.producto = res.data;
          console.log(this.producto);
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }

  ngOnInit(): void {}

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
        this.file = file;
      } else {
        iziToast.show({
          title: 'ERROR',
          class: 'text-danger',
          titleColor: '#ff0000',
          position: 'topRight',
          message: 'El archivo debe de ser imagen.',
        });
        $('#input-img').val('');
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
      $('#input-img').val('');
      this.file = undefined;
    }
    console.log(this.file);
  }

  subir_imagen() {
    if (this.file != undefined) {
      let data = {
        imagen: this.file,
        _id: uuidv4(),
      };
      console.log(data);
      this._productoService
        .agregar_imagen_galeria_admin(this.id, data, this.token)
        .subscribe(
          (res) => {
            console.log(res);
            this.init_data();
            $('#input-img').val('');
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
        message: 'Debe seleccionar una imagen para subir.',
      });
    }
  }

  eliminar(id: any) {
    this.load_btn_eliminar = true;
    this._productoService
      .eliminar_imagen_galeria_admin(this.id, { _id: id }, this.token)
      .subscribe(
        (res) => {
          iziToast.show({
            title: 'SUCCESS',
            class: 'text-success',
            titleColor: '#1DC74C',
            position: 'topRight',
            message: 'Se eliminó correctamente la imagen.',
          });
          $('#delete-' + id).modal('hide');
          $('.modal-backdrop').removeClass('show');
          this.load_btn_eliminar = false;

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
          this.load_btn = true;
        }
      );
  }
}
