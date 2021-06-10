import { Criterion } from './../../_models/criterion';
import { CriterionService } from '../../_services/criterion.service';
import { Component, EventEmitter, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-update-criterion',
  templateUrl: './update-criterion.component.html',
  styleUrls: ['./update-criterion.component.css']
})
export class UpdateCriterionComponent implements OnInit {

  criterion: Criterion;
  validationErrors: string[] = [];


  @Input() updateSelectedRoles = new EventEmitter();
  @ViewChild("updateForm") updateForm: NgForm;


  constructor(public bsModalRef: BsModalRef) {

   }

  ngOnInit(): void {
  }

  sendUpdatedCriterion() {
    this.updateSelectedRoles.emit(this.criterion)
    this.bsModalRef.hide();
  }

}
