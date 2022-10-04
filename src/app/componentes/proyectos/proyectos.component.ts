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

  isProjectEdit = 0;
  isNewProject = false;
  projectsList: any = [];
  projectForm: FormGroup;

  constructor(private apiDbService: ApiDbService,
    private formBuilder: FormBuilder) {
    this.projectForm = this.formBuilder.group({
      nameForm: ['', Validators.required],
      urlForm: ['', Validators.required],
      imageForm: ['', Validators.required]
    })
  }

  ngOnInit(): void {

    /*------------------------LECTURA DE DATOS-------------------------------*/

    this.apiDbService.readDataBase(4).subscribe(data => {
      this.projectsList = data;
      if (Object.values(this.projectsList).length == 0) {
        this.projectsList.push({ "id": 0, "name": '', "url": '', "image": '' });
      }
    })
  }

  toogleprojectEdit(id: number, index: number) {
    this.isNewProject = false;
    this.isProjectEdit = id;
    if (this.isProjectEdit != 0) {
      this.projectForm = this.formBuilder.group({
        nameForm: [this.projectsList[index].name, Validators.required],
        urlForm: [this.projectsList[index].url, Validators.required],
        imageForm: [this.projectsList[index].image, Validators.required]
      });
    }
  }

  toogleNewproject() {
    this.isNewProject = !this.isNewProject;
    this.isProjectEdit = 0;
    this.projectForm.reset();
  }

  /*------------------GUARDAR EDICION DE DATOS-------------------------*/

  onSaveprojectEdit(event: Event, index: number) {
    event.preventDefault;
    this.projectsList[index].name = this.projectForm.get('nameForm')?.value;
    this.projectsList[index].url = this.projectForm.get('urlForm')?.value;
    this.projectsList[index].image = this.projectForm.get('imageForm')?.value;
    this.isProjectEdit = 0;
    this.apiDbService.editInformation(this.projectsList[index], 4, this.projectsList[index].id).subscribe({
      next: () => alert("Edición guardada"),
      error: () => alert("Error: La edicion no se guardó en la base de datos")
    });
  }

  /*----------------------GUARDAR NUEVO PROYECTO------------------------*/

  onSaveNewproject(event: Event) {
    event.preventDefault;
    this.projectsList[0].id = 0;
    this.projectsList[0].name = this.projectForm.get('nameForm')?.value;
    this.projectsList[0].url = this.projectForm.get('urlForm')?.value;
    this.projectsList[0].image = this.projectForm.get('imageForm')?.value;
    this.isNewProject = false;
    console.log(this.projectsList[0])
    this.apiDbService.newInformation(this.projectsList[0], 4).subscribe({
      next: () => {
        alert("projecto guardado!");
        this.ngOnInit()
      },
      error: () => alert("Error: El projecto no se guardó en la base de datos")
    });
  }

  onDeleteproject(index: number) {
    if (confirm("Deseas eliminar el projecto " + this.projectsList[index].nameForm + "?")) {
      this.apiDbService.deleteInformation(this.projectsList[index].id, 4).subscribe({
        next: () => this.ngOnInit(),
        error: () => alert("Error: El projecto no se eliminó de la base de datos")
      });
    }
  }
}
