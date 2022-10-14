import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

declare var jQuery: any;
declare var $: any;
declare var iziToast: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public user: any = {
    email: '',
    password: '',
  };
  public usuario: any = {};
  public token: any = '';
  public config: any = {};
  public url: any;

  public imgSelect: any;
  constructor(private _adminService: AdminService, private _router: Router) {
    this.token = this._adminService.getToken();
    this._adminService.obtener_config_public().subscribe(
      (response) => {
        this.config = response.data;

        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }

  ngOnInit(): void {
    console.log(this.token);
    if (this.token) {
      this._router.navigate(['/']);
    } else {
      //MANTENER EN EL COMPONENTE
    }
  }

  login(loginForm: any) {
    if (loginForm.valid) {
      console.log(this.user);

      let data = {
        email: this.user.email,
        password: this.user.password,
      };

      this._adminService.login_admin(data).subscribe(
        (resp) => {
          if (resp.data == undefined) {
            iziToast.show({
              title: 'Error',
              class: 'text-danger',
              titleColor: '#ff0000',
              position: 'topRight',
              color: 'red', // blue, red, green, yellow
              message: resp.message,
            });
          } else {
            iziToast.show({
              title: 'Exito',
              class: 'text-danger',
              titleColor: '#44EA0A',
              position: 'topRight',
              message: 'Bienvenido ' + resp.data.rol,
              messageColor: '#fff',
              theme: 'dark',
              progressBarColor: 'rgb(0, 255, 184)',
            });
            this.usuario = resp.data;

            localStorage.setItem('token', resp.token);
            localStorage.setItem('_id', resp.data._id);

            this._router.navigate(['/']);
          }
          console.log(resp);
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
