import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/_services/account.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  changPasswordForm: FormGroup
  validationErrors: string[] = [];

  constructor(private accountService: AccountService, private toastr: ToastrService,
    private fb: FormBuilder, private router: Router) { }

  ngOnInit(): void {
    this.initializeForm()
  }


  initializeForm() {
    this.changPasswordForm = this.fb.group({
      password: ['',[Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(8), this.comparePassword('password')]],
    });
    this.changPasswordForm.controls.password.valueChanges.subscribe(() => {
      this.changPasswordForm.controls.confirmPassword.updateValueAndValidity();
    })
  }

  comparePassword(matchTo: string) {
    return (control: AbstractControl) => {
      return control?.value === control?.parent?.controls[matchTo].value ? null : { isMatching: true }
    }
  }

  changePassword() {
    this.accountService.changePassword(this.changPasswordForm.get('password').value).subscribe(() => {
      this.accountService.logout();
      this.router.navigateByUrl("/")
    })
  }
}
