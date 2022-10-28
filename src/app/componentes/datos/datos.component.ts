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
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  styleUrls: ['./datos.component.css']
})
export class DatosComponent implements OnInit {
  @ViewChild('dropListContainer') dropListContainer?: ElementRef;
  dropListReceiverElement?: HTMLElement;
  dragDropInfo?: {
    dragIndex: number;
    dropIndex: number;
  };
  dataBaseError = false;
  personalDetailsList: any = [];
  educationList: any = [];
  experienceList: any;
  isPersonalDetailsEdit = false;
  isEducationEdit: number = 0;
  isExperienceEdit: number = 0;
  isNewExperience = false;
  isNewEducation = false;
  personalDetailsForm: FormGroup;
  educationForm: FormGroup;
  experienceForm: FormGroup;

  @Input() isUserLogin!: boolean;

  constructor(private apiDbService: ApiDbService,
    private formBuilder: FormBuilder) {

    this.personalDetailsForm = this.formBuilder.group({
      nameForm: ['', [Validators.required]],
      lastnameForm: ['', [Validators.required]],
      degreeForm: ['', [Validators.required]],
      cityForm: ['', [Validators.required]],
      aboutMeForm: ['', [Validators.required]],
      nationalityForm: ['', [Validators.required]]
    });

    this.educationForm = this.formBuilder.group({
      educationGradeForm: ['', [Validators.required]],
      educationDegreeForm: ['', [Validators.required]],
      educationInstitutionForm: ['', [Validators.required]],
      educationStartedForm: ['', [Validators.required]],
      educationEndedForm: ['', [Validators.required]],
      educationLogoForm: ['', [Validators.required]]
    });

    this.experienceForm = this.formBuilder.group({
      experienceJobForm: ['', [Validators.required]],
      experienceCompanyForm: ['', [Validators.required]],
      experienceStartedForm: ['', [Validators.required]],
      experienceEndedForm: ['', [Validators.required]],
      experienceLogoForm: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    /*-----------------------------------LECTURA EN BASE DE DATOS--------------------------------------------*/
    this.personalDetailsList = [{
      "id": 0, "name": "", "lastname": "", "degree": "", "city": "",
      "nationality": "", "aboutMe": ""
    }];

    this.educationList = [{
      "id_edu": 0, "rowIndex": 0, "grade": "", "degree": "", "institution": "",
      "started": "", "ended": "", "logo": ""
    }];

    this.experienceList = [{
      "id_exp": 0, "rowIndex": 0, "job": "", "company": "", "started": "", "ended": "", "logo": ""
    }];

    this.apiDbService.readDataBase(0).subscribe({
      next: data => {
        if (Object.values(data).length != 0) {
          this.personalDetailsList = data;
        }
      },
     // error: () => alert("Base de datos no conectada")
    });

    this.apiDbService.readDataBase(1).subscribe(data => {
      if (Object.values(data).length != 0) {
        this.educationList = data;
        this.educationList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);
      }
    });

    this.apiDbService.readDataBase(2).subscribe(data => {
      if (Object.values(data).length != 0) {
        this.experienceList = data;
        this.experienceList.sort((a: any, b: any) => a.rowIndex - b.rowIndex);
      }
    });

    this.resetExtraVariables();
  }

  get Data(){
    return this.experienceForm.get('job'), this.educationForm.get('logo');
  }

  /*------------------------ FUNCIONES PARA MODIFICACION DE VARIABLE PARA EDICION---------------------------*/

  tooglePersonalDetailsEdit() {
    this.resetExtraVariables();
    this.isPersonalDetailsEdit = !this.isPersonalDetailsEdit;
    this.personalDetailsForm.controls['nameForm'].setValue(this.personalDetailsList[0].name);
    this.personalDetailsForm.controls['lastnameForm'].setValue(this.personalDetailsList[0].lastname);
    this.personalDetailsForm.controls['degreeForm'].setValue(this.personalDetailsList[0].degree);
    this.personalDetailsForm.controls['cityForm'].setValue(this.personalDetailsList[0].city);
    this.personalDetailsForm.controls['aboutMeForm'].setValue(this.personalDetailsList[0].aboutMe);
    this.personalDetailsForm.controls['nationalityForm'].setValue(this.personalDetailsList[0].nationality);
  }

  toogleEducationEdit(id: number, index: number) {
    this.resetExtraVariables();
    this.isEducationEdit = id;
    this.educationForm.controls['educationGradeForm'].setValue(this.educationList[index].grade);
    this.educationForm.controls['educationDegreeForm'].setValue(this.educationList[index].degree);
    this.educationForm.controls['educationInstitutionForm'].setValue(this.educationList[index].institution);
    this.educationForm.controls['educationStartedForm'].setValue(this.educationList[index].started);
    this.educationForm.controls['educationEndedForm'].setValue(this.educationList[index].ended);
    this.educationForm.controls['educationLogoForm'].setValue(this.educationList[index].logo);
  }

  toogleExperienceEdit(id: number, index: number) {
    this.resetExtraVariables();
    this.isExperienceEdit = id;
    this.experienceForm.controls['experienceJobForm'].setValue(this.experienceList[index].job);
    this.experienceForm.controls['experienceCompanyForm'].setValue(this.experienceList[index].company);
    this.experienceForm.controls['experienceStartedForm'].setValue(this.experienceList[index].started);
    this.experienceForm.controls['experienceEndedForm'].setValue(this.experienceList[index].ended);
    this.experienceForm.controls['experienceLogoForm'].setValue(this.experienceList[index].logo);
  }

  /*----------------------------------FUNCIONES EXTRAS-----------------------*/

  readPersonalDetailsForm() {
    this.personalDetailsList[0].name = this.personalDetailsForm.get('nameForm')?.value;
    this.personalDetailsList[0].lastname = this.personalDetailsForm.get('lastnameForm')?.value;
    this.personalDetailsList[0].degree = this.personalDetailsForm.get('degreeForm')?.value;
    this.personalDetailsList[0].city = this.personalDetailsForm.get('cityForm')?.value;
    this.personalDetailsList[0].nationality = this.personalDetailsForm.get('nationalityForm')?.value;
    this.personalDetailsList[0].aboutMe = this.personalDetailsForm.get('aboutMeForm')?.value;
  }


  readExperienceForm(index: number) {
    this.experienceList[index].job = this.experienceForm.get('experienceJobForm')?.value;
    this.experienceList[index].company = this.experienceForm.get('experienceCompanyForm')?.value;
    this.experienceList[index].started = this.experienceForm.get('experienceStartedForm')?.value;
    this.experienceList[index].ended = this.experienceForm.get('experienceEndedForm')?.value;
    this.experienceList[index].logo = this.experienceForm.get('experienceLogoForm')?.value;
  }

  readEducationForm(index: number) {
    this.educationList[index].grade = this.educationForm.get('educationGradeForm')?.value;
    this.educationList[index].degree = this.educationForm.get('educationDegreeForm')?.value;
    this.educationList[index].institution = this.educationForm.get('educationInstitutionForm')?.value;
    this.educationList[index].started = this.educationForm.get('educationStartedForm')?.value;
    this.educationList[index].ended = this.educationForm.get('educationEndedForm')?.value;
    this.educationList[index].logo = this.educationForm.get('educationLogoForm')?.value;
  }

  resetExtraVariables() {
    this.isPersonalDetailsEdit = false;
    this.isNewExperience = false;
    this.isExperienceEdit = 0;
    this.isNewEducation = false;
    this.isEducationEdit = 0;
    this.dataBaseError = false;
  }

  toogleNewExperience() {
    this.resetExtraVariables();
    this.isNewExperience = !this.isNewExperience;
    this.experienceForm.reset();
  }

  toogleNewEducation() {
    this.resetExtraVariables();
    this.isNewEducation = !this.isNewEducation;
    this.educationForm.reset();
  }

  /*---------------FUNCIONES PARA EL GUARDADO DE DATOS-------------------------*/

  onSavePersonalDetails(event: Event) {
    event.preventDefault;
    this.readPersonalDetailsForm();
    
    if (this.personalDetailsList[0].id != 0) {
      this.apiDbService.editInformation(this.personalDetailsList[0], 0, this.personalDetailsList[0].id).subscribe({
        next: () => {
          this.isPersonalDetailsEdit = false;
          window.location.reload();
        },
        error: () => this.dataBaseError = true
      });
    }
    else {
      this.apiDbService.newInformation(this.personalDetailsList[0], 0).subscribe({
        next: () => {
          this.isPersonalDetailsEdit = false;
          window.location.reload();
        },
        error: () => this.dataBaseError = true
      });
    }
  }

  onSaveEducationEdit(event: Event, index: number) {
    event.preventDefault;
    this.readEducationForm(index);
    this.apiDbService.editInformation(this.educationList[index], 1, this.educationList[index].id_edu).subscribe({
      next:()=> this.isEducationEdit = 0,
      error: () => this.dataBaseError = true
    });
  }

  onSaveExperienceEdit(event: Event, index: number) {
    event.preventDefault;
    this.readExperienceForm(index);
    this.apiDbService.editInformation(this.experienceList[index], 2, this.experienceList[index].id_exp).subscribe({
      next:()=>this.isExperienceEdit = 0,
      error: () => this.dataBaseError = true
    });
  }

  onNewEducation(event: Event) {
    event.preventDefault;
    this.educationList.push({
      "id_edu": 0, "rowIndex": this.educationList.length, "grade": "", "degree": "", "institution": "",
      "started": "", "ended": "", "logo": ""
    });
    this.readEducationForm(this.educationList.length-1);
    if (this.educationList[0].id_edu == 0) {
      this.educationList[1].rowIndex = 0;
    }
    this.apiDbService.newInformation(this.educationList[this.educationList.length-1], 1).subscribe({
      next: () => {
        this.isNewEducation = false;
        this.ngOnInit()
      },
      error: () => this.dataBaseError = true
    });
  }

  onNewExperience(event: Event) {
    event.preventDefault;
    this.experienceList.push({
      "id_exp": 0, "rowIndex": this.experienceList.length, "job": "", "company": "", "started": "", "ended": "", "logo": ""
    });
    this.readExperienceForm(this.experienceList.length-1);
    if (this.experienceList[0].id_exp == 0) {
      this.experienceList[1].rowIndex = 0;
    }
    this.apiDbService.newInformation(this.experienceList[this.experienceList.length-1], 2).subscribe({
      complete: () => {
        this.isNewExperience = false;
        this.ngOnInit();
      },
      error: () => this.dataBaseError = true
    });
  }


  /*-----------------------FUNCION ELIMINAR DATOS--------------------------*/

  onDeleteExperience(index: number) {
    if (confirm("Deseas eliminar la experience con el puesto: " + this.experienceList[index].job + "?")) {
      this.apiDbService.deleteInformation(this.experienceList[index].id_exp, 2).subscribe({
        next: () => {
          this.experienceList.splice(index, 1);
          for (let i = 0; i < this.experienceList.length; i++) {
            this.experienceList[i].rowIndex = i;
          }
          this.apiDbService.saveCompleteList(2, this.experienceList).subscribe({
            error: () => alert("Error con la base de datos")
          })
          this.ngOnInit();
        },
        error: () => alert("Error: El dato no se eliminó en la base de datos")
      });
    }
  }

  onDeleteEducation(index: number) {
    if (confirm("Deseas eliminar la educación con el título: " + this.educationList[index].degree + "?")) {
      this.apiDbService.deleteInformation(this.educationList[index].id_edu, 1).subscribe({
        next: () => {
          this.educationList.splice(index, 1);
          for (let i = 0; i < this.educationList.length; i++) {
            this.educationList[i].rowIndex = i;
          }
          this.apiDbService.saveCompleteList(1, this.educationList).subscribe({
            error: () => alert("Error con la base de datos")
          })
          this.ngOnInit();
        },
        error: () => alert("Error: El dato no se eliminó en la base de datos")
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
   // console.log('dragEntered', { dragIndex, dropIndex });

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

  dragDropped(event: CdkDragDrop<number>, urlId: number, list: any) {
    if (!this.dropListReceiverElement) {
      console.log("soltar")
      for (let i = 0; i < list.length; i++) {
        list[i].rowIndex = i;
      }
      this.apiDbService.saveCompleteList(urlId, list).subscribe({
        error: () => alert("Error: Los datos no se guardaron en la base de datos")
      });
      return;
    }

    this.dropListReceiverElement.style.removeProperty('display');
    this.dropListReceiverElement = undefined;
    this.dragDropInfo = undefined;
  }
}

