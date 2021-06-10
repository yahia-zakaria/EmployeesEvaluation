import { Employee } from './../_models/Employee';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { EvaluationService } from "../_services/evaluation.service";

@Injectable(
    {
        providedIn: 'root'
    }
)
export class EmployeeDetailsResolver implements Resolve<Employee>{
    constructor(private evalService:EvaluationService) {
    }
    resolve(route: ActivatedRouteSnapshot):Observable<Employee>{
        return this.evalService.getEmployee(route.paramMap.get('id'));
        //we used resolver becuase it loaded before compnont int
    }

}
