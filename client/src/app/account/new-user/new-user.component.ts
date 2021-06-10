import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from '../../_services/account.service';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html',
  styleUrls: ['./new-user.component.css']
})
export class NewUserComponent implements OnInit {
 registerForm: FormGroup;
 maxDate:Date;
 validationErrors:string[]=[];
 constructor(private accountService: AccountService,
   private toastr: ToastrService,private fb:FormBuilder,private router:Router) { }

 ngOnInit(): void {
   this.iniailizeForm();
   this.maxDate=new Date();
   this.maxDate.setFullYear(this.maxDate.getFullYear()-18);
 }
 iniailizeForm() {
   this.registerForm = this.fb.group({
     fullName: ['', Validators.required],
     identityNo: ['', [Validators.required, Validators.pattern("^(1|2)[0-9]{9}$")]],
     email: ['', [Validators.required, Validators.email]],
     phoneNumber: ['', [Validators.required, Validators.pattern("^(05)(5|0|2|3|6|4|9|1|8|7)([0-9]{7})$")]]
   });
 }

 register() {
   this.accountService.register(this.registerForm.value).subscribe(user=>{
     this.registerForm.reset();
     this.router.navigateByUrl('/users');
   },error=>{
     this.validationErrors=error;
   });
 }

}
