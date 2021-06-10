import { EvaluationService } from './../_services/evaluation.service';
import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { FinalEvaluation } from "../_models/finalEvaluation";
import { User } from "../_models/user";
import { AccountService } from "../_services/account.service";

@Injectable(
    {
        providedIn: 'root'
    }
)
export class EvaluationDetailsResolver implements Resolve<FinalEvaluation>{
    constructor(private evalService:EvaluationService) {
    }
    resolve(route: ActivatedRouteSnapshot):Observable<FinalEvaluation>{
        return this.evalService.getEmployeeEvaluation(route.paramMap.get('id'));
        //we used resolver becuase it loaded before compnont int
    }

}
