import { ToastrService } from 'ngx-toastr';
import { UpdateCriterionComponent } from './../update-criterion/update-criterion.component';
import { take } from 'rxjs/operators';
import { Criterion } from './../../_models/criterion';
import { AddCriterionComponent } from './../add-criterion/add-criterion.component';
import { Component, OnInit } from '@angular/core';
import { CriterionService } from 'src/app/_services/criterion.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-criterion-list',
  templateUrl: './criterion-list.component.html',
  styleUrls: ['./criterion-list.component.css']
})
export class CriterionListComponent implements OnInit {
  bsModalRef: BsModalRef;
  criteria$: Observable<Criterion[]>;
  constructor(public criterionService: CriterionService, private modalService: BsModalService,
    private toastrService:ToastrService) { }

  ngOnInit(): void {
    this.criteria$ = this.criterionService.getCriteria();
  }


  openAddModal() {
    const config = {
      class: "modal-dailog-centered"
    };
    this.bsModalRef = this.modalService.show(AddCriterionComponent, config);
  }

  openUpdateModal(criterion: Criterion) {
    const config = {
      class: "modal-dailog-centered",
      initialState: {
        criterion
      }
    };
    this.bsModalRef = this.modalService.show(UpdateCriterionComponent, config);
    this.bsModalRef.content.updateSelectedRoles.subscribe(values => {
      console.log(values)
      this.criterionService.updateCriterion(values).subscribe(()=>{
      this.toastrService.success('تم تعديل المعيار التقييمي', 'نجاح')
      })
    })
  }

}
