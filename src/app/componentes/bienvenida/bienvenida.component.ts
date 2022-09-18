import { Component, OnInit } from '@angular/core';
import { ApiDbService } from 'src/app/servicios/api-db.service';


@Component({
  selector: 'app-bienvenida',
  templateUrl: './bienvenida.component.html',
  styleUrls: ['./bienvenida.component.css']
})
export class BienvenidaComponent implements OnInit {
  personalDetailsList: any = [];

  constructor(private apiDbService: ApiDbService) { }

  ngOnInit(): void {
    this.apiDbService.readDataBase(0).subscribe(data => {


      if (Object.values(data).length == 0) {
        this.personalDetailsList.push({
          "id": 0, "name": "", "degree": ""
        });
        console.log(this.personalDetailsList.value);
      }
      else {
        this.personalDetailsList[0] = data[0];
      }
    });

  }
}
