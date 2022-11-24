import { Component, OnInit } from '@angular/core';
import { AdminService } from 'src/app/services/admin.service';
import Chart from 'chart.js/auto';
@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements OnInit {
  public token;
  public total_ganancia = 0;
  public total_mes = 0;
  public count_ventas = 0;
  public total_mes_ant = 0;
  constructor(private _adminService: AdminService) {
    this.token = localStorage.getItem('token');
  }

  ngOnInit(): void {
    this.init_data();
  }

  init_data() {
    this._adminService
      .kpi_ganancias_mensaules_admin(this.token)
      .subscribe((res) => {
        console.log(res);
        this.total_ganancia = res.total_ganancia;
        this.total_mes = res.total_mes;
        this.count_ventas = res.count_ventas;
        this.total_mes_ant = res.total_mes_ant;
        var canvas = <HTMLCanvasElement>document.getElementById('myChart');
        var ctx: any = canvas.getContext('2d');
        new Chart(ctx, {
          type: 'line',
          data: {
            labels: [
              'Enero',
              'Febrero',
              'Marzo',
              'Abril',
              'Mayo',
              'Junio',
              'Julio',
              'Agosto',
              'Septiembre',
              'Octubre',
              'Noviembre',
              'diciembre',
            ],
            datasets: [
              {
                label: 'Meses',
                data: [
                  res.enero,
                  res.febrero,
                  res.marzo,
                  res.abril,
                  res.mayo,
                  res.junio,
                  res.julio,
                  res.agosto,
                  res.septiembre,
                  res.octubre,
                  res.noviembre,
                  res.diciembre,
                ],
                borderWidth: 1,
              },
            ],
          },
          options: {
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          },
        });
      });
  }
}
