import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';
declare var iziToast: any;
declare var jQuery: any;
declare var $: any;

@Component({
  selector: 'app-variedad-producto',
  templateUrl: './variedad-producto.component.html',
  styleUrls: ['./variedad-producto.component.css'],
})
export class VariedadProductoComponent implements OnInit {
  public producto: any = {};
  public id: any;
  public token;
  public url;
  public nueva_variedad = '';
  public load_btn = false;
  public load_data = false;

  constructor(
    private _route: ActivatedRoute,
    private _productoService: ProductoService
  ) {
    this.url = GLOBAL.url;
    this.token = localStorage.getItem('token');
    this._route.params.subscribe((params) => {
      this.id = params['id'];
      console.log(this.id);

      this.load_data = true;
      this._productoService
        .obtener_producto_admin(this.id, this.token)
        .subscribe(
          (res) => {
            if (res.data == undefined) {
              this.producto = undefined;
              this.load_data = false;
            } else {
              this.producto = res.data;
              this.load_data = false;
            }
          },
          (err) => {
            console.log(err);
          }
        );
    });
  }

  ngOnInit(): void {}

  agregar_variedad() {
    if (this.nueva_variedad) {
      this.producto.variedades.push({ titulo: this.nueva_variedad });
      this.nueva_variedad = '';
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        class: 'text-danger',
        position: 'topRight',
        message: 'El campo de la varierad debe ser completada.',
      });
    }
  }

  eliminar_variedad(idx: any) {
    this.producto.variedades.splice(idx, 1);
  }

  actualizar() {
    if (this.producto.titulo_variedad) {
      if (this.producto.variedades.length >= 1) {
        this.load_btn = true;
        this._productoService
          .actulizar_producto_variedades_admin(
            this.id,
            {
              titulo_variedad: this.producto.titulo_variedad,
              variedades: this.producto.variedades,
            },
            this.token
          )
          .subscribe(
            (res) => {
              iziToast.show({
                title: 'Éxito',
                class: 'text-success',
                titleColor: '#1DC74C',
                position: 'topRight',
                message:
                  'Se actualizó correctamente las variedades del producto.',
              });
              this.load_btn = false;
            },
            (err) => {
              console.log(err);
            }
          );
      } else {
        iziToast.show({
          title: 'ERROR',
          titleColor: '#FF0000',
          class: 'text-danger',
          position: 'topRight',
          message: 'Se debe agregar una variedad.',
        });
      }
    } else {
      iziToast.show({
        title: 'ERROR',
        titleColor: '#FF0000',
        class: 'text-danger',
        position: 'topRight',
        message: 'Debe de completar el titulo de la variedad.',
      });
    }
  }
}
