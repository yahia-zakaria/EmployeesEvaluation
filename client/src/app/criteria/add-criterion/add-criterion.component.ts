import { CriterionService } from '../../_services/criterion.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-add-criterion',
  templateUrl: './add-criterion.component.html',
  styleUrls: ['./add-criterion.component.css']
})
export class AddCriterionComponent implements OnInit {

  addForm: FormGroup;
  validationErrors: string[] = [];


  constructor(private criterionService: CriterionService, private toastr: ToastrService,
    private fb: FormBuilder, public bsModalRef: BsModalRef) { }

  ngOnInit(): void {
    this.iniailizeForm();
  }

  iniailizeForm() {
    this.addForm = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      fullScore: ['5', Validators.required],
    });
  }

  addCriterion() {
    this.criterionService.addCriterion(this.addForm.value).subscribe(() => {
      this.toastr.success("تم حفظ المعيار التقييمي", "نجاح")
      this.bsModalRef.hide();
    })
  }

}
