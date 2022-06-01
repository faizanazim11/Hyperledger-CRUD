import { AppServiceService } from './../app-service.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {

  constructor(private service: AppServiceService) { }

  ngOnInit(): void {
  }

  createPatient()
  {
    const patientId = Number((<HTMLInputElement>document.getElementById('patientId')).value);
    const firstName = (<HTMLInputElement>document.getElementById('firstName')).value;
    const middleName = (<HTMLInputElement>document.getElementById('middleName')).value;
    const lastName = (<HTMLInputElement>document.getElementById('lastName')).value;
    const age = Number((<HTMLInputElement>document.getElementById('age')).value);
    const gender = (<HTMLInputElement>document.getElementById('gender')).value;
    const condition = (<HTMLInputElement>document.getElementById('condition')).value;
    this.service.createPatient(patientId, firstName, middleName, lastName, age, gender, condition);
  }
}
