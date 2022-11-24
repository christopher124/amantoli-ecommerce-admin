import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GLOBAL } from 'src/app/services/GLOBAL';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-reviews-producto',
  templateUrl: './reviews-producto.component.html',
  styleUrls: ['./reviews-producto.component.css'],
})
export class ReviewsProductoComponent implements OnInit {
  public id: any;
  public token;
  public _idUser;
  public producto: any = {};
  public load_btn = false;
  public reviews: Array<any> = [];
  public url;
  public page = 1;
  public pageSize = 15;
  constructor(
    private _route: ActivatedRoute,
    private _productoService: ProductoService
  ) {
    this.token = localStorage.getItem('token');
    this.url = GLOBAL.url;
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
                .listar_reviews_producto_publico(this.producto._id)
                .subscribe((res) => {
                  this.reviews = res.data;
                  console.log(res);
                });
            }
          },
          (err) => {
            console.log(err);
          }
        );
    });
  }
}
