import { Criterion } from './../_models/criterion';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { of, ReplaySubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map, take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CriterionService {
  baseUrl = environment.baseUrl;
  criteria : Criterion[] = [];

  constructor(private http: HttpClient) {
  }

  getCriteria() {
    if(this.criteria.length==0)
    return this.http.get<Criterion[]>(this.baseUrl + 'Criteria').pipe(
      map((criteria : Criterion[])=>{
        this.criteria = criteria;
        return criteria;
      })
    );

    return of(this.criteria)
  }

  addCriterion(model: Criterion) {
    return this.http.post(this.baseUrl + 'Criteria/add-criterion', model).pipe(
      map((response:Criterion)=>{
        this.criteria.push(response);
      })
    );
  }
  updateCriterion(criterion: Criterion) {
    return this.http.post(this.baseUrl + 'Criteria/update-criterion', criterion).pipe(
      map((criterion:Criterion)=>{
        let index = this.criteria.indexOf(criterion);
        this.criteria[index] = criterion;
      })
    );
  }
}
