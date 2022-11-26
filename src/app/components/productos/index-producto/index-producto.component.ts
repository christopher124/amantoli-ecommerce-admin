import { Component, OnInit } from '@angular/core';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
declare var iziToast: any;
declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-index-producto',
  templateUrl: './index-producto.component.html',
  styleUrls: ['./index-producto.component.css'],
})
export class IndexProductoComponent implements OnInit {
  public productos: Array<any> = [];
  public productos_const: Array<any> = [];
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

  constructor(private _productoService: ProductoService) {}

  ngOnInit(): void {
    this.init_data();
  }
  init_data() {
    this._productoService
      .listar_productos_admin(this.filtro, this.token)
      .subscribe(
        (res) => {
          console.log(res);
          this.productos = res.data;
          this.productos.forEach((e) => {
            this.productos_const.push({
              titulo: e.titulo,
              stock: e.stock,
              precio: e.precio,
              categoria: e.categoria,
              nventas: e.nventas,
            });
          });
          console.log(this.productos_const);

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
    this._productoService.eliminar_producto_admin(id, this.token).subscribe(
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

  donwload_excel() {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Reporte de productos');

    worksheet.addRow(undefined);
    for (let x1 of this.productos_const) {
      let x2 = Object.keys(x1);

      let temp = [];
      for (let y of x2) {
        temp.push(x1[y]);
      }
      worksheet.addRow(temp);
    }

    let fname = 'REP01- ';

    worksheet.columns = [
      { header: 'Producto', key: 'col1', width: 30 },
      { header: 'Stock', key: 'col2', width: 15 },
      { header: 'Precio', key: 'col3', width: 15 },
      { header: 'Categoria', key: 'col4', width: 25 },
      { header: 'N° ventas', key: 'col5', width: 15 },
    ] as any;

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, fname + '-' + new Date().valueOf() + '.xlsx');
    });
  }
}
