import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Criterion } from 'src/app/_models/criterion';
import { Employee } from 'src/app/_models/Employee';
import { FinalEvaluation } from 'src/app/_models/finalEvaluation';
import { CriterionService } from 'src/app/_services/criterion.service';
import { EvaluationService } from 'src/app/_services/evaluation.service';

@Component({
  selector: 'app-print-evaluation',
  templateUrl: './print-evaluation.component.html',
  styleUrls: ['./print-evaluation.component.css']
})
export class PrintEvaluationComponent implements OnInit {

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
        console.log(data)
        this.lastEvaluation = data.employeeEvaluation
        this.lastEvaluation.employeeScore.forEach(element => {
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
        if(this.criteria.length > 0)
        sum = sum + (this.evaluationScore[index] / this.criteria[index].fullScore);
      }
      avg = sum / this.criteria.length;

      if(this.evaluationScore.length == 0)
      return ""

      if (avg >= .9)
        return "ممتاز"
      if (avg >= .8)
        return "جيد جدا"
      if (avg >= 0.7)
        return "جيد"
      if (avg >= 0.6)
        return "مرضي"
      else
        return "غير مرضي"
    }

    print() {
      console.log('printed')
      window.print();
    }
  }
