import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable } from "rxjs";
import { User } from "../_models/user";
import { AccountService } from "../_services/account.service";

@Injectable(
    {
        providedIn: 'root'
    }
)
export class UserDetailedResolver implements Resolve<User>{
    constructor(private accouuntService:AccountService) {
    }
    resolve(route: ActivatedRouteSnapshot):Observable<User>{
        return this.accouuntService.getUser(route.paramMap.get('username'));
        //we used resolver becuase it loaded before compnont int
    }

}