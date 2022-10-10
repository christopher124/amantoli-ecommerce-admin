import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductoService } from 'src/app/services/producto.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
declare var iziToast: any;
declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-inventario-producto',
  templateUrl: './inventario-producto.component.html',
  styleUrls: ['./inventario-producto.component.css'],
})
export class InventarioProductoComponent implements OnInit {
  public id: any;
  public token;
  public _idUser;
  public producto: any = {};
  public load_btn = false;
  public inventarios: Array<any> = [];
  public arr_inventario: Array<any> = [];
  public inventario: any = {};
  constructor(
    private _route: ActivatedRoute,
    private _productoService: ProductoService
  ) {
    this.token = localStorage.getItem('token');
    this._idUser = localStorage.getItem('_id');
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
            } else {
              this.producto = res.data;

              this._productoService
                .listar_inventario_producto_admin(this.producto._id, this.token)
                .subscribe(
                  (res) => {
                    this.inventarios = res.data;
                    this.inventarios.forEach((e) => {
                      this.arr_inventario.push({
                        admin: e.admin.nombres + ' ' + e.admin.apellidos,
                        cantidad: e.cantidad,
                        proveedor: e.proveedor,
                      });
                    });
                  },
                  (err) => {
                    console.log(err);
                  }
                );
            }
          },
          (err) => {
            console.log(err);
          }
        );
    });
  }

  registro_inventario(inventarioForm: any) {
    if (inventarioForm.valid) {
      let data = {
        producto: this.producto._id,
        cantidad: inventarioForm.value.cantidad,
        admin: this._idUser,
        proveedor: inventarioForm.value.proveedor,
      };
      this._productoService
        .registro_inventario_producto_admin(data, this.token)
        .subscribe(
          (res) => {
            iziToast.show({
              title: 'SUCCESS',
              class: 'text-success',
              titleColor: '#1DC74C',
              position: 'topRight',
              message: 'Se agrego el estock al producto.',
            });
            this._productoService
              .listar_inventario_producto_admin(this.producto._id, this.token)
              .subscribe(
                (res) => {
                  this.inventarios = res.data;
                },
                (err) => {
                  console.log(err);
                }
              );
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

  eliminar(id: any) {
    this.load_btn = true;
    this._productoService
      .eliminar_inventario_producto_admin(id, this.token)
      .subscribe(
        (res) => {
          iziToast.show({
            title: 'SUCCESS',
            class: 'text-success',
            titleColor: '#1DC74C',
            position: 'topRight',
            message: 'Se eliminó correctamente el cliente.',
          });
          $('#delete-' + id).modal('hide');
          $('.modal-backdrop').removeClass('show');
          this.load_btn = false;

          this._productoService
            .listar_inventario_producto_admin(this.producto._id, this.token)
            .subscribe(
              (res) => {
                this.inventarios = res.data;
                console.log(this.inventarios);
              },
              (err) => {
                console.log(err);
              }
            );
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
  donwload_excel() {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Reporte de productos');

    worksheet.addRow(undefined);
    for (let x1 of this.arr_inventario) {
      let x2 = Object.keys(x1);

      let temp = [];
      for (let y of x2) {
        temp.push(x1[y]);
      }
      worksheet.addRow(temp);
    }

    let fname = 'REP01- ';

    worksheet.columns = [
      { header: 'Trabajador', key: 'col1', width: 30 },
      { header: 'Cantidad', key: 'col2', width: 15 },
      { header: 'Proveedor', key: 'col3', width: 25 },
    ] as any;

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, fname + '-' + new Date().valueOf() + '.xlsx');
    });
  }
}
