import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import { ClienteService } from 'src/app/services/cliente.service';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
declare var iziToast: any;
declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-index-cliente',
  templateUrl: './index-cliente.component.html',
  styleUrls: ['./index-cliente.component.css'],
})
export class IndexClienteComponent implements OnInit {
  public clientes: Array<any> = [];
  public filtro_apellidos = '';
  public filtro_correo = '';
  public arr_clientes: Array<any> = [];
  public page = 1;
  public pageSize = 10;
  public token;
  public load_data = true;

  constructor(
    private _clienteService: ClienteService,
    private _adminService: AdminService
  ) {
    this.token = this._adminService.getToken();
    console.log(this.token);
  }

  ngOnInit(): void {
    this.init_Data();
  }

  init_Data() {
    this._clienteService
      .listar_cliente_filtro_admin(null, null, this.token)
      .subscribe(
        (res) => {
          this.clientes = res.data;
          this.clientes.forEach((e) => {
            this.arr_clientes.push({
              nombres: e.nombres,
              apellidos: e.apellidos,
              email: e.email,
            });
          });
          this.load_data = false;
        },
        (err) => {
          console.error(err);
        }
      );
  }

  filtro(tipo: any) {
    if (tipo == 'apellidos') {
      if (this.filtro_apellidos) {
        this.load_data = true;
        this._clienteService
          .listar_cliente_filtro_admin(tipo, this.filtro_apellidos, this.token)
          .subscribe(
            (res) => {
              this.clientes = res.data;
              this.load_data = false;
            },
            (err) => {
              console.error(err);
            }
          );
      } else {
        this.init_Data();
      }
    } else if (tipo == 'correo') {
      if (this.filtro_correo) {
        this.load_data = true;
        this._clienteService
          .listar_cliente_filtro_admin(tipo, this.filtro_correo, this.token)
          .subscribe(
            (res) => {
              this.clientes = res.data;
              this.load_data = false;
            },
            (err) => {
              console.error(err);
            }
          );
      } else {
        this.init_Data();
      }
    }
  }

  eliminar(id: any) {
    this._clienteService.eliminar_cliente_admin(id, this.token).subscribe(
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

        this.init_Data();
      },
      (err) => {
        console.log(err);
      }
    );
  }
  donwload_excel() {
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Reporte de productos');

    worksheet.addRow(undefined);
    for (let x1 of this.arr_clientes) {
      let x2 = Object.keys(x1);

      let temp = [];
      for (let y of x2) {
        temp.push(x1[y]);
      }
      worksheet.addRow(temp);
    }

    let fname = 'REP01- ';

    worksheet.columns = [
      { header: 'Nombres del cliente', key: 'col1', width: 30 },
      { header: 'Apellidos del cliente', key: 'col2', width: 15 },
      { header: 'Correo', key: 'col3', width: 25 },
    ] as any;

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      fs.saveAs(blob, fname + '-' + new Date().valueOf() + '.xlsx');
    });
  }
}
