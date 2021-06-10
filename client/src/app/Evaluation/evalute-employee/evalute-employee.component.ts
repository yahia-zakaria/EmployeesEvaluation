import { EvaluationService } from './../../_services/evaluation.service';
import { FinalEvaluation } from './../../_models/finalEvaluation';
import { EmployeeScore } from './../../_models/employeeScore';
import { Criterion } from './../../_models/criterion';
import { Employee } from './../../_models/Employee';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { CriterionService } from 'src/app/_services/criterion.service';
import { Observable } from 'rxjs/internal/Observable';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-evalute-employee',
  templateUrl: './evalute-employee.component.html',
  styleUrls: ['./evalute-employee.component.css']
})
export class EvaluteEmployeeComponent implements OnInit {

  employee: Employee;
  criteria$: Observable<Criterion[]>;
  evaluationScore: number[] = []
  criteria: Criterion[] = [];
  lastEvaluation: FinalEvaluation;


  @ViewChild("evaluationForm") EvaluationForm: NgForm;

  constructor(private toastr: ToastrService, private activatedRouter: ActivatedRoute,
    private criterionService: CriterionService, private evalService: EvaluationService) { }

  ngOnInit(): void {
    this.activatedRouter.data.subscribe(data => {
      this.employee = data.employee;
      this.lastEvaluation = data.employeeEvaluation
      this.lastEvaluation?.employeeScore.forEach(element => {
        this.evaluationScore.push(element.scoreValue)
      });
    });

    this.criteria$ = this.criterionService.getCriteria()
    this.criterionService.getCriteria().subscribe(resp => this.criteria = resp);
  }

  setProgressType(score) {
    if (score >= 1 && score <= 2) {
      return "danger"
    } else if (score == 3) {
      return "warning"
    } else {
      return "success"
    }
  }

  onScoreChange() {
    let sum = 0.0;
    let avg = 0.0;
    for (let index = 0; index < this.evaluationScore.length; index++) {
      //calculate evaluation
      if (this.criteria.length > 0)
        sum = sum + (this.evaluationScore[index] / this.criteria[index].fullScore);
    }
    avg = sum / this.criteria.length;

    if (this.evaluationScore.length == 0)
      return ""

    if (avg >= 0.9)
      return "ممتاز"
    if (avg >= 0.8)
      return "جيد جدا"
    if (avg >= 0.7)
      return "جيد"
    if (avg >= 0.6)
      return "مرضي"
    else
      return "غير مرضي"
  }

  evaluateEmployee() {
    let finalEval = {
      grade: "",
      evaluatedBy: "",
      evaluatedAt: new Date(),
      employeeId: this.employee.id,
      employeeScore: []
    }
    let sum = 0.0;
    let avg = 0.0;
    for (let index = 0; index < this.evaluationScore.length; index++) {
      finalEval.employeeScore.push(
        {
          criterionId: this.criteria[index].id,
          scoreValue: this.evaluationScore[index]
        }
      )
      //calculate evaluation
      sum = sum + (this.evaluationScore[index] / this.criteria[index].fullScore);
    }
    avg = sum / this.criteria.length;

    console.log(avg)

    if (avg >= 0.9)
      finalEval.grade = "ممتاز"
    else if (avg >= 0.8)
      finalEval.grade = "جيد جدا"
    else if (avg >= 0.7)
      finalEval.grade = "جيد"
    else if (avg >= 0.6)
      finalEval.grade = "مرضي"
    else
      finalEval.grade = "غير مرضي"

    console.log(finalEval.grade)

    this.evalService.evaluateEmployee(finalEval).subscribe(() => {
      this.employee.isEvaluated = true;
      this.employee.lastEvauationDate = new Date();
      let emp = this.evalService.employees.find(a => a.id == finalEval.employeeId)
      emp.isEvaluated = true;
      emp.lastEvauationDate = new Date();
      this.evalService.employees[this.evalService.employees.indexOf(emp)] = emp
      this.toastr.success("تم تقييم الموظف", "نجاح");
    })

  }

}
