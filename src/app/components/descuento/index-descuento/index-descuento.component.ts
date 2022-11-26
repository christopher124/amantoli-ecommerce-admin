import { Component, OnInit } from '@angular/core';
import { DescuentoService } from 'src/app/services/descuento.service';
import { GLOBAL } from 'src/app/services/GLOBAL';
declare var iziToast: any;
declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-index-descuento',
  templateUrl: './index-descuento.component.html',
  styleUrls: ['./index-descuento.component.css'],
})
export class IndexDescuentoComponent implements OnInit {
  public descuentos: Array<any> = [];
  public descuentos_const: Array<any> = [];
  public token = localStorage.getItem('token');
  public page = 1;
  public pageSize = 15;
  public filtro = '';

  public load_btn_etiqueta = false;
  public load_data_etiqueta = false;
  public nueva_etiqueta = '';
  public etiquetas: Array<any> = [];
  public load_del_etiqueta = false;
  public load_btn = false;
  public load_data = false;

  public load_estado = false;
  public url = GLOBAL.url;

  constructor(private _descuentoService: DescuentoService) {}

  ngOnInit(): void {
    this.init_data();
  }
  init_data() {
    this._descuentoService
      .listar_descuentos_admin(this.filtro, this.token)
      .subscribe(
        (res) => {
          console.log(res);
          this.descuentos = res.data;

          this.descuentos.forEach((e) => {
            var tt_inicio = Date.parse(e.fecha_inicio + 'T00:00:00') / 1000;
            var tt_fin = Date.parse(e.fecha_fin + 'T00:00:00') / 1000;

            var today = Date.parse(new Date().toString()) / 1000;

            if (today > tt_inicio) {
              e.estado = 'Expirado';
            }
            if (today < tt_inicio) {
              e.estado = 'Proximamente';
            }
            if (today >= tt_inicio && today <= tt_fin) {
              e.estado = 'En proceso';
            }
          });

          this.descuentos.forEach((e) => {
            this.descuentos_const.push({
              titulo: e.titulo,
              fecha_inicio: e.fecha_inicio,
              fecha_fin: e.fecha_fin,
              descuento: e.descuento,
            });
          });
          console.log(this.descuentos_const);

          this.load_data = false;
        },
        (err) => {
          console.log(err);
        }
      );
  }

  filtrar() {
    if (this.filtro) {
      this.init_data();
    } else {
      iziToast.show({
        title: 'ERROR',
        class: 'text-danger',
        titleColor: '#ff0000',
        position: 'topRight',
        message: 'Ingrese un filtro para buscar.',
      });
    }
  }
  resetear() {
    this.filtro = '';
    this.init_data();
  }

  eliminar(id: any) {
    this.load_btn = true;
    this._descuentoService.eliminar_descuento_admin(id, this.token).subscribe(
      (res) => {
        iziToast.show({
          title: 'Éxito',
          class: 'text-success',
          titleColor: '#1DC74C',
          position: 'topRight',
          message: 'Se eliminó correctamente el producto.',
        });
        $('#delete-' + id).modal('hide');
        $('.modal-backdrop').removeClass('show');
        this.load_btn = false;

        this.init_data();
      },
      (err) => {
        iziToast.show({
          title: 'Error',
          class: 'text-success',
          titleColor: '#1DC74C',
          position: 'topRight',
          message: 'Ocurrió un error en el servidor.',
        });
        console.log(err);
        this.load_btn = true;
      }
    );
  }
}
