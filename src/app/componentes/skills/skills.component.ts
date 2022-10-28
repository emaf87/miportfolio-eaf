import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ApiDbService } from 'src/app/servicios/api-db.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgCircleProgressModule } from 'ng-circle-progress';
import {
  CdkDragDrop,
  CdkDragEnter,
  CdkDragMove,
  moveItemInArray
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {

  @Input() isUserLogin!: boolean;

  @ViewChild('dropListContainer') dropListContainer?: ElementRef;
  dropListReceiverElement?: HTMLElement;
  dragDropInfo?: {
    dragIndex: number;
    dropIndex: number;
  };

  skillForm: FormGroup;
  skillsList: Array<any> = [];
  isSkillEdit = 0;
  isNewSkill = false; 
  dataBaseError = false;
  newSkillData:any;
  color='red';

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
      this.skillsList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);
    });
  }

  get Name() {
    return this.skillForm.get('nameForm');
  }

  get Value() {
    return this.skillForm.get('valueForm');
  }

  ColorBarra(valor:number){
    if(valor<25){
      return 'red';
    }
    else if(valor<50){
      return 'orange';
    }
    else if(valor<75){
      return '#e3e704';
    }
    else{
      return '#20a805';
    }
  }

  //-----------------------FUNCIONES EXTRAS-------------------------------------

  toogleSkillEdit(id: number, index: number) {
    this.isSkillEdit = id;
    this.isNewSkill = false;
    this.dataBaseError = false;
    if (this.isSkillEdit != 0) {
      //let valueString = (this.skillsList[index].value).split("%", 2)
      this.skillForm.controls['nameForm'].setValue(this.skillsList[index].name);
      this.skillForm.controls['valueForm'].setValue(this.skillsList[index].value);
    }
  }

  toogleNewSkill() {
    this.skillForm.reset();
    this.isNewSkill = !this.isNewSkill;
    this.isSkillEdit = 0;
    this.dataBaseError = false;
  }

  //------------------------------GUARDAR EDICION DE SKILL---------------------------

  onSaveEditSkill(event: Event, index: number) {
    event.preventDefault;
    this.skillsList[index].name = this.skillForm.get('nameForm')?.value;
    this.skillsList[index].value = this.skillForm.get('valueForm')?.value;
    this.apiDbService.editInformation(this.skillsList[index], 3, this.skillsList[index].id).subscribe({
      next: () => {
        this.isSkillEdit = 0;
        this.skillForm.reset();
      },
      error: () => this.dataBaseError = true
    });
  }

  //--------------------------------------GUARDAR NUEVA SKILL-------------------------------

  onNewSkill(event: Event) {
    event.preventDefault;
    this.newSkillData = [{ "id": 0, "rowIndex": this.skillsList.length, "name": this.skillForm.get('nameForm')?.value,
     "value": this.skillForm.get('valueForm')?.value}];
    console.log(this.newSkillData);
    this.apiDbService.newInformation(this.newSkillData[0], 3).subscribe({
      next: () => {
        this.toogleNewSkill();
        this.ngOnInit();
      },
      error: () => this.dataBaseError = true
    });
  }

  //--------------------------------ELIMINAR SKILL---------------------------------

  onDeleteSkill(index: number) {
    if (confirm("Deseas eliminar la habilidad " + this.skillsList[index].name + "?")) {
      console.log(this.skillsList[index].id);
      this.apiDbService.deleteInformation(this.skillsList[index].id, 3).subscribe({
        next: () => {
          this.skillsList.splice(index, 1);
          for (let i = 0; i < this.skillsList.length; i++) {
            this.skillsList[i].rowIndex = i;
          }
          this.apiDbService.saveCompleteList(3, this.skillsList).subscribe({
            error: () => alert("Error con la base de datos")
          })
          this.ngOnInit();
        },
        error: () => alert("Error: La habilidad no se eliminó de la base de datos")
      })
    }
  }
  //------------------------------------DRAG&DROP---------------------------------

  dragEntered(event: CdkDragEnter<number>, list: any) {
    const drag = event.item;
    const dropList = event.container;
    const dragIndex = drag.data;
    const dropIndex = dropList.data;

    this.dragDropInfo = { dragIndex, dropIndex };
    console.log('dragEntered', { dragIndex, dropIndex });

    const phContainer = dropList.element.nativeElement;
    const phElement = phContainer.querySelector('.cdk-drag-placeholder');

    if (phElement) {
      phContainer.removeChild(phElement);
      phContainer.parentElement?.insertBefore(phElement, phContainer);

      moveItemInArray(list, dragIndex, dropIndex);
    }
  }

  dragMoved(event: CdkDragMove<number>) {
    if (!this.dropListContainer || !this.dragDropInfo) return;

    const placeholderElement =
      this.dropListContainer.nativeElement.querySelector(
        '.cdk-drag-placeholder'
      );

    const receiverElement =
      this.dragDropInfo.dragIndex > this.dragDropInfo.dropIndex
        ? placeholderElement?.nextElementSibling
        : placeholderElement?.previousElementSibling;

    if (!receiverElement) {
      return;
    }

    receiverElement.style.display = 'none';
    this.dropListReceiverElement = receiverElement;
  }

  dragDropped(event: CdkDragDrop<number>) {
    if (!this.dropListReceiverElement) {
      console.log("soltar")
      for (let i = 0; i < this.skillsList.length; i++) {
        console.log(this.skillsList[i]);
        this.skillsList[i].rowIndex = i;
      }
      this.apiDbService.saveCompleteList(3, this.skillsList).subscribe({
        error: () => alert("Error: Los datos no se guardaron en la base de datos")
      });
      return;
    }

    this.dropListReceiverElement.style.removeProperty('display');
    this.dropListReceiverElement = undefined;
    this.dragDropInfo = undefined;
  }
}

