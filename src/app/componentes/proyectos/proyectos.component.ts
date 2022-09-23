import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiDbService } from 'src/app/servicios/api-db.service';



@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css']
})


export class ProyectosComponent implements OnInit {

  @Input() isUserLogin!: boolean;

  isProyectEdit = 0;
  isNewProyect = false;
  proyectsList: any = [];
  proyectForm: FormGroup;

  constructor(private apiDbService: ApiDbService,
    private formBuilder: FormBuilder) {

    this.proyectForm = this.formBuilder.group({
      nameForm: ['', Validators.required],
      urlForm: ['', Validators.required],
      imageForm: ['', Validators.required]
    })

  }

  ngOnInit(): void {

    /*------------------------LECTURA DE DATOS-------------------------------*/

    this.apiDbService.readDataBase(4).subscribe(data => {
      this.proyectsList = data;
      if (Object.values(this.proyectsList).length == 0) {
        this.proyectsList.push({ "id": 0, "name": '', "url": '', "image": '' });
      }
    })
  }

  toogleProyectEdit(id: number, index: number) {
    this.isNewProyect = false;
    this.isProyectEdit = id;
    if (this.isProyectEdit != 0) {
      this.proyectForm = this.formBuilder.group({
        nameForm: [this.proyectsList[index].name, Validators.required],
        urlForm: [this.proyectsList[index].url, Validators.required],
        imageForm: [this.proyectsList[index].image, Validators.required]
      });
    }
  }

  toogleNewProyect() {
    this.isNewProyect = !this.isNewProyect;
    this.isProyectEdit = 0;
    this.proyectForm.reset();
  }

  /*------------------GUARDAR EDICION DE DATOS-------------------------*/

  onSaveProyectEdit(event: Event, index: number) {
    event.preventDefault;
    this.proyectsList[index].name = this.proyectForm.get('nameForm')?.value;
    this.proyectsList[index].url = this.proyectForm.get('urlForm')?.value;
    this.proyectsList[index].image = this.proyectForm.get('imageForm')?.value;
    this.isProyectEdit = 0;
    this.apiDbService.editInformation(this.proyectsList[index], 4, this.proyectsList[index].id).subscribe({
      next: () => alert("Edición guardada"),
      error: () => alert("Error: La edicion no se guardó en la base de datos")
    });
  }


  /*----------------------GUARDAR NUEVO PROYECTO------------------------*/

  onSaveNewProyect(event: Event) {
    event.preventDefault;
    this.proyectsList[0].id = 0;
    this.proyectsList[0].name = this.proyectForm.get('nameForm')?.value;
    this.proyectsList[0].url = this.proyectForm.get('urlForm')?.value;
    this.proyectsList[0].image = this.proyectForm.get('imageForm')?.value;
    this.isNewProyect = false;
    this.apiDbService.newInformation(this.proyectsList[0], 4).subscribe({
      next: () => {
        alert("Proyecto guardado")
        this.ngOnInit()
      },
      error: () => alert("Error: El proyecto no se guardó en la base de datos")
    });

  }

  onDeleteProyect(index: number) {
    if (confirm("Deseas eliminar el proyecto " + this.proyectsList[index].nameForm + "?")) {
      this.apiDbService.deleteInformation(this.proyectsList[index].id, 4).subscribe({
        next: () => this.ngOnInit(),
        error: () => alert("Error: El proyecto no se eliminó de la base de datos")
      });
    }
  }
}
