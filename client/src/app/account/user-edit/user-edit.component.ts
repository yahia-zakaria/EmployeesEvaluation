import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { take } from 'rxjs/operators';
import { User } from '../../_models/user';
import { AccountService } from '../../_services/account.service';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  username:string;
  user: User;
  validationErrors:string[]=[];


  @ViewChild("editForm") editForm: NgForm;
  @HostListener('window:beforeunload', ['$event'])
  unloadNotification($event: any) {
    if (this.editForm.dirty) $event.returnValue = true;
  }
  constructor(private accountService: AccountService, private toastr: ToastrService,private activatedRouter:ActivatedRoute) {


  }

  ngOnInit(): void {
    this.activatedRouter.data.subscribe(data => {
      this.user = data.user;//user:key we used when we add resolver to route in approuting
      console.log(this.user);

    });
  }

  updateUser() {
    this.accountService.updateUser(this.user).subscribe(() => {
      this.toastr.success('تم تعديل المستخدم بنجاح !');
      this.editForm.reset(this.user);
    })
  }
}
