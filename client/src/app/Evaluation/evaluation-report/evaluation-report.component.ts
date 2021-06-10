import { Observable, Subject } from 'rxjs';
import { EvaluationService } from 'src/app/_services/evaluation.service';
import { Component, OnInit } from '@angular/core';
import { EvaluationReport } from 'src/app/_models/evaluationReport';
import { LanguageApp } from 'src/app/_models/languageApp';

class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-evaluation-report',
  templateUrl: './evaluation-report.component.html',
  styleUrls: ['./evaluation-report.component.css']
})

export class EvaluationReportComponent implements OnInit {

  report: EvaluationReport[] = []
  dtOptions: any = {};
  dtTrigger: Subject<any> = new Subject<any>();

  constructor(private evaluationService: EvaluationService) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      language: LanguageApp.arabic_datatables,
      processing: true,
      columns: [{ data: 'identityNo' }, { data: 'fullName' }, { data: 'grade' }, { data: 'evaluatedAt' }],
      dom: 'Bfrtip',
      buttons: [{
        extend : ['excel'],
        title : 'تقرير التقييم الوظيفي'
      }]
    };
    this.evaluationService.getReport().subscribe(data => {
      this.report = (data as any).data;
      // Calling the DT trigger to manually render the table
      this.dtTrigger.next();
    });
  }
  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }
}
