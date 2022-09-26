import { Component, OnInit } from '@angular/core';
import { ApiDbService } from 'src/app/servicios/api-db.service';


@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.css']
})
export class BienvenidaComponent implements OnInit {
  personalDetailsList: any = [{
    "id": 0, "name": "", "degree": ""
  }];

  constructor(private apiDbService: ApiDbService) { }

  ngOnInit(): void {
    this.apiDbService.readDataBase(0).subscribe({
      next: (data) => {
        if (Object.values(data).length != 0) {
          this.personalDetailsList[0] = data[0];
        }
      }
    });
  }
}
