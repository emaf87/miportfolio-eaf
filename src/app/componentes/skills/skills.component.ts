import { Component, OnInit, Input, Renderer2, ElementRef, AfterViewInit } from '@angular/core';
import { ApiDbService } from 'src/app/servicios/api-db.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {

  @Input() isUserLogin!: boolean;

  skillForm: FormGroup;
  skillsList: Array<any> = [];
  isSkillEdit: number = 0;
  isNewSkill = false;

  constructor(private apiDbService: ApiDbService,
    private formBuilder: FormBuilder,
    private router: Router) {

    this.skillForm = this.formBuilder.group({
      nameFormForm: ['', [Validators.required]],
      valorForm: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {

    /*-----------------LECTURA DE DATOS----------------*/

    this.apiDbService.readDataBase(3).subscribe(data => {
      this.skillsList = data;
     /* if (Object.values(this.skillsList).length == 0) {                        //Si la DB esta vacia 
        //this.skillsList.push({ "id": 0, "nameForm": '', "valor": '' });         //inyecta un elemento vacio
      }*/
    });
  }

  //-----------------------FUNCIONES EXTRAS-------------------------------------

  toogleSkillEdit(id: number, index: number) {
    this.isSkillEdit = id;
    this.isNewSkill = false;
    if (this.isSkillEdit != 0) {
      this.skillForm = this.formBuilder.group({
        nameFormForm: [this.skillsList[index].nameForm, [Validators.required]],
        valorForm: [this.skillsList[index].valor, [Validators.required]]
      });
    }
  }

  toogleNewSkill() {
    this.skillForm.reset();
    this.isNewSkill = !this.isNewSkill;
    this.isSkillEdit = 0;
  }

  //------------------------------GUARDAR EDICION DE SKILL---------------------------

  onSaveEditSkill(event: Event, index: number) {
    event.preventDefault;
    this.isSkillEdit = 0;
    this.skillsList[index].nameForm = this.skillForm.get('nameFormForm')?.value;
    this.skillsList[index].valor = this.skillForm.get('valorForm')?.value;
    this.skillForm.reset();
    this.apiDbService.editInformation(this.skillsList[index], 3, this.skillsList[index].id).subscribe({
      next: () => this.ngOnInit(),
      error: () => alert("Error: La edicion no se realizó")
    });
  }

 

  //--------------------------------------GUARDAR NUEVA SKILL-------------------------------

  onNewSkill(event: Event) {
    event.preventDefault;
    this.skillsList.push({ "id": 0, "nameForm": this.skillForm.get('nameFormForm')?.value, "valor": this.skillForm.get('valorForm')?.value })
    this.toogleNewSkill();
    this.apiDbService.newInformation(this.skillsList[this.skillsList.length - 1], 3).subscribe({
      next: () => this.ngOnInit(),
      error: () => alert("Error: La habilidad no se guardó en la base de datos")
    });
  }

  //--------------------------------ELIMINAR SKILL---------------------------------

  onDeleteSkill(index: number) {
    if (confirm("Deseas eliminar la habilidad " + this.skillsList[index].nameForm + "?")) {
      this.apiDbService.deleteInformation(this.skillsList[index].id, 3).subscribe({
        next: () => this.ngOnInit(),
        error: () => alert("Error: La habilidad no se eliminó de la base de datos")
      });
    }
  }

}

