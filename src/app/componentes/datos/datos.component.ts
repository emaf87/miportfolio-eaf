import { Component, OnInit, Input } from '@angular/core';
import { ApiDbService } from 'src/app/servicios/api-db.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-datos',
  templateUrl: './datos.component.html',
  styleUrls: ['./datos.component.css']
})
export class DatosComponent implements OnInit {
  personalDetailsList: any = [];
  educationList: any = [];
  experienceList: any = [];
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
      nacionalityForm: ['', [Validators.required]]
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

    this.apiDbService.readDataBase(0).subscribe({
      next: data => {
        this.personalDetailsList = data;
        if (Object.values(data).length == 0) {
          this.personalDetailsList.push({
            "id": 0, "name": "", "lastname": "", "degree": "", "city": "",
            "nacionality": "", "aboutMe": ""
          });
        }
        else {
          this.personalDetailsList = data;
        }
      },
      error: () => alert("Base de datos no conectada")
    });

    this.apiDbService.readDataBase(1).subscribe(data => {
      this.educationList = data;
      this.educationList.reverse();
      if (Object.values(this.educationList).length == 0) {
        this.educationList.push({
          "id_edu": 0, "grade": '', "degree": '', "institution": '',
          "started": '', "ended": '', "logo": ''
        });
      }
    });

    this.apiDbService.readDataBase(2).subscribe(data => {
      this.experienceList = data;
      this.experienceList.reverse();

      if (Object.values(this.experienceList).length == 0) {
        this.experienceList.push({
          "id_exp": 0, "job": "", "company": "", "starded": "", "ended": "", "logo": ""
        });
      }
    });

