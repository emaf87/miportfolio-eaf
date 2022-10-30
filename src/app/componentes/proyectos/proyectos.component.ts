import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { ApiDbService } from 'src/app/servicios/api-db.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  CdkDragDrop,
  CdkDragEnter,
  CdkDragMove,
  moveItemInArray
} from '@angular/cdk/drag-drop';
@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css']
})

export class ProyectosComponent implements OnInit {

  @Input() isUserLogin!: boolean;
  @ViewChild('dropListContainer') dropListContainer?: ElementRef;
  dropListReceiverElement?: HTMLElement;
  dragDropInfo?: {
    dragIndex: number;
    dropIndex: number;
  };

  isProjectEdit = 0;
  isNewProject = false;
  isShowDetails = 0;
  projectsList: Array<any> = [];
  projectForm: FormGroup;
  dataBaseError = false;

  constructor(private apiDbService: ApiDbService,
    private formBuilder: FormBuilder) {
    this.projectForm = this.formBuilder.group({
      nameForm: ['', Validators.required],
      descriptionForm: ['', Validators.required],
      dateForm: ['', Validators.required],
      urlForm: ['', [Validators.required, Validators.pattern(`(${'http://.*'})|(${'https://.*'})|(${'www.*'}|(${'WWW.*'}))`)]],
      imageForm: ['', Validators.required]
    })
  }

  ngOnInit(): void {

    /*------------------------LECTURA DE DATOS-------------------------------*/

    this.apiDbService.readDataBase(4).subscribe(data => {
      this.projectsList = data;
      this.projectsList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);
    })
  }

  get Name() {
    return this.projectForm.get('nameForm');
  }

  get Description() {
    return this.projectForm.get('descriptionForm');
  }

  get Date(){
    return this.projectForm.get('dateForm');
  }

  get Url() {
    return this.projectForm.get('urlForm');
  }

  get Image() {
    return this.projectForm.get('imageForm');
  }

  setFormValues(index:number){
    this.projectForm.controls['nameForm'].setValue(this.projectsList[index].name);
    this.projectForm.controls['descriptionForm'].setValue(this.projectsList[index].description);
    this.projectForm.controls['dateForm'].setValue(this.projectsList[index].date);
    this.projectForm.controls['urlForm'].setValue(this.projectsList[index].url);
    this.projectForm.controls['imageForm'].setValue(this.projectsList[index].image);
  }


  toogleprojectEdit(id: number, index: number) {
    this.isNewProject = false;
    this.isProjectEdit = id;
    this.dataBaseError = false;
    if (this.isProjectEdit != 0) {
      this.setFormValues(index);
    }
  }

  toogleNewproject() {
    this.isShowDetails = 0;
    this.isNewProject = !this.isNewProject;
    this.isProjectEdit = 0;
    this.projectForm.reset();
    this.dataBaseError = false;
  }

  toogleShowDetails(id: number, index:number) {
    this.isShowDetails = id;
    this.setFormValues(index);
  }

  /*------------------GUARDAR EDICION DE DATOS-------------------------*/

  onSaveprojectEdit(event: Event, index: number) {
    event.preventDefault;
    this.projectsList[index].name = this.projectForm.get('nameForm')?.value;
    this.projectsList[index].description = this.projectForm.get('descriptionForm')?.value;
    this.projectsList[index].date = this.projectForm.get('dateForm')?.value;
    this.projectsList[index].url = this.projectForm.get('urlForm')?.value;
    this.projectsList[index].image = this.projectForm.get('imageForm')?.value;
    this.apiDbService.editInformation(this.projectsList[index], 4, this.projectsList[index].id).subscribe({
      next: () => {
        this.isProjectEdit = 0;
        this.projectForm.reset();
      },
      error: () => this.dataBaseError = true
    });
  }

  /*----------------------GUARDAR NUEVO PROYECTO------------------------*/

  onSaveNewproject(event: Event) {
    event.preventDefault;
    this.projectsList.push({
      "id": 0, "rowIndex": this.projectsList.length, "name": this.projectForm.get('nameForm')?.value,
      "description": this.projectForm.get('descriptionForm')?.value, "date":this.projectForm.get('dateForm')?.value,
       "url": this.projectForm.get('urlForm')?.value, "image": this.projectForm.get('imageForm')?.value
    });
    this.apiDbService.newInformation(this.projectsList[this.projectsList.length - 1], 4).subscribe({
      next: () => {
        this.isNewProject = false;
        this.ngOnInit();
      },
      error: () => this.dataBaseError = true
    });
  }

  onDeleteproject(index: number) {
    if (confirm("Deseas eliminar el projecto " + this.projectsList[index].nameForm + "?")) {
      this.apiDbService.deleteInformation(this.projectsList[index].id, 4).subscribe({
        next: () => {
          this.projectsList.splice(index, 1);
          for (let i = 0; i < this.projectsList.length; i++) {
            this.projectsList[i].rowIndex = i;
          }
          this.apiDbService.saveCompleteList(4, this.projectsList).subscribe({
            error: () => alert("Error con la base de datos")
          })
          this.ngOnInit();
        },
        error: () => alert("Error: El projecto no se eliminó de la base de datos")
      });
    }
  }

  //------------------------------------DRAG&DROP---------------------------------

  dragEntered(event: CdkDragEnter<number>, list: any) {
    const drag = event.item;
    const dropList = event.container;
    const dragIndex = drag.data;
    const dropIndex = dropList.data;
    this.dragDropInfo = { dragIndex, dropIndex };
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
      for (let i = 0; i < this.projectsList.length; i++) {
        this.projectsList[i].rowIndex = i;
      }
      this.apiDbService.saveCompleteList(4, this.projectsList).subscribe({
        error: () => alert("Error: Los datos no se guardaron en la base de datos")
      });
      return;
    }

    this.dropListReceiverElement.style.removeProperty('display');
    this.dropListReceiverElement = undefined;
    this.dragDropInfo = undefined;
  }
}
