import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AppServiceService {

  baseURL = 'http://192.168.49.2:31704/patient';

  constructor(private http: HttpClient) { }

  readPatient(id: number): Observable<any>{
    return this.http.get(this.baseURL+"/read/"+id);
  }

  createPatient(patientId: number, firstName: string, middleName: string, lastName: string, age: number, gender: string, condition: string) {
    const data = {
      patientId: patientId,
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      age: age,
      gender: gender,
      condition: condition
    }
    this.http.post(this.baseURL+"/create", data).subscribe(data=>console.log(data));
  }

  updatePatient(patientId: number, firstName: string, middleName: string, lastName: string, age: number, gender: string, condition: string) {
    const data = {
      patientId: patientId,
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
      age: age,
      gender: gender,
      condition: condition
    }
    this.http.put(this.baseURL + "/update", data).subscribe(data => console.log(data));
  }

  deletePatient(id: number) {
    this.http.delete(this.baseURL + "/delete/" + id).subscribe(data=>console.log(data));
  }
}
