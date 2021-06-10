import { FinalEvaluation } from './../_models/finalEvaluation';
import { Employee } from './../_models/Employee';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';
import { EvaluationReport } from '../_models/evaluationReport';

@Injectable({
  providedIn: 'root'
})
export class EvaluationService {
  baseUrl = environment.baseUrl;
  employees : Employee[] = [];

  constructor(private http: HttpClient) { }

  // getEmployees() {
  //   if(this.employees.length==0)
  //   return this.http.get(this.baseUrl + 'Evaluations/employees').pipe(
  //     map((epms : Employee[])=>{
  //       this.employees = epms;
  //       return epms;
  //     })
  //   );

  //   return of(this.employees)
  // }

  getEmployee(id:string){
    if(this.employees.length > 0)
    return of(this.employees.find(e=>e.id == id));
    else
    return this.http.get<Employee>(this.baseUrl + 'Evaluations/employee/' + id)
  }

  evaluateEmployee(model:any){
   return  this.http.post<Employee>(this.baseUrl + 'Evaluations/evaluate-employee', model)
  }
  getEmployeeEvaluation(id:string){
    return  this.http.get<FinalEvaluation>(this.baseUrl + 'Evaluations/employee-evaluation/' + id)
   }

   getReport(){
    return this.http.get(this.baseUrl + 'Evaluations/evaluation-report/')
   }

   getDashboard(){
    return this.http.get(this.baseUrl + 'Evaluations/dashboard')
   }

}
