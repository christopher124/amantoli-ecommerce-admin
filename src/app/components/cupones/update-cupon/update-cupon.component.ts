import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CuponService } from 'src/app/services/cupon.service';
declare var iziToast: any;

@Component({
  selector: 'app-update-cupon',
  templateUrl: './update-cupon.component.html',
  styleUrls: ['./update-cupon.component.css'],
})
export class UpdateCuponComponent implements OnInit {
  public cupon: any = {
    tipo: '',
  };
  public load_btn = false;
  public token;
  public id: any;
  public load_data = true;
  constructor(
    private _cuponService: CuponService,
    private _router: Router,
    private _route: ActivatedRoute
  ) {
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
    this._route.params.subscribe((params) => {
      this.id = params['id'];

      this._cuponService.obtener_cupon_admin(this.id, this.token).subscribe(
        (res) => {
          if (res.data == undefined) {
            this.cupon = undefined;
            this.load_data = false;
          } else {
            this.cupon = res.data;
            this.load_data = false;
          }
          console.log(this.cupon);
        },
        (err) => {}
      );
    });
  }

  actualizar(actualizarForm: any) {
    if (actualizarForm.valid) {
      this.load_btn = true;
      this._cuponService
        .actualizar_cupon_admin(this.id, this.cupon, this.token)
        .subscribe(
          (res) => {
            iziToast.show({
              title: 'Éxito',
              class: 'text-success',
              titleColor: '#1DC74C',
              position: 'topRight',
              message: 'Se actualizó correctamente el cupón.',
            });
            this.load_btn = false;

            this._router.navigate(['/panel/cupones']);
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
}
