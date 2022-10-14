import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-siderbar',
  templateUrl: './siderbar.component.html',
  styleUrls: ['./siderbar.component.css'],
})
export class SiderbarComponent implements OnInit {
  public token;
  public id;
  public user: any = undefined;
  public user_lc: any = undefined;

  constructor(private _adminService: AdminService, private _router: Router) {
    this.token = localStorage.getItem('token');
    this.id = localStorage.getItem('_id');
    if (this.token) {
      this._adminService.obtener_admin(this.id, this.token).subscribe(
        (res) => {
          this.user = res.data;
          localStorage.setItem('user_data', JSON.stringify(this.user));
          if (localStorage.getItem('user_data')) {
            this.user_lc = JSON.parse(localStorage.getItem('user_data') || '');
          } else {
            this.user_lc = undefined;
          }
        },
        (err) => {
          this.user = undefined;
        }
      );
    }
  }

  ngOnInit(): void {}
}