    this.resetExtraVariables();
  }

  /*------------------------ FUNCIONES PARA MODIFICACION DE VARIABLE PARA EDICION---------------------------*/

  tooglePersonalDetailsEdit() {
    this.resetExtraVariables();
    this.isPersonalDetailsEdit = !this.isPersonalDetailsEdit;

    this.personalDetailsForm = this.formBuilder.group({
      nameForm: [this.personalDetailsList[0].name, [Validators.required]],
      lastnameForm: [this.personalDetailsList[0].lastname, [Validators.required]],
      degreeForm: [this.personalDetailsList[0].degree, [Validators.required]],
      cityForm: [this.personalDetailsList[0].city, [Validators.required]],
      aboutMeForm: [this.personalDetailsList[0].aboutMe, [Validators.required]],
      nacionalityForm: [this.personalDetailsList[0].nacionality, [Validators.required]]
    })
  }

  toogleEducationEdit(id: number, index: number) {
    this.resetExtraVariables();
    this.isEducationEdit = id;

    this.educationForm = this.formBuilder.group({
      educationGradeForm: [this.educationList[index].grade, [Validators.required]],
      degreeForm: [this.educationList[index].degree, [Validators.required]],
      educationInstitutionForm: [this.educationList[index].institution, [Validators.required]],
      experienceStartedForm: [this.educationList[index].starded, [Validators.required]],
      educationEndedForm: [this.educationList[index].ended, [Validators.required]],
      educationLogoForm: [this.educationList[index].logo, [Validators.required]],
    });
  }

  toogleExperienceEdit(id: number, index: number) {
    this.resetExtraVariables();
    this.isExperienceEdit = id;

    this.experienceForm = this.formBuilder.group({
      experienceJobForm: [this.experienceList[index].job, [Validators.required]],
      experienceCompanyForm: [this.experienceList[index].company, [Validators.required]],
      experienceStartedForm: [this.experienceList[index].starded, [Validators.required]],
      educationEndedForm: [this.experienceList[index].ended, [Validators.required]],
      educationLogoForm: [this.experienceList[index].logo, [Validators.required]]
    })
  }

  /*----------------------------------FUNCIONES EXTRAS-----------------------*/

  readPersonalDetailsForm() {
    this.personalDetailsList[0].nameForm = this.personalDetailsForm.get('nameForm')?.value;
    this.personalDetailsList[0].lastnameFormForm = this.personalDetailsForm.get('lastnameForm')?.value;
    this.personalDetailsList[0].degree = this.personalDetailsForm.get('degreeForm')?.value;
    this.personalDetailsList[0].city = this.personalDetailsForm.get('cityForm')?.value;
    this.personalDetailsList[0].nacionality = this.personalDetailsForm.get('nacionalityForm')?.value;
    this.personalDetailsList[0].aboutMe = this.personalDetailsForm.get('aboutMeForm')?.value;

  }


  readExperienceForm(index: number) {
    this.experienceList[index].job = this.experienceForm.get('experienceJobForm')?.value;
    this.experienceList[index].company = this.experienceForm.get('experienceCompanyForm')?.value;
    this.experienceList[index].started = this.experienceForm.get('experienceStartedForm')?.value;
    this.experienceList[index].ended = this.experienceForm.get('educationEndedForm')?.value;
    this.experienceList[index].logo = this.experienceForm.get('logoForm')?.value;
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
    this.isPersonalDetailsEdit = false;
    if (this.personalDetailsList[0].id != 0) {
      this.apiDbService.editInformation(this.personalDetailsList[0], 0, this.personalDetailsList[0].id).subscribe({
        next: () => this.ngOnInit(),
        error: () => alert("Error: La edicion no se guardó en la base de datos")
      });
    }
    else {
      this.apiDbService.newInformation(this.personalDetailsList[0], 0).subscribe({
        next: () => this.ngOnInit(),
        error: () => alert("Error: Los datos no se guardaron en la base de datos")
      });
    }
  }

  onSaveEducationEdit(event: Event, index: number) {
    event.preventDefault;
    this.readEducationForm(index);
    this.isEducationEdit = 0;
    this.apiDbService.editInformation(this.educationList[index], 1, this.educationList[index].id_edu).subscribe({
      next: () => this.ngOnInit(),
      error: () => alert("Error: Los datos no se guardaron en la base de datos")
    });
  }

  onSaveExperienceEdit(event: Event, index: number) {
    event.preventDefault;
    this.readExperienceForm(index);
    this.isExperienceEdit = 0;
    this.apiDbService.editInformation(this.experienceList[index], 2, this.experienceList[index].id_exp).subscribe({
      next: () => this.ngOnInit(),
      error: () => alert("Error: Los datos no se guardaron en la base de datos")
    });
  }

  onNewEducation(event: Event) {
    event.preventDefault;
    this.isNewExperience = false;
    this.readEducationForm(0);
    this.educationList[0].id_edu = 0;
    this.apiDbService.newInformation(this.educationList[0], 1).subscribe({
      next: () => this.ngOnInit(),
      error: () => alert("Error: Los datos no se guardaron en la base de datos")
    });
  }

  onNewExperience(event: Event) {
    event.preventDefault;
    this.readExperienceForm(0);
    this.experienceList[0].id_exp = 0;
    console.log(this.experienceList[0]);
    this.apiDbService.newInformation(this.experienceList[0], 2).subscribe({
      next: () => this.ngOnInit(),
      error: () => alert("Error: El dato no se guardó en la base de datos")
    });
  }


  /*-----------------------FUNCION ELIMINAR DATOS--------------------------*/

  onDeleteExperience(index: number) {
    if (confirm("Deseas eliminar la experience con el job: " + this.experienceList[index].job + "?")) {
      this.apiDbService.deleteInformation(this.experienceList[index].id_exp, 2).subscribe({
        next: () => this.ngOnInit(),
        error: () => alert("Error: El dato no se eliminó en la base de datos")
      });
    }
  }

  onEliminarEdu(index: number) {
    if (confirm("Deseas eliminar la education con el título: " + this.educationList[index].job + "?")) {
      this.apiDbService.deleteInformation(this.educationList[index].id_edu, 1).subscribe({
        next: () => this.ngOnInit(),
        error: () => alert("Error: El dato no se eliminó en la base de datos")
      });
    }
  }
}
