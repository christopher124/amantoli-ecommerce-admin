import { Component, OnInit } from '@angular/core';
import { CuponService } from '../../../services/cupon.service';
declare var iziToast: any;
declare var jQuery: any;
declare var $: any;
@Component({
  selector: 'app-index-cupon',
  templateUrl: './index-cupon.component.html',
  styleUrls: ['./index-cupon.component.css'],
})
export class IndexCuponComponent implements OnInit {
  public cupones: Array<any> = [];
  public load_data = true;
  public page = 1;
  public pageSize = 10;
  public filtro = '';
  public token;
  public load_btn = true;
  constructor(private _cuponService: CuponService) {
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
    this.init_data();
  }
  init_data() {
    this._cuponService.listar_cupones_admin(this.filtro, this.token).subscribe(
      (res) => {
        this.cupones = res.data;
        this.load_data = false;
      },
      (err) => {}
    );
  }
  filtrar() {
    this._cuponService.listar_cupones_admin(this.filtro, this.token).subscribe(
      (res) => {
        this.cupones = res.data;
        this.load_data = false;
      },
      (err) => {}
    );
  }
  eliminar(id: any) {
    this.load_btn = true;
    this._cuponService.eliminar_cupon_admin(id, this.token).subscribe(
      (res) => {
        iziToast.show({
          title: 'Éxito',
          class: 'text-success',
          titleColor: '#1DC74C',
          position: 'topRight',
          message: 'Se eliminó correctamente el cupón.',
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
