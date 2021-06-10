import { HttpClient } from '@angular/common/http';
import { EvaluationService } from './../../_services/evaluation.service';
import { Employee } from './../../_models/Employee';
import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LanguageApp } from 'src/app/_models/languageApp';


class DataTablesResponse {
  data: any[];
  draw: number;
  recordsFiltered: number;
  recordsTotal: number;
}

@Component({
  selector: 'app-list-employees',
  templateUrl: './list-employees.component.html',
  styleUrls: ['./list-employees.component.css']
})
export class ListEmployeesComponent implements OnInit {
  employees: Employee[]
  dtOptions: DataTables.Settings = {};
  baseUrl = environment.baseUrl
  constructor(private evalService: EvaluationService, private http: HttpClient) { }

  ngOnInit(): void {
    //datatable config
    const that = this;
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5,
      serverSide: true,
      processing: true,
      language: LanguageApp.arabic_datatables,
      ajax: (dataTablesParameters: any, callback) => {
        that.http.post<DataTablesResponse>(
          this.baseUrl + 'evaluations/employees',
          dataTablesParameters, {}
        ).subscribe(resp => {
          that.employees = resp.data;
          that.evalService.employees = resp.data;
          callback({
            recordsTotal: resp.recordsTotal,
            recordsFiltered: resp.recordsFiltered,
            data: []
          });
        });
      },
      columns: [{ data: 'identityNo' }, { data: 'fullName' }, { data: 'lastEvauationDate' }]
    };
  }

}
