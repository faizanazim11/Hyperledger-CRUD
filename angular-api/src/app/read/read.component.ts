import { AppServiceService } from './../app-service.service';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-read',
  templateUrl: './read.component.html',
  styleUrls: ['./read.component.scss']
})
export class ReadComponent implements OnInit {

  constructor(private service: AppServiceService) { }

  ngOnInit(): void {
  }

  read() {
    const id = Number((<HTMLInputElement>document.getElementById('patientId')).value);
    this.service.readPatient(id).subscribe(data=>{
      (<HTMLTableColElement>document.getElementById('firstName')).innerHTML=data.firstName;
      (<HTMLTableColElement>document.getElementById('middleName')).innerHTML = data.middleName;
      (<HTMLTableColElement>document.getElementById('lastName')).innerHTML = data.lastName;
      (<HTMLTableColElement>document.getElementById('age')).innerHTML = data.age;
      (<HTMLTableColElement>document.getElementById('gender')).innerHTML = data.gender;
      (<HTMLTableColElement>document.getElementById('condition')).innerHTML = data.condition;
      (<HTMLTableElement>document.getElementById('output-table')).style.visibility = 'visible';
    });
  }

}
