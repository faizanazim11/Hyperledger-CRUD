import { Component, OnInit } from '@angular/core';
import { AppServiceService } from '../app-service.service';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrls: ['./delete.component.scss']
})
export class DeleteComponent implements OnInit {

  constructor(private service: AppServiceService) { }

  ngOnInit(): void {
  }

  delete() {
    const id = Number((<HTMLInputElement>document.getElementById('patientId')).value);
    this.service.deletePatient(id);
  }
}
