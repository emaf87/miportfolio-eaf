import { Component, OnInit, Input } from '@angular/core';
import { ApiDbService } from 'src/app/servicios/api-db.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


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
    private formBuilder: FormBuilder) {

    this.skillForm = this.formBuilder.group({
      nameForm: ['', [Validators.required]],
      valueForm: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {

    /*-----------------LECTURA DE DATOS----------------*/

    this.apiDbService.readDataBase(3).subscribe(data => {
      this.skillsList = data;
    });
  }

  get Name() {
    return this.skillForm.get('nameForm');
  }

  get Value() {
    return this.skillForm.get('valueForm');
  }
  //-----------------------FUNCIONES EXTRAS-------------------------------------

  toogleSkillEdit(id: number, index: number) {
    this.isSkillEdit = id;
    this.isNewSkill = false;
    if (this.isSkillEdit != 0) {

      let str = (this.skillsList[index].value).split("%", 2)
      this.skillForm = this.formBuilder.group({
        nameForm: [this.skillsList[index].name, [Validators.required]],
        valueForm: [str[0], [Validators.required]]
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
    this.skillsList[index].name = this.skillForm.get('nameForm')?.value;
    this.skillsList[index].value = this.skillForm.get('valueForm')?.value + '%';
    this.skillForm.reset();
    this.apiDbService.editInformation(this.skillsList[index], 3, this.skillsList[index].id).subscribe({
      next: () => {
        alert("Edición guardada");
        // this.ngOnInit();
      },
      error: () => alert("Error: La edicion no se realizó")
    });
  }

  //--------------------------------------GUARDAR NUEVA SKILL-------------------------------

  onNewSkill(event: Event) {
    event.preventDefault;
    this.skillsList.push({ "id": 0, "name": this.skillForm.get('nameForm')?.value, "value": this.skillForm.get('valueForm')?.value + '%' })
    this.toogleNewSkill();
    this.apiDbService.newInformation(this.skillsList[this.skillsList.length - 1], 3).subscribe({
      next: () => {
        alert("Skill guardado");
        this.ngOnInit();
      },
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

