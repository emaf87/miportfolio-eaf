import { Component, OnInit } from '@angular/core';
//import { MailService } from '@sendgrid/mail'


@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {

  constructor(//private mail: MailService
  ) { }

  ngOnInit(): void {
  }

  sendMail() {
    //this.mail.setApiKey("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");


  }
}
